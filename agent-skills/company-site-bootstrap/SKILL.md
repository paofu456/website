---
name: company-site-bootstrap
description: Start a new customer-specific Astro company website through conversational material intake, confirmed P0 facts, an isolated catalog checkout, template selection, and a private customer repository. Use for a first build; do not use for edits to an existing customer site.
---

# Company site bootstrap

Move a new customer from uploaded materials to a separate project with its own verified Git remote. Do not create a project before intake is confirmed, and do not treat a local commit as repository delivery.

## Route before acting

- Existing customer site: stop and use that site's `company-website` modify flow. Clone the customer repository directly when needed.
- New site with no attachments: ask the user to upload available PDF, Word, PowerPoint, spreadsheet, logo, product, project, and company images, then end the turn. Do not invent a materials path, clone the catalog, or send a blank questionnaire.
- New site with attachments: use the runtime-provided paths. Keep attachments, OCR, rendered pages, contact sheets, and intake notes outside the catalog.

## Intake gate

Read the supplied materials before asking questions. For large PDFs, extract text in bulk and create a contact sheet or batch of thumbnails for image selection; do not render and inspect every page one at a time. If pages lack a text layer, state the exact limitation. Never claim a document was fully read unless every relevant page was actually covered by text extraction or visual review.

Report four separate lists:

1. facts explicitly confirmed by the user;
2. facts stated in authorized source material;
3. Agent inferences that still require confirmation;
4. missing or conflicting facts.

Ask one consolidated question set for unresolved P0 items. P0 consists of the public company name, target customers, at least one real product or service, site language, one publishable inquiry contact, public-use permission for text and media, and every conflict affecting published content. Agent inference is never confirmation. Wait when any P0 item remains unresolved.

## Use an isolated catalog checkout

For an external-Agent run or workflow acceptance test, always clone the operator catalog into an Agent-owned workspace. Do not reuse the operator's maintenance checkout even when it exists on the same computer. Reuse is allowed only when the user explicitly identifies that checkout as the intended trusted source.

Require the operator-provided catalog SSH URL and an approved full commit or tag. Clone or fetch, check out that revision, confirm a clean worktree, then read only:

- root `AGENTS.md`;
- root `README.md`;
- `docs/site-build-sop.md`;
- `docs/onboarding.md`.

Run `npm ci` and `npm run verify` without piping their output through `tail`, `grep`, or another command that could hide the exit code.

## Select and create

Choose exactly one template after P0 is confirmed:

- `lumen`: image-led premium or design-focused brands;
- `forge`: product catalogs and specification-heavy manufacturers;
- `nexus`: B2B services, engineering groups, and multi-line companies.

Generate the project outside the catalog:

```bash
npm run create-site -- --template <lumen|forge|nexus> --target <customer-project-directory>
```

Record the catalog SSH URL, full source commit, template ID, confirmed facts, authorization boundary, language, audience, scope, and contact in `notes/requirements.md`. Clearly label source-material facts and user confirmations. Put raw material in the ignored `materials/` directory only after project creation.

## Create and attach the customer repository

A complete first-build workflow includes a new private customer repository, Commit, and Push unless the user explicitly requests local-only output. The repository must belong to the configured customer-site owner and must never be the catalog repository.

When creating a Gitee repository, use `scripts/create-gitee-repo.mjs` from this skill. It reads `GITEE_TOKEN` from the process environment, verifies the authenticated owner, refuses name collisions, and creates a private empty repository. Never print or place the token in a URL, command argument, note, file, or Git remote.

Example:

```bash
node <skill-directory>/scripts/create-gitee-repo.mjs --owner website-bot --repo <customer-repo> --ssh-host gitee-website-bot
```

Initialize the generated project and attach only the returned customer SSH URL:

```bash
git init -b main
git remote add origin <customer-repository-ssh-url>
git remote -v
```

Stop if the owner, repository name, or remote URL differs from the intended customer repository. Do not copy the catalog `.git` directory or alter the catalog's `origin`.

## Hand off to the generated project

Enter the generated project and read its `AGENTS.md`, `skills/company-website/SKILL.md`, and first-build reference. Do not recursively inspect every page and component. Start with the documented content-contract files; inspect page or component code only when a requested layout change or a concrete verification failure requires it.

Continue through content replacement, desktop visual QA, verification, Commit, Push, and `npm run verify:handoff`. Without the intended `origin`, a successful Push, and a matching remote commit, a local commit is only a local draft, not a completed delivery.
