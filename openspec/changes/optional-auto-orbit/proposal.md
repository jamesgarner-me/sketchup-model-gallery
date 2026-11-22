## Why

Some Models are best introduced by a slow automatic 360° orbit when the Viewer first loads (for example the stairs), while others are not. Make this an optional per-Model setting, off unless a Model opts in. Backlog item; not yet planned in detail.

## What Changes

- Add an optional per-Model Catalog setting for default camera behaviour on first load, starting with a 360° auto-orbit.
- Models without the setting behave exactly as today (no motion).
- Enable it for the stairs Model.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `model-viewer`: optional automatic camera orbit on first load, and how it interacts with Reset view and visitor input.
- `content-publishing`: optional Catalog field to enable and configure it.

## Impact

- Catalog type and validation (`src/catalog.ts`, `src/validateCatalog.ts`), viewer logic (`src/viewer/main.ts`), `src/models.json`.
- Likely uses `<model-viewer>`'s built-in auto-rotate support; confirm during design.

## Decisions (from grilling)

- Orbit stops for the rest of the visit on the first visitor touch, drag or zoom.
- Reset view returns to Initial framing (undoing the turntable turn) and stays still.
- Optional per-Model speed in degrees per second, default 18°/s; negative reverses.
- Disabled when the device prefers reduced motion.
- Paused while Info is open; resumes on close if the visitor has not taken control.
- Starts as soon as the Model loads.
- The library's "hand" interaction prompt is hidden on orbiting Models.
- Catalog accepts `"autoOrbit": true` or `"autoOrbit": { "degreesPerSecond": n }`. Stairs uses `true`.
