// Generates the static site into the repository root. Run: node build/build.mjs (Node 18+, no dependencies).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE, FACTS, PRACTICES, REASONS, STEPS, FOCUS, JOBS,
  ENGAGEMENT_MODELS, TRANSITION, GOVERNANCE, CONTROLS, FAQS, ABOUT, CAREERS,
} from "./content.mjs";
import { FINANCE_SERVICES } from "./finance-services.mjs";
import { ARTICLES } from "./insights.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const YEAR = new Date().getFullYear();
const ASSET_VERSION = Date.now().toString(36);

const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const pad = (n) => String(n).padStart(2, "0");
const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ---------- icons (24px line icons) ----------
const ICONS = {
  ledger: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12h6M9 16h4"/>',
  layers: '<path d="M12 3 3 8l9 5 9-5z"/><path d="m3 13 9 5 9-5"/>',
  workflow: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4a3 3 0 0 1 3 3V14"/>',
  code: '<rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/><path d="m10 8.5-2.5 2 2.5 2M14 8.5l2.5 2-2.5 2"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  receipt: '<path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  "arrow-out": '<path d="M4 12h12M12 7l5 5-5 5"/><path d="M20 5v14"/>',
  "arrow-in": '<path d="M20 12H8M12 7l-5 5 5 5"/><path d="M4 5v14"/>',
  book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v14H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H19v-3"/><path d="m9 10 2 2 4-4"/>',
  trend: '<path d="M3 20h18M3 20V4"/><path d="m7 15 4-4 3 3 6-7"/><path d="M15 7h5v5"/>',
  chart: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18M8 17v-4M12 17v-6M16 17v-3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5h.01"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M8.5 7V5a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 5v2M3 12.5h18"/>',
  file: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/>',
  gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 18 4-6"/>',
};
const icon = (name, cls = "icon") => {
  if (!ICONS[name]) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
};

// ---------- shared pieces ----------
const photo = (name, alt, { eager = false, sizes = "100vw", cls = "" } = {}) =>
  `<img${cls ? ` class="${cls}"` : ""} src="/assets/img/photos/${name}.webp" srcset="/assets/img/photos/${name}-800.webp 800w, /assets/img/photos/${name}.webp 1600w" sizes="${sizes}" alt="${esc(alt)}" width="1600" height="1067" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const button = (href, label, variant = "primary") =>
  `<a class="btn btn-${variant}" href="${href}"><span>${esc(label)}</span>${icon("arrow", "icon btn-icon")}</a>`;
const eyebrow = (text) => `<p class="eyebrow">${esc(text)}</p>`;
const head = (kicker, title, text = "") =>
  `<div class="section-head" data-reveal>${kicker ? eyebrow(kicker) : ""}<h2 class="h-display">${esc(title)}</h2>${text ? `<p class="section-lede">${esc(text)}</p>` : ""}</div>`;
const section = (inner, bg = "", extra = "", id = "") => `<section${id ? ` id="${id}"` : ""} class="section${bg ? ` section-${bg}` : ""}${extra ? ` ${extra}` : ""}"><div class="container">${inner}</div></section>`;
const logo = (cls = "") =>
  `<a class="logo ${cls}" href="/" aria-label="${esc(SITE.name)} home"><img src="/assets/img/anira-mark.webp" alt="" width="67" height="32"><span>Anira <b>Data DevOps</b></span></a>`;
const crumbs = (trail) =>
  `<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${trail
    .map((c, i) => (i === trail.length - 1 ? `<li aria-current="page">${esc(c.label)}</li>` : `<li><a href="${c.href}">${esc(c.label)}</a></li>`))
    .join("")}</ol></nav>`;

const NAV = [
  { href: "/services/", label: "Services", menu: true },
  { href: "/how-we-work/", label: "How we work" },
  { href: "/insights/", label: "Insights" },
  { href: "/about/", label: "About" },
  { href: "/careers/", label: "Careers" },
];

const megaMenu = () => `<div class="nav-menu">
  <div class="nav-menu-grid">
    <div class="nav-menu-col">
      <p class="nav-menu-label">Practices</p>
      <ul>${PRACTICES.map((p) => `<li><a href="/services/${p.slug}/">${icon(p.icon)}<span><b>${esc(p.name)}</b><small>${esc(p.short)}</small></span></a></li>`).join("")}</ul>
    </div>
    <div class="nav-menu-col nav-menu-side">
      <p class="nav-menu-label">Finance &amp; accounting</p>
      <ul class="nav-menu-simple">${FINANCE_SERVICES.map((s) => `<li><a href="/services/finance-accounting/${s.slug}/">${esc(s.name)}</a></li>`).join("")}</ul>
      <a class="text-link" href="/services/">All services ${icon("arrow")}</a>
    </div>
  </div>
</div>`;

const header = (active) => `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <div class="container header-inner">
    ${logo()}
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
      ${icon("menu", "icon icon-open")}${icon("close", "icon icon-close")}<span class="sr-only">Menu</span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul class="nav-list">
        ${NAV.map(
          (n) => `<li class="${n.menu ? "has-menu" : ""}"><a href="${n.href}"${active === n.href ? ' aria-current="page"' : ""}>${n.label}${n.menu ? icon("chevron", "icon nav-chevron") : ""}</a>${n.menu ? megaMenu() : ""}</li>`,
        ).join("")}
      </ul>
      <a class="btn btn-primary btn-sm nav-cta" href="/contact/"><span>Contact us</span></a>
    </nav>
  </div>
</header>`;

const ctaBand = (title = "Let's build a more efficient future for your business.") => `
<section class="cta-band">
  <div class="container cta-inner">
    <div>
      ${eyebrow("Start the conversation")}
      <h2>${esc(title)}</h2>
      <p>Explore how Anira Data DevOps can support your finance operations, technology initiatives and evolving business requirements. We welcome the opportunity to understand your priorities and discuss how we can add value.</p>
    </div>
    <div class="cta-actions">
      ${button("/contact/", "Talk to our team", "light")}
      <a class="cta-mail" href="mailto:${SITE.email}">${icon("mail")}<span>${SITE.email}</span></a>
    </div>
  </div>
