# Reference Rebuild Workflow

Read this reference when planning or executing work driven by an existing visual
or behavioral reference.

## Scope Contract

Record these fields before implementation:

```text
reference_origin
authorization_statement
target_directory
scope: site | page | section | component | interaction
mode: faithful-replica | inspired-reimplementation
routes_or_consumers
viewports
required_states
content_and_asset_policy
backend_policy
delivery_scope
```

A partial scope must name the target route and component or visible region. A
full-site scope must use a route contract with source URL, normalized path,
destination path, expected status, page family, discovery source, and notes.

## Evidence to Capture

Use same-viewport screenshots and browser inspection to record:

- container width, section height, alignment, overflow, and crop behavior;
- font family, size, weight, line height, and letter spacing;
- colors, gradients, images, borders, radii, shadows, and opacity;
- navigation, active states, sticky/fixed layers, and responsive changes;
- trigger, before state, after state, transition, and timing for interactions;
- console errors, failed requests, third-party requests, and broken images.

For inspired work, extract design rules rather than source code. For faithful
work, preserve observable behavior while removing unsafe or unneeded runtime.

## Implementation Modes

### Static mirror

Use only for an authorized full-site scope when the source HTML/CSS/JS is close
to deployable. Preserve routes, localize assets, clean scripts, and add only the
minimum local runtime needed for visible behavior.

### Target-stack reimplementation

Use for partial scopes, screenshots, prototypes, inspired work, or an existing
project. Recreate measured structure and behavior in the local project's current
component, styling, and routing conventions.

### Hybrid

Use when stable content pages can be mirrored but shared navigation or complex
interactions should be rebuilt. Record which routes use which mode.

## Partial Transplant Rules

- Inspect every consumer of a shared component before changing it.
- Prefer a scoped class, token, variant, or component API over global overrides.
- Preserve existing content and semantics unless replacement is requested.
- Do not import the reference site's analytics, trackers, backend clients, or
  entire framework bundle for one effect.
- Re-test the target page and one unaffected shared consumer after a shared edit.

## Full-Site Artifacts

For a multi-route replica, prefer these project-local records unless repository
instructions define another location:

```text
docs/research/<site-key>/routes.json
docs/research/<site-key>/asset-manifest.json
docs/research/<site-key>/PAGE_TOPOLOGY.md
docs/research/<site-key>/INTERACTION_PATTERNS.md
docs/research/<site-key>/STATIC_ARCHITECTURE.md
docs/design-references/<site-key>/source/
docs/design-references/<site-key>/local/
```

For each localized asset record source URL, local path, content type, bytes,
SHA-256, consumers, download status, and notes. Discover nested CSS imports,
`url(...)`, `srcset`, posters, SVG references, fonts, scripts, and downloads.

## Deployment Readiness

Check the selected provider's individual asset limit, file count, total upload,
case sensitivity, default documents, extensionless routes, MIME types, media
range requests, SPA fallbacks, and cache behavior. A successful build does not
prove public aliases and nested routes resolve.
