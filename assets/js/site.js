(() => {
  const root = document.documentElement;
  root.classList.add("js");

  // Header shadow once the page scrolls.
  const header = document.querySelector("[data-header]");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile navigation.
  const toggle = document.querySelector("[data-nav-toggle]");
  if (toggle) {
    const setOpen = (open) => {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
    document.querySelectorAll(".site-nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  }

  // Reveal-on-scroll.
  const items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-visible"));
  }

  // Contact form.
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  const status = form.querySelector("[data-form-status]");
  const button = form.querySelector('button[type="submit"]');
  const setStatus = (text, kind) => {
    status.textContent = text;
    status.className = `form-status${kind ? ` is-${kind}` : ""}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let firstInvalid = null;
    form.querySelectorAll("[required]").forEach((field) => {
      const invalid = !field.value.trim() || (field.type === "email" && !field.checkValidity());
      field.setAttribute("aria-invalid", String(invalid));
      if (invalid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      setStatus("Please complete the required fields with a valid email address.", "error");
      firstInvalid.focus();
      return;
    }

    button.disabled = true;
    setStatus("Sending…");
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We could not send your message.");
      form.reset();
      setStatus(result.message || "Thank you. Your message has been sent.", "success");
    } catch (error) {
      setStatus(`${error.message} You can also email info@aniradatadev.com.`, "error");
    } finally {
      button.disabled = false;
    }
  });
})();
