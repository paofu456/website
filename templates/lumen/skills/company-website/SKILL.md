---
name: company-website
description: Build or safely modify a customer-specific Astro company website from confirmed business materials using the generated project's content contract, desktop QA, and repository handoff gates.
---

# Company website workflow

Read the repository `AGENTS.md`, then choose one route:

- First customer build: read `references/first-build.md` completely.
- Scoped change to an existing site: read `references/modify-site.md`. Clone that customer's repository directly when it is not present; never regenerate it from the catalog.
- SEO-specific work: also read `references/seo-baseline.md`.

Work in the generated Astro project. Do not add a CMS, backend, storage service, React, Vue, or another page-generator runtime.

Raw inputs stay in `materials/`; internal facts and gaps stay in `notes/`; only authorized public assets go in `public/media/`. Keep user-confirmed facts, source-material facts, Agent inferences, and conflicts visibly separate. An inference is never confirmation.

For a first build, preserve the selected template and use the content contract first. Do not recursively read or explain the whole template. Inspect `src/pages/` or `src/components/` only for a requested layout change or a specific defect found during verification.

Run verification commands directly so their real exit codes are preserved. The current acceptance scope is desktop-only unless the user explicitly adds mobile work. A complete first build includes Commit and Push to the existing customer `origin` unless the user explicitly requested local-only output. Never push customer files to the catalog repository.
