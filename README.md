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

## Agent operating procedure

For an end-to-end customer build, follow [`docs/site-build-sop.md`](docs/site-build-sop.md). For the shorter repository and multi-Agent operating model, read [`docs/agent-operations.md`](docs/agent-operations.md). Each generated project contains a self-contained `skills/company-website` workflow so an external Agent can continue without access to this catalog.

The operator maintains one catalog repository. Every remote Agent clones that same repository and pins an approved commit; it does not need to create another Fork. The selected customer website is generated outside the catalog and pushed to a separate customer repository. Ten customers therefore mean ten independent customer repositories, not ten companies inside this catalog.

The fixed first-build order is: clone or update the catalog, generate the customer project, create an empty customer remote repository, initialize Git in the customer project, implement and verify the website, then commit and push to that customer remote. An existing customer website is modified by cloning its own repository directly; do not regenerate it from the catalog.

SSH authenticates clone and push to repositories that already exist. Creating a new remote repository requires an authorized provider API token or a central repository-provisioning service. Credentials stay in the Agent host's SSH/secret configuration and are never stored in this repository or its skills.

Portable Agent skills live in `agent-skills/`:

- `company-site-bootstrap` gets or reuses the catalog, performs intake and creates the customer project.
- `company-website` completes or modifies the generated Astro website.

Install both into an Agent's skill directory without copying credentials:

```bash
npm run install:agent-skills -- --target <agent-skills-directory>
```

The installer refuses to overwrite an existing skill unless `--force` is supplied.

Template selection happens once, during initialization. Moving an already customized site to another template is a migration, not a runtime theme switch.

## Licensing note

These are original starter implementations. The names Matterhaus, Mølle, and Outkast are design references only and no source code, copy, or media from those commercial templates is included.
