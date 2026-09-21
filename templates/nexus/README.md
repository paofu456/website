# Nexus · Modern Business Starter

An Agent-friendly modern business website built with Astro, Tailwind CSS, and TypeScript. Nexus balances company positioning, capability blocks, products, and contact routes.

## Requirements

- Node.js 22+
- npm 10+

## Commands

```bash
npm ci --include=optional
npm run dev
npm run build
npm run verify:quick
npm run verify
npm run verify:handoff -- --owner <owner> --repo <customer-repo>
```

Use `npm run verify` once for final local acceptance. When production delivery with a real canonical domain is in scope, run `npm run verify:delivery` instead; it includes the same build and checks plus release gates.

## Start a company website

1. Copy this repository into a new company-specific directory. Do not edit the original starter.
2. Put private source files in `materials/`. That directory is ignored by Git and never read by the website.
3. Read `AGENTS.md` before making changes.
4. Replace public company facts in `src/data/company.json`.
5. Replace demo product files and copy approved public media into `public/media/`.
6. Set `contentStatus` in `site.config.ts` to `draft` while working and `ready` only after facts and assets are confirmed.
7. Run `npm run verify:quick` after editing batches, then exactly one final `verify` or `verify:delivery` command and review every public route at desktop width. Mobile adaptation is a separate scope unless the user explicitly requests it.
8. After Push, run `npm run verify:handoff -- --owner <owner> --repo <customer-repo>`; a local commit alone is not repository delivery.

See `docs/content-contract.md` for the public content schema and `docs/verification.md` for automated checks.
