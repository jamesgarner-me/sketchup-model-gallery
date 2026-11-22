## Context

The Bastings Garden GLB has 66 materials, each with `KHR_materials_pbrSpecularGlossiness` plus a `pbrMetallicRoughness` fallback. three.js uses the fallback. On plain materials, `baseColorFactor` equals the SketchUp RGB value divided by 255. For example, "07 • Black stained battens" is `[0.184, 0.188, 0.176]`, which is #2F302D. glTF treats that factor as linear, so it shows as roughly 47% grey. Textured materials have factor `[1,1,1]`, and their textures are already decoded as sRGB.

`main.ts` already fixes another exporter fallback on `load`, setting `setMetallicFactor(0)` for every material through `el.model.materials`. Before/after renders confirmed that converting the factors gives the expected look.

## Goals / Non-Goals

**Goals:** plain colours match SketchUp; no change to textured materials; the same public-API pattern as the metallic fix.

**Non-Goals:** rewriting GLBs, matching SketchUp's sun shading, per-Model opt-out (until needed), emissive or specular-gloss handling.

## Decisions

1. **Conversion:** a pure `srgbToLinear(c)` in `src/colour.ts`, using the standard piecewise sRGB EOTF: `c ≤ 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4`. On `load`, for each material: `setBaseColorFactor([lin(r), lin(g), lin(b), a])`. It runs in the same loop as `setMetallicFactor(0)`.
   - Alternatives considered:
     - A build-time GLB rewrite was rejected because it would mean an extra step on every re-export.
     - Reading the spec-gloss `diffuseFactor` instead gives the same values and also needs conversion, so there's no gain.
2. **Run once per load.** The `load` event fires once per `src`. Retry loads a fresh GLB with fresh materials, so the conversion is never applied twice to the same material.
3. **Stage retune.** Take screenshots at the owner's angle on the Neutral stage (Bastings Garden) and the Showroom stage (Stairs). Adjust `exposure` in `src/stages.ts` only if the result is clearly too dark or too bright.
4. **Verification.**
   - Vitest for `srgbToLinear`: endpoints, the 0.04045 knee, and 0.184 → about 0.029.
   - A smoke-test step on Bastings Garden reads the battens material's factor (about 0.029) and a textured material's factor (still 1) through `el.model.materials`.
5. **Docs.** `docs/export-findings.md` records the exporter's sRGB-in-factor encoding next to the metallic fallback note.

## Risks / Trade-offs

- [A future exporter writes correct linear factors] → those colours would turn too dark. Add a per-Model opt-out then, and note it in export findings.
- [Scenes look darker overall] → exposure re-check (Decision 3).
- [Showroom look shifts] → re-screenshot Stairs and retune only if needed.