</section>`;

const footer = () => `
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      ${logo("logo-light")}
      <p>Finance operations, ERP, technology and talent for ambitious businesses, delivered from Hyderabad, India.</p>
    </div>
    <div>
      <h2 class="footer-title">Services</h2>
      <ul>${PRACTICES.map((p) => `<li><a href="/services/${p.slug}/">${esc(p.name)}</a></li>`).join("")}</ul>
    </div>
    <div>
      <h2 class="footer-title">Company</h2>
      <ul>
        <li><a href="/about/">About us</a></li>
        <li><a href="/how-we-work/">How we work</a></li>
        <li><a href="/insights/">Insights</a></li>
        <li><a href="/faq/">FAQ</a></li>
        <li><a href="/careers/">Careers</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-title">Contact</h2>
      <ul class="footer-contact">
        <li>${icon("mail")}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
        <li>${icon("pin")}<span>${esc(SITE.address.street)},<br>${esc(SITE.address.city)}, ${esc(SITE.address.region)}, ${esc(SITE.address.country)}</span></li>
        <li>${icon("clock")}<span>${esc(SITE.hours[0][0])}<br>${esc(SITE.hours[0][1])}</span></li>
      </ul>
    </div>
  </div>
  <div class="container footer-base">
    <p>© ${YEAR} ${esc(SITE.legalName)}. All rights reserved.</p>
    <p><a href="/privacy-policy/">Privacy policy</a></p>
  </div>
</footer>`;

const orgSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/assets/img/anira-logo.png`,
  email: SITE.email,
  address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: SITE.address.city, addressRegion: SITE.address.region, addressCountry: SITE.address.countryCode },
});

const faqSchema = (items) =>
  JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });

const page = ({ path, title, description, active = "", body, schemas = [orgSchema] }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE.url}${path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE.url}${path}">
<meta property="og:image" content="${SITE.url}/assets/img/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0A1C33">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/figtree-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/source-serif-4-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=${ASSET_VERSION}">
${schemas.map((s) => `<script type="application/ld+json">${s}</script>`).join("\n")}
</head>
<body>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/site.js?v=${ASSET_VERSION}" defer></script>
</body>
</html>
`;

const pageHero = ({ kicker, title, text, photoName, photoAlt, trail = [], aside = "" }) => `
<section class="page-hero${aside ? " page-hero-aside" : ""}">
  <div class="page-hero-media">${photo(photoName, photoAlt, { eager: true })}</div>
  <div class="container page-hero-inner">
    <div>
      ${trail.length ? crumbs(trail) : ""}
      ${eyebrow(kicker)}
      <h1>${esc(title)}</h1>
      ${text ? `<p class="page-hero-lede">${esc(text)}</p>` : ""}
    </div>
    ${aside}
  </div>
</section>`;

const plainHero = ({ kicker, title, text, trail = [], cls = "" }) => `
<section class="contact-hero ${cls}">
  <div class="container">
    ${trail.length ? crumbs(trail) : ""}
    ${eyebrow(kicker)}
    <h1>${esc(title)}</h1>
    ${text ? `<p class="page-hero-lede">${esc(text)}</p>` : ""}
  </div>
</section>`;

const faqList = (items) => `<div class="faq-list">${items
  .map((f) => `<details class="faq" data-reveal><summary><span>${esc(f.q)}</span>${icon("chevron", "icon faq-chevron")}</summary><p>${esc(f.a)}</p></details>`)
  .join("")}</div>`;

const practiceCards = () => `
<ol class="practice-grid">
  ${PRACTICES.map(
    (p, i) => `<li class="practice-card" data-reveal><a href="/services/${p.slug}/">
      <span class="practice-num">${pad(i + 1)}</span>${icon(p.icon, "icon practice-icon")}
      <h3>${esc(p.name)}</h3><p>${esc(p.short)}</p><span class="practice-link">Explore ${icon("arrow")}</span>
    </a></li>`,
  ).join("")}
</ol>`;

const factStrip = () => `
<div class="fact-strip" style="--facts: ${FACTS.length}">
  ${FACTS.map((f) => `<div class="fact" data-reveal><p class="fact-value${f.small ? " fact-value-sm" : ""}">${esc(f.value)}</p><p class="fact-label">${esc(f.label)}</p></div>`).join("")}
</div>`;

const flowSteps = (steps, cls = "") =>
  `<ol class="flow ${cls}" style="--steps: ${steps.length}">${steps.map((s, i) => `<li data-reveal><span class="flow-num">${pad(i + 1)}</span><span class="flow-label">${esc(s)}</span></li>`).join("")}</ol>`;

const articleCard = (a) => `<li class="article-card" data-reveal><a href="/insights/${a.slug}/">
  <div class="article-card-media">${photo(a.photo, "", { sizes: "(min-width: 960px) 33vw, 100vw" })}</div>
  <div class="article-card-body"><p class="article-meta">${esc(a.category)} · ${a.minutes} min read</p><h3>${esc(a.title)}</h3><p>${esc(a.dek)}</p><span class="practice-link">Read article ${icon("arrow")}</span></div>
