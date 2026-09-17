# Verification

`npm run verify` performs type checking, a production build, and static output checks.

The output checker validates:

- every HTML page has a title and meta description
- local page and asset references resolve inside `dist/`
- images have non-empty alt text
- private directory names are not leaked into HTML
- no localhost canonical URL is emitted

`npm run verify:delivery` adds a release gate: `site.config.ts` must use `contentStatus: "ready"` and must not use `siteMode: "local"`.

After committing and pushing a customer site, run `npm run verify:handoff -- --owner <owner> --repo <customer-repo>`. It requires an SSH `origin` for that customer repository, a clean worktree, no tracked private/generated files, and the same commit on local and remote `main`.
