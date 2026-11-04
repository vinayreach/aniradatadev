// Vercel function: receives the contact form and emails it through Zoho Mail (SMTP).
import nodemailer from "nodemailer";

const jsonResponse = (body, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });

const escapeHtml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

const cleanLine = (value, max) => String(value || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

const UNAVAILABLE = "We could not send your message right now.";
const THANKS = "Thank you. Your message has been sent to Anira Data DevOps. Our team will be in touch.";

export default {
  async fetch(request) {
    if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

    let data;
    try {
      const type = request.headers.get("content-type") || "";
      data = type.includes("application/json") ? await request.json() : Object.fromEntries((await request.formData()).entries());
    } catch {
      return jsonResponse({ error: "Invalid form submission." }, 400);
    }

    // Honeypot: hidden from people, often filled in by bots.
    if (data.website) return jsonResponse({ success: true, message: THANKS });

    const name = cleanLine(data.name, 120);
    const email = cleanLine(data.email, 254).toLowerCase();
    const company = cleanLine(data.company, 120);
    const phone = cleanLine(data.phone, 50);
    const interest = cleanLine(data.interest, 120);
    const message = String(data.message || "").trim().slice(0, 5000);

    if (!name || !email || !message) return jsonResponse({ error: "Please provide your name, email address and message." }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonResponse({ error: "Please provide a valid email address." }, 400);

    const env = globalThis.process?.env || {};
    const user = env.ZOHO_SMTP_USER;
    const pass = env.ZOHO_SMTP_PASSWORD;
    if (!user || !pass) {
      console.error("ZOHO_SMTP_USER / ZOHO_SMTP_PASSWORD are not configured.");
      return jsonResponse({ error: UNAVAILABLE }, 503);
    }

    const transporter = nodemailer.createTransport({
      host: env.ZOHO_SMTP_HOST || "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const rows = [
      ["Name", name],
      ["Email", email],
      ["Company", company || "Not provided"],
      ["Phone", phone || "Not provided"],
      ["Interest", interest || "Not specified"],
    ];

    try {
      await transporter.sendMail({
        from: { name: "Anira website", address: user },
        to: env.CONTACT_TO_EMAIL || "info@aniradatadev.com",
        replyTo: { name, address: email },
        subject: `Website inquiry from ${name}${company ? ` (${company})` : ""}`,
        text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${message}`,
        html: `<h2>New website inquiry</h2>${rows
          .map(([k, v]) => `<p><strong>${k}:</strong> ${escapeHtml(v)}</p>`)
          .join("")}<p><strong>Message:</strong><br>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`,
      });
      return jsonResponse({ success: true, message: THANKS });
    } catch (error) {
      console.error("Contact form delivery failed:", error);
      return jsonResponse({ error: UNAVAILABLE }, 502);
    }
  },
};
