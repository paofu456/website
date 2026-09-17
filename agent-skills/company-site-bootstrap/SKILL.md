---
name: company-site-bootstrap
description: Start a customer-specific Astro company website from the operator-provided template catalog, including catalog checkout, material intake, template selection, and creation of a separate customer project. Use before the first build, not for edits inside an existing generated site.
---

# Company site bootstrap

Create the customer project without modifying or contaminating the shared catalog.

## Establish the two workspaces

Obtain these task inputs or discover them from the current workspace:

- the operator-provided catalog repository URL or an existing catalog checkout;
- an approved catalog commit or tag;
- the customer material directory;
- the destination directory for the independent customer project.

If the catalog is remote, clone it. Do not create a Fork unless the user explicitly asks for one. Check out the approved revision, then read the catalog `AGENTS.md`, `README.md`, `docs/site-build-sop.md`, and `docs/onboarding.md`. Run `npm ci` and `npm run verify` before using the catalog.

Keep customer materials outside the catalog. Never commit customer data, customer pages, credentials, tokens, or SSH keys to the catalog.

## Intake and create

Read the supplied materials before asking questions. Follow `docs/onboarding.md` to identify confirmed public facts, authorization boundaries, conflicts, and P0 gaps. Do not invent missing facts.

Choose exactly one template:

- `lumen`: editorial whitespace and brand-led presentation;
- `forge`: products, specifications, and catalog browsing;
- `nexus`: B2B services, engineering capabilities, or multi-line companies.

Respect the user's choice. Otherwise select by the site's primary conversion task and record the reason.

Create the project outside the catalog and outside `templates/`:

```bash
npm run create-site -- --template <lumen|forge|nexus> --target <customer-project-directory>
```

Record the catalog URL, full source commit, template ID, audience, language, scope, and confirmed public contact in the generated project's `notes/requirements.md`. Put raw material in its ignored `materials/` directory and unresolved items in `notes/content-gaps.md`.

## Continue to the website build

Enter the generated project and treat it as a separate repository. Read its `AGENTS.md` and `skills/company-website/SKILL.md`, then follow that skill through content replacement, page work, verification, and handoff. Do not stop after scaffolding when the user requested a finished MVP.

The customer project must have its own Git repository and remote. Never push customer-specific changes back to the catalog. Only a reusable fix that benefits the template catalog belongs in a separate catalog change.
