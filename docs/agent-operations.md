# GitHub website operations

Follow [github-workflow.md](github-workflow.md).

Use Git, Node/npm, a working browser and gh authenticated as paofu456. Lucy credentials stay in /data/github/gh and Git configuration in /data/github/gitconfig; non-secret pinned defaults live in /data/github/site-builder.json. Never copy credentials into a skill or repository. Saved gh HTTPS authentication supports clone, creation and push. Install portable skills with `npm run install:agent-skills -- --target <skill-directory>`; --force replaces only intended installed copies. Default new repositories are public and created after implementation and QA.
