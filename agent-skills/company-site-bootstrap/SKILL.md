---
name: company-site-bootstrap
description: Start a new customer-specific Astro company website through conversational material intake, fact-gap confirmation, catalog checkout, template selection, and independent repository setup. Use for a first build, including when the user has not uploaded files yet; do not use for edits inside an existing customer site.
---

# Company site bootstrap

Move a new customer from material intake to a separate, build-ready project without contaminating the shared catalog.

## Route the request before doing work

- If this is a change to an existing customer site, stop using this skill and work from that customer's repository with `company-website`.
- If this is a new site and no files or attachment paths were supplied, ask the user to upload the available PDF, Word, PowerPoint, spreadsheet, logo, product, project, and company images. End the current turn after that request. Do not clone the catalog, create a project, create a repository, or send a full questionnaire yet.
- If files are attached, use the paths supplied by the runtime. Do not invent a material path and do not require the user to create a local directory.
- If the task already supplies a real material directory, treat it as an automation entry point and use it without copying anything into the catalog.

## Intake before scaffolding

Read all supplied materials before asking questions. Extract confirmed facts, possible public assets, conflicts, and missing decisions. Then give the user a concise summary and ask one consolidated set of genuine gaps, classified as:

- P0: blocks project creation or truthful website work;
- P1: can use an explicitly stated fallback;
- P2: can be deferred.

P0 must cover the public company name, target customers, at least one real product or service, site language, one publishable inquiry contact, and the public-use boundary for supplied text and media. Do not infer authorization merely because a file was uploaded. Do not invent facts or ask for fields already present in the materials.

Wait for the user's answers when any P0 item or material conflict remains. Do not run `create-site` or create a customer remote repository before P0 is cleared and the public-use boundary is confirmed.

Keep attachments and all extraction work outside the catalog. Never put customer files, extracted pages, OCR output, contact sheets, or intake notes in the catalog's `.tmp/`, `materials/`, templates, or any other catalog path. Use runtime attachment storage or a customer task workspace outside the catalog. After project creation, raw source material may be copied into the generated project's ignored `materials/` directory.

## Establish the catalog and customer workspaces

After intake is ready, obtain or discover:

- the operator-provided catalog repository URL or an existing catalog checkout;
- an approved catalog commit or tag;
- a destination directory for the independent customer project outside the catalog;
- the customer repository SSH URL, or an authorized way to create that empty repository.

If the catalog is remote, clone it. Do not create a Fork unless the user explicitly asks for one. Check out the approved revision, then read the catalog `AGENTS.md`, `README.md`, `docs/site-build-sop.md`, and `docs/onboarding.md`. Run `npm ci` and `npm run verify` before using the catalog.

If no destination was specified, derive a stable customer slug from the confirmed company identity and choose a customer task/project location outside the catalog. State the chosen path before creating it. Never commit customer data, customer pages, credentials, tokens, or SSH keys to the catalog.

## Select and create

Follow `docs/onboarding.md` and preserve the confirmed intake results. Choose exactly one template only after the P0 gate passes:

- `lumen`: editorial whitespace and brand-led presentation;
- `forge`: products, specifications, and catalog browsing;
- `nexus`: B2B services, engineering capabilities, or multi-line companies.

Respect the user's choice. Otherwise select by the site's primary conversion task and record the reason.

Create the project outside the catalog and outside `templates/`:

```bash
npm run create-site -- --template <lumen|forge|nexus> --target <customer-project-directory>
```

Record the catalog URL, full source commit, template ID, confirmed facts, authorization boundary, audience, language, scope, and public contact in the generated project's `notes/requirements.md`. Put raw material in its ignored `materials/` directory and unresolved P1/P2 items in `notes/content-gaps.md`.

## Create the customer repository

Only after intake and project generation, prepare one empty remote repository for that customer:

- Use a supplied customer repository when one already exists.
- If repository creation is explicitly in scope and the runtime provides an authorized API tool or token, check for a name collision and create a private empty repository.
- On Gitee hosts, `GITEE_TOKEN` is the expected optional repository-creation credential. Read it only from the process environment, use it as an authorization header, check presence without printing its value, and never interpolate the literal value into a logged command, URL, file, note, or log.
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
