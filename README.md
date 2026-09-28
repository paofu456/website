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
npm ci --include=optional
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
npm ci --include=optional
npm run dev
```

## Agent operating procedure

For an end-to-end customer build, follow [`docs/site-build-sop.md`](docs/site-build-sop.md). For the shorter repository and multi-Agent operating model, read [`docs/agent-operations.md`](docs/agent-operations.md). Each generated project contains a self-contained `skills/company-website` workflow so an external Agent can continue without access to this catalog.

To configure the same capability on a new non-Hermes server, follow [`docs/external-agent-website-setup.md`](docs/external-agent-website-setup.md). It describes existing GitHub CLI authentication, the five portable skills, catalog pinning, and the first acceptance test.

The operator maintains one catalog repository. Every remote Agent clones that same repository and pins an approved commit; it does not need to create another Fork. The selected customer website is generated outside the catalog and pushed to a separate customer repository. Ten customers therefore mean ten independent customer repositories, not ten companies inside this catalog.

For a conversational first build, the Agent first asks the user to upload available company materials when none were supplied. It reads the attachments, separates user confirmations, source facts, inferences and conflicts, then asks one consolidated set of genuine gaps. Only after the P0 inputs are confirmed does an external Agent clone the catalog into its own workspace at an approved commit, generate the customer project, initialize local Git, implement and verify the website, then create a public GitHub customer repository, commit and push. A workflow acceptance test must not reuse the operator's maintenance checkout. The user does not need to invent a local materials path, and customer attachments or extraction output must never be stored in this catalog. An existing customer website is modified by cloning its own repository directly; do not regenerate it from the catalog.

Use the host's existing GitHub CLI HTTPS authentication for clone, new repository creation and push. Credentials stay in the host's secure gh configuration and never enter this repository or its skills.

Portable Agent skills live in `agent-skills/`:

- `company-site-bootstrap` gets or reuses the catalog, performs intake and creates the customer project.
- `company-website` completes or modifies the generated Astro website.

The generated projects also expose `npm run verify:handoff -- --owner <owner> --repo <customer-repo>`. It verifies that the clean local `main` commit is present on the expected customer HTTPS or SSH remote; a local commit alone is not repository delivery.

Install both into an Agent's skill directory without copying credentials:

```bash
npm run install:agent-skills -- --target <agent-skills-directory>
```

The installer refuses to overwrite an existing skill unless `--force` is supplied.

Template selection happens once, during initialization. Moving an already customized site to another template is a migration, not a runtime theme switch.

## Licensing note

These are original starter implementations. The names Matterhaus, Mølle, and Outkast are design references only and no source code, copy, or media from those commercial templates is included.

## Linux and GitHub HTTPS verification

Use the committed lockfile and `npm ci --include=optional`; do not install platform bindings globally or omit optional dependencies. The catalog lockfile must retain the platform packages already locked by the standalone templates. Run `python3 scripts/test_portability.py` when changing dependency locks or repository handoff checks, followed by `npm run verify` for catalog/template changes.

GitHub CLI HTTPS authentication is supported for customer repositories. `verify:handoff` accepts HTTPS and SSH remotes and checks the owner/repository path, clean branch and remote commit. Choose visibility from the user request; new repositories default to public unless the task explicitly chooses otherwise. Generate each customer project outside this catalog, initialize its own Git repository, and use its new repository as `origin`. Keep this catalog remote separate.
