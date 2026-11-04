"""End-to-end checks for every page on phone, tablet and desktop.

Usage:
  pip install playwright && python -m playwright install webkit
  python tests/e2e.py [BASE_URL]          # default http://127.0.0.1:4173
  python tests/e2e.py https://www.aniradatadev.com
  python tests/e2e.py BASE_URL --device iphone      # one device only (iphone, android, ipad, laptop, desktop)

Uses installed Google Chrome for Chromium viewports and Playwright WebKit for
iPhone / iPad (Safari engine). Exits non-zero if any check fails.
Screenshots are written to tests/screens/ (git-ignored).
"""
import re
import sys
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
ONLY = sys.argv[sys.argv.index("--device") + 1] if "--device" in sys.argv else None
if ONLY in ARGS:
    ARGS.remove(ONLY)
BASE = (ARGS[0] if ARGS else "http://127.0.0.1:4173").rstrip("/")
LIVE = not BASE.startswith("http://127.0.0.1") and not BASE.startswith("http://localhost")
SHOTS = Path(__file__).parent / "screens"
SHOTS.mkdir(exist_ok=True)

failures, warnings = [], []
fail = lambda where, msg: failures.append(f"{where}: {msg}")
warn = lambda where, msg: warnings.append(f"{where}: {msg}")


def page_paths():
    xml = urllib.request.urlopen(f"{BASE}/sitemap.xml").read().decode()
    return [re.sub(r"^https?://[^/]+", "", u) for u in re.findall(r"<loc>([^<]+)</loc>", xml)]


# Collects layout problems in the page: horizontal overflow, broken images,
# clipped text, content left invisible by the scroll-reveal animation.
AUDIT_JS = """
async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const H = () => document.documentElement.scrollHeight;
  // Instant scrolling: the site uses smooth scrolling, which would still be animating when we measure.
  const go = (y) => scrollTo({ top: y, behavior: 'instant' });
  for (let y = 0; y < H(); y += Math.max(300, innerHeight * 0.7)) { go(y); await sleep(60); }
  go(H()); await sleep(400);
  await Promise.race([Promise.all([...document.images].map((i) => i.decode().catch(() => {}))), sleep(4000)]);
  const vw = document.documentElement.clientWidth;
  const label = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '');
  const hiddenByAncestor = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(s.overflowX)) return true; if (s.display === 'none' || s.visibility === 'hidden') return true; } return false; };
  const visible = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  const overflow = [];
  if (document.documentElement.scrollWidth > vw + 1) {
    for (const el of document.body.querySelectorAll('*')) {
      if (!visible(el) || hiddenByAncestor(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 || r.left < -1) overflow.push(label(el) + ' right=' + Math.round(r.right));
      if (overflow.length > 5) break;
    }
  }
  const brokenImages = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
  const clipped = [...document.querySelectorAll('h1,h2,h3,.btn,.nav-list a,.filter-btn,.fact-value')]
    .filter((el) => visible(el) && el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible')
    .map(label).slice(0, 5);
  const notRevealed = [...document.querySelectorAll('[data-reveal]:not(.is-visible)')].filter((el) => !el.closest('[hidden]')).length;
  const fonts = document.fonts.check('16px Figtree') && document.fonts.check('16px "Source Serif 4"');
  const small = [...document.querySelectorAll('a, button, summary')].filter((el) => {
    if (!visible(el) || el.closest('.footer-base, .breadcrumb, .site-footer, .prose, .article-body, .section-lede, .form-note, .faq p, .contact-card, .apply-note, .cycle-links')) return false;
    const r = el.getBoundingClientRect(); return r.height < 24 && r.width < 200;
  }).map(label).slice(0, 5);
  return { overflow, brokenImages, clipped, notRevealed, fonts, small, scrollWidth: document.documentElement.scrollWidth, vw };
}
"""


