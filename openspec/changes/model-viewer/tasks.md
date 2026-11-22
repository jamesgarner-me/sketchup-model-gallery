## 1. Catalog and validation

- [x] 1.1 Define catalog types in `src/catalog.ts` and create `src/models.json` with the stairs entry (`id: stairs`)
- [x] 1.2 Create the stairs thumbnail at `public/thumbnails/stairs.webp`
- [x] 1.3 Implement pure `validateCatalog(entries, fileExists)` (unique IDs, required fields, GLB and thumbnail exist, Notes optional)
- [x] 1.4 Add `scripts/validate-catalog.ts` using `tsx`, wired to `prebuild`, with clear error messages naming entry and file
- [x] 1.5 Add Vitest and tests for `validateCatalog` (missing GLB, missing thumbnail, duplicate ID, no Notes passes)

## 2. Viewer routing and states

- [x] 2.1 Add pure path-ID parser for `/models/<id>` with Vitest tests
- [x] 2.2 Replace the spike in `model.html` with the catalog-driven Viewer: look up the entry and render `<model-viewer>` from its GLB
- [x] 2.3 Render "Model not found" with a link to the Gallery for unknown IDs, with no GLB request
- [x] 2.4 Loading progress bar driven by the `progress` event, hidden on `load`
- [x] 2.5 Load-failure state with message, Retry and Back to Gallery

## 3. Framing and Reset view

- [x] 3.1 Initial framing from catalog `camera` or captured auto-framing after first `load`
- [x] 3.2 Reset view button: set absolute camera goals with ~400 ms glide and `jumpCameraToGoal()` fallback
- [ ] 3.3 Verify Reset recovers after panning offscreen, over-zoom, and orientation change; repeatable

## 4. Controls and layout

- [x] 4.1 Controls overlay: back link, title, Reset view, short control instructions, empty slot for Info
- [x] 4.2 Touch targets, safe-area insets, visible keyboard focus
- [x] 4.3 Portrait and landscape layout; keep `touch-action` and overscroll rules; neutral background and lighting

## 5. Verify

- [x] 5.1 Run unit tests and `npm run build` (validation runs in prebuild)
- [ ] 5.2 Manual check on iPhone: orbit, pinch, two-finger pan, Reset, load-failure and not-found states, portrait and landscape
- [ ] 5.3 Keyboard check of Reset and back link; confirm `/models/stairs` direct link and refresh on the deployed site
