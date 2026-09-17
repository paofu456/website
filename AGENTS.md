# Template catalog Agent instructions

This repository contains three independent Astro + Tailwind website starters under `templates/`. Do not add React, Vue, a CMS, backend, template runtime, or storage service.

## Before editing

1. Read this file and the root `README.md`.
2. Inspect Git status and preserve unrelated or uncommitted work.
3. For template code, also read that template's `AGENTS.md`.
4. Keep the shared content contract and route structure compatible across all three templates.

## Customer website workflow

When the request is to build a company website from customer materials, read `docs/site-build-sop.md` before creating or editing a customer project. A remote Agent clones the operator-provided catalog and pins an approved commit; a local Agent may use the existing checkout. Complete intake and template selection in the catalog, then continue from the generated project's `skills/company-website/SKILL.md`. Do not stop after copying a template when the user asked for a finished MVP.

For a conversational first-build request, do not require the user to invent a local material directory. If no files are attached or supplied, ask the user to upload the available PDF, Word, PowerPoint, spreadsheet, and image files, then stop before scaffolding. Read all supplied materials before asking for missing facts. Do not create the customer project or remote repository until the P0 facts and public-use authorization are confirmed.

## Catalog rules

- Template selection occurs only in `scripts/create-site.mjs` by copying one complete starter.
- Each template must remain independently installable and buildable.
- All templates expose `npm run dev`, `npm run build`, `npm run verify`, `npm run verify:delivery`, and `npm run verify:handoff`.
- All templates use `site.config.ts`, `src/data/company.json`, `src/content/products/*.md`, and `public/media/` for the same purposes.
- Template-specific layout and presentation remain inside each template. Do not create cross-template runtime imports.
- Never import commercial template source, copy, or media without an explicit redistribution license.
- Never place customer materials or customer-specific code in the catalog repository. Each customer website has its own project directory and Git repository.
- Never use the catalog's `.tmp/`, `materials/`, or any other catalog path for customer attachments, extracted pages, OCR output, contact sheets, or intake notes. Use runtime attachment storage or a customer task workspace outside the catalog.

Run `npm run verify` after meaningful catalog or template changes. Customer builds default to desktop-only QA at approximately 1440px; mobile adaptation and 390px QA occur only when the user explicitly includes them. When a catalog change alters responsive template presentation, inspect both desktop and mobile before releasing that template change.
