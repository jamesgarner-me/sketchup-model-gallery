## 1. Build

- [x] 1.1 `src/explode.ts`: pure offset maths for Groups and Nested modes (direction, reach, staging, parent-space conversion) with unit tests, including t = 0 restores rest positions
- [x] 1.2 `src/viewer/explode.ts`: find top-level parts and sub-parts in the internal scene (skip empty Viewpoint nodes), record rest state at load, apply offsets and request a redraw; clear error if internals are missing
- [x] 1.3 Slider and mode toggle in `model.html` and `viewer.css` (finger-sized, dark-Stage styling); shown only on the stairs with `?explode`; wire into `src/viewer/main.ts`

## 2. Verify

- [x] 2.1 Playwright: no slider without the flag or on Bastings Garden; with the flag, moving the slider moves parts and back to 0 restores them; the slider doesn't change the camera orbit; camera orbit still changes by drag at full explode; Reset view keeps the explode amount
- [x] 2.2 Run unit and all e2e tests and the build
- [ ] 2.3 Deploy and run e2e tests on the hosted site
- [ ] 2.4 iPhone check at `/models/stairs?explode`: try both modes; record findings and the decision (productise, tweak or drop) in `design.md`

## 3. Visible Layers (after model-layers)

- [x] 3.1 Rebase `explode-spike` onto `main`; resolve conflicts in `model.html`, `main.ts`, `viewer.css`, `CONTEXT.md`; all tests and the build pass
- [x] 3.2 Move scene access into `sceneAccess.ts` (top-level groups, sub-parts, positions, world bounds, render); remove the spike's own lookup
- [x] 3.3 `src/explode.ts`: C and R from visible groups only; single-visible-group case uses its parts; unit tests
- [x] 3.4 Hidden groups stay at rest; Layers visibility changes and Restore defaults re-apply the current slider value immediately
- [x] 3.5 Phone layout: Layers bottom sheet sits above the whole controls footer, including the explode row
- [x] 3.6 Playwright: only visible groups move; toggling a Layer while exploded re-spreads and returns hidden ones to rest; single visible group spreads its parts; slider usable with the Layers sheet open on Pixel 7; camera unchanged
- [ ] 3.7 Run unit and all e2e tests and the build; iPhone check at `/models/stairs?explode` with Layers; record findings and the decision
