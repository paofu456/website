# Template catalog Agent instructions

This repository contains three independent Astro + Tailwind website starters under `templates/`. Do not add React, Vue, a CMS, backend, template runtime, or storage service.

## Before editing

1. Read this file and the root `README.md`.
2. Inspect Git status and preserve unrelated or uncommitted work.
3. For template code, also read that template's `AGENTS.md`.
4. Keep the shared content contract and route structure compatible across all three templates.

## Customer website workflow

When the request is to build a company website from customer materials, read `docs/site-build-sop.md` before creating or editing a customer project. Complete intake and template selection in the catalog, then continue from the generated project's `skills/company-website/SKILL.md`. Do not stop after copying a template when the user asked for a finished MVP.

## Catalog rules

- Template selection occurs only in `scripts/create-site.mjs` by copying one complete starter.
- Each template must remain independently installable and buildable.
- All templates expose `npm run dev`, `npm run build`, `npm run verify`, and `npm run verify:delivery`.
- All templates use `site.config.ts`, `src/data/company.json`, `src/content/products/*.md`, and `public/media/` for the same purposes.
- Template-specific layout and presentation remain inside each template. Do not create cross-template runtime imports.
- Never import commercial template source, copy, or media without an explicit redistribution license.

Run `npm run verify` after meaningful catalog or template changes. Visually inspect each template at approximately 390px and 1440px when browser tooling is available.
