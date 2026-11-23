## Context

The Viewer (`src/viewer/main.ts`) creates one `<model-viewer>` per page, applies the Stage, Auto-orbit and camera settings from the Catalog, and has Reset view and an Info `<dialog>`. `<model-viewer>` exposes no public API for part visibility; its scene-graph API covers materials and variants only. Internally it holds a three.js `Scene` subclass under a private `Symbol('scene')`. SketchUp exports (SimLab glTF exporter) keep group names as node names. In Bastings Garden the tree is: unnamed root → `Assembly-776` → the eleven numbered groups plus camera nodes (`Active View`, SketchUp scene names). Decisions from grilling are in proposal.md; the access approach is ADR 0003.

## Goals / Non-Goals

**Goals:** catalog-driven Layers, reliable toggling, a build check that ties Layer names to the GLB, contained reliance on library internals.

**Non-Goals:** automatic discovery of groups, nested Layers, either/or Layer sets, Layer state in the URL, SketchUp Tags, saved views from SketchUp scenes.

## Decisions

1. **Catalog shape:** `layers?: { group: string; label?: string; visible?: boolean }[]`. `group` is the exact SketchUp group name as exported (e.g. `"01  Street, crossover and driveway"`, two spaces included); `label` defaults to `group`; `visible` defaults to `true`. Order in the array is panel order.
2. **"Top-level group":** starting from the scene's root nodes, descend while there is exactly one node (unwrapping wrapper nodes such as the unnamed root and `Assembly-776`); the named nodes at the first level with more than one node are the top-level groups. The same rule is used by the build check and the viewer so they agree.
3. **Build check:** `scripts/validate-catalog.ts` reads each GLB's JSON chunk (no full parse, no three.js) to list top-level group names, and `validateCatalog` gains a `groupsFor(entry)` input. Errors name the entry and Layer for: malformed Layer, duplicate `group` within an entry, `group` not found.
4. **Name matching at runtime:** three.js's glTF loader sanitises node names (whitespace → `_`, removes `[ ] . : /`). A pure `sanitizeNodeName` in `src/layers.ts` mirrors that rule, and lookups happen among the top-level groups found by Decision 2, not by global name search, so a duplicate name deeper in the tree can't be picked up.
5. **Scene access (ADR 0003):** `src/viewer/sceneAccess.ts` is the only code that touches internals: finds the symbol by description `scene`, checks the object looks like a three.js scene (`children`, `traverse`), and exposes `getTopLevelGroups()` and `requestRender()`. If anything is missing it throws a clear error; the viewer then hides the Layers button and logs it, so the Model still works.
6. **Toggling:** set `object.visible` on the matched group, then request a render (and refresh the ground shadow if the scene exposes it). Defaults are applied once after `load`, before the first interaction.
7. **Panel UI:** `model.html` gets a Layers button in the controls row and a non-modal `<section aria-label="Layers">` containing a heading, close button, a list of `<label><input type=checkbox>` rows (44 px targets) and a "Restore defaults" button. The Layers button has `aria-expanded`/`aria-controls`. Bottom sheet below 640 px wide (max 50% height, scrolls), right-side panel otherwise. Escape and the close button close it and return focus to the Layers button. Dark-theme rules extend to it.
8. **Interactions:** the panel is not full-screen, so it does not pause Auto-orbit and toggling does not emit camera changes; Reset view is untouched. The Info dialog and the Layers panel are independent; opening Info leaves the panel's state as it was.
9. **Catalog for Bastings Garden:** all eleven groups in their numbered order, labels with the number prefix and "• toggle" suffix removed, 10 and 11 `"visible": false`.
10. **Tests:** Vitest for top-level group extraction from a fake glTF JSON, `sanitizeNodeName`, Layer validation and default resolution. Browser checks for defaults, toggling, Restore defaults, Reset view independence and Auto-orbit independence. A smoke test step on Bastings Garden that toggles a Layer and asserts the group's visibility via the scene, which fails loudly if the internals change.

## Risks / Trade-offs

- [Library upgrade changes internals] → isolated module, clear error, Layers button hidden instead of a broken page, smoke test catches it.
- [Sanitisation rule changes in three.js] → matching is covered by a smoke test against the real GLB.
- [Ground shadow still shows hidden parts] → request a shadow refresh after toggling; verify visually; accept if the library gives no hook and note it.
- [Future compression merges groups] → build check fails with the Layer name, pointing at the cause.
- [Group renamed in SketchUp] → build fails naming the Layer; owner updates the Catalog.
- [Panel covers part of the Model on phones] → bottom sheet capped at half height; the Model stays interactive above it.

## Implementation notes

Added during apply. The plan predates Viewpoints, so these reconcile the two:

- **One side panel at a time.** On wide screens the Layers panel and the Viewpoints drawer both use the right edge. Opening either one closes the other.
- **Bottom sheet sits above the controls row**, not over it, so Layers (to close), Reset view, Viewpoints and Info stay reachable on phones.
- **Controls row compacts below 480 px**: smaller gaps and padding, wrapping as a fallback, so four buttons fit on a phone. `.btn[hidden]` is now actually hidden; `.btn`'s `display` was overriding the attribute.
- **Runtime lookup**: `<model-viewer>` adds its own wrapper objects above the glTF root, so the viewer doesn't replay Decision 2's unwrapping. It takes the shallowest object (breadth-first) whose children include the Layer names. That gives the same top-level groups and still ignores same-named nodes deeper down.
- **Ground shadow** follows hidden groups (`updateShadow()` + `queueRender()`), checked by screenshot.
- **Framing above the sheet**: on narrow screens, while the sheet is open, the 3D view shrinks to the area above it. `<model-viewer>` re-fits the Model to the smaller view at the same orbit, so the Model stays in sight. Closing the sheet restores full height.
