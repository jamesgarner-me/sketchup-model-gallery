## Context

The Viewer (`model.html`) and Info overlay are live. `index.html` is still a one-link placeholder. The catalog (`src/catalog.ts`, sorted by `order`) and the stairs thumbnail exist. Only one real Model exists. See proposal.md and the `model-gallery` spec.

## Goals / Non-Goals

**Goals:**
- Gallery page meeting the `model-gallery` spec, sharing styles and config with the Viewer.
- An automated end-to-end smoke test of the main journey.

**Non-Goals:**
- Search, filters, categories, pagination (PRD scope).
- Publishing a placeholder second Model.

## Decisions

1. **Rendering:** a pure `renderGallery(entries)` returns the card markup (escaped) and `src/gallery/main.ts` mounts it. Pure function so Vitest can check order, escaping and multiple entries without a second published Model. Alternative: static HTML per Model; rejected because adding a Model must need only catalog changes.
2. **Card shape:** `<article>` with thumbnail `<img alt="<title>" loading="lazy" width height>`, `<h2><a href="/models/<id>">title</a></h2>` and the Description. The link's accessible name is the title; a CSS stretched-link makes the whole card tappable.
3. **Layout:** CSS grid `repeat(auto-fill, minmax(260px, 1fr))`; one column on phones, more on wider screens, no horizontal scroll; safe-area padding.
4. **Config:** `src/config.ts` exports `siteName` ("Model Gallery"), used for the Gallery heading and document title.
5. **No GLB on landing:** the Gallery imports only the catalog; `<model-viewer>` is not imported on this page, so no GLB or three.js loads.
6. **Shared styles:** extract the colour tokens and `.btn`/focus styles into `src/base.css`, imported by both pages.
7. **Smoke test:** `@playwright/test` against `vite preview` of the production build. Add a `configurePreviewServer` rewrite matching `vercel.json` so `/models/:id` works locally. Chromium with SwiftShader flags for headless WebGL. Journey: Gallery → card → Viewer loads → Info open/close → Reset view returns camera.
8. **Empty catalog:** show a short "No models yet" message instead of an empty grid.

## Risks / Trade-offs

- [Headless WebGL flakiness in CI] → test waits on the loading bar hiding, not fixed sleeps; SwiftShader flags set in config. CI is not set up yet, so tests run locally.
- [Single Model can hide grid bugs] → unit tests cover multiple entries and ordering.
- [Thumbnail aspect differs between Models] → fixed aspect-ratio box with `object-fit: contain`.
