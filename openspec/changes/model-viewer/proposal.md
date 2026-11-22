## Why

Visitors need to inspect a Model in 3D and recover when lost. Second step after `validate-sketchup-export`; to be fully planned (design, tasks) once that change's findings are in. See `docs/PRD.md`.

## What Changes

- Minimal Catalog and build-time validation.
- `/models/<id>` Viewer: gestures, Initial framing, Reset view, loading, load-failure and not-found states.
- Persistent controls, portrait and landscape layout.
- Hosting and public-content requirements.

## Capabilities

### New Capabilities
- `model-viewer`: Interactive Viewer with Reset view and error states.
- `content-publishing`: Catalog schema, build-time validation, hosting and routing, public access.

### Modified Capabilities

None.

## Impact

- `src/models.json`, `scripts/validate-catalog.ts`, viewer page code, Vitest.
- Depends on `validate-sketchup-export`.
- Note: the draft specs reflect pre-validation assumptions; revise them after the export findings.
