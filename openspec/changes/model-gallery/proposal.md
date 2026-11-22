## Why

Visitors need a landing page to browse Models. Final step; to be fully planned after `model-info`. Also closes out end-to-end verification on Vercel. See `docs/PRD.md`.

## What Changes

- Gallery page: responsive card grid in Catalog order.
- Add a second Model (or duplicate entry) to exercise the Catalog.
- Playwright smoke test (gallery → viewer → Info → Reset) and manual device checks.
- Hosted verification of the main visitor journeys.

## Capabilities

### New Capabilities
- `model-gallery`: Landing page of Model cards.

### Modified Capabilities

None.

## Impact

- `index.html` page code, a second Model's assets, Playwright test.
- Depends on `model-viewer` and `model-info`.
