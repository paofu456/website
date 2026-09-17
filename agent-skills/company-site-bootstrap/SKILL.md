---
name: company-site-bootstrap
description: Start a customer-specific Astro company website from the operator-provided template catalog, including catalog checkout, intake, template selection, customer repository setup, and creation of a separate project. Use before the first build, not for edits inside an existing customer site.
---

# Company site bootstrap

Create the customer project without modifying or contaminating the shared catalog.

## Establish the two workspaces

Obtain these task inputs or discover them from the current workspace:

- the operator-provided catalog repository URL or an existing catalog checkout;
- an approved catalog commit or tag;
- the customer material directory;
- the destination directory for the independent customer project.
- the customer repository SSH URL, or an authorized way to create that empty repository.

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

## Create the customer repository

After generating the project and before customer-specific edits, prepare one empty remote repository for that customer:

- Use a supplied customer repository when one already exists.
- If repository creation is explicitly in scope and the runtime provides an authorized API tool or token, check for a name collision and create a private empty repository.
- SSH credentials can clone and push but cannot create a remote repository. If no repository or creation capability is available, state that exact limitation; do not redirect the catalog remote or claim that a push succeeded.
- Read credentials only from the host's SSH or secret configuration. Never write a token, password, private key, or credential-bearing URL to project files, notes, logs, skills, or Git.

Initialize Git inside the generated customer directory and attach only the customer SSH remote:

```bash
git init -b main
git remote add origin <customer-repository-ssh-url>
git remote -v
```

Do not copy the catalog `.git` directory and do not change the catalog's `origin`.

## Continue to the website build

Enter the generated project and treat it as a separate repository. Read its `AGENTS.md` and `skills/company-website/SKILL.md`, then follow that skill through content replacement, page work, verification, commit, and push when Git delivery is in scope. Do not stop after scaffolding when the user requested a finished MVP.

The customer project must have its own Git repository and remote. Never push customer-specific changes back to the catalog. Only a reusable fix that benefits the template catalog belongs in a separate catalog change.
