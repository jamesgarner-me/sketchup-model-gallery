## Context

Viewer, Info and Gallery are live. The Viewer currently hardcodes neutral styling (`viewer.css`) and `shadow-intensity`/`exposure` attributes in `src/viewer/main.ts`. Decisions from grilling: named presets, image-based lighting (ADR 0002), CSS room cues, dark controls, generated environment image under 1 MB. See proposal.md and the delta specs.

## Goals / Non-Goals

**Goals:** Stage presets applied from the Catalog; a convincing Showroom look; zero cost for Neutral Models.

**Non-Goals:** real spotlights, per-Model custom lighting values, Gallery styling, 3D floors or plinths.

## Decisions

1. **`src/stages.ts`:** a pure, DOM-free map of Stage name → `{ theme: 'light' | 'dark', environmentImage?, exposure, shadowIntensity, shadowSoftness, toneMapping }` plus `STAGE_NAMES`. Used by the Viewer and by validation. Neutral reproduces today's values exactly.
2. **Applying a Stage:** the Viewer sets `data-stage` and `data-theme` on `.viewer` and the preset's attributes on `<model-viewer>`. `environment-image` is only set for Stages that have one, so Neutral never fetches it.
3. **Background:** CSS on `.viewer[data-stage="showroom"]`: a radial floor glow under centre-bottom fading to near-black, plus an inset vignette. `<model-viewer>` background is transparent on this Stage so the CSS shows through. The environment image lights but is not displayed (no `skybox-image`).
4. **Environment image:** `scripts/make-showroom-env.ts` writes `public/environments/showroom.hdr`, an uncompressed Radiance RGBE equirectangular image (512×256 ≈ 0.5 MB), using four soft rectangular light panels (key front-top-left, fill right, rim behind, overhead) on a near-black base. Light list lives at the top of the script for tuning. The generated file is committed. Alternative: a downloaded CC0 HDR; rejected (not dark enough, less controllable).
5. **Dark controls:** `[data-theme="dark"]` overrides for `.btn`, title, loading bar and `.state` within `.viewer`. The Info `<dialog>` sits outside `.viewer`, so it keeps the light style untouched. "Model not found" never gets a Stage, so it stays light.
6. **Validation:** `validateCatalog` takes the list of known Stage names; unknown names produce an error naming entry and Stage.
7. **Tuning:** lights, exposure and tone mapping tuned by eye on the stairs via headless screenshots, then confirmed on the iPhone.

## Risks / Trade-offs

- [Generated lighting looks flat or harsh] → tunable light list and exposure; iterate with screenshots.
- [Equirect orientation differs from expectation] → verify light directions visually and adjust.
- [Contrast of dark controls] → light text on dark translucent buttons, focus ring kept.
- [Thumbnail no longer matches the dark look] → accepted; thumbnails are manual.
