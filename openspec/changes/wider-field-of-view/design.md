## Context

`<model-viewer>` defaults: `field-of-view` 30° (`auto`), `min-field-of-view` 12°, `max-field-of-view` `auto`. Its zoom (`SmoothControls.adjustOrbit`) moves radius and FOV together between their limits, so zooming in narrows to 12°. Its `adjustedFoV` widens the vertical FOV on narrow (portrait) screens so the model fits, which is why portrait currently shows 60° vertical (about 30° across). The `auto` maximum radius and the auto starting distance (`idealCameraDistance`) are derived from the framed FOV. Viewpoints (`src/viewer/viewpoints.ts`) already set all three FOV properties to 45° and restore the previous values on exit. Bastings Garden's Catalog entry fixes the starting distance at 48 m.

## Goals / Non-Goals

**Goals:** 45° across the shorter side everywhere, FOV fixed during zoom, framing that still fills the screen.

**Non-Goals:** reading SketchUp's FOV (not exported), per-device FOV choices, changing Viewpoints code.

## Decisions

1. **Lock the FOV:** set `field-of-view`, `min-field-of-view` and `max-field-of-view` to the same value (default `45deg`, or the Catalog override) on every `<model-viewer>`. With min = max, the zoom gesture can only change the radius. This matches how Viewpoints already lock their FOV, and `<model-viewer>`'s `adjustedFoV` keeps the portrait behaviour (about 45° horizontally).
2. **Reset view:** it restores the captured FOV. With the lock in place the captured value is the locked one, so no logic change; verify only.
3. **Starting distance:** with a wider FOV the auto starting distance shrinks to keep the same fill; Bastings Garden's fixed 48 m would make it look smaller and may exceed the new `auto` maximum radius. Re-tune its `camera.orbit` radius by screenshot (or drop the fixed radius and keep only the angle) and confirm the maximum zoom-out still reaches it.
4. **Verification:** measure FOV on desktop, portrait and landscape at load, after zoom in and out, after Reset view, and after leaving a Viewpoint; smoke-test step asserting FOV stays about 45° after zooming.

## Risks / Trade-offs

- [Wider lens shows more perspective distortion near the edges] → 45° is moderate; the Catalog override remains for any Model that needs less.
- [`auto` maximum radius shrinks with the wider FOV] → check zoom-out still reaches the starting view on every Model; set an explicit maximum if not.
- [Viewpoints restore order] → their exit already restores FOV settings first; re-run the Viewpoints e2e tests.
