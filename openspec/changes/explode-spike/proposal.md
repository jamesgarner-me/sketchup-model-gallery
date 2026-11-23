## Why

Build-detail Models such as the stairs hide their construction: framing, stringers and winders sit behind walls, plasterboard and treads. Pulling the parts apart (Explode, see `CONTEXT.md`) could let visitors inspect the inside. It might also just produce a confusing mess, so this change is a spike to find out before committing to a feature.

## What Changes

- A spike-only **Explode slider** on the stairs Model, shown only when the Viewer URL has `?explode` (e.g. `/models/stairs?explode`). Visitors without the flag see no change.
- Dragging the slider right pulls the **visible** top-level groups apart, radially from the centre of what is visible, up to about 0.75 × its bounding radius; far left is assembled. Groups hidden with Layers stay put.
- Showing or hiding a Layer (or Restore defaults) while exploded re-spreads the visible groups straight away for the current slider position.
- With a single group visible, both modes spread that group's own parts, so hiding all Layers but one explodes within it.
- A toggle switches between two modes so both can be judged:
  - **Groups:** the visible top-level SketchUp groups move as solid blocks.
  - **Nested:** groups separate over the first half of the slider, then the groups inside each one spread out over the second half.
- The camera stays fully free at any slider position (orbit, zoom, pan, tap to set pivot). The slider never moves the camera. Auto-orbit keeps turning while the slider is dragged. Reset view also restores the starting Layers (on every Model, a change to shipped Layers behaviour) and reassembles the Model (slider back to 0). The slider works inside Viewpoints.
- Outcome: after an iPhone check the owner decides to productise (a follow-up change with a Catalog field and proper specs), tweak, or drop. Findings are recorded in `design.md`.
- Deferred: canonical Model kinds. Candidate names are **Site design** (gardens, landscapes, house sites) and **Build detail** (stairs, joinery, framing).

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `model-viewer`: a flag-gated Explode slider on the stairs Model for the spike, acting on visible Layers only; Reset view restores default Layers (all Models) and reassembles.

## Impact

- New `src/explode.ts` (pure offset maths, unit-tested) and `src/viewer/explode.ts` (slider UI, applies offsets). Internal scene access goes through the shared `src/viewer/sceneAccess.ts` from Layers (ADR 0003), extended for positions and bounds.
- On phones the Layers bottom sheet sits above the whole bottom controls area, including the explode row, so both can be used together.
- The branch is rebased onto `main` (Layers, Info top right, new stairs export) before building.
- `model.html`, `src/viewer/main.ts`, `src/viewer/viewer.css`, a Playwright test.
- No Catalog or build changes. All spike code is either promoted by the follow-up change or deleted.
