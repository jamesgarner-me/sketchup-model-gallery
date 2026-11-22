## 1. Zoom

- [ ] 1.1 Set `min-camera-orbit` radius to 0.1 m on every Model
- [ ] 1.2 Verify tap-to-pivot works (tap moves pivot, background tap does not) and Reset view restores the original pivot; add code only if needed

## 2. Colour

- [ ] 2.1 Material correction on load: metallic 0 for every material via the public API
- [ ] 2.2 Generalise the environment generator; add the Daylight light set; generate `daylight.hdr` (under 300 KB) and confirm `showroom.hdr` is unchanged
- [ ] 2.3 Neutral preset: daylight environment and linear tone mapping; tune exposure and shadow against the SketchUp screenshot
- [ ] 2.4 Re-screenshot stairs on Showroom; retune only if the material fix changed its look for the worse

## 3. Verify

- [ ] 3.1 Before/after screenshots of both Models at the owner's angle
- [ ] 3.2 Smoke-test step: zoom Bastings Garden below 1 m from the pivot; a material reports metallic 0; run unit, smoke tests and build
- [ ] 3.3 Update README (`make:env` now writes both lighting images)
- [ ] 3.4 Deploy and run smoke tests on the hosted site
- [ ] 3.5 Manual check on iPhone: zoom close after tapping a point, colours compared with SketchUp
