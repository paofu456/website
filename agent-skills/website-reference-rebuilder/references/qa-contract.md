# Reference Rebuild QA Contract

Use this contract after implementation and after deployment when deployment is
in scope. Scale the checks to the agreed scope.

## Sampling

- Component or section: test its target route, every documented state, and one
  unaffected consumer of any shared component changed.
- Page: test the page, its navigation entry points, and shared header/footer.
- Full site: test the homepage and at least one route from every page family,
  including pagination, details, language variants, downloads, and aliases.

## Browser Assertions

For every sampled route record:

- HTTP status, final URL, title, body dimensions, and viewport;
- console errors and failed requests;
- requests to nonlocal origins;
- images that are incomplete or have zero natural width;
- screenshot path and the stabilized interaction state.

The default threshold is zero unexplained console errors, failed requests,
unapproved external runtime requests, and broken images.

## Interaction Assertions

Create an explicit check for each required trigger and state transition: menu,
carousel, wheel, keyboard, search, toolbar, hover, form, timer, and media control.
Static forms must be blocked or clearly simulated according to the contract.

## Visual Comparison Loop

1. Match viewport, device scale, scroll position, fonts, content, and animation state.
2. Compare structure, crop, section heights, and major coordinates first.
3. Compare typography, spacing, and responsive behavior second.
4. Compare icons, borders, shadows, and hover details last.
5. Fix the largest repeated cause and re-test its consumers.

Do not use unstable video frames, timers, or cursors as pixel-perfect acceptance
regions. Stabilize the state or compare a deterministic region.

## Completion Record

Save a compact JSON or Markdown record containing timestamp, reference, local or
public origin, scope, mode, tested viewports, tested routes/components, browser
assertions, interaction results, build result, audit result, and known gaps.
