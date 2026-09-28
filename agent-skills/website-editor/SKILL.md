---
name: website-editor
description: 修改已有独立站或网站的文案、图片、产品、页面、布局和交互，修复网站问题并保留现有技术栈。新建站用 website-builder，按参考站重建用 website-reference-rebuilder。
license: MIT
metadata:
  version: "0.1.0"
  author: "paofu456, Hermes Agent"
  adaptation: "Lucy Codex Linux"
---

# Website Editor Skill

Make scoped changes in an existing local website repository while preserving its
stack, history, conventions, and unrelated work. The local checkout is the source
of truth; do not reacquire or regenerate it.

## Company website workflow precedence

For new company sites, ../company-site-bootstrap/SKILL.md is authoritative over generic instructions below: materials first, consolidated confirmation and Forge/Lumen/Nexus selection, pinned GitHub template, independent project, verification and browser QA, then new repository delivery. Default owner is paofu456 and visibility is public unless explicitly overridden. Do not create a remote before QA. Never push customer changes to the template. For existing projects, preserve their repository, stack and unrelated work. Read /data/github/site-builder.json and /data/github/WORKFLOW.md in Lucy.

## When to Use

- The user asks to change text, images, products, navigation, styles, or layout.
- The user asks to add, remove, or repair a page or component in a local project.
- A responsive, interaction, build, or deployment defect needs a code fix.
- The task is ordinary maintenance of an existing website codebase.

Don't use for a new website; use `website-builder`. When a URL, screenshot, or
prototype is the primary visual specification, use `website-reference-rebuilder`.

## Lucy container runtime

- For GitHub clone, repository creation or push tasks, read `/data/github/WORKFLOW.md` for this instance's account, visibility defaults, credential setup and template-to-new-repository workflow.
- Use the file reading, search, editing and shell tools actually exposed by Codex; Hermes tool names and slash commands are not required.
- Keep the user's established project path. For a new site without a specified path, choose and announce a unique `/data/websites/<project-slug>` directory. Keep each project separate; store source, supplied materials and QA evidence there. Keep private materials outside the public output. `/data` is persistent; do not build sites inside the skill directories or the running Dealstream application.
- Use Node.js/npm and `python3` already installed. Honor an existing lockfile; Git is installed; check availability before using pnpm. Do not turn a missing tool into an unrelated runtime upgrade.
- For headless browser QA, the existing Python environment is `/root/.venvs/dealstream/bin/python`; it provides `playwright.sync_api`. Use `with sync_playwright() as p`, launch `p.chromium.launch(headless=True)`, and close the browser after checks. Capture real page, console, request, image, viewport and interaction evidence. Recheck availability if the container image changes; report any unverified browser coverage honestly.
- Bind temporary preview servers to `127.0.0.1` and choose an unused port. That address is only accessible inside the container: never present it as a user-accessible preview. Stop task-owned temporary servers after QA. External preview hosting, deployment, domains/DNS, HTTPS and form services need an explicit target and appropriate authorization; skill installation does not configure them.
- Deliver a source/output archive and relevant screenshots through the current session's attachment mechanism when requested. Do not claim a site is published based on local files or a successful build.

## Prerequisites

- The existing local project path or current workspace.
- The user's requested change and any supplied replacement content or media.
- File reading, search, editing, shell execution and browser
  capabilities available in the current runtime appropriate to the project's verification workflow.

## How to Run

```text
$website-editor Update the local website's contact page and footer using the
provided content. Preserve the current stack and do not push or deploy.
```

For diagnosis-only requests, determine the cause and report it without modifying
files unless the user also asks for a fix.

## Procedure

1. **Fix the change contract.** Translate the request into observable acceptance
   criteria: target routes, content, appearance, behavior, viewports, non-goals,
   and whether build, commit, push, or deployment is included. Completion: the
   requested outcome can be verified without guessing intent.

2. **Protect the workspace.** Resolve the local project path, read applicable
   `AGENTS.md` and README files, and inspect Git status, current branch, and
   remotes. Preserve unrelated and uncommitted work. Do not clone, fetch, pull,
   switch branches, rewrite history, change `origin`, or create another repository
   unless explicitly requested. Completion: every existing change is accounted for.

3. **Inspect the smallest relevant surface.** Identify the current framework,
   package manager, route, source of content, component, style layer, tests, and
   verification commands. Search every consumer before editing a shared component
   or global token. Do not recursively read the whole project without a concrete
   reason. Completion: the root cause or exact edit points are known.

4. **Make the narrowest coherent change.** Reuse current abstractions and content
   sources, preserve stable URLs and public behavior outside scope, and avoid
   introducing a new framework, state system, dependency, or design language for
   a local change. Store repeated facts once where the existing architecture
   permits it. Completion: the acceptance criteria are implemented with no
   unrelated rewrite.

5. **Handle content and media truthfully.** Use supplied or authorized assets,
   preserve intentional crops and aspect ratios, and never invent business facts,
   product parameters, qualifications, clients, or contact details. Record missing
   facts rather than filling them plausibly. Completion: changed public content is
   traceable to the request or authorized source.

6. **Run proportional terminal checks.** Execute the smallest relevant lint,
   type, unit, route, or quick verification after a coherent edit batch, then the
   project's documented final build or verification command. Preserve real exit
   codes and retry a failed command only after a concrete corrective change.
   Completion: relevant checks pass or the exact blocker is reported.

7. **Run focused browser QA.** Inspect every changed route at the agreed viewport
   and exercise changed interactions. Check status, title, console, failed requests,
   broken images, overflow, navigation, and affected shared consumers. Re-test one
   unaffected route after global or shared changes. Completion: the requested
   behavior works without observed regression.

8. **Review and hand off.** Inspect the final diff and Git status, ensuring only
   intended files changed. Report files, routes, verification commands, browser
   coverage, and unresolved gaps. Commit, push, or deploy only when explicitly
   included in the task. Completion: the user can distinguish completed work from
   unverified or out-of-scope work.

## Pitfalls

- A local checkout does not need to be cloned again.
- A small content request should not trigger project regeneration.
- Editing a shared component without checking consumers creates hidden regressions.
- A clean build does not prove the changed page looks or behaves correctly.
- Do not overwrite user changes to make the working tree easier to reason about.
- Do not turn a diagnosis request into an unsolicited implementation.

## Verification

- All changed routes and shared consumers are identified.
- The existing stack, package manager, routes, and remote configuration are preserved.
- Only requested files and necessary dependencies changed.
- Relevant terminal checks and the documented final verification pass.
- Browser QA covers changed routes, interactions, and one regression route when needed.
- No fabricated facts, unauthorized assets, or unexplained external requests remain.
- No clone, remote mutation, push, or deployment occurred outside explicit scope.
