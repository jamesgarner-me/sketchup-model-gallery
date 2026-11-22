## 1. Catalog, matching and validation

- [ ] 1.1 Add `layers` to the Catalog type; pure helpers in `src/layers.ts`: default resolution, `sanitizeNodeName`, top-level group extraction from glTF JSON
- [ ] 1.2 Vitest tests for those helpers (wrapper unwrapping, sanitisation, defaults)
- [ ] 1.3 Extend `validateCatalog` with Layer checks (malformed, duplicate, not found) via a `groupsFor` input; Vitest tests
- [ ] 1.4 GLB JSON-chunk reader in the build script feeding `groupsFor`; confirm the eleven Bastings Garden groups are found

## 2. Viewer

- [ ] 2.1 `src/viewer/sceneAccess.ts`: find internal scene, verify shape, expose top-level groups and render request; clear error path that hides the Layers button
- [ ] 2.2 Apply default visibility after load; toggle groups and refresh render (and shadow if available)
- [ ] 2.3 Layers button and panel markup, bottom sheet / side panel styles, dark-theme styles
- [ ] 2.4 Panel behaviour: open/close via button, close button and Escape; focus return; Restore defaults
- [ ] 2.5 Add the eleven Bastings Garden Layers to the Catalog (10 and 11 off)

## 3. Verify

- [ ] 3.1 Browser checks: defaults on load; toggle hides/shows without camera movement; Restore defaults; Reset view keeps Layers; Auto-orbit continues; no Layers button on stairs; build fails on a misspelt Layer
- [ ] 3.2 Screenshots on phone and desktop, light and dark Stage; check ground shadow after hiding Layers
- [ ] 3.3 Smoke test step toggling a Bastings Garden Layer; run unit and smoke tests and build
- [ ] 3.4 Update README catalog field table and example
- [ ] 3.5 Deploy and run smoke tests on the hosted site
- [ ] 3.6 Manual check on iPhone
