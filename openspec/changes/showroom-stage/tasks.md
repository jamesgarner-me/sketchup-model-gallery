## 1. Stage presets and Catalog

- [x] 1.1 Add `src/stages.ts` with `neutral` (today's values) and `showroom` presets and `STAGE_NAMES`
- [x] 1.2 Add optional `stage` to the Catalog type; default to `neutral`
- [x] 1.3 Extend `validateCatalog` to fail on unknown Stage names; Vitest tests

## 2. Showroom lighting asset

- [x] 2.1 Write `scripts/make-showroom-env.ts` generating `public/environments/showroom.hdr` (four soft lights, near-black base, < 1 MB)
- [x] 2.2 Generate and commit the HDR; add an npm script to regenerate it

## 3. Viewer

- [x] 3.1 Apply the Model's Stage: `data-stage`/`data-theme` on `.viewer`, preset attributes on `<model-viewer>`, environment image only when defined
- [x] 3.2 Showroom background CSS: near-black, floor glow, vignette; transparent viewer background
- [x] 3.3 Dark theme for controls, loading bar and load-failure screen; Info overlay and not-found stay light
- [x] 3.4 Move stairs to the `showroom` Stage

## 4. Tune and verify

- [x] 4.1 Tune lights, exposure and tone mapping with headless screenshots
- [x] 4.2 Confirm Neutral Models do not request the HDR (temporary neutral entry) and that the build fails on an unknown Stage
- [ ] 4.3 Run unit tests, smoke tests and build; deploy and check the hosted site
- [ ] 4.4 Manual check on iPhone: look, legibility of controls, Info still light
