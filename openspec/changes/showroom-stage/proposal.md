## Why

Some Models deserve a more dramatic presentation than the light neutral look: shown as if on display in a dark room lit by several lights. Introduce Stages (see `CONTEXT.md`) so each Model can choose its presentation.

## What Changes

- Stages: named background-and-lighting presets; a Model picks one in the Catalog, defaulting to Neutral.
- New Showroom stage: near-black background with soft floor glow and vignette, lit by a generated dark environment image with key, fill, rim and overhead lights (image-based; no real spotlights, see ADR 0002).
- A Stage also sets exposure, shadow strength and tone mapping.
- Viewer controls and the load-failure screen use a dark style on the Showroom stage; Info overlay and "Model not found" stay light.
- Build fails on an unknown Stage name.
- Stairs moves to the Showroom stage.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `model-viewer`: neutral-only appearance becomes Stage-based; adds Showroom stage and dark control styling.
- `content-publishing`: optional `stage` Catalog field and its validation.

## Impact

- `src/stages.ts` (new), `src/catalog.ts`, `src/validateCatalog.ts`, `src/viewer/main.ts`, `src/viewer/viewer.css`, `src/models.json`.
- New `scripts/make-showroom-env.ts` and generated `public/environments/showroom.hdr` (< 1 MB, loaded only on Showroom).
- No Gallery changes.
