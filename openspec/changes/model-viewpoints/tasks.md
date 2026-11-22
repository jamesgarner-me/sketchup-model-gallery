## 1. Viewpoint extraction

- [x] 1.1 `src/viewpoints.ts`: pure `extractViewpoints(gltfJson)`. Unwrap single-child wrappers, take empty leaf nodes beside the top-level groups, exclude `Active View`, keep order, compute world eye and forward in glTF metres by applying the wrapper transforms (the root matrix does the Z-up → Y-up conversion), normalise the axes
- [x] 1.2 Pure helper converting `{ eye, forward }` to `<model-viewer>` camera target and orbit (theta/phi from −forward, small radius)
- [x] 1.3 Vitest tests: wrappers and scale, axis conversion, `Active View` exclusion, order, no Scenes, orbit maths
- [x] 1.4 Vite plugin exposing `virtual:viewpoints` (Model id → Viewpoints) from `src/models.json` and the GLBs' JSON chunks, with types. Log the Viewpoints found per Model at build. Confirm Bastings Garden yields six (Stairs turned out to have seven)

## 2. Viewer

- [x] 2.1 `src/viewer/viewpoints.ts`: `enterViewpoint` / `exitViewpoint`. Save and restore camera attributes, pin the radius, pitch 30°–150°, disable pan, zoom and tap, field of view 45°, instant cut via `jumpCameraToGoal()`, stop Auto-orbit on enter
- [x] 2.2 "Grab the scene" drag direction (negative `orbit-sensitivity`, or inverted deltas as fallback). Check the arrow keys match
- [x] 2.3 Reset view calls `exitViewpoint()` before its existing logic. Confirm Auto-orbit restarts where enabled
- [x] 2.4 Viewpoints button and right-hand drawer markup in `model.html`. Styles in `viewer.css`: slide-in, `min(360px, 85vw)`, safe areas, reduced motion, 44 px rows, dark theme
- [x] 2.5 Drawer behaviour: show the button only when Viewpoints exist, open and close via the button, close button and Escape, focus return, select closes the drawer, `aria-pressed` on the current Viewpoint
- [x] 2.6 If `model-layers` has already landed, make the Layers panel and Viewpoints drawer mutually exclusive (it hasn't, so nothing to do here; `model-layers` takes this on when it lands)

## 3. Verify

- [x] 3.1 Browser check on Bastings Garden for each Viewpoint: eye position and direction match the SketchUp Scene. Nearby geometry isn't clipped (adjust per design Decision 5 if it is). Tune the small radius for stability
- [x] 3.2 Playwright checks:
  - Button present on Bastings Garden (Stairs also has Viewpoints, so there's no Model without the button to check).
  - Drawer opens, closes with Escape and returns focus.
  - Selecting a Viewpoint closes the drawer, puts the camera at the eye and stops Auto-orbit.
  - Drag changes the view but not the target.
  - Wheel and pinch do nothing.
  - Reset view restores Initial framing and controls.
- [x] 3.3 Screenshots on phone and desktop, light and dark Stage, drawer open and in a Viewpoint
- [x] 3.4 README: how to add Viewpoints (save named Scenes in SketchUp, re-export, rebuild; `Active View` ignored). Run unit tests, smoke tests and build
