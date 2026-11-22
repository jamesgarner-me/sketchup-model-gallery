## Why

The owner finds the Viewer's camera uncomfortable compared with SketchUp. Measured on Bastings Garden: the field of view (FOV) is 30° on desktop and phone landscape, and zooming in narrows it further, down to 12°, because `<model-viewer>` zooms by moving closer and narrowing the lens at the same time. That feels like a telephoto lens or binoculars. SketchUp's default is 35° and its zoom only moves the camera. Viewpoints already use a fixed 45°.

## What Changes

- Every Model uses a 45° FOV across the screen's shorter side (vertical on desktop and landscape, horizontal on portrait phones), the same as Viewpoints.
- The FOV stays fixed while zooming: zoom only moves the camera, like SketchUp. The close-zoom limit (about 0.1 m) is unchanged.
- Bastings Garden's fixed starting distance is re-tuned so the garden fills the screen about as much as it does now. Stairs uses automatic framing and adjusts itself.
- The Catalog's `camera.fieldOfView` override remains for any Model that needs a different lens.
- No Viewpoints code changes: they already use a fixed 45° and restore the Model's FOV on exit.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `model-viewer`: a fixed, wider default field of view; zoom no longer changes it.

## Impact

- `src/viewer/main.ts` (FOV attributes, Reset view), `src/models.json` (Bastings Garden starting distance), `tests/smoke.e2e.ts`.
