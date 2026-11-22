## Why

SketchUp designs are organised into top-level groups (for example existing house, proposed planting, a clearance check). Visitors and the owner want to show or hide these to compare options and see what is behind things. The Bastings Garden export already carries eleven such groups, two of them intended as toggles.

## What Changes

- Introduce Layers (see `CONTEXT.md`): named top-level SketchUp groups listed per Model in the Catalog, each with a label, a default visibility and an order.
- A **Layers** button beside Reset view and Info, shown only on Models with Layers, opening a checkbox panel (bottom sheet on phones, side panel on desktop) with "Restore defaults".
- Toggling a Layer shows or hides that group immediately; it does not move the camera, change Initial framing or affect Auto-orbit. Reset view stays camera-only. Layer state is not kept in the URL.
- Build fails when a configured Layer name is not a top-level group in that Model's GLB.
- Bastings Garden gets all eleven groups as Layers: 01–09 on by default, 10 ("Existing landing comparison") and 11 ("Roof-loaded 4×4 clearance") off. Stairs gets none.
- Implementation reaches `<model-viewer>`'s internal three.js scene (ADR 0003).

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `model-viewer`: Layers control and visibility behaviour; dark-Stage styling extends to the Layers button and panel.
- `content-publishing`: optional `layers` Catalog field and its build-time validation against the GLB.

## Impact

- New `src/layers.ts` (pure resolution and validation helpers), `src/viewer/layers.ts` (scene access and panel), a GLB group-name reader for the build script.
- `src/catalog.ts`, `src/validateCatalog.ts`, `scripts/validate-catalog.ts`, `model.html`, `src/viewer/main.ts`, `src/viewer/viewer.css`, `src/models.json`, `README.md` (catalog field table).
- Note for future compression work: optimisation must keep top-level group names, or the build check fails.
