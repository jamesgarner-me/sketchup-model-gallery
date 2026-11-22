## Why

Visitors need a landing page to browse Models. Final MVP step, building on the archived `model-viewer` and `model-info`. Also closes out end-to-end verification on Vercel. See `docs/PRD.md`.

## What Changes

- Gallery page: responsive card grid in Catalog order.
- Exercise multi-Model rendering with tests rather than publishing a duplicate entry; the owner adds a real second Model when one is ready.
- Playwright smoke test (gallery → viewer → Info → Reset) and manual device checks.
- Hosted verification of the main visitor journeys.

## Capabilities

### New Capabilities
- `model-gallery`: Landing page of Model cards.

### Modified Capabilities

None.

## Impact

- `index.html`, gallery module and styles, a site config module, Playwright test and config, preview-server rewrite.
- Dependency: `@playwright/test` (dev).
- Builds on archived `model-viewer` and `model-info`.
