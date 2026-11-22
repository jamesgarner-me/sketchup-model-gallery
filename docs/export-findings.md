# SketchUp export findings (validate-sketchup-export)

Date: 2026-11-22. Model: `stairs-james-design-v1-backup.glb`.

## Result

The real export renders correctly and navigates well. No optimisation is needed for the MVP. Proceed to `model-viewer`.

## Asset facts (measured)

| Item | Value |
|---|---|
| File size | 6.4 MB (6.27 MB gzipped, so GLB barely compresses) |
| Generator | SimLab glTF exporter (SketchUp export path) |
| Meshes / nodes | 70 / 175 |
| Triangles | 1,368 (very light geometry) |
| Materials / textures | 2 / 10 |
| Texture payload | ~6.3 MB: five PNGs at 0.7-2.1 MB each (~6.1 MB), five small JPEGs (<85 KB each) |
| Extension | `KHR_materials_pbrSpecularGlossiness` |
| JS bundle (model page) | ~1 MB, 291 kB gzipped (mostly three.js inside `<model-viewer>`) |

Geometry is not the cost; the PNG textures are almost the whole file.

## Device validation (owner-reported)

- iPhone 15 Pro: the stairs render correctly; orbit, pinch zoom and two-finger pan all work well.
- Desktop: renders well (owner-reported).
- Not measured: load time, memory use, frame rate, iOS version, Android, other browsers.

## Decisions

- **Optimisation:** none now. Geometry is tiny. If load time proves slow on weaker devices or mobile data, convert the five large PNGs to WebP/JPEG or resize them (likely the biggest win, with no geometry changes).
- **Interim phone floor:** iPhone 15 Pro, current iOS Safari. Widen after testing an older phone and Android Chrome.
- **Proposed targets (not yet agreed):** keep each Model under about 10 MB; first interaction within a few seconds on typical broadband. Revisit after measuring on slower devices.

## Risks and follow-ups

- `KHR_materials_pbrSpecularGlossiness` is a deprecated glTF extension. It works today in `<model-viewer>`; watch it on library upgrades and re-export if it breaks.
- Test an older iPhone, Android Chrome and a throttled connection during `model-gallery` verification.
- The deployment URL is public; any GLB placed in `public/` is downloadable by anyone (accepted in the PRD).
