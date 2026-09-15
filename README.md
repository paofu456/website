# Company Website Template Catalog

Three self-contained Astro + Tailwind CSS company website starters for external Agents.

| ID | Customer name | Direction | Best fit |
|---|---|---|---|
| `lumen` | Lumen · 极简画册 | Editorial whitespace, large imagery, restrained typography | Design-led manufacturers and premium brands |
| `forge` | Forge · 产品目录 | Product grid, specifications, catalog-first navigation | Industrial equipment and component suppliers |
| `nexus` | Nexus · 现代商务 | Structured capability blocks and credible business presentation | B2B services, groups, and general enterprises |

All three templates use the same company data, product content, routes, Agent rules, SEO baseline, and verification commands. Their page composition and visual components are intentionally different.

## Install and verify the catalog

```bash
npm install
npm run verify
```

## Create a company project

The target directory must not already contain files.

```bash
npm run create-site -- --template forge --target ../acme-website
```

Available template IDs are `lumen`, `forge`, and `nexus`. The generated directory is an independent Astro project; future edits do not affect this catalog.

After creation:

```bash
cd ../acme-website
npm install
npm run dev
```

Template selection happens once, during initialization. Moving an already customized site to another template is a migration, not a runtime theme switch.

## Licensing note

These are original starter implementations. The names Matterhaus, Mølle, and Outkast are design references only and no source code, copy, or media from those commercial templates is included.
