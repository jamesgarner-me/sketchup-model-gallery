## 1. Lift

- [x] 1.1 Add `INITIAL_LIFT = 0.10`; on `load`, when `entry.camera?.target` is unset, lower the camera target Y by the computed amount and `jumpCameraToGoal()` before capturing `framing`
- [x] 1.2 Confirm Reset view returns to the lifted framing and Auto-orbit still orbits in place

## 2. Verify

- [x] 2.1 e2e: on phone and desktop, Model centre sits about 10% of viewport height above centre on load and after Reset; catalog target skips the lift
- [x] 2.2 README: note that a catalog `camera.target` opts out of the lift
- [x] 2.3 Run locally for visual check
