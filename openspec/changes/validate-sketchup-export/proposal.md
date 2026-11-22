## Why

The whole MVP depends on a real SketchUp GLB looking right and running well on a phone (PRD milestone 1). Validate that first, with the project scaffold and Vercel deploy in place, before building the viewer, Info and gallery. See `docs/PRD.md`.

## What Changes

- Scaffold the Vite + TypeScript project with two HTML entry points.
- Initialise git, push to GitHub, connect Vercel auto-deploy on the default `*.vercel.app` URL.
- Add `vercel.json` rewrite `/models/:id` → `/model.html`.
- Render one owner-supplied GLB in a bare `<model-viewer>` page (no catalog, Reset view or Info yet).
- Test on a real phone and desktop; record findings, performance targets and phone support floor.

## Capabilities

### New Capabilities

None. This is scaffolding and a validation spike; it declares `skip_specs: true`. Findings feed the specs of later changes.

### Modified Capabilities

None.

## Impact

- New project files: `package.json`, `vite.config.ts`, `index.html`, `model.html`, `vercel.json`, `.gitignore`, `public/models/`.
- Dependencies: `vite`, `typescript`, `@google/model-viewer`.
- New `docs/export-findings.md` capturing results.
- Gate: changes `model-viewer`, `model-info`, `model-gallery` are planned in detail only after this one.
