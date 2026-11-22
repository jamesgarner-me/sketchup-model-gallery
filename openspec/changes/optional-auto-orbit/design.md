## Context

The Viewer (`src/viewer/main.ts`) creates `<model-viewer>`, captures Initial framing on `load`, implements Reset view with absolute camera goals, and hosts the Info `<dialog>` in `setupInfo`. `<model-viewer>` provides `auto-rotate`, `rotation-per-second`, `auto-rotate-delay`, `resetTurntableRotation()` and a `camera-change` event whose `detail.source` is `user-interaction` for visitor input. Auto-rotate turns the model (turntable), not the camera. See proposal.md and the delta specs.

## Goals / Non-Goals

**Goals:** opt-in Auto-orbit per Model that never fights the visitor.

**Non-Goals:** other first-load behaviours (camera fly-ins, tours); per-Model start delay.

## Decisions

1. **Resolution:** pure `resolveAutoOrbit(setting, prefersReducedMotion)` in `src/autoOrbit.ts` returns degrees per second or `undefined`. `true` → 18, `{ degreesPerSecond: n }` → n, anything falsy or reduced motion → `undefined`. Unit-tested.
2. **Applying:** when a speed resolves, set `auto-rotate`, `rotation-per-second="<n>deg"` and `interaction-prompt="none"`. Library default `auto-rotate-delay` is irrelevant because we switch auto-rotate off on first interaction.
3. **Stop for good:** listen to `camera-change`; on the first event with `source === 'user-interaction'`, set a `stopped` flag and `autoRotate = false`.
4. **Reset view:** additionally sets `stopped`, `autoRotate = false` and calls `resetTurntableRotation()` before applying the captured camera goals, so the Model ends exactly at Initial framing.
5. **Info pause:** `setupInfo` gains `onOpen`/`onClose` hooks. Open pauses (`autoRotate = false`); the dialog's `close` event resumes unless `stopped`.
6. **Validation:** `validateCatalog` rejects an `autoOrbit` that is not a boolean or an object with a finite, non-zero `degreesPerSecond`.
7. **Catalog:** stairs gets `"autoOrbit": true`.

## Risks / Trade-offs

- [`camera-change` with `user-interaction` might also fire from keyboard camera controls] → desired: keyboard use is visitor control too.
- [Turntable reset is instant while the camera glides] → acceptable; the Model is centred, so the jump is barely visible during the glide.
- [Auto-orbit while Reset's glide fallback timer runs] → Reset stops orbit first, so no interference.
