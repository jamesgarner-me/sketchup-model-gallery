## 1. Build

- [x] 1.1 `src/explode.ts`: pure offset maths for Groups and Nested modes (direction, reach, staging, parent-space conversion) with unit tests, including t = 0 restores rest positions
- [x] 1.2 `src/viewer/explode.ts`: find top-level parts and sub-parts in the internal scene (skip empty Viewpoint nodes), record rest state at load, apply offsets and request a redraw; clear error if internals are missing
- [x] 1.3 Slider and mode toggle in `model.html` and `viewer.css` (finger-sized, dark-Stage styling); shown only on the stairs with `?explode`; wire into `src/viewer/main.ts`

## 2. Verify

- [x] 2.1 Playwright: no slider without the flag or on Bastings Garden; with the flag, moving the slider moves parts and back to 0 restores them; the slider doesn't change the camera orbit; camera orbit still changes by drag at full explode; Reset view keeps the explode amount
- [x] 2.2 Run unit and all e2e tests and the build
- [ ] 2.3 Deploy and run e2e tests on the hosted site
- [ ] 2.4 iPhone check at `/models/stairs?explode`: try both modes; record findings and the decision (productise, tweak or drop) in `design.md`
