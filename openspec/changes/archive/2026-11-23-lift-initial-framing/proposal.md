## Why

On first load the Model sits a little low in the viewport, leaving dead space above it and crowding the bottom controls.

## What Changes

- Initial framing lifts the Model vertically by 10% of the viewport height.
- Applies to every Model automatically; a catalog `camera.target` still overrides it.
- Reset view returns to the lifted framing (the lift is part of Initial framing).
- Viewpoints, Layers sheet fit and orbit behaviour are unchanged.

## Capabilities

### New Capabilities

### Modified Capabilities
- `model-viewer`: "Initial framing shows whole Model" gains the vertical lift.

## Impact

- `src/viewer/main.ts`: framing capture on `load`.
- `tests/`: e2e check of the lift on phone and desktop.
- `README.md`: `camera.target` note (opting out of the lift).
