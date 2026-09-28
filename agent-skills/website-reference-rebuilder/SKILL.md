---
name: website-reference-rebuilder
description: 依据获授权的参考网站、截图或设计稿重建网站、页面、组件与交互，或借鉴布局制作原创实现；进行浏览器对比验证。普通站点维护用 website-editor。
license: MIT
metadata:
  version: "0.1.0"
  author: "paofu456, Hermes Agent"
  adaptation: "Lucy Codex Linux"
---

# Website Reference Rebuilder Skill

Study an authorized live website, screenshot, or design reference and implement
the requested visual or behavioral scope. Support full-site replicas as well as
single pages, sections, components, and interactions.

## Company website workflow precedence

For new company sites, ../company-site-bootstrap/SKILL.md is authoritative over generic instructions below: materials first, consolidated confirmation and Forge/Lumen/Nexus selection, pinned GitHub template, independent project, verification and browser QA, then new repository delivery. Default owner is paofu456 and visibility is public unless explicitly overridden. Do not create a remote before QA. Never push customer changes to the template. For existing projects, preserve their repository, stack and unrelated work. Read /data/github/site-builder.json and /data/github/WORKFLOW.md in Lucy.

## When to Use

- The user asks to reproduce, imitate, learn from, mirror, or rebuild a website.
- A URL, screenshot, prototype, or existing page is the primary specification.
- The requested scope is a full site, page, section, component, or interaction.
- A local site's fidelity to a reference needs repair.

Don't use when the user only requests an ordinary change without a reference;
use `website-editor`. Don't copy protected content or media without permission.

## Authorization Gate

Before downloading source markup, scripts, copy, or media, confirm that the user
owns them or has permission to reproduce them. Public visibility alone is not
authorization. Do not bypass authentication, paywalls, CAPTCHAs, robots rules,
or technical access controls.

Visual study without copying protected assets may proceed when the user asks for
an inspired reimplementation. Record whether the mode is `faithful-replica` or
`inspired-reimplementation`; do not silently switch between them.

## Lucy container runtime

- For GitHub clone, repository creation or push tasks, read `/data/github/WORKFLOW.md` for this instance's account, visibility defaults, credential setup and template-to-new-repository workflow.
- Use the file reading, search, editing and shell tools actually exposed by Codex; Hermes tool names and slash commands are not required.
- Keep the user's established project path. For a new site without a specified path, choose and announce a unique `/data/websites/<project-slug>` directory. Keep each project separate; store source, supplied materials and QA evidence there. Keep private materials outside the public output. `/data` is persistent; do not build sites inside the skill directories or the running Dealstream application.
- Use Node.js/npm and `python3` already installed. Honor an existing lockfile; Git is installed; check availability before using pnpm. Do not turn a missing tool into an unrelated runtime upgrade.
- For headless browser QA, the existing Python environment is `/root/.venvs/dealstream/bin/python`; it provides `playwright.sync_api`. Use `with sync_playwright() as p`, launch `p.chromium.launch(headless=True)`, and close the browser after checks. Capture real page, console, request, image, viewport and interaction evidence. Recheck availability if the container image changes; report any unverified browser coverage honestly.
- Bind temporary preview servers to `127.0.0.1` and choose an unused port. That address is only accessible inside the container: never present it as a user-accessible preview. Stop task-owned temporary servers after QA. External preview hosting, deployment, domains/DNS, HTTPS and form services need an explicit target and appropriate authorization; skill installation does not configure them.
- Deliver a source/output archive and relevant screenshots through the current session's attachment mechanism when requested. Do not claim a site is published based on local files or a successful build.

## Prerequisites

- A reference URL, image, prototype, or source page.
- A user-designated local destination or existing local project.
- Browser automation for screenshots, DOM inspection, viewport changes, clicks,
  hovers, scrolling, keyboard input, console capture, and network capture.
- File reading, writing, editing, search and shell execution capabilities available in the current runtime.

If browser automation is unavailable, state that visual and interaction fidelity
cannot be fully verified. Never claim 1:1 fidelity from HTTP source alone.

## How to Run

```text
$website-reference-rebuilder Rebuild the authorized reference into ./project.
Scope: one product section. Mode: inspired reimplementation.
```

Read [references/workflow.md](references/workflow.md) for scope artifacts and
implementation-mode decisions. After implementation, follow
[references/qa-contract.md](references/qa-contract.md).

