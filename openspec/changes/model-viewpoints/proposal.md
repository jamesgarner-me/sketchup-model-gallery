## Why

Getting a good eye-level view of a design with orbit, pan and zoom is fiddly, especially on a phone. The owner already composes good views in SketchUp as Scenes, and the SketchUp export carries each Scene's camera position and direction. Visitors should be able to jump to those views and simply look around.

## What Changes

- Introduce Viewpoints (see `CONTEXT.md`). Every saved SketchUp Scene in a Model's export becomes a Viewpoint automatically. `Active View` is excluded. Names and order come from SketchUp, with no Catalog configuration.
- A **Viewpoints** button sits in the controls row and is shown only on Models with at least one Viewpoint. It opens a drawer from the right on all screen sizes, listing the Viewpoints. Escape and the close button dismiss it.
- Choosing a Viewpoint cuts the camera there instantly (no glide), closes the drawer and marks that Viewpoint as current.
- Inside a Viewpoint the eye stays fixed:
  - pan, zoom and tap-to-set-pivot are off;
  - dragging (touch or mouse) or the arrow keys look around, as if grabbing the scene, like Street View;
  - the view turns a full 360° horizontally and about 60° above or below level;
  - nearby geometry renders correctly with the camera inside the Model;
  - field of view is a fixed default of about 45°.
- Entering a Viewpoint stops Auto-orbit. **Reset view** is the only way back: it returns to Initial framing with full controls and restores Auto-orbit's normal Reset behaviour.
- Out of scope: Models always open in Initial framing, there are no Viewpoint deep links, no movement inside a Viewpoint, and no Catalog overrides for labels, order or field of view.
- No dependency on `model-layers`. Whichever change lands second makes the Layers panel and Viewpoints drawer mutually exclusive.
- Implementation uses `<model-viewer>`'s orbit controls around the eye point (ADR 0004). Viewpoint data is extracted from the GLB at build time.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `model-viewer`: Viewpoints button, drawer, entering and leaving a Viewpoint, look-around-only behaviour. Changes to camera gestures, tap to set pivot, Reset view, persistent controls, dark-Stage styling and the accessibility-gap statement, since Reset view is no longer the only camera button.
- `content-publishing`: Viewpoints come from saved Scenes in the export, with no Catalog fields needed.

## Impact

- New build-time Scene extractor that reads the GLB JSON chunk and outputs each Scene's name, eye position and look direction. It is exposed to the viewer as build-time data, in the same way notes are.
- New `src/viewpoints.ts` (pure helpers: Scene detection and conversion to camera settings) and `src/viewer/viewpoints.ts` (drawer and camera mode).
- `model.html`, `src/viewer/main.ts`, `src/viewer/viewer.css`, `vite.config.ts`, `README.md` (how to add Viewpoints in SketchUp).
- `CONTEXT.md` (Viewpoint added, Reset view wording), ADR 0004.
- Bastings Garden needs re-exporting from SketchUp to pick up the newly added Scenes.