</a></li>`;

const stepsBlock = () =>
  `<ol class="steps">${STEPS.map((s, i) => `<li data-reveal><span class="step-num">${pad(i + 1)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>`;

// ---------- practice page blocks: each practice composes its own page from these ----------
const BLOCKS = {
  outcomes: (b) => `<div class="split"><div data-reveal>${eyebrow("What you gain")}<h2 class="h-display">${esc(b.title)}</h2></div><ul class="outcomes" data-reveal>${b.items.map((o) => `<li>${icon("check")}<span>${esc(o)}</span></li>`).join("")}</ul></div>`,

  financeCards: () => `${head("Services", "Seven services, each with a defined scope and process", "Choose a service to see what is included, how the work flows and what you receive.")}
    <ul class="fin-cards">${FINANCE_SERVICES.map(
      (s, i) => `<li data-reveal><a href="/services/finance-accounting/${s.slug}/"><span class="fin-cards-top">${icon(s.icon, "icon fin-cards-icon")}<span class="fin-cards-num">${pad(i + 1)}</span></span><h3>${esc(s.name)}</h3><p>${esc(s.short)}</p><span class="practice-link">View service ${icon("arrow")}</span></a></li>`,
    ).join("")}</ul>`,

  cycles: (b) => `${head("End to end", b.title, b.text)}
    <div class="cycles">${b.cycles
      .map(
        (c) => `<div class="cycle" data-reveal><h3>${esc(c.name)}</h3><ol>${c.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol><p class="cycle-links">${c.links
          .map((l) => {
            const s = FINANCE_SERVICES.find((x) => x.slug === l);
            return `<a href="/services/finance-accounting/${s.slug}/">${esc(s.name)}</a>`;
          })
          .join("")}</p></div>`,
      )
      .join("")}</div>`,

  faq: (b) => `<div class="split split-faq"><div data-reveal>${eyebrow("FAQ")}<h2 class="h-display">Common questions</h2><p class="section-lede">More answers on our <a href="/faq/">FAQ page</a>.</p></div>${faqList(b.items)}</div>`,

  split: (b) => `<div class="split"><div data-reveal>${eyebrow(b.eyebrow)}<h2 class="h-display">${esc(b.title)}</h2></div><div class="prose" data-reveal>${(b.paras || []).map((p) => `<p>${esc(p)}</p>`).join("")}${
    b.list ? `<ul class="outcomes outcomes-compact">${b.list.map((o) => `<li>${icon("check")}<span>${esc(o)}</span></li>`).join("")}</ul>` : ""
  }</div></div>`,

  phases: (b) => `${head("Our approach", b.title, b.text)}
    <ol class="phases">${b.items
      .map((p, i) => `<li data-reveal><span class="phase-num">${pad(i + 1)}</span><div class="phase-body"><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></div><p class="phase-out"><span>Output</span>${esc(p.out)}</p></li>`)
      .join("")}</ol>`,

  serviceGrid: (b) => `${head("Services", b.title)}
    <div class="service-list">${b.items
      .map((s, i) => `<article class="service-item" id="${slug(s.name)}" data-reveal><span class="service-num">${pad(i + 1)}</span><div><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p></div></article>`)
      .join("")}</div>`,

  platformCards: (b) => `${head("Platforms", b.title)}
    <ul class="platform-cards">${b.items.map((p) => `<li data-reveal><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p></li>`).join("")}</ul>`,

  checklist: (b) => `<div class="split"><div data-reveal>${eyebrow("Before you migrate")}<h2 class="h-display">${esc(b.title)}</h2><p class="section-lede">${esc(b.text)}</p><p class="checklist-link"><a class="text-link" href="/insights/erp-migration-checklist/">Read the full checklist ${icon("arrow")}</a></p></div>
    <ol class="checklist" data-reveal>${b.items.map((q, i) => `<li><span>${pad(i + 1)}</span>${esc(q)}</li>`).join("")}</ol></div>`,

  compare: (b) => `${head("Before and after", b.title, b.text)}
    <div class="compare" data-reveal role="table" aria-label="${esc(b.title)}">
      <div class="compare-row compare-head" role="row"><span role="columnheader">Today</span><span role="columnheader">After transformation</span></div>
      ${b.rows.map(([a, c]) => `<div class="compare-row" role="row"><span role="cell">${esc(a)}</span><span role="cell">${icon("arrow", "icon compare-arrow")}${esc(c)}</span></div>`).join("")}
    </div>`,

  ladder: (b) => `${head("Maturity", b.title, b.text)}
    <ol class="ladder">${b.items.map((s, i) => `<li data-reveal style="--i:${i}"><span class="ladder-num">Stage ${i + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></li>`).join("")}</ol>`,

  chips: (b) => `<div class="platforms-row" data-reveal><div>${eyebrow("Quick wins")}<h2 class="h-small">${esc(b.title)}</h2><p class="platforms-note">${esc(b.text)}</p></div><ul class="platforms">${b.items.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>`,

  models: (b) => `${head("Engagement", b.title)}
    <ul class="models">${b.items.map((m) => `<li data-reveal><h3>${esc(m.t)}</h3><p>${esc(m.d)}</p><p class="model-fit"><span>Best for</span>${esc(m.best)}</p></li>`).join("")}</ul>`,

  flow: (b) => `${head("Process", b.title)}${flowSteps(b.steps)}`,

  stack: (b) => `${head("Technology", b.title)}
    <div class="stack">${b.groups.map((g) => `<div class="stack-group" data-reveal><h3>${esc(g.t)}</h3><ul>${g.items.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>`).join("")}</div>`,

  pipeline: (b) => `${head("Delivery pipeline", b.title, b.text)}
    <ol class="pipeline" style="--steps: ${b.stages.length}">${b.stages
      .map((s, i) => `<li data-reveal><span class="pipe-num">${pad(i + 1)}</span><h3>${esc(s.t)}</h3><ul>${s.tools.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></li>`)
      .join("")}</ol>
    <p class="pipeline-note">Monitoring and feedback close the loop, so each release is faster and safer than the last.</p>`,

  roles: (b) => `${head("Talent", b.title)}
    <ul class="roles">${b.items.map((r) => `<li data-reveal>${icon("briefcase")}<div><h3>${esc(r.t)}</h3><p>${esc(r.d)}</p></div></li>`).join("")}</ul>`,
};
// Blocks alternate white / stone; the pipeline always sits on navy.
const BLOCK_BG = { pipeline: "navy" };

const practiceAside = (p) => `<aside class="hero-aside">
  <p class="hero-aside-label">In this practice</p>
  <ul>${p.services.map((s) => `<li><a href="${s.href || `#${slug(s.name)}`}">${esc(s.name)}</a></li>`).join("")}</ul>
</aside>`;

const relatedInsights = (practiceSlug, bg) => {
  const list = ARTICLES.filter((a) => a.related.startsWith(`/services/${practiceSlug}/`)).slice(0, 3);
  return list.length ? section(`<div class="head-row">${head("Insights", "Related reading")}<a class="text-link" href="/insights/">All insights ${icon("arrow")}</a></div><ul class="article-grid${list.length === 2 ? " article-grid-2" : list.length === 1 ? " article-grid-2" : ""}">${list.map(articleCard).join("")}</ul>`, bg) : "";
};

const practicePage = (p) => {
  const others = PRACTICES.filter((o) => o.slug !== p.slug);
  const faq = p.blocks.find((b) => b.type === "faq");
  let prev = "stone";
  const blocks = p.blocks
    .map((b) => {
      const bg = BLOCK_BG[b.type] ?? (prev === "" ? "stone" : "");
      prev = bg;
      return section(BLOCKS[b.type](b), bg, b.type === "chips" ? "section-tight" : "", b.id);
    })
    .join("");
  return page({
    path: `/services/${p.slug}/`,
    title: `${p.name} | ${SITE.name}`,
    description: `${p.short} ${SITE.name}, Hyderabad, India.`,
    active: "/services/",
    schemas: [orgSchema, ...(faq ? [faqSchema(faq.items)] : [])],
    body: `
${pageHero({ kicker: p.name, title: p.headline, text: p.intro, photoName: p.photo, photoAlt: p.photoAlt, trail: [{ href: "/services/", label: "Services" }, { label: p.name }], aside: practiceAside(p) })}
${blocks}
${relatedInsights(p.slug, prev === "" ? "stone" : "")}
${section(`${head("Explore more", "Related services")}<ul class="related">${others
  .map((o) => `<li data-reveal><a href="/services/${o.slug}/">${icon(o.icon)}<span>${esc(o.name)}</span>${icon("arrow", "icon related-arrow")}</a></li>`)
  .join("")}</ul>`, prev === "" ? "" : "stone")}
${ctaBand()}`,
  });
};

// ---------- finance service sub-pages ----------
const financePage = (s) => {
  const idx = FINANCE_SERVICES.indexOf(s);
  const next = FINANCE_SERVICES[(idx + 1) % FINANCE_SERVICES.length];
  const article = ARTICLES.find((a) => a.related === `/services/finance-accounting/${s.slug}/`);
  const heroSteps = s.flow || s.calendar.map((c) => c.day);
  return page({
    path: `/services/finance-accounting/${s.slug}/`,
    title: `${s.name} | ${SITE.name}`,
    description: `${s.headline} ${s.short}`,
    active: "/services/",
    schemas: [orgSchema, faqSchema(s.faqs)],
    body: `
<section class="svc-hero">
  <div class="container svc-hero-inner">
    <div>
      ${crumbs([{ href: "/services/", label: "Services" }, { href: "/services/finance-accounting/", label: "Finance & Accounting" }, { label: s.name }])}
      <div class="svc-hero-title">${icon(s.icon, "icon svc-hero-icon")}${eyebrow(s.name)}</div>
      <h1>${esc(s.headline)}</h1>
      <p class="page-hero-lede">${esc(s.intro)}</p>
    </div>
    <ol class="svc-hero-flow" aria-hidden="true">${heroSteps.map((f, i) => `<li><span>${pad(i + 1)}</span>${esc(f)}</li>`).join("")}</ol>
  </div>
</section>
<div class="container svc-layout">
  <aside class="svc-side">
    <nav aria-label="Finance and accounting services">
      <p class="svc-side-label">Finance &amp; accounting</p>
      <ul>${FINANCE_SERVICES.map((o) => `<li><a href="/services/finance-accounting/${o.slug}/"${o === s ? ' aria-current="page"' : ""}>${esc(o.name)}</a></li>`).join("")}</ul>
    </nav>
    <div class="svc-side-cta"><p>Discuss ${esc(s.name)} with our team.</p>${button("/contact/", "Contact us")}</div>
  </aside>
  <div class="svc-main">
    <section class="svc-block">
      ${eyebrow("Sound familiar?")}
      <h2 class="h-display h-mid">The challenges we solve</h2>
      <ul class="pains">${s.challenges.map((c) => `<li data-reveal>${icon("alert")}<span>${esc(c)}</span></li>`).join("")}</ul>
    </section>
    <section class="svc-block">
      ${eyebrow("What we do")}
      <h2 class="h-display h-mid">Scope of service</h2>
      <dl class="scope">${s.scope.map((x) => `<div data-reveal><dt>${esc(x.t)}</dt><dd>${esc(x.d)}</dd></div>`).join("")}</dl>
    </section>
    <section class="svc-block">
      ${
        s.calendar
          ? `${eyebrow("A typical close")}<h2 class="h-display h-mid">An illustrative close calendar</h2><p class="section-lede">Every client's calendar is built around their entities, systems and deadlines. This is a typical starting point.</p>
        <ol class="calendar">${s.calendar.map((d) => `<li data-reveal><span class="cal-day">${esc(d.day)}</span><ul>${d.tasks.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></li>`).join("")}</ol>`
          : `${eyebrow("How it works")}<h2 class="h-display h-mid">The process, step by step</h2>${flowSteps(s.flow, "flow-compact")}`
      }
    </section>
    <section class="svc-block svc-two">
      <div>
        ${eyebrow("What you receive")}
        <h2 class="h-display h-mid">Deliverables</h2>
        <ul class="deliverables">${s.deliverables.map((d) => `<li data-reveal>${icon("file")}<span>${esc(d)}</span></li>`).join("")}</ul>
      </div>
      <div>
        ${eyebrow("What we track")}
        <h2 class="h-display h-mid">Measures we report</h2>
        <ul class="measures">${s.measures.map((m) => `<li data-reveal>${icon("gauge")}<div><b>${esc(m.t)}</b><span>${esc(m.d)}</span></div></li>`).join("")}</ul>
      </div>
    </section>
    <section class="svc-block">
      ${eyebrow("FAQ")}
      <h2 class="h-display h-mid">Common questions</h2>
      ${faqList(s.faqs)}
    </section>
    ${article ? `<section class="svc-block">${eyebrow("Related insight")}<ul class="article-grid article-grid-1">${articleCard(article)}</ul></section>` : ""}
    <a class="next-service" href="/services/finance-accounting/${next.slug}/"><span>Next service</span><b>${esc(next.name)}</b>${icon("arrow")}</a>
  </div>
</div>
${ctaBand()}`,
  });
};

// ---------- pages ----------
const finance = PRACTICES[0];

const home = page({
  path: "/",
  title: `${SITE.name} | Finance Operations, ERP, Cloud & Technology Services`,
  description: SITE.description,
  active: "/",
  body: `
<section class="hero">
  <div class="hero-media">${photo("office-towers", "Modern glass office towers seen from below", { eager: true })}</div>
  <div class="container hero-inner">
    ${eyebrow("Anira Data DevOps")}
    <h1>Enabling Smarter Finance.<br>Empowering Business Growth.</h1>
    <p class="hero-lede">Integrated finance operations, global payroll, ERP and technology solutions for ambitious businesses.</p>
    <div class="hero-actions">${button("/services/", "Explore our services")}${button("/contact/", "Talk to our team", "ghost")}</div>
  </div>
  <div class="container hero-foot">
    <p><b>Finance</b> · <b>ERP</b> · <b>Technology</b> · <b>Talent</b><span aria-hidden="true">·</span>Delivery center in <b>Hyderabad, India</b></p>
  </div>
</section>
${section(factStrip(), "", "section-tight")}
${section(`<div class="split">
  <div data-reveal>${eyebrow("Who we are")}<h2 class="h-display">One accountable partner for the finance operations and technology that keep your business moving.</h2></div>
  <div class="prose" data-reveal>
    <p>Anira Data DevOps helps organizations run accurate, well-controlled and better-informed finance functions, and builds the technology that supports them. From expenses and payables to month-end close, payroll and reporting, we take on the work that demands precision, so leadership can focus on growth.</p>
    <p>By combining finance expertise with practical technology, including ERP, automation, cloud and DevOps, we help teams streamline operations and make better, more informed decisions. From our delivery center in Hyderabad, India, we offer cost-effective, scalable solutions without compromising on quality.</p>
    <p><a class="text-link" href="/about/">More about us ${icon("arrow")}</a></p>
  </div>
</div>`)}
${section(`${head("Our capabilities", "Comprehensive solutions. One trusted business partner.", "Six practice areas that can be engaged individually or together. Start where the need is greatest and extend the partnership as your priorities evolve.")}${practiceCards()}`, "stone")}
${section(`<div class="finance-feature">
  <div class="finance-feature-media" data-reveal>${photo(finance.photo, finance.photoAlt, { sizes: "(min-width: 960px) 45vw, 100vw" })}</div>
  <div data-reveal>
    ${eyebrow("Finance & accounting operations")}
    <h2 class="h-display">Finance operations that run accurately, on time and under control.</h2>
    <ul class="finance-list">${FINANCE_SERVICES.map((s) => `<li><a href="/services/finance-accounting/${s.slug}/"><span>${esc(s.name)}</span>${icon("arrow")}</a></li>`).join("")}</ul>
  </div>
</div>`)}
${section(`${head("Why Anira Data DevOps", "Proven business experience. Expanding capabilities. Partnership for growth.")}
<ol class="reasons">
  ${REASONS.map((r, i) => `<li data-reveal><span class="reason-num">${pad(i + 1)}</span><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></li>`).join("")}
  <li class="reason-quote" data-reveal><p>Experience, operational discipline, business understanding and technology capability, in one partner.</p></li>
</ol>`, "navy")}
${section(`${head("How we engage", "A structured path from first conversation to steady improvement.")}${stepsBlock()}
<p class="center-link" data-reveal><a class="text-link" href="/how-we-work/">See how we work ${icon("arrow")}</a></p>`)}
${section(`<div class="platforms-row" data-reveal><div>${eyebrow("Platforms we work with")}<p class="platforms-note">ERP and cloud platforms our teams implement, integrate and support.</p></div><ul class="platforms">${["SAP", "Oracle NetSuite", "Microsoft Dynamics 365", "Odoo", "QuickBooks Enterprise", "Microsoft Azure"].map((n) => `<li>${n}</li>`).join("")}</ul></div>`, "stone", "section-tight")}
${section(`<div class="head-row">${head("Insights", "Practical thinking for finance and technology leaders")}<a class="text-link" href="/insights/">All insights ${icon("arrow")}</a></div><ul class="article-grid">${ARTICLES.map(articleCard).join("")}</ul>`)}
${ctaBand()}`,
});

const servicesHub = page({
  path: "/services/",
  title: `Services | ${SITE.name}`,
  description: "Finance and accounting operations, ERP consulting, finance transformation, software development, cloud and DevOps, and IT and finance talent.",
  active: "/services/",
  body: `
${pageHero({ kicker: "Our services", title: "Comprehensive solutions. One trusted business partner.", text: "From transaction processing to ERP, automation, software and talent: six practice areas designed to work on their own or together.", photoName: "analytics", photoAlt: "Laptop showing a financial dashboard with charts and KPIs", trail: [{ label: "Services" }] })}
${section(practiceCards())}
${section(`${head("At a glance", "Everything we deliver")}<div class="index-grid">${PRACTICES.map(
  (p) => `<div class="index-col" data-reveal><h3><a href="/services/${p.slug}/">${esc(p.name)}</a></h3><ul>${p.services
    .map((s) => `<li><a href="${s.href?.startsWith("#") ? `/services/${p.slug}/${s.href}` : s.href || `/services/${p.slug}/#${slug(s.name)}`}">${esc(s.name)}</a></li>`)
    .join("")}</ul></div>`,
).join("")}</div>`, "stone")}
${ctaBand()}`,
});

const howWeWork = page({
  path: "/how-we-work/",
  title: `How We Work | ${SITE.name}`,
  description: "Engagement models, transition approach, governance and controls at Anira Data DevOps.",
  active: "/how-we-work/",
  body: `
${pageHero({ kicker: "How we work", title: "Structured, transparent and built around your controls.", text: "Whether we run a finance process, deliver a project or provide talent, every engagement follows the same principles: clear scope, documented processes, regular reporting and continuous improvement.", photoName: "planning-session", photoAlt: "Team planning a project around a table with laptops and sticky notes", trail: [{ label: "How we work" }] })}
${section(`${head("Engagement models", "Four ways to work with us", "Choose the model that fits the work. Many clients combine them as the relationship grows.")}
<ul class="models models-4">${ENGAGEMENT_MODELS.map((m, i) => `<li data-reveal><span class="model-num">${pad(i + 1)}</span><h3>${esc(m.t)}</h3><p>${esc(m.d)}</p><p class="model-fit"><span>Best for</span>${esc(m.fit)}</p></li>`).join("")}</ul>`)}
${section(`${head("Transition", "How we take over a process, safely", "A step-by-step handover that protects quality and continuity at every stage.")}
<ol class="phases phases-transition">${TRANSITION.map((p, i) => `<li data-reveal><span class="phase-num">${pad(i + 1)}</span><div class="phase-body"><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></div></li>`).join("")}</ol>`, "stone")}
${section(`<div class="split"><div data-reveal>${eyebrow("Governance")}<h2 class="h-display">A rhythm of communication you can rely on.</h2><p class="section-lede">You always know what is happening, what is coming up and how the service is performing.</p></div>
<div class="cadence" data-reveal>${GOVERNANCE.map((g) => `<div class="cadence-row"><span class="cadence-when">${esc(g.when)}</span><p>${esc(g.what)}</p></div>`).join("")}</div></div>`)}
${section(`${head("Quality and controls", "How we protect quality and your data")}
<ul class="controls">${CONTROLS.map((c) => `<li data-reveal>${icon("check")}<h3>${esc(c.t)}</h3><p>${esc(c.d)}</p></li>`).join("")}</ul>`, "navy")}
${section(`${head("Our approach", "From first conversation to steady improvement")}${stepsBlock()}`)}
${ctaBand()}`,
});

const allFaqs = FAQS.flatMap((c) => c.items);
const faqPage = page({
  path: "/faq/",
  title: `FAQ | ${SITE.name}`,
  description: "Answers to common questions about working with Anira Data DevOps.",
  schemas: [orgSchema, faqSchema(allFaqs)],
  body: `
${plainHero({ kicker: "FAQ", title: "Frequently asked questions", text: "Quick answers about our services and how we work. Can't find what you need? Contact us.", trail: [{ label: "FAQ" }], cls: "contact-hero-short" })}
${section(`<div class="faq-page">${FAQS.map((c) => `<div class="faq-group"><h2 class="h-small">${esc(c.cat)}</h2>${faqList(c.items)}</div>`).join("")}</div>`)}
${ctaBand("Still have questions? Let's talk.")}`,
});

const TOPICS = [...new Set(ARTICLES.slice(1).map((a) => a.topic))];
const insightsIndex = page({
  path: "/insights/",
  title: `Insights | ${SITE.name}`,
  description: "Practical articles on finance operations, automation, ERP, DevOps and working with a finance and technology partner.",
  active: "/insights/",
  body: `
${plainHero({ kicker: "Insights", title: "Practical thinking for finance and technology leaders.", text: "Short, useful articles on running finance well, automating with care, getting ERP projects right and working with a delivery partner.", trail: [{ label: "Insights" }], cls: "contact-hero-short" })}
<section class="section section-flush-top"><div class="container">
  <a class="featured" href="/insights/${ARTICLES[0].slug}/" data-reveal>
    <div class="featured-media">${photo(ARTICLES[0].photo, "", { eager: true, sizes: "(min-width: 960px) 55vw, 100vw" })}</div>
    <div class="featured-body"><p class="article-meta">Featured · ${esc(ARTICLES[0].category)} · ${ARTICLES[0].minutes} min read</p><h2>${esc(ARTICLES[0].title)}</h2><p>${esc(ARTICLES[0].dek)}</p><span class="practice-link">Read article ${icon("arrow")}</span></div>
  </a>
</div></section>
${section(`<div class="filter-bar" data-filter-bar role="group" aria-label="Filter articles by topic">
  <button type="button" class="filter-btn is-active" data-filter="all" aria-pressed="true">All topics <span>${ARTICLES.length - 1}</span></button>
  ${TOPICS.map((t) => `<button type="button" class="filter-btn" data-filter="${slug(t)}" aria-pressed="false">${esc(t)} <span>${ARTICLES.slice(1).filter((a) => a.topic === t).length}</span></button>`).join("")}
</div>
<ul class="article-grid" data-filter-list>${ARTICLES.slice(1).map((a) => articleCard(a).replace('<li class="article-card"', `<li class="article-card" data-topic="${slug(a.topic)}"`)).join("")}</ul>`)}
${section(`${head("Browse by service", "Find insights for your area")}
<ul class="topic-index">${ARTICLES.map((a) => `<li data-reveal><a href="/insights/${a.slug}/"><span class="article-meta">${esc(a.category)}</span><b>${esc(a.title)}</b>${icon("arrow")}</a></li>`).join("")}</ul>`, "stone")}
${ctaBand("Want to talk through any of these topics?")}`,
});

const articlePage = (a) => {
  const others = ARTICLES.filter((x) => x !== a);
  return page({
    path: `/insights/${a.slug}/`,
    title: `${a.title} | ${SITE.name}`,
    description: a.dek,
    active: "/insights/",
    schemas: [orgSchema, JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.dek, author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name } })],
    body: `
<article>
  <header class="article-hero">
    <div class="container article-narrow">
      ${crumbs([{ href: "/insights/", label: "Insights" }, { label: a.category }])}
      <p class="article-meta">${esc(a.category)} · ${a.minutes} min read</p>
      <h1>${esc(a.title)}</h1>
      <p class="page-hero-lede">${esc(a.dek)}</p>
    </div>
  </header>
  <div class="container article-media">${photo(a.photo, "", { eager: true, sizes: "(min-width: 1200px) 1200px, 100vw" })}</div>
  <div class="container article-narrow article-body">
    ${a.body.map((b) => (b.h ? `<h2>${esc(b.h)}</h2>` : b.p ? `<p>${esc(b.p)}</p>` : `<ul>${b.list.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>`)).join("\n    ")}
    <aside class="article-cta"><p>Want help putting this into practice?</p><div>${button(a.related, "See the related service")}${button("/contact/", "Talk to our team", "outline")}</div></aside>
  </div>
</article>
${section(`${head("Keep reading", "More insights")}<ul class="article-grid article-grid-2">${others.map(articleCard).join("")}</ul>`, "stone")}
${ctaBand()}`,
  });
};

const about = page({
  path: "/about/",
  title: `About Us | ${SITE.name}`,
  description: "Anira Data DevOps provides financial and technology consulting services that help organizations improve how they manage their finances and operations.",
  active: "/about/",
  body: `
${pageHero({ kicker: "About us", title: "Finance expertise and practical technology, working as one.", text: "Anira Data DevOps provides financial and technology consulting services that help organizations improve how they manage their finances and operations.", photoName: "planning-session", photoAlt: "Team planning a project around a table with laptops and sticky notes", trail: [{ label: "About us" }] })}
${section(`<div class="split"><div data-reveal>${eyebrow("Who we are")}<h2 class="h-display">We bring clarity and structure to finance and operations.</h2></div>
<div class="prose" data-reveal>
  <p>We work closely with businesses to strengthen financial controls, improve reporting, and bring more clarity and structure to their processes. By combining finance expertise with practical technology solutions, we help teams streamline operations and make better, more informed decisions.</p>
  <p>Along with our consulting services, we support clients with skilled finance and IT professionals who contribute to key projects such as system implementations, process improvements and ongoing operations.</p>
  <p>Our team has over 12 years of combined experience across financial consulting, software development, DevOps and cloud technologies, allowing us to deliver solutions that are both practical and scalable.</p>
</div></div>`)}
${section(`<div class="mission">
  <div data-reveal><p class="mission-label">Our mission</p><p class="mission-text">${esc(ABOUT.mission)}</p></div>
  <div data-reveal><p class="mission-label">Our vision</p><p class="mission-text">${esc(ABOUT.vision)}</p></div>
</div>`, "navy")}
${section(factStrip(), "", "section-tight")}
${section(`${head("What sets us apart", "Four things clients can count on")}
<ul class="apart">${ABOUT.apart.map((a, i) => `<li data-reveal><span class="model-num">${pad(i + 1)}</span><h3>${esc(a.t)}</h3><p>${esc(a.d)}</p></li>`).join("")}</ul>`, "stone")}
${section(`${head("How our practices connect", "Run, improve and build", "Our six practices fit together, so one partner can run today's operations, improve them, and build what comes next.")}
<div class="connect">${ABOUT.connect.map((c) => `<div class="connect-col" data-reveal><p class="connect-label">${esc(c.t)}</p><p class="connect-desc">${esc(c.d)}</p><ul>${c.practices
  .map((slugName) => {
    const p = PRACTICES.find((x) => x.slug === slugName);
    return `<li><a href="/services/${p.slug}/">${icon(p.icon)}<span>${esc(p.name)}</span>${icon("arrow", "icon related-arrow")}</a></li>`;
  })
  .join("")}</ul></div>`).join("")}</div>`)}
${section(`${head("Our core values", "What guides how we work")}
<ol class="values">${ABOUT.values.map((v, i) => `<li data-reveal><span class="reason-num">${pad(i + 1)}</span><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p><p class="values-label">In practice</p><ul>${v.practice.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></li>`).join("")}</ol>`, "navy")}
${section(`<div class="split"><div data-reveal>${eyebrow("Our commitments")}<h2 class="h-display">What you can expect from us.</h2><p class="section-lede">The standards we hold ourselves to on every engagement. <a href="/how-we-work/">See how we work</a>.</p></div>
<ul class="outcomes" data-reveal>${ABOUT.commitments.map((c) => `<li>${icon("check")}<span>${esc(c)}</span></li>`).join("")}</ul></div>`)}
${section(`${head("Our focus", "Where we concentrate our expertise")}<ul class="focus-grid">${FOCUS.map((f) => `<li data-reveal>${icon("check")}<span>${esc(f)}</span></li>`).join("")}</ul>`, "stone")}
${section(`<div class="office">
  <div class="office-card" data-reveal>${icon("pin", "icon office-pin")}<p class="office-card-label">Delivery center</p><p class="office-card-city">Madhapur,<br>Hyderabad</p><p class="office-card-region">Telangana, India</p></div>
  <div data-reveal>
    ${eyebrow("Delivery center")}
    <h2 class="h-display">Our office in Madhapur, Hyderabad.</h2>
    <p class="section-lede">From our delivery center in Hyderabad, we offer cost-effective and scalable solutions without compromising on quality, working closely with each client's teams, systems and timelines.</p>
    <ul class="office-facts">
      <li>${icon("pin")}<div><b>Address</b><span>${esc(SITE.address.street)}, ${esc(SITE.address.city)}, ${esc(SITE.address.region)}, ${esc(SITE.address.country)}</span></div></li>
      <li>${icon("clock")}<div><b>Business hours</b><span>${esc(SITE.hours[0][0])}, ${esc(SITE.hours[0][1])}</span></div></li>
      <li>${icon("mail")}<div><b>Email</b><a href="mailto:${SITE.email}">${SITE.email}</a></div></li>
    </ul>
    <a class="text-link" href="${SITE.mapUrl}" target="_blank" rel="noopener">View on Google Maps ${icon("arrow")}</a>
  </div>
</div>`)}
${section(`<div class="duo">
  <a class="duo-card" href="/careers/" data-reveal>${eyebrow("Careers")}<h3>Build your career with us</h3><p>Varied projects across finance and technology, mentoring and skills training.</p><span class="practice-link">View careers ${icon("arrow")}</span></a>
  <a class="duo-card" href="/insights/" data-reveal>${eyebrow("Insights")}<h3>Read our latest thinking</h3><p>Practical articles on finance operations, automation, ERP and DevOps.</p><span class="practice-link">Browse insights ${icon("arrow")}</span></a>
</div>`, "stone")}
${ctaBand()}`,
});

const careers = page({
  path: "/careers/",
  title: `Careers | ${SITE.name}`,
  description: "Join Anira Data DevOps in Hyderabad. Work across software, DevOps, databases, ERP, finance and analytics with mentoring and skills training.",
  active: "/careers/",
  schemas: [orgSchema, faqSchema(CAREERS.faqs)],
  body: `
${pageHero({ kicker: "Careers", title: "Challenging projects. Room to grow.", text: "We are looking for talented people ready to tackle challenging projects in the IT industry. We are an equal opportunity employer offering competitive salaries and comprehensive benefits.", photoName: "team-laptops", photoAlt: "Team of professionals working together on laptops", trail: [{ label: "Careers" }], aside: `<aside class="hero-aside"><p class="hero-aside-label">On this page</p><ul><li><a href="#why">Why join us</a></li><li><a href="#areas">Where you could work</a></li><li><a href="#growth">How you grow</a></li><li><a href="#process">Our hiring process</a></li><li><a href="#openings">Current openings</a></li></ul></aside>` })}
${section(`${head("Why join us", "A place to do good work and keep growing")}
<ul class="apart">${CAREERS.why.map((w, i) => `<li data-reveal><span class="model-num">${pad(i + 1)}</span><h3>${esc(w.t)}</h3><p>${esc(w.d)}</p></li>`).join("")}</ul>`, "", "", "why")}
${section(`${head("Where you could work", "Six areas, one team", "Our work spans finance and technology, so you can deepen your specialty and learn from colleagues in other disciplines.")}
<ul class="roles">${CAREERS.areas.map((a) => `<li data-reveal>${icon(a.icon)}<div><h3>${esc(a.t)}</h3><p>${esc(a.d)}</p></div></li>`).join("")}</ul>`, "stone", "", "areas")}
${section(`${head("How you grow", "We are with you every step of the way.")}
<ol class="growth">${CAREERS.growth.map((g, i) => `<li data-reveal><span class="reason-num">${pad(i + 1)}</span><h3>${esc(g.t)}</h3><p>${esc(g.d)}</p><ul>${g.points.map((p) => `<li>${icon("check")}<span>${esc(p)}</span></li>`).join("")}</ul></li>`).join("")}</ol>`, "navy", "", "growth")}
${section(`${head("Our hiring process", "What to expect when you apply", "A clear, respectful process. Steps can vary slightly by role.")}${flowSteps(CAREERS.process)}`, "", "", "process")}
<section class="section section-stone" id="openings"><div class="container">
  ${head("Open positions", "Current openings")}
  <p class="section-lede apply-note" data-reveal>To apply, email your resume to <a href="mailto:${SITE.email}">${SITE.email}</a> with the job title in the subject line.</p>
  <div class="jobs">${JOBS.map(
    (j) => `<details class="job" data-reveal><summary><span class="job-title">${icon("briefcase")}<span>${esc(j.title)}</span></span>${icon("chevron", "icon job-chevron")}</summary>
      <div class="job-body"><p>${esc(j.summary)}</p><h3>Qualifications</h3><ul>${j.qualifications.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
      <a class="btn btn-primary btn-sm" href="mailto:${SITE.email}?subject=${encodeURIComponent(`Application: ${j.title}`)}"><span>Apply by email</span>${icon("arrow", "icon btn-icon")}</a></div></details>`,
  ).join("")}</div>
  <div class="open-application" data-reveal><div><h3>Don't see the right role?</h3><p>Send us your resume and tell us what you are looking for. We will keep it in mind for future openings.</p></div>${button(`mailto:${SITE.email}?subject=${encodeURIComponent("General application")}`, "Send your resume")}</div>
</div></section>
${section(`<div class="split split-faq"><div data-reveal>${eyebrow("Candidate FAQ")}<h2 class="h-display">Questions about applying</h2></div>${faqList(CAREERS.faqs)}</div>`)}
${section(`<p class="eeo" data-reveal><b>Equal opportunity.</b> Anira Data DevOps is an equal opportunity employer. We welcome applications from all qualified candidates and make hiring decisions based on skills, experience and fit for the role.</p>`, "stone", "section-tight")}
${ctaBand("Ready to take the next step in your career?")}`,
});

const contact = page({
  path: "/contact/",
  title: `Contact Us | ${SITE.name}`,
  description: "Contact Anira Data DevOps in Madhapur, Hyderabad. Email info@aniradatadev.com or send us a message.",
  active: "/contact/",
  body: `
${plainHero({ kicker: "Contact us", title: "Let's talk about your priorities.", text: "Tell us a little about your business and what you need. Our team will be in touch.", trail: [{ label: "Contact" }] })}
<section class="section section-flush-top">
  <div class="container contact-grid">
    <form class="contact-form" action="/api/contact/" method="post" data-contact-form novalidate>
      <div class="field-row">
        <label class="field"><span>Full name *</span><input name="name" autocomplete="name" required maxlength="120"></label>
        <label class="field"><span>Work email *</span><input name="email" type="email" autocomplete="email" required maxlength="254"></label>
      </div>
      <div class="field-row">
        <label class="field"><span>Company</span><input name="company" autocomplete="organization" maxlength="120"></label>
        <label class="field"><span>Phone</span><input name="phone" type="tel" autocomplete="tel" maxlength="50"></label>
      </div>
      <label class="field"><span>Area of interest</span>
        <select name="interest"><option value="">Select a service (optional)</option>${PRACTICES.map((p) => `<option>${esc(p.name)}</option>`).join("")}<option>Careers</option><option>Something else</option></select>
      </label>
      <label class="field"><span>How can we help? *</span><textarea name="message" rows="6" required maxlength="5000"></textarea></label>
      <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <p class="form-note">By sending this form you agree to our <a href="/privacy-policy/">privacy policy</a>.</p>
      <button class="btn btn-primary" type="submit"><span>Send message</span>${icon("arrow", "icon btn-icon")}</button>
      <p class="form-status" role="status" aria-live="polite" data-form-status></p>
    </form>
    <aside class="contact-card">
      <h2>Anira Data DevOps</h2>
      <ul>
        <li>${icon("mail")}<div><b>Email</b><a href="mailto:${SITE.email}">${SITE.email}</a></div></li>
        <li>${icon("pin")}<div><b>Office</b><span>${esc(SITE.address.street)}<br>${esc(SITE.address.city)}, ${esc(SITE.address.region)}<br>${esc(SITE.address.country)}</span><a class="text-link" href="${SITE.mapUrl}" target="_blank" rel="noopener">View on Google Maps ${icon("arrow")}</a></div></li>
        <li>${icon("clock")}<div><b>Business hours</b>${SITE.hours.map(([d, h]) => `<span>${esc(d)}: ${esc(h)}</span>`).join("")}</div></li>
      </ul>
      <p class="contact-faq">Have a quick question? See our <a href="/faq/">FAQ</a>.</p>
    </aside>
  </div>
</section>`,
});

const privacy = page({
  path: "/privacy-policy/",
  title: `Privacy Policy | ${SITE.name}`,
  description: "How Anira Data DevOps handles information submitted through this website.",
  body: `
${plainHero({ kicker: "Legal", title: "Privacy policy", text: `Last updated ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`, cls: "contact-hero-short" })}
<section class="section"><div class="container prose prose-narrow">
  <p>This policy explains how ${esc(SITE.legalName)} ("we", "us") handles information you provide through this website.</p>
  <h2>Information we collect</h2>
  <p>When you use our contact form or email us, we receive the details you choose to share, such as your name, email address, company, phone number and message. If you apply for a role, we receive the resume and information you send.</p>
  <h2>How we use it</h2>
  <p>We use this information only to respond to your inquiry, to discuss our services with you, or to assess your application. We do not sell your information or share it with third parties for marketing.</p>
  <h2>Service providers</h2>
  <p>This website is hosted by Vercel, and messages sent through the contact form are delivered to our mailbox through our email provider. These providers process information on our behalf.</p>
  <h2>Retention</h2>
  <p>We keep inquiries and applications only as long as needed for the purpose they were sent, or as required by law.</p>
  <h2>Your choices</h2>
  <p>You can ask us to access, correct or delete the information you have sent us by emailing <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
  <h2>Cookies</h2>
  <p>This website does not use advertising or tracking cookies.</p>
</div></section>`,
});

const notFound = page({
  path: "/404.html",
  title: `Page not found | ${SITE.name}`,
  description: "The page you are looking for could not be found.",
  schemas: [],
  body: `
<section class="contact-hero contact-hero-tall"><div class="container">${eyebrow("404")}<h1>We couldn't find that page.</h1><p class="page-hero-lede">The page may have moved. Try one of these instead.</p>
<div class="hero-actions">${button("/", "Go to the homepage")}${button("/services/", "Browse services", "ghost")}</div></div></section>`,
});

// ---------- write ----------
const out = (rel, content) => {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
};

const PAGES = [
  ["index.html", home, "/"],
  ["services/index.html", servicesHub, "/services/"],
  ...PRACTICES.map((p) => [`services/${p.slug}/index.html`, practicePage(p), `/services/${p.slug}/`]),
  ...FINANCE_SERVICES.map((s) => [`services/finance-accounting/${s.slug}/index.html`, financePage(s), `/services/finance-accounting/${s.slug}/`]),
  ["how-we-work/index.html", howWeWork, "/how-we-work/"],
  ["insights/index.html", insightsIndex, "/insights/"],
  ...ARTICLES.map((a) => [`insights/${a.slug}/index.html`, articlePage(a), `/insights/${a.slug}/`]),
  ["faq/index.html", faqPage, "/faq/"],
  ["about/index.html", about, "/about/"],
  ["careers/index.html", careers, "/careers/"],
  ["contact/index.html", contact, "/contact/"],
  ["privacy-policy/index.html", privacy, "/privacy-policy/"],
  ["404.html", notFound, null],
];

for (const [rel, html] of PAGES) out(rel, html);

const today = new Date().toISOString().slice(0, 10);
out(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.filter(([, , p]) => p)
    .map(([, , p]) => `  <url><loc>${SITE.url}${p}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`,
);
out("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
out(
  "site.webmanifest",
  JSON.stringify(
    {
      name: SITE.name,
      short_name: "Anira",
      icons: [
        { src: "/assets/img/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/assets/img/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      theme_color: "#0A1C33",
      background_color: "#FFFFFF",
      display: "standalone",
    },
    null,
    2,
  ) + "\n",
);

console.log(`Built ${PAGES.length} pages.`);
