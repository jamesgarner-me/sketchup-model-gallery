## 1. Catalog and resolution

- [x] 1.1 Add `autoOrbit?: boolean | { degreesPerSecond: number }` to the Catalog type
- [x] 1.2 Implement pure `resolveAutoOrbit(setting, prefersReducedMotion)` with Vitest tests (true, object, negative, false/absent, reduced motion)
- [x] 1.3 Extend `validateCatalog` to reject invalid `autoOrbit` values; Vitest tests

## 2. Viewer behaviour

- [x] 2.1 Apply Auto-orbit on load: `auto-rotate`, `rotation-per-second`, `interaction-prompt="none"`; honour reduced motion
- [x] 2.2 Stop for good on first `camera-change` with `user-interaction` source
- [x] 2.3 Reset view stops Auto-orbit and calls `resetTurntableRotation()`
- [x] 2.4 Pause while Info is open; resume on close unless stopped
- [x] 2.5 Enable Auto-orbit for stairs in the Catalog

## 3. Verify

- [x] 3.1 Browser script: orbits on load; drag stops it permanently; Reset returns to Initial framing with zero turntable rotation; Info pauses and resumes; reduced motion stays still; neutral Model does not rotate
- [x] 3.2 Update smoke test for the orbiting stairs; run unit, smoke tests and build
- [ ] 3.3 Deploy and run smoke tests on the hosted site
- [ ] 3.4 Manual check on iPhone
