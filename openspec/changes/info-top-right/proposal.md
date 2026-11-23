## Why

Info sits in the bottom row with Reset view and Viewpoints, and the bottom row keeps growing (Layers is next). Moving Info to the top right, opposite the home button, follows a common app pattern, frees the bottom row for camera and model controls, and keeps Info easy to find.

## What Changes

- Info moves from the bottom controls row to the top right of the Viewer's top bar.
- It becomes an icon-only button (a circled "i"), announced to assistive technology as "Info", matching the home button's size.
- It stays prominent: filled with the accent colour (light accent on dark Stages) so it stands out from the plain home button and is noticed.
- The title stays between home and Info and still shortens with "…" when long.
- The bottom row keeps Reset view and Viewpoints (and Layers once that change lands).
- Info behaviour is unchanged: same overlay, history, focus return and Auto-orbit pause.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `model-info`: Info button position, form and prominence.
- `model-viewer`: control layout (Info in the top bar, not the bottom row).

## Impact

- `model.html`, `src/viewer/viewer.css` (and possibly `src/base.css`), Playwright tests that find Info by its "Info" text.
- Small merge overlap with `model-layers`, which adds a Layers button to the same bottom row in `model.html`.
