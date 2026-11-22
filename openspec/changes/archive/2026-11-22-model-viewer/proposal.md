## Why

Visitors need to inspect a Model in 3D and recover when lost. Second step after `validate-sketchup-export`; to be fully planned (design, tasks) once that change's findings are in. See `docs/PRD.md`.

## What Changes

- Minimal Catalog and build-time validation.
- `/models/<id>` Viewer: gestures, Initial framing, Reset view, loading, load-failure and not-found states.
- Persistent controls, portrait and landscape layout.
- Hosting and public-content requirements (hosting itself is already in place; only the requirement is specified here).

## Capabilities

### New Capabilities
- `model-viewer`: Interactive Viewer with Reset view and error states.
- `content-publishing`: Catalog schema, build-time validation, hosting and routing, public access.

### Modified Capabilities

None.

## Impact

- `src/models.json`, `scripts/validate-catalog.ts`, viewer page code, Vitest.
- Builds on completed `validate-sketchup-export`: the scaffold, Vercel deploy, GitHub connection and `/models/:id` rewrite already exist, and the export was validated on an iPhone 15 Pro (see `docs/export-findings.md`).
