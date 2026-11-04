# Anira Data DevOps website

The public website for Anira Data DevOps Pvt Ltd (https://www.aniradatadev.com): a fast,
hand-built static site with one serverless function for the contact form, deployed on Vercel.

## Pages

| URL | Page |
| --- | --- |
| `/` | Home |
| `/services/` | All services |
| `/services/finance-accounting/` | Finance & Accounting Operations (T&E, AP, AR/O2C, R2R, FP&A, reporting, global payroll) |
| `/services/erp/` | ERP Consulting & Implementation |
| `/services/finance-transformation/` | Finance Transformation & Automation |
| `/services/technology/` | IT Consulting & Software Development |
| `/services/cloud-devops/` | Cloud & DevOps |
| `/services/it-staffing/` | IT & Finance Talent |
| `/about/`, `/careers/`, `/contact/`, `/privacy-policy/` | Company pages |

The old Google Sites URLs `/home`, `/about-us` and `/contact-us` redirect to the new pages (see `vercel.json`).

## Editing content

All copy and company facts are in `build/content.mjs` (services, jobs, address, hours, figures).
Page templates are in `build/build.mjs`. After editing, regenerate the HTML and commit it:

```bash
node build/build.mjs
```

Requires Node 18 or newer; the build has no dependencies.

- Styles: `assets/css/site.css`. Behaviour (mobile menu, scroll reveal, contact form): `assets/js/site.js`.

## Preview locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173/. The contact form only sends from a Vercel deployment.

## Deploy on Vercel

1. Import the repository in Vercel.
2. Framework preset: **Other**. Leave the build command and output directory empty (the generated HTML is committed).
3. Add the environment variables below, then deploy.
4. Add the domain `www.aniradatadev.com` (and `aniradatadev.com`) under **Settings → Domains** and update DNS as Vercel instructs.

### Contact form email (Zoho Mail)

`api/contact.js` sends each inquiry through Zoho Mail SMTP to `info@aniradatadev.com`, with
the visitor's address as reply-to. Create an app-specific password in Zoho Mail
(**My Account → Security → App Passwords**) and add these variables in Vercel
(Production and Preview):

| Variable | Value |
| --- | --- |
| `ZOHO_SMTP_USER` | The Zoho mailbox that sends the email, e.g. `info@aniradatadev.com` |
| `ZOHO_SMTP_PASSWORD` | The app-specific password |
| `ZOHO_SMTP_HOST` | Optional. Defaults to `smtp.zoho.in` (India data center) |
| `CONTACT_TO_EMAIL` | Optional. Defaults to `info@aniradatadev.com` |

## Assets and credits

- Typefaces: [Figtree](https://fonts.google.com/specimen/Figtree) and [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4), self-hosted (SIL Open Font License).
- Photography: [Unsplash](https://unsplash.com/license) stock images (free for commercial use). They are illustrative, not photos of Anira staff or offices. Replace them with real office photos when available.
- Logo and icons: generated from the Anira logo (`build/logo-source.png`).
