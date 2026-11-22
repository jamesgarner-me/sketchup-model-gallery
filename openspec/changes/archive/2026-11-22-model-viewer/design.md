## Context

`validate-sketchup-export` is complete: Vite + TypeScript scaffold, `index.html` and `model.html` entry points, `vercel.json` rewrite `/models/:id` → `/model.html`, a dev-server mirror of that rewrite, `@google/model-viewer`, GitHub + Vercel connected. `model.html` is currently a spike with a hardcoded GLB (`public/models/stairs-james-design-v1-backup.glb`, 6.4 MB, 1,368 triangles, validated on iPhone 15 Pro; see `docs/export-findings.md`). No catalog, tests or controls exist yet. See proposal.md and the specs for behaviour. The Info button belongs to `model-info`.

## Goals / Non-Goals

**Goals:**
- Replace the spike with a catalog-driven Viewer at `/models/<id>` meeting the `model-viewer` and `content-publishing` specs.
- Reset view that reliably recovers from any camera state.
- Catalog validation that fails the build on bad entries.

**Non-Goals:**
- Info overlay, Notes rendering, Gallery cards, Playwright smoke test (later changes).
- GLB optimisation (findings say not needed).

## Decisions

1. **Catalog:** `src/models.json`, typed in `src/catalog.ts`. Fields: `id`, `title`, `description`, `glb`, `thumbnail`, `order`, optional `notes`, optional `camera` (`orbit`, `target`, `fieldOfView`). Bundled into both pages (small). Alternative: fetch JSON at runtime; rejected as an extra request for no gain.
2. **Validation:** `scripts/validate-catalog.ts` runs under `tsx` from `prebuild`. A pure `validateCatalog(entries, fileExists)` function does the checks (unique IDs, required fields, GLB and thumbnail exist; missing Notes allowed) so Vitest can test it without touching disk. Errors name the entry and file.
3. **Viewer module** `src/viewer/`: parse ID from `location.pathname` (pure, unit-tested), look up the entry, then render one of: loading, ready, load-failure, not-found. Not-found renders before any `<model-viewer>` exists, so no request is made for an unknown ID.
4. **Initial framing:** use the entry's `camera` values when present; otherwise let `<model-viewer>` auto-frame, and after the first `load` capture `getCameraOrbit()`, `getCameraTarget()` and `getFieldOfView()` as the framing. Reset always sets absolute goals from that captured framing, so it works wherever the camera is.
5. **Reset view:** set `cameraOrbit`, `cameraTarget` and `fieldOfView` to the captured goals so the library animates; after ~600 ms call `jumpCameraToGoal()` so it always lands (spec: ~400 ms glide, instant fallback). Glide speed is tuned through the library's interpolation decay during implementation.
6. **Loading and errors:** `progress` event drives a bar and `load` hides it. `error` shows a message with Retry (re-assigns `src`) and Back to Gallery.
7. **Controls overlay:** plain DOM over the viewer: back link, title, Reset view, short instructions, and an empty slot where `model-info` adds Info. Touch targets at least 44×44 px, `env(safe-area-inset-*)` padding, visible `:focus-visible`, laid out for portrait and landscape. Keep `touch-action: none` and `overscroll-behavior: none` from the spike.
8. **Config:** site name stays in one config module for reuse by Gallery.
9. **Tests:** Vitest for `validateCatalog` and the path-ID parser. Gestures verified manually on a real phone, as agreed. Playwright is added in `model-gallery`.
10. **First entry:** add the stairs Model (`id: stairs`) to the catalog, replacing the spike's hardcoded path.

## Risks / Trade-offs

- [Reset glide too slow or stalls under load] → timeout fallback to `jumpCameraToGoal()`; tune on the iPhone.
- [Captured auto-framing differs between loads] → store once per page load and prefer explicit catalog `camera` when framing looks off.
- [Gesture or overscroll conflicts on iOS Safari] → already clean on iPhone 15 Pro in the spike; re-check after controls are added.
- [Thumbnail required by validation but none exists yet] → create the stairs thumbnail as part of this change.
- [Spec wording says controls include Info, but Info ships in `model-info`] → control bar reserves an Info slot; the Info part of that requirement is met when `model-info` lands.

## Open Questions

- Exact `camera` field format and defaults can be settled during implementation.
