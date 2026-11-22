## Context

Measured on Bastings Garden (see proposal): the auto minimum camera radius is `2.2 × boundingSphere.radius` (36.7 m); all 66 materials carry `KHR_materials_pbrSpecularGlossiness` plus a `pbrMetallicRoughness` fallback with `metallicFactor: 0.5`, and three.js uses the fallback. Comparison renders at the owner's SketchUp angle showed metalness 0 plus linear tone mapping gave the clearest improvement; raising exposure made things worse; AgX was greyer. `<model-viewer>` already sets the pivot on a tap without drag (`SmoothControls.recenter`, enabled with camera controls). The Neutral stage currently uses the default lighting and `neutral` tone mapping.

## Goals / Non-Goals

**Goals:** close zoom with tap-to-pivot on every Model; colours closer to SketchUp on the Neutral stage; fix the material artefact for all Models.

**Non-Goals:** cursor-centred zoom, sky background, GLB conversion or compression, exact SketchUp reproduction.

## Decisions

1. **Zoom limit:** set `min-camera-orbit="auto auto 0.1m"` on every `<model-viewer>`. Leave `min-field-of-view` at its default; the library couples radius and field of view during zoom, so tune only if zoom feels uneven near the limit.
2. **Tap-to-pivot:** rely on the library's built-in behaviour; verify it is active and that Reset view's absolute `camera-target` goal restores the original pivot. No code unless verification shows it is off.
3. **Material correction:** on `load`, call `setMetallicFactor(0)` on every material through the public `model.materials` API. Leave roughness as exported unless tuning shows unwanted shine. Applies to all Models and Stages.
4. **Daylight lighting:** generalise `scripts/make-showroom-env.ts` into a generator with two light sets: Showroom (unchanged output) and Daylight (one bright, soft sun high on one side, a broad sky dome brighter above, a dim warm ground). Daylight is 256×128 to stay small. `npm run make:env` writes both files.
5. **Neutral preset:** `environmentImage: '/environments/daylight.hdr'`, `toneMapping: 'linear'`, exposure and shadow tuned by eye against the owner's screenshot.
6. **Verification:** screenshots of both Models at the owner's angle before and after; a smoke-test step that zooms the Bastings Garden camera below 1 m from the pivot and checks a material reports metallic 0; iPhone check by the owner.

## Risks / Trade-offs

- [Very close zoom clips into geometry] → accepted (proposal); Reset view always recovers.
- [Linear tone mapping clips bright areas] → tune exposure; fall back to another tone mapping per Stage if highlights blow out.
- [Some future Model genuinely uses metal] → correction is global today; make it a per-Model setting if that happens.
- [Daylight adds a download to Neutral Models] → small resolution, target under 300 KB.
- [Showroom look shifts due to the material fix] → re-screenshot stairs and retune only if needed.
