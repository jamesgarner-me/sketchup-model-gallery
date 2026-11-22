## Why

Build-detail Models such as the stairs hide their construction: framing, stringers and winders sit behind walls, plasterboard and treads. Pulling the parts apart (Explode, see `CONTEXT.md`) could let visitors inspect the inside. It might also just produce a confusing mess, so this change is a spike to find out before committing to a feature.

## What Changes

- A spike-only **Explode slider** on the stairs Model, shown only when the Viewer URL has `?explode` (e.g. `/models/stairs?explode`). Visitors without the flag see no change.
- Dragging the slider right pulls the parts apart, radially from the Model's centre, up to about 0.75 × the Model's bounding radius; far left is assembled.
- A toggle switches between two modes so both can be judged:
  - **Groups:** the 12 top-level SketchUp groups move as solid blocks.
  - **Nested:** groups separate over the first half of the slider, then the groups inside each one spread out over the second half.
- The camera stays fully free at any slider position (orbit, zoom, pan, tap to set pivot). The slider never moves the camera. Auto-orbit keeps turning while the slider is dragged. Reset view stays camera-only and leaves the explode amount as is. The slider works inside Viewpoints.
- Outcome: after an iPhone check the owner decides to productise (a follow-up change with a Catalog field and proper specs), tweak, or drop. Findings are recorded in `design.md`.
- Deferred: canonical Model kinds. Candidate names are **Site design** (gardens, landscapes, house sites) and **Build detail** (stairs, joinery, framing).

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `model-viewer`: a flag-gated Explode slider on the stairs Model for the spike.

## Impact

- New `src/explode.ts` (pure offset maths, unit-tested) and `src/viewer/explode.ts` (finds the parts in `<model-viewer>`'s internal three.js scene, applies offsets, slider UI). The scene access follows ADR 0003; the planned Layers change can reuse it.
- `model.html`, `src/viewer/main.ts`, `src/viewer/viewer.css`, a Playwright test.
- No Catalog or build changes. All spike code is either promoted by the follow-up change or deleted.
