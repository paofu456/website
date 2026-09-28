---
name: website-builder
description: 从公司产品资料建立独立站；集中确认范围并选择 Forge、Lumen 或 Nexus，使用固定版本模板，验收后交付 GitHub 新仓库，默认公开。
license: MIT
---
# Website Builder

Read ../company-site-bootstrap/SKILL.md and follow its authoritative sequence.
For a new company website:
1. Request company/product brochures and available assets; wait for materials.
2. Read materials first. Consolidate gaps and confirm pages, language, audience, visual direction, contact/inquiry behavior, media rights, repository name and delivery scope. Recommend Forge, Lumen or Nexus and confirm the selection.
3. Only after confirmation, clone the approved pinned catalog revision from the configured GitHub template.
4. Generate a separate customer project and initialize local Git. Do not create its remote yet.
5. Follow the generated skills/company-website/SKILL.md for implementation, project verification and actual browser QA.
6. After acceptance checks pass, create the new GitHub repository under paofu456, public by default unless explicitly overridden; push and verify remote HEAD.
Never push customer changes to the template repository. Never invent company facts or claim deployment from a successful build.
For an existing project use website-editor; for reference-led work use website-reference-rebuilder, which follows the same intake and delivery contract for new company sites.

## Lucy container runtime


- For GitHub clone, repository creation or push tasks, read `/data/github/WORKFLOW.md` for this instance's account, visibility defaults, credential setup and template-to-new-repository workflow.
- Use the file reading, search, editing and shell tools actually exposed by Codex; Hermes tool names and slash commands are not required.
- Keep the user's established project path. For a new site without a specified path, choose and announce a unique `/data/websites/<project-slug>` directory. Keep each project separate; store source, supplied materials and QA evidence there. Keep private materials outside the public output. `/data` is persistent; do not build sites inside the skill directories or the running Dealstream application.
- Use Node.js/npm and `python3` already installed. Honor an existing lockfile; Git is installed; check availability before using pnpm. Do not turn a missing tool into an unrelated runtime upgrade.
- For headless browser QA, the existing Python environment is `/root/.venvs/dealstream/bin/python`; it provides `playwright.sync_api`. Use `with sync_playwright() as p`, launch `p.chromium.launch(headless=True)`, and close the browser after checks. Capture real page, console, request, image, viewport and interaction evidence. Recheck availability if the container image changes; report any unverified browser coverage honestly.
- Bind temporary preview servers to `127.0.0.1` and choose an unused port. That address is only accessible inside the container: never present it as a user-accessible preview. Stop task-owned temporary servers after QA. External preview hosting, deployment, domains/DNS, HTTPS and form services need an explicit target and appropriate authorization; skill installation does not configure them.
- Deliver a source/output archive and relevant screenshots through the current session's attachment mechanism when requested. Do not claim a site is published based on local files or a successful build.

