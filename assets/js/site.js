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

  // Reveal-on-scroll. The observer handles normal scrolling; the sweep catches
  // anything skipped by fast scrolls, anchor jumps or the End key, so no section
  // is ever left invisible.
  const pending = new Set(document.querySelectorAll("[data-reveal]"));
  const reveal = (el) => {
    el.classList.add("is-visible");
    pending.delete(el);
  };
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    pending.forEach((el) => io.observe(el));
    let queued = false;
    const sweep = () => {
      queued = false;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          reveal(el);
          io.unobserve(el);
        }
      });
    };
    const queueSweep = () => {
      if (!queued && pending.size) {
        queued = true;
        requestAnimationFrame(sweep);
      }
    };
    window.addEventListener("scroll", queueSweep, { passive: true });
    window.addEventListener("resize", queueSweep);
    window.addEventListener("hashchange", queueSweep);
    window.addEventListener("load", queueSweep);
  } else {
    pending.forEach(reveal);
  }

  // Insights topic filter.
  const bar = document.querySelector("[data-filter-bar]");
  if (bar) {
    const cards = document.querySelectorAll("[data-filter-list] [data-topic]");
    bar.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-filter]");
      if (!btn) return;
      bar.querySelectorAll("[data-filter]").forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      const topic = btn.dataset.filter;
      cards.forEach((card) => {
        card.hidden = topic !== "all" && card.dataset.topic !== topic;
        card.classList.add("is-visible");
      });
    });
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
