## Context

The stairs GLB (SimLab SketchUp export) has one root assembly node with 20 children: 8 empty Scene nodes (Viewpoints, including Active View) and 12 top-level groups (walls, centre newel, upper and lower stringers, AllStairs, plasterboard, upper floor wall, balusters). AllStairs holds UpperFlight, LowerFlight, Winders and WinderFraming; most other groups hold a few parts. There are 70 meshes. `<model-viewer>` has no public API for moving nodes; ADR 0003 (written for Layers, not built yet) accepts reaching its internal three.js scene through the private `scene` symbol.

## Goals / Non-Goals

**Goals:** a quick, honest test of whether exploding the stairs is useful; both Groups and Nested modes to compare; camera stays fully free at any explode amount.

**Non-Goals:** Catalog field, build validation, Model kinds, per-Model tuning, explode on other Models, polished UI, auto-zoom to fit the exploded Model, animated transitions beyond following the slider.

## Decisions

1. **Gating:** a hard-coded spike list (`['stairs']`) plus the `explode` query flag. No Catalog field until the idea is proven.
2. **Finding parts:** from the loaded model root, descend through single-child wrappers to the first node with several children; its children with geometry are the top-level parts (empty Scene/Viewpoint nodes are skipped). For Nested, each part's children with geometry are sub-parts. Isolate scene access in `src/viewer/explode.ts` and throw a clear error if the internal symbol or shape is missing.
3. **Offsets (pure, `src/explode.ts`):** at load, record each part's rest position and world-space bounding-box centre, plus the Model's centre C and bounding radius R. Direction = normalised (part centre − C), or straight up if the part sits on C.
   - Groups: offset = t × 0.75R × direction, for slider t ∈ [0, 1].
   - Nested: top-level offset uses t₁ = min(1, 2t); sub-part offset = t₂ × 0.35R × (direction from its group's centre), with t₂ = max(0, 2t − 1).
   - World offsets are converted to each node's parent space (inverse of the parent's world rotation and scale) and added to the rest position, so t = 0 restores the exact original transforms.
4. **Rendering:** after moving nodes, ask `<model-viewer>` to redraw (its scene's render queue or `needsRender`). Framing, Initial framing and the zoom limits stay as captured at load; the camera is never touched.
5. **UI:** a native range input (0–1000) and a two-state mode button in a row above Reset view and Info, up to about 360 px wide with a large thumb. It sits outside the `<model-viewer>` element, so slider drags never reach camera controls, and `input` events don't produce `camera-change`, so Auto-orbit keeps going. Dark-Stage styling follows the existing button theme.
6. **Reset view and Viewpoints:** no changes; Reset is camera-only and the slider works inside a Viewpoint.

## Risks / Trade-offs

- [Contact shadow is computed for the assembled bounds] → acceptable for the spike; note how it looks.
- [Exploded parts leave the frame or pass through a Viewpoint's eye] → visitors can zoom out; record if it's a real problem.
- [Library internals change] → isolated module with a clear error; the e2e test catches it.
- [Radial directions look arbitrary for long thin parts such as stringers] → this is exactly what the spike is judging.

## Open Questions

- Is either mode useful, and which? Is 0.75R the right reach?
- If productised: Catalog field shape (per-Model on/off, mode, reach), and whether Model kinds (**Site design**, **Build detail**) should drive it.

## Findings

To be filled in after the iPhone check.
