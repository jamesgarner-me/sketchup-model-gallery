## Why

Visitors need each Model's Description and Notes without leaving the Viewer. Second step after the archived `model-viewer`, which left an empty Info slot in the controls. See `docs/PRD.md`.

## What Changes

- Build-time Markdown pipeline (raw HTML disabled, unsafe link schemes neutralised).
- Info button in the Viewer's reserved slot; full-screen Info overlay with title, Description, then Notes.
- Description-only fallback when a Model has no Notes.
- History entry on open (Back closes overlay first), focus management, independent scrolling, camera preserved.
- Stairs Notes content (placeholder text for the owner to replace).

## Capabilities

### New Capabilities
- `model-info`: Info overlay and Notes rendering.

### Modified Capabilities

None.

## Impact

- Markdown renderer module and Vite plugin, `src/content/*.md`, Info overlay markup, styles and logic in the viewer page, Vitest tests.
- Dependency: `marked`.
- Builds on archived `model-viewer` (catalog, viewer page, `#info-slot`).