def audit(page, where, mobile):
    r = page.evaluate(AUDIT_JS)
    if r["overflow"] or r["scrollWidth"] > r["vw"] + 1:
        fail(where, f"horizontal overflow (page {r['scrollWidth']}px > viewport {r['vw']}px): {r['overflow']}")
    if r["brokenImages"]:
        fail(where, f"broken images: {r['brokenImages']}")
    if r["clipped"]:
        fail(where, f"clipped text: {r['clipped']}")
    if r["notRevealed"]:
        fail(where, f"{r['notRevealed']} sections stayed invisible after scrolling")
    if not r["fonts"]:
        fail(where, "web fonts did not load")
    if mobile and r["small"]:
        warn(where, f"small tap targets: {r['small']}")


def step(where, msg):
    print(f"    {where}: {msg}", flush=True)


def check_mobile_menu(page, where):
    step(where, "mobile menu")
    page.goto(f"{BASE}/", wait_until="networkidle")
    page.click("[data-nav-toggle]")
    page.wait_for_timeout(400)
    vh = page.viewport_size["height"]
    box = page.locator("#site-nav").bounding_box()
    if not box or box["y"] + box["height"] < vh - 2:
        fail(where, f"mobile menu does not reach the bottom of the screen: {box}")
    for name in ["How we work", "Careers", "Contact us"]:
        link = page.locator("#site-nav").get_by_role("link", name=name, exact=True)
        link.scroll_into_view_if_needed()  # the menu scrolls on short screens, as a user would
        b = link.bounding_box()
        if not b:
            fail(where, f"menu link '{name}' not visible"); continue
        hit = page.evaluate("([x, y]) => { const el = document.elementFromPoint(x, y); return el && !!el.closest('#site-nav'); }", [b["x"] + b["width"] / 2, b["y"] + b["height"] / 2])
        if not hit:
            fail(where, f"menu link '{name}' is covered by other content")
    page.locator("#site-nav").get_by_role("link", name="Careers", exact=True).click()
    page.wait_for_url("**/careers/")
    if page.evaluate("document.body.classList.contains('nav-open')"):
        fail(where, "menu stayed open after navigating")
    page.click("[data-nav-toggle]"); page.keyboard.press("Escape"); page.wait_for_timeout(300)
    if page.evaluate("document.body.classList.contains('nav-open')"):
        fail(where, "Escape did not close the menu")


def check_desktop_menu(page, where):
    step(where, "desktop menu")
    page.goto(f"{BASE}/", wait_until="networkidle")
    page.hover(".has-menu > a")
    page.wait_for_timeout(350)
    box = page.locator(".nav-menu").bounding_box()
    vw = page.viewport_size["width"]
    if not box or box["x"] < 0 or box["x"] + box["width"] > vw:
        fail(where, f"Services dropdown runs off-screen: {box} (viewport {vw})")
    last = page.locator(".nav-menu-simple a").last
    if last.is_visible():
        b = last.bounding_box()
        page.mouse.move(b["x"] + 5, b["y"] + b["height"] / 2)
        page.wait_for_timeout(200)
        if not page.locator(".nav-menu").is_visible():
            fail(where, "dropdown closes before the pointer can reach it")
        last.click(); page.wait_for_url("**/global-payroll/")


