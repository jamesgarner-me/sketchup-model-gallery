## 1. Repository and scaffold

- [x] 1.1 `git init`, add `.gitignore`, create GitHub repo and push
- [x] 1.2 Scaffold Vite + TypeScript with `index.html` and `model.html` entry points
- [x] 1.3 Add `@google/model-viewer`
- [x] 1.4 Add `vercel.json` rewrite `/models/:id` → `/model.html`

## 2. Bare viewer with one real model

- [x] 2.1 Place the owner's GLB in `public/models/` and render it in `model.html` with camera controls and neutral background
- [x] 2.2 Confirm geometry, orientation, materials and textures render acceptably on desktop

## 3. Deploy

- [ ] 3.1 Connect the GitHub repo to Vercel with auto-deploy
- [x] 3.2 Verify `/models/anything` serves the viewer on the hosted site, including refresh

## 4. Phone validation and findings

- [ ] 4.1 Test on a real phone: orbit, pinch zoom, two-finger pan, load time, responsiveness
- [ ] 4.2 Write `docs/export-findings.md` with sizes, load times, visual notes, device and proposed performance targets and phone floor
- [ ] 4.3 Decide whether optimisation is needed; record the decision and any follow-up
