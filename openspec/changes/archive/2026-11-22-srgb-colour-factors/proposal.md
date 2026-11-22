## Why

Plain-coloured materials look washed out compared with SketchUp: black battens render mid-grey, the mustard bin lid looks cream, and deep greens look mint. The SketchUp exporter (SimLab) writes each colour's 8-bit sRGB value divided by 255 into `baseColorFactor`, but glTF defines that field as linear, so the viewer brightens it a second time. Textured materials are unaffected, which is why timber and bluestone already match. A test in the live page that converted the factors to linear brought the render close to the owner's SketchUp view.

## What Changes

- On load, the Viewer treats each material's exported base colour (RGB) as sRGB and converts it to linear. Alpha is unchanged. Textured materials (factor 1) are unaffected.
- Applies to every Model, like the existing non-metallic correction. An opt-out is added only if a future export encodes colours correctly.
- The GLB files are not modified.
- Stage exposure is re-checked against the owner's SketchUp render after the fix, and adjusted only if the result is clearly too dark or too bright. Tone mapping stays as it is unless that fails.
- Gallery thumbnails for both Models are retaken at the same framing.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `model-viewer`: new requirement that exported plain colours display as authored in SketchUp, not lightened.

## Impact

- `src/viewer/main.ts` (load handler, next to the metallic fix), plus a small pure helper for the sRGB → linear conversion with unit tests.
- Possibly `src/stages.ts` (exposure).
- `public/thumbnails/bastings-garden.webp`, `public/thumbnails/stairs.webp`.
- `tests/smoke.e2e.ts` (colour check).
- `docs/export-findings.md` (record the exporter's colour encoding).
