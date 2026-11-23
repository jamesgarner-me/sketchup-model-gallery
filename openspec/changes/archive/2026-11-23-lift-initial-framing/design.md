## Context

Initial framing is whatever model-viewer computes on `load`; `main.ts` captures orbit, target and field of view into `framing`, which Reset view replays. A catalog `camera.target` overrides the automatic target. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Lift the Model by 10% of viewport height on first load and Reset.
- No catalog field; same look on every Model and screen size.

**Non-Goals:**
- Viewpoints (they set their own camera), the Layers sheet fit, new controls.

## Decisions

- **Shift the camera target down, not the view.** model-viewer exposes no screen-space view offset. Lowering the target's Y by `0.10 × 2 × radius × tan(fov/2) / sin(phi)` (world units at the framing distance; `sin(phi)` allows for the camera looking down, which foreshortens a vertical shift) puts the Model 10% of the viewport height higher. The shift is vertical only, so the pivot stays on the Model's vertical axis: orbiting and Auto-orbit don't wobble sideways.
- **Apply once, before capturing `framing`.** On `load`, set the lowered target and `jumpCameraToGoal()`, then capture `framing`. Reset then reproduces it with no extra code.
- **Skip when the catalog sets `camera.target`.** The author's target is deliberate.
- **Single constant** (`INITIAL_LIFT = 0.10`) so the amount is easy to tune by eye.

## Risks / Trade-offs

- The lift is computed from the viewport at load. Rotating a phone or opening the Layers sheet changes the viewport, so the fraction drifts; accepted, as the world-space shift stays sensible.
- Orbiting up or down (phi) moves the Model slightly on screen relative to a centred pivot. Accepted.

- The e2e test checks the pivot against the Model's centre via the public API (the scene camera's matrices aren't reliable to read in headless runs). The on-screen look is checked by eye.