## Procedure

1. **Fix the reference contract.** Record authorization, reference origins,
   local target, scope (`site`, `page`, `section`, `component`, or `interaction`),
   mode, required content, supported viewports, functional behavior, and delivery
   boundary. Completion: copied versus reinterpreted elements are explicit.

2. **Protect the target.** Read local project instructions, inspect Git status,
   identify the existing stack and shared consumers, and preserve unrelated work.
   Do not clone another code repository, replace project history, change remotes,
   or switch frameworks merely because the reference uses a different stack.
   Completion: the smallest safe edit surface is known.

3. **Capture the reference.** Inspect representative states at matching viewports.
   Record layout geometry, design tokens, responsive or fixed-width behavior,
   assets, page families, component states, and interaction transitions. Test
   scroll before assuming a scroll-driven UI is click-driven. Completion: every
   required visible state has reproducible evidence.

4. **Choose the implementation mode.** Use a sanitized static mirror only for an
   authorized full-site task where source HTML/CSS/JS is reusable. Reimplement
   in the target stack for partial scopes, inspiration, unsafe source runtime,
   proprietary frameworks, or existing local projects. Use a hybrid when stable
   pages can be mirrored but shared behavior must be rebuilt. Completion: the
   chosen mode minimizes unrelated change while meeting fidelity requirements.

5. **Implement only the contracted scope.** For partial work, reuse the target's
   tokens and components where compatible, and do not overwrite unrelated routes,
   global styles, content, or navigation. For full replicas, preserve the route
   contract, localize authorized assets, recursively rewrite dependencies, and
   remove analytics, trackers, backend posts, and unsafe third-party runtime.
   Completion: no element outside the agreed scope changed without a documented
   dependency reason.

6. **Preserve useful behavior.** Recreate required menus, carousels, scroll
   transitions, search panels, hover states, timers, forms, keyboard behavior,
   and media controls. Do not fabricate authentication, persistence, successful
   submissions, or backend data. Completion: each documented trigger produces
   the expected state transition locally.

7. **Audit deterministically.** For a static output tree, run
   `python3 /data/codex/skills/website-reference-rebuilder/scripts/audit_static_site.py <output-dir> --max-file-mib 25 --fail-on-external-runtime`.
   Adjust the file limit to the provider. For framework outputs, run equivalent
   route, asset, build, and network checks instead of forcing this script onto
   source files. Completion: missing references, unapproved runtime dependencies,
   and oversize deployment assets are zero or explicitly resolved.

8. **Compare and iterate.** Capture reference and local screenshots at identical
   viewport, scale, scroll, font, and animation states. Fix structural mismatches
   before typography and decorative details. Verify every documented interaction,
   console, network, and image assertion. Completion: remaining differences are
   either within the inspired mode or listed as known gaps.

9. **Deliver traceably.** Report scope, mode, routes/components changed, assets
   localized, browser states checked, audit results, known differences, and local
   run commands. Commit, push, or deploy only when explicitly requested.
   Completion: another operator can reproduce the comparison and verification.

## Pitfalls

- A homepage screenshot match does not prove a full site is complete.
- Partial imitation must not replace the whole project or leak global styles.
- Similar appearance does not justify copying unlicensed text or media.
- Font failures often appear as missing icons or square glyphs.
- Animations, video frames, timers, and cursors require stabilized comparisons.
- External links are navigation; external runtime requests are dependencies.

## Verification

- The scope and faithful/inspired mode are explicit.
- Every requested state was observed in the reference and tested locally.
- Partial work changed only its intended consumers and dependencies.
- Full-site work has a complete local route and asset contract.
- Browser checks have no unexplained failures, bad images, or external runtime.
- Visual comparisons use matching viewport and stable state.
- No remote, push, or deployment mutation occurred outside explicit scope.

## Static audit limits

The bundled audit is a supplemental HTML/CSS reference check, not a JavaScript, SVG, route or runtime verifier. It may report metadata links as runtime dependencies and does not fully parse data-URL srcsets or HTML base/style semantics. Before treating output as deployable, verify it contains the expected pages and that all local dependencies ship inside the output root; an empty directory or a dependency outside that root can pass the script. Use the production build and real browser network/interaction checks to cover these gaps.
