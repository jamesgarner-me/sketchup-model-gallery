## 1. Conversion

- [x] 1.1 `src/colour.ts`: pure `srgbToLinear`. Vitest tests for the endpoints, the 0.04045 knee, and 0.184 → about 0.029
- [x] 1.2 In the `load` handler in `src/viewer/main.ts`, convert each material's base colour RGB to linear, keeping alpha, in the same loop as the metallic fix

## 2. Look

- [x] 2.1 Before/after screenshots at the owner's angle: Bastings Garden (Neutral) and Stairs (Showroom). Adjust Stage exposure only if clearly too dark or too bright (checked: no exposure change needed)
- [x] 2.2 Retake `public/thumbnails/bastings-garden.webp` and `public/thumbnails/stairs.webp` at the same framing (Bastings retaken. Stairs left as is: its materials are textured or white, so the fix doesn't change it, and the before/after renders match)

## 3. Verify and document

- [x] 3.1 Smoke-test step: the Bastings battens material factor is about 0.029 and a textured material's factor is 1
- [x] 3.2 Record the exporter's sRGB-in-factor encoding in `docs/export-findings.md`
- [x] 3.3 Run unit tests, smoke tests and build
