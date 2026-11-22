# SketchUp Model Gallery

A small public website for browsing SketchUp models in 3D. Visitors pick a model from the Gallery, then orbit, pinch-zoom and pan it on a phone or desktop. Each model has an **Info** overlay with a description and Markdown notes.

**Live site:** https://sketchup-model-gallery.vercel.app

Built with Vite, TypeScript and Google's [`<model-viewer>`](https://modelviewer.dev/), hosted on Vercel. There is no backend: models, thumbnails and notes are files in this repo.

## Adding a new model

1. **Export from SketchUp** as glTF binary (`.glb`). See [SketchUp: exporting GLB files](https://help.sketchup.com/en/sketchup/working-gltf-files). Aim for under about 10 MB; large PNG textures are usually the biggest cost (see [export findings](docs/export-findings.md)).
2. **Add the model file** to `public/models/`, e.g. `public/models/garden-shed.glb`.
3. **Add a thumbnail** to `public/thumbnails/`, e.g. `public/thumbnails/garden-shed.webp`. A 4:3 image works best; a screenshot of the model in the local viewer is fine.
4. **Add notes (optional)** as `src/content/<id>.md`, e.g. `src/content/garden-shed.md`. Supported Markdown: headings, paragraphs, lists, bold, italic and links. Images, tables and raw HTML are not supported (HTML is shown as plain text). No notes file means Info shows the description only.
5. **Add a catalog entry** to `src/models.json` (fields below):
   ```json
   {
     "id": "garden-shed",
     "title": "Garden shed",
     "description": "Timber shed with a skillion roof.",
     "glb": "/models/garden-shed.glb",
     "thumbnail": "/thumbnails/garden-shed.webp",
     "order": 2
   }
   ```
6. **Check it locally:** `npm run dev`, then open http://localhost:5173/ and http://localhost:5173/models/garden-shed.
7. **Validate:** `npm run build`. The build fails with a clear message on a duplicate ID, a missing GLB or thumbnail, an unknown stage, or an invalid `autoOrbit`.
8. **Publish:** commit and push to `main`. Vercel deploys automatically; the model is live at `/models/<id>`.

## Catalog fields (`src/models.json`)

| Field | Required | Description |
|---|---|---|
| `id` | Yes | Unique, stable ID used in the URL `/models/<id>`. Use lowercase with hyphens. |
| `title` | Yes | Shown on the Gallery card, in the Viewer and in Info. |
| `description` | Yes | Short summary for the Gallery card and the top of Info. |
| `glb` | Yes | Path under `public/`, e.g. `/models/garden-shed.glb`. |
| `thumbnail` | Yes | Path under `public/`, e.g. `/thumbnails/garden-shed.webp`. |
| `order` | Yes | Gallery position; lower numbers come first. |
| `notes` | No | Notes filename in `src/content/`. Defaults to `<id>.md`. |
| `camera` | No | Initial framing when automatic framing isn't right: `{ "orbit": "30deg 70deg auto", "target": "auto auto auto", "fieldOfView": "30deg" }` (any subset). |
| `stage` | No | Background and lighting: `"neutral"` (default, light) or `"showroom"` (dark room with several lights). |
| `autoOrbit` | No | Slow turntable rotation on load: `true` (18°/s) or `{ "degreesPerSecond": 10 }` (negative reverses). Stops on the visitor's first touch; Reset view restarts it. Off when the device prefers reduced motion. |

Example with every optional field (illustrative; the real stairs entry only sets `stage` and `autoOrbit`):

```json
{
  "id": "stairs",
  "title": "Stairs design",
  "description": "Staircase design, version 1.",
  "glb": "/models/stairs-james-design-v1-backup.glb",
  "thumbnail": "/thumbnails/stairs.webp",
  "order": 1,
  "notes": "stairs.md",
  "camera": { "orbit": "0deg 75deg auto" },
  "stage": "showroom",
  "autoOrbit": true
}
```

## Development

Requires Node.js 22.

| Command | What it does |
|---|---|
| `npm install` | Install dependencies. |
| `npm run dev` | Local dev server at http://localhost:5173. |
| `npm run build` | Validate the catalog, type-check and build to `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Unit tests (Vitest). |
| `npm run test:e2e` | Playwright smoke tests on desktop and phone sizes. First time: `npx playwright install chromium`. Run against the live site with `BASE_URL=https://sketchup-model-gallery.vercel.app npm run test:e2e`. |
| `npm run validate` | Catalog validation only. |
| `npm run make:env` | Regenerate the Showroom lighting image (`public/environments/showroom.hdr`) after editing the light list in `scripts/make-showroom-env.ts`. |

The site name lives in `src/config.ts`.

## Project layout

```text
index.html, model.html   Gallery page and Viewer page
src/
  models.json            The catalog
  content/               Notes, one Markdown file per model
  gallery/               Gallery page
  viewer/                Viewer page: camera, Reset view, Info overlay
  stages.ts              Stage presets (neutral, showroom)
  autoOrbit.ts           Auto-orbit settings
  markdown.ts, notes.ts  Notes rendering (at build time)
  validateCatalog.ts     Catalog checks used by the build
public/
  models/                GLB files
  thumbnails/            Gallery images
  environments/          Generated Showroom lighting
scripts/                 Catalog validation and Showroom lighting generator
tests/                   Playwright smoke tests
vercel.json              Rewrite /models/:id to the Viewer page
```

## Deployment

The GitHub repo is connected to Vercel. Every push to `main` deploys to production at https://sketchup-model-gallery.vercel.app. `vercel.json` rewrites `/models/<id>` to `model.html`, so direct links and refreshes work.

## How changes are planned

Changes go through [OpenSpec](https://github.com/Fission-AI/OpenSpec) using the `/opsx:*` commands in Claude Code:

1. `/opsx:propose <idea>`: interview to sharpen the idea (updating the glossary and ADRs), then write the proposal, specs, design and tasks.
2. `/opsx:apply <change>`: build it and tick off tasks.
3. `/opsx:archive <change>`: merge its specs into `openspec/specs/` and archive it.

`/opsx:update` revises a planned change; `/opsx:sync` merges specs without archiving.

Reference material:

- [docs/PRD.md](docs/PRD.md): original product requirements.
- [CONTEXT.md](CONTEXT.md): glossary (Model, Catalog, Stage, Auto-orbit and so on).
- [docs/adr/](docs/adr/): architecture decisions.
- [openspec/specs/](openspec/specs/): current behaviour specs.
- [docs/export-findings.md](docs/export-findings.md): results of validating the first SketchUp export.

## Known limits

- **Camera controls are gestures plus Reset view only.** Touch users who can't do multi-finger gestures have no single-pointer zoom or pan. No WCAG conformance is claimed. See [ADR 0001](docs/adr/0001-accept-reset-only-camera-controls.md).
- **Showroom lights are image-based.** They light the model and show in reflections, but cast no visible beams or hard spotlight shadows. See [ADR 0002](docs/adr/0002-image-based-lighting-for-stages.md).
- **The stairs export uses a deprecated glTF material extension** (`KHR_materials_pbrSpecularGlossiness`). It works today; re-export if a library upgrade breaks it. See [export findings](docs/export-findings.md).
- **Model files are public.** Anyone can download a GLB from the live site.
