## Why

Compared with SketchUp, the Viewer has two problems the owner noticed on Bastings Garden:

- **Zoom stops far away.** `<model-viewer>` limits the camera to 2.2× the model's bounding radius from its pivot point. For the garden that is 36.7 m against a 48 m start, so visitors barely get closer.
- **Colours look washed out.** Measured causes: the SimLab exporter's fallback materials are 50% metallic on every material (three.js ignores the older specular-glossiness data and uses the fallback), the Neutral stage's tone mapping softens contrast, and its lighting is even from all directions so faces barely shade.

## What Changes

- Visitors can zoom until the camera is about 0.1 m from the pivot point, on every Model. Tapping or clicking a point on the Model (without dragging) makes it the pivot, so visitors zoom into what they tapped. Very close up, the camera may pass inside geometry; that is accepted.
- Exported materials display as non-metallic on every Model, corrected when the Model loads.
- The Neutral stage uses linear tone mapping and a generated daylight lighting image (soft sun from one side plus sky fill), tuned by eye against the owner's SketchUp screenshot. The Showroom stage keeps its look apart from the material correction.
- The background stays flat light grey. The goal is closer to SketchUp, judged on a phone, not an exact match.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `model-viewer`: Neutral stage appearance; close zoom; tap-to-pivot; non-metallic material display.

## Impact

- `src/viewer/main.ts` (zoom limit, material correction), `src/stages.ts` (Neutral preset), `scripts/make-showroom-env.ts` generalised to also produce `public/environments/daylight.hdr`, `tests/smoke.e2e.ts`, `README.md` (`make:env` description).
- Neutral-stage Models now download a small lighting image (target under 300 KB).
- Not changed: zoom toward the cursor, background, compression, `model-layers` (separate change).
