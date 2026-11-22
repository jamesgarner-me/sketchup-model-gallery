## 1. Gallery page

- [x] 1.1 Add `src/config.ts` (`siteName`) and extract shared tokens, `.btn` and focus styles into `src/base.css` used by both pages
- [x] 1.2 Implement pure `renderGallery(entries)` (catalog order, escaped text, title link to `/models/<id>`, thumbnail alt text, empty-catalog message)
- [x] 1.3 Vitest tests for `renderGallery` (order, multiple entries, escaping, link target, alt text, empty catalog)
- [x] 1.4 Replace placeholder `index.html` with the Gallery mounted from `src/gallery/main.ts`
- [x] 1.5 Responsive grid styles: one column on phones, multiple on wide screens, no horizontal scroll, stretched-link cards
- [x] 1.6 Confirm no `.glb` or `<model-viewer>` code loads on the Gallery

## 2. Smoke test

- [x] 2.1 Add `@playwright/test`, config using the production preview build and SwiftShader flags
- [x] 2.2 Add `configurePreviewServer` rewrite for `/models/:id` to match `vercel.json`
- [x] 2.3 Smoke test: Gallery → card → Viewer loads → Info open/close → Reset view restores camera

## 3. Verify

- [x] 3.1 Run unit tests, smoke test and `npm run build`
- [x] 3.2 Deploy and run the principal journeys against the hosted site (direct link, refresh, Back from Viewer to Gallery)
- [ ] 3.3 Manual check on iPhone: Gallery layout portrait and landscape, tap card, back to Gallery
