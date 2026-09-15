# Forge · Product Catalog Starter

An Agent-friendly, catalog-first company website built with Astro, Tailwind CSS, and TypeScript. Forge emphasizes product discovery, specifications, and direct sales contact.

## Requirements

- Node.js 22+
- npm 10+

## Commands

```bash
npm install
npm run dev
npm run build
npm run verify
```

Run `npm run verify:delivery` before handing a generated company site to a user. Delivery verification fails while the starter still contains demo content.

## Start a company website

1. Copy this repository into a new company-specific directory. Do not edit the original starter.
2. Put private source files in `materials/`. That directory is ignored by Git and never read by the website.
3. Read `AGENTS.md` before making changes.
4. Replace public company facts in `src/data/company.json`.
5. Replace demo product files and copy approved public media into `public/media/`.
6. Set `contentStatus` in `site.config.ts` to `draft` while working and `ready` only after facts and assets are confirmed.
7. Run `npm run verify:delivery` and review the site at mobile and desktop widths.

See `docs/content-contract.md` for the public content schema and `docs/verification.md` for automated checks.
