## Context

`src/viewer/main.ts` sets up one `<model-viewer>` with camera controls, `min-camera-orbit` radius 0.1 m (close zoom), the library's tap-to-set-pivot, Auto-orbit, and Reset view, which glides to a captured Initial framing.

The SketchUp exporter (SimLab) writes each saved Scene, plus `Active View`, as an empty node: no mesh and no children, a sibling of the top-level groups under `Assembly-776`. Findings from the current Bastings Garden GLB (exported 22 Nov 2026, 22:39):

- **Scenes:** six, plus `Active View`:
  - `Spring • through the driveway opening`
  - `Middle landing`
  - `Front verandah looking at drive`
  - `Driveway looking at first landing`
  - `First landing`
  - `Hovering above car`

  Node order matches the Scene order.
- **Coordinates:** Scene node transforms are in SketchUp axes (Z-up, inches). The exporter's unnamed root node carries a `matrix` that converts Z-up to Y-up, and `Assembly-776` scales by 0.0254, so applying the wrapper transforms gives glTF world metres with no extra conversion. (An earlier note here claimed a separate conversion was needed; that check had skipped the root `matrix`.) Checked against geometry:
  - The `Front verandah…` eye lands about 1.5 m above the verandah paving.
  - `Middle landing` lands over the middle landing.
- **Stairs:** the Stairs export also has seven saved Scenes (`Scene 1`–`Scene 7`), so it gets Viewpoints too.
- **Orientation:** the camera looks along the node's local **−Z**, with local +Y as up (glTF camera convention). For example, `Spring…` looks towards the house and slightly up.
- **Field of view:** none is exported.

Decisions from grilling are in proposal.md. The look-around approach is ADR 0004.

## Goals / Non-Goals

**Goals:** zero-configuration Viewpoints from the GLB, an instant cut, look-around that feels natural on touch and mouse, a clean return through Reset view, no reliance on `<model-viewer>` internals.

**Non-Goals:** runtime GLB parsing, per-Viewpoint field of view, glide transitions, Viewpoint state in history or URL, movement inside a Viewpoint.

## Decisions

1. **Extract at build time, not at runtime.**
   - A pure `extractViewpoints(gltfJson)` in `src/viewpoints.ts` reads the GLB's JSON chunk (the same approach as the Layers build check: no full parse, no three.js).
   - It finds the top-level container by descending single-child wrappers, the same rule as Layers, and takes child nodes with no `mesh` and no `children`, excluding the name `Active View`. Order is preserved.
   - For each, it composes the wrapper and node transforms and returns `{ name, eye: [x,y,z], forward: [x,y,z] }` in glTF metres, normalising the axes since parent scale is baked in.
   - A Vite plugin exposes a virtual module, `virtual:viewpoints`, mapping each Catalog entry's `id` to its Viewpoints. It reads `src/models.json` and each `public/…glb`.
   - Alternatives considered:
     - Runtime extraction from three.js `userData.name` would need ADR 0003-style internals and a loaded scene.
     - Re-fetching the GLB JSON at runtime duplicates a 25 MB download unless cached.
     - Hand-typed Catalog coordinates were rejected during grilling.
2. **Scene-node heuristic.** Treating "empty leaf node beside the top-level groups" as a Scene is specific to the exporter. An empty SketchUp group would also match, so the build logs the Viewpoints found per Model, which makes surprises visible. Scenes nested deeper are ignored.
3. **Camera mode (ADR 0004).** Entering a Viewpoint with forward `f`, eye `e` and a small radius `r` (0.01 m):
   - `camera-target` is set to `e + f·r`.
   - `camera-orbit` is set so the camera sits at `e`: theta and phi come from `−f`, and the radius is `r`.
   - min and max radius are both pinned to `r`.
   - min and max phi are 30°–150°, giving about ±60° pitch. Theta is unlimited.
   - `disable-pan`, `disable-zoom` and `disable-tap` are on.
   - `field-of-view`, `min-field-of-view` and `max-field-of-view` are all 45°. `<model-viewer>` applies this to the narrower axis, so on a portrait phone it is 45° horizontally.
   - The pitch limits widen if a Scene itself looks more steeply than ±60°, so the saved view is never clamped.
   - Camera values are written with a fixed short precision: `<model-viewer>`'s value parser misreads long decimals (`0.5235987755982988rad` became 7755982988).
   - `jumpCameraToGoal()` makes the cut instant.
   - Leaving restores the saved values in two updates: field-of-view settings first, then the orbit limits and control flags. `<model-viewer>` derives the `auto` maximum radius from the current field of view when the limits are re-applied. Restoring everything at once clamped Reset view to 45.8 m instead of Bastings Garden's 48 m. The existing Reset view path then runs.
   - All of this is isolated in a small `enterViewpoint` / `exitViewpoint` pair in `src/viewer/viewpoints.ts`.
