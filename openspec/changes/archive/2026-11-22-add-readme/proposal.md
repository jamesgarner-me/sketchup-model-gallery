## Why

The project has no README. The owner needs a quick reference for adding Models, and a developer picking up the code needs to know how to run, test, deploy and plan changes.

## What Changes

- Add `README.md` at the repo root, for the owner first and developers second, with these sections:
  1. What it is, with the live URL.
  2. **Adding a new model**: a concise numbered step-by-step guide (export GLB from SketchUp, add files, add the Catalog entry, preview, push).
  3. Catalog field reference: a table of every field (`id`, `title`, `description`, `glb`, `thumbnail`, `order`, `notes`, `camera`, `stage`, `autoOrbit`) and one example entry.
  4. Local development commands (`dev`, `build`, `test`, `test:e2e`, `make:env`).
  5. Project layout.
  6. Deployment (Vercel auto-deploy on push to `main`).
  7. How planning works (OpenSpec `/opsx:*` workflow, PRD, glossary, ADRs).
  8. Known limits (reset-only camera controls, image-based lighting, deprecated glTF material extension in the stairs export), linking to ADRs and findings.
- Keep it short; link to `docs/PRD.md`, `CONTEXT.md`, `docs/adr/` and `docs/export-findings.md` rather than repeating them.

## Capabilities

### New Capabilities

None. Documentation only; this change sets `skip_specs: true`.

### Modified Capabilities

None.

## Impact

- New `README.md`. No code or behaviour changes.
