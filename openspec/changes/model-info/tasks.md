## 1. Markdown pipeline

- [x] 1.1 Add `marked`; implement pure `renderNotes(markdown)` in `src/markdown.ts` (headings, paragraphs, lists, emphasis, links; raw HTML escaped; unsafe link schemes neutralised; external links get `rel`)
- [x] 1.2 Vitest tests for `renderNotes` (formatting, raw HTML escaped, `javascript:` link neutralised, empty input)
- [x] 1.3 Vite plugin that renders `src/content/*.md` to HTML strings at build time; confirm no Markdown parser appears in the browser bundle
- [x] 1.4 Add `src/content/stairs.md` with clearly marked placeholder Notes

## 2. Notes lookup

- [x] 2.1 Resolve a Model's Notes from `src/content/<id>.md` (or catalog `notes` filename); absent means no Notes, not an error
- [x] 2.2 Test or script-check that a Model with no Notes file builds and resolves to no Notes

## 3. Info overlay

- [x] 3.1 Add Info button to `#info-slot` and a `<dialog>` with Close button in `model.html`; style full-viewport with safe-area insets and readable typography
- [x] 3.2 Populate title, Description, then Notes on open; omit the Notes section when there are none
- [x] 3.3 Independent scrolling: scroll container with `overscroll-behavior: contain`; confirm the camera does not move

## 4. History and focus

- [x] 4.1 `pushState` on open; `popstate` closes; Close button and Escape call `history.back()`; second Back leaves the Model
- [x] 4.2 Confirm focus moves into the overlay, returns to Info on close, and Viewer controls are not keyboard-reachable while open

## 5. Verify

- [x] 5.1 Run unit tests and `npm run build`
- [x] 5.2 Browser script: orbit, open Info, close, camera unchanged; Back closes overlay then leaves page; fallback with no Notes
- [ ] 5.3 Manual check on iPhone (portrait and landscape): open, scroll long Notes, close, Back
- [x] 5.4 Deploy and confirm Info works on the hosted site