def check_interactions(page, where):
    step(where, "faq / filter / jobs / form")
    # FAQ accordion
    page.goto(f"{BASE}/faq/", wait_until="networkidle")
    page.locator(".faq summary").first.click()
    if not page.locator(".faq").first.evaluate("el => el.open"):
        fail(where, "FAQ item did not open")
    # Insights topic filter
    page.goto(f"{BASE}/insights/", wait_until="networkidle")
    for btn in page.locator("[data-filter]").all()[1:]:
        btn.click(); page.wait_for_timeout(150)
        expected = int(btn.locator("span").inner_text())
        shown = page.locator("[data-filter-list] [data-topic]:not([hidden])").count()
        if shown != expected:
            fail(where, f"filter '{btn.inner_text()}' shows {shown} articles, expected {expected}")
    # Careers job accordion and mailto
    page.goto(f"{BASE}/careers/", wait_until="networkidle")
    page.locator(".job summary").first.click()
    href = page.locator(".job").first.locator("a.btn").get_attribute("href")
    if not href or not href.startswith("mailto:info@aniradatadev.com"):
        fail(where, f"apply link wrong: {href}")
    # Contact form validation (no real submission)
    page.goto(f"{BASE}/contact/", wait_until="networkidle")
    page.click("[data-contact-form] button[type=submit]")
    status = page.locator("[data-form-status]").inner_text()
    if "required" not in status:
        fail(where, f"empty form did not show a validation message (got '{status}')")
    if page.locator("[name=name]").get_attribute("aria-invalid") != "true":
        fail(where, "empty required field not marked invalid")


def main():
    paths = page_paths()
    print(f"Testing {len(paths)} pages at {BASE}", flush=True)
    with sync_playwright() as p:
        chrome = p.chromium.launch(channel="chrome")
        webkit = p.webkit.launch()
        configs = [
            ("iPhone (Safari)", webkit, dict(p.devices["iPhone 13"]), True),
            ("Android (Chrome)", chrome, dict(p.devices["Pixel 7"]), True),
            ("iPad (Safari)", webkit, dict(p.devices["iPad (gen 7)"]), True),
            ("Laptop 1366 (Chrome)", chrome, {"viewport": {"width": 1366, "height": 768}}, False),
            ("Desktop 1920 (Chrome)", chrome, {"viewport": {"width": 1920, "height": 1080}}, False),
        ]
        if ONLY:
            configs = [c for c in configs if c[0].lower().startswith(ONLY.lower())]
        for name, browser, opts, mobile in configs:
            ctx = browser.new_context(**opts)
            ctx.set_default_timeout(15000)
            page = ctx.new_page()
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: m.type == "error" and errors.append(m.text))
            for path in paths:
                where = f"[{name}] {path}"
                errors.clear()
                step(name, path)
                resp = page.goto(f"{BASE}{path}", wait_until="networkidle")
                if not resp or resp.status != 200:
                    fail(where, f"HTTP {resp.status if resp else 'no response'}"); continue
                audit(page, where, mobile)
                if errors:
                    fail(where, f"browser errors: {errors[:3]}")
                if name.startswith(("iPhone", "Desktop")):
                    page.screenshot(path=str(SHOTS / f"{name.split()[0].lower()}{path.strip('/').replace('/', '_') or '_home'}.png"), full_page=True)
            narrow = (opts.get("viewport") or {}).get("width", 1000) <= 900
            for check, label in ((check_mobile_menu if narrow else check_desktop_menu, "menu"), (check_interactions, "interactions")):
                try:
                    check(page, f"[{name}] {label}")
                except Exception as e:  # noqa: BLE001
                    fail(f"[{name}] {label}", f"{type(e).__name__}: {str(e).splitlines()[0]}")
            ctx.close()
            print(f"  done: {name}", flush=True)
        chrome.close(); webkit.close()

    # Old Google Sites URLs must redirect (only on Vercel).
    if LIVE and ONLY in (None, "desktop"):
        for old, new in [("/home", "/"), ("/about-us", "/about/"), ("/contact-us", "/contact/")]:
            req = urllib.request.Request(BASE + old, method="HEAD")
            try:
                final = urllib.request.urlopen(req).geturl()
                if not final.rstrip("/").endswith(new.rstrip("/")):
                    fail(f"redirect {old}", f"ended at {final}")
            except Exception as e:  # noqa: BLE001
                fail(f"redirect {old}", str(e))

    print(f"\n{len(failures)} failures, {len(warnings)} warnings")
    for f in failures:
        print("FAIL", f)
    for w in sorted(set(warnings))[:40]:
        print("WARN", w)
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
