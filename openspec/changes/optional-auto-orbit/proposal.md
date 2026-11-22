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

## Open Questions (resolve when this is planned, ideally via grilling)

- Should the orbit stop permanently on first touch/drag, or resume after a delay?
- What does Reset view do while a Model has auto-orbit: return to Initial framing and stay still, or restart the orbit?
- Speed and direction: one global default, or configurable per Model?
- Respect `prefers-reduced-motion` by disabling the orbit?
- Does it apply only on first load, or also after returning from Info?