4. **Drag direction.** At a tiny radius, plain orbit gives "turn your head". `orbit-sensitivity` is set to −1 in a Viewpoint, which gives "grab the scene" for pointer drags. Arrow keys ignore the sensitivity, but at a tiny radius they already turn the same way as an inverted drag (verified: drag left and ArrowLeft both turn the view right).
5. **Near clipping.** `<model-viewer>` sets near = far / 1000, with far twice the scene's far radius, which is about 4 cm for Bastings Garden. Screenshots from each Viewpoint confirm walls and plants about 1 m away render fully. No change needed.
6. **Auto-orbit and Reset.** `enterViewpoint` calls the existing `stopOrbit()`. Reset view first calls `exitViewpoint()`, then its current logic, which restarts the orbit where enabled. Camera-change events with source `user-interaction` inside a Viewpoint must not restart anything. The existing logic only stops the orbit, so this already holds.
7. **Drawer UI.**
   - `model.html` gets a Viewpoints button in the controls row: hidden by default, with `aria-expanded` and `aria-controls`.
   - It also gets an `<aside aria-label="Viewpoints">` with a heading, a close button and a list of `<button>` rows (44 px targets), each with `aria-pressed` for the current Viewpoint.
   - The drawer slides in from the right with `transform`, honouring reduced motion. Width is `min(360px, 85vw)`. It respects safe areas.
   - Non-modal: the Model stays visible, and tapping a row selects that Viewpoint and closes the drawer.
   - Escape and close return focus to the button. The drawer doesn't affect history.
   - The dark-theme rules from `[data-theme=dark]` extend to it.
8. **Coexistence with Layers.** Whichever of `model-layers` and this change lands second adds a small "one panel at a time" rule: opening one closes the other.
9. **Models.** No Catalog change. Bastings Garden's six Scenes and Stairs' seven appear automatically.
10. **Tests.**
    - Vitest for `extractViewpoints` against a fake glTF JSON: wrappers, scale, Z-up conversion, `Active View` exclusion, order, and "no Scenes".
    - Vitest for the forward → orbit/target maths.
    - Playwright checks:
      - The button and drawer list on Bastings Garden; Auto-orbit stops and restarts on Stairs.
      - The drawer opens, closes with Escape and returns focus.
      - Selecting a Viewpoint closes the drawer, sets `camera-target` near the expected eye, and turns Auto-orbit off.
      - A drag changes the orbit theta but not the target.
      - Wheel and pinch don't change the radius.
      - Reset view restores Initial framing and controls.

## Risks / Trade-offs

- [Exporter changes the Scene-node convention] → unit test pins the expected shape. The build log lists Viewpoints found, and the smoke test asserts Bastings Garden has six.
- [Empty SketchUp groups mistaken for Scenes] → visible in the build log and the drawer. The owner deletes or fills the group.
- [Near plane clips nearby geometry] → Decision 5. The accepted fallback is documented.
- [Negative orbit sensitivity unsupported] → fall back to inverted deltas (Decision 4).
- [Orbit at a tiny radius drifts or jitters] → radius is pinned by min/max. If the library still interpolates the radius, use the smallest stable value (0.01–0.05 m).
- [Scene names with odd characters] → names come from the GLB JSON (not three.js-sanitised) and are rendered as text, not HTML.
- [Reset glide from inside the Model passes through geometry] → accepted, as it is short and expected.

## Migration Plan

Additive. Re-export Bastings Garden (done 22:39). Rollback: revert the change. No Catalog data to migrate.

## Open Questions

- Is the 0.01 m radius stable on a range of real devices? It is stable in desktop and phone emulation.
