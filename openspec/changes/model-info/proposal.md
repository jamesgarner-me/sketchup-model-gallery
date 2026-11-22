## Why

Visitors need each Model's Description and Notes without leaving the Viewer. Third step; to be fully planned after `model-viewer`. See `docs/PRD.md`.

## What Changes

- Build-time Markdown pipeline (raw HTML disabled).
- Info overlay with Description then Notes, description-only fallback.
- History entry (Back closes overlay), focus management, independent scrolling, camera preserved.

## Capabilities

### New Capabilities
- `model-info`: Info overlay and Notes rendering.

### Modified Capabilities

None.

## Impact

- Markdown Vite plugin, Info overlay UI, Vitest tests for rendering.
- Depends on `model-viewer`.
