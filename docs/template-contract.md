# Template contract

Every directory under `templates/` is a complete, independent website starter.

## Required files

- `template.json`
- `AGENTS.md` and `README.md`
- `package.json` and lock file
- `site.config.ts`
- `src/data/company.json`
- `src/content/products/*.md`
- standard pages for home, about, products, product detail, contact, and 404
- `scripts/verify.mjs`

## Stable commands

Every generated project provides `npm run dev`, `npm run build`, `npm run verify`, and `npm run verify:delivery`.

## Independence

Templates may duplicate small components. They must not import runtime code from the catalog root or another template because a selected template is copied out as a standalone project.

## Selection

`scripts/create-site.mjs` accepts exactly one registered template ID and a new or empty target directory. It copies the selected starter while excluding generated dependencies and build artifacts.
