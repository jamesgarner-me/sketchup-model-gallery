## Context

The stairs GLB (SimLab SketchUp export) has one root assembly node with 20 children: 8 empty Scene nodes (Viewpoints, including Active View) and 12 top-level groups (walls, centre newel, upper and lower stringers, AllStairs, plasterboard, upper floor wall, balusters). AllStairs holds UpperFlight, LowerFlight, Winders and WinderFraming; most other groups hold a few parts. There are 70 meshes. `<model-viewer>` has no public API for moving nodes; ADR 0003 accepts reaching its internal three.js scene through the private `scene` symbol; Layers (now on `main`) does this only in `src/viewer/sceneAccess.ts`. Layers shows and hides the 12 stairs groups; five (four walls and the plaster sheeting) start hidden.

## Goals / Non-Goals

**Goals:** a quick, honest test of whether exploding the stairs is useful; both Groups and Nested modes to compare; camera stays fully free at any explode amount.

**Non-Goals:** Catalog field, build validation, Model kinds, per-Model tuning, explode on other Models, polished UI, auto-zoom to fit the exploded Model, animated transitions beyond following the slider.

## Decisions

1. **Gating:** a hard-coded spike list (`['stairs']`) plus the `explode` query flag. No Catalog field until the idea is proven.
2. **Finding parts:** extend `sceneAccess.ts` (the only module touching internals) to return the top-level groups (descend single-child wrappers; children with geometry, skipping empty Viewpoint nodes) with their positions, parents and world bounds. For Nested, each group's children with geometry are sub-parts. The spike's own scene lookup is removed. A clear error hides the explode row if internals change.
2a. **Visible only:** a group explodes if it is currently shown (`visible`), whether or not it is a Catalog Layer. Centre C and radius R come from the union of the visible groups' bounds. Hidden groups are put back at rest.
2b. **Layers interplay:** Layers notifies explode when visibility changes (a small event or callback); explode recomputes C, R and directions and re-applies the current slider value immediately. Reset view stays camera-only.
2c. **Single visible group:** when exactly one group is visible, its geometry children become the parts in both modes (C and R from that group), so hiding all Layers but one explodes within it. Nested then has no further level; it behaves like Groups.
3. **Offsets (pure, `src/explode.ts`):** at load, record each part's rest position and world-space bounding-box centre, plus the Model's centre C and bounding radius R. Direction = normalised (part centre − C), or straight up if the part sits on C.
   - Groups: offset = t × 0.75R × direction, for slider t ∈ [0, 1].
   - Nested: top-level offset uses t₁ = min(1, 2t); sub-part offset = t₂ × 0.35R × (direction from its group's centre), with t₂ = max(0, 2t − 1).
   - World offsets are converted to each node's parent space (inverse of the parent's world rotation and scale) and added to the rest position, so t = 0 restores the exact original transforms.
4. **Rendering:** after moving nodes, ask `<model-viewer>` to redraw (its scene's render queue or `needsRender`). Framing, Initial framing and the zoom limits stay as captured at load; the camera is never touched.
5. **UI:** a native range input (0–1000) and a two-state mode button in a row above Reset view, Viewpoints and Layers (Info is now top right), up to about 360 px wide with a large thumb. It sits outside the `<model-viewer>` element, so slider drags never reach camera controls, and `input` events don't produce `camera-change`, so Auto-orbit keeps going. Dark-Stage styling follows the existing button theme. On narrow screens the Layers bottom sheet's bottom offset is the whole controls footer's height (measured, not the fixed 44px row), so the slider stays usable with Layers open; the stage-shrink logic follows the sheet as now.
6. **Reset view and Viewpoints:** no changes; Reset is camera-only and the slider works inside a Viewpoint.

## Risks / Trade-offs

- [Contact shadow is computed for the assembled bounds] → acceptable for the spike; note how it looks.
- [Exploded parts leave the frame or pass through a Viewpoint's eye] → visitors can zoom out; record if it's a real problem.
- [Library internals change] → isolated module with a clear error; the e2e test catches it.
- [Recomputing C and R on each Layer toggle makes visible groups jump] → intended; judge on iPhone.
- [Radial directions look arbitrary for long thin parts such as stringers] → this is exactly what the spike is judging.

## Open Questions

- Is either mode useful, and which? Is 0.75R the right reach?
- If productised: Catalog field shape (per-Model on/off, mode, reach), and whether Model kinds (**Site design**, **Build detail**) should drive it.

## Findings

- 2026-11-23, first iPhone check: "a good start". The effect is worth pursuing (not dropped).
- Wanted next: explode relative to visible groups, i.e. only the groups currently shown, or within a chosen Layer or group. Depends on the parallel `model-layers` change (show and hide top-level groups).
- Status: `model-layers` merged to `main` on 2026-11-23. Plan updated for visible-only explode (decisions 2a–2c, 5); next is rebase and build. The spike branch `explode-spike` is kept, not deployed.
