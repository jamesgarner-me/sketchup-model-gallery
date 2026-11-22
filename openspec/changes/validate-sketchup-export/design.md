## Context

Greenfield repo. Decisions on stack and hosting are in earlier planning (vanilla Vite + TS, `<model-viewer>`, two static pages, Vercel rewrite). This change only proves the pipeline end to end with one real export. See proposal.md.

## Goals / Non-Goals

**Goals:**
- Working scaffold, deploy pipeline and rewrite.
- Evidence on geometry, orientation, materials, size, load time and phone responsiveness.

**Non-Goals:**
- Catalog, Reset view, Info, gallery, error states, tests beyond a manual check.
- Optimisation work, unless the export is unusable.

## Decisions

1. **Bare viewer reads nothing from a catalog:** `model.html` hardcodes one GLB path, enough to test rendering and the rewrite.
2. **Rewrite verified early:** `/models/anything` serves `model.html` on Vercel, so routing risk is found now.
3. **Findings recorded in `docs/export-findings.md`:** file and texture sizes, load times on a real phone, visual differences from SketchUp, device and browser used, proposed targets.
4. **Optimise only on evidence:** compression or texture resizing is added only if findings show a problem.

## Risks / Trade-offs

- [Export looks wrong or is heavy] → Record it, try SketchUp export options, then decide on optimisation before moving on.
- [Only one device tested] → Note the device as the interim support floor and widen later.
