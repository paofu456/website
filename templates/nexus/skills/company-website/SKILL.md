---
name: company-website
description: Build or safely modify a customer-specific Astro company website from supplied business materials using this repository's content contract and verification gates.
---

# Company website workflow

Always read the repository `AGENTS.md` before acting. Work directly in the generated Astro project; do not create an Agent runtime, page generator, CMS, backend, or storage platform.

Choose one route:

- For the first customer build, read `references/first-build.md` completely and follow its phase gates.
- For a scoped change to an existing customer site, read `references/modify-site.md`. Clone the customer's repository directly when it is not already present; do not run the catalog scaffold again.
- For SEO-specific work, also read `references/seo-baseline.md`.

Never fill visual gaps with invented facts. Raw input stays in `materials/`; internal decisions stay in `notes/`; only approved public assets go in `public/media/`. Omit unsupported sections and record the missing input in `notes/content-gaps.md`.

When the user asked for a completed MVP, do not stop after scaffolding or describing a plan. Continue through content replacement, verification and handoff unless a P0 input is genuinely missing.

After meaningful changes run `npm run verify`. Before delivery run `npm run verify:delivery` and visually inspect mobile and desktop layouts when browser tooling is available. When Git delivery is requested, commit only the intended verified files and push to the existing customer `origin`; never redirect or push to the catalog repository.
