# SketchUp Model Gallery — MVP PRD

**Status:** Planning snapshot; implementation has not started.  
**Updated:** 22 November 2026, Australia/Melbourne.  
**Purpose:** Preserve the product requirements, decisions, proposed implementation, assumptions, and outstanding questions from the planning conversation.

## 1. Product summary

Build a small website, deployable on Vercel, where visitors browse a collection of SketchUp models and open an interactive 3D view of each model. The experience must work well on mobile touchscreens and remain simple on desktop.

Each model has a description and additional notes. A persistent Info button opens a full-screen information view showing the description followed by notes rendered from Markdown maintained in source control.

Visitors interact through orbit, pan, and zoom gestures. Reset view is the only explicit camera-control button in the MVP. It must remain available when visitors move the camera away from the model.

## 2. Problem and goals

The owner needs a straightforward way to publish multiple SketchUp models for browser-based viewing, without requiring visitors to install SketchUp. Visitors should be able to find a model, inspect it intuitively, and read its supporting information.

The principal usability concern is losing the model through panning or zooming into empty background. A reliable reset action is the agreed MVP response.

### Goals

- Browse available models from a landing page.
- View real 3D geometry with orbit, pan, and zoom.
- Make mobile touchscreen use a first-class requirement.
- Recover the initial camera framing with one obvious action.
- Read model descriptions and formatted notes without leaving the site.
- Publish models and notes through a small, source-controlled project.
- Keep implementation and Vercel deployment simple.

### Success definition

A visitor can open the public site on a phone, choose a model, manipulate its view, recover after losing its position, read its information, and return to browsing. The owner can publish another model through files and catalog data without changing viewer logic.

## 3. Confirmed decisions

- **Source material:** The owner has SketchUp `.skp` models that can be exported to `.glb`. This is not a screenshot-to-3D reconstruction project.
- **Navigation scope:** Orbit, pan, and zoom only. Interior walkthrough movement is excluded.
- **Access:** Anyone with the public URL can view models and notes. No visitor sign-in is required.
- **Mobile:** Touch input is required, including pinch zoom and two-finger pan.
- **Information layout:** One persistent Info button opens a full-screen view containing the description followed by notes. Gallery items also show a short description.
- **Markdown scope:** Headings, paragraphs, lists, emphasis, and links.
- **Notes authoring:** Read-only website content, edited through source control, as accepted in the clarification round.
- **Camera toolbar:** Reset view is the only camera-control button for now. Separate zoom, pan, and rotation buttons were proposed and then removed from scope by the owner.
- **Info remains:** The reset-only decision applies to camera controls. It does not remove the Info button or the notes feature.

## 4. Users and primary journeys

### Visitor: browse and inspect

1. Open the landing page.
2. Browse model thumbnails, titles, and short descriptions.
3. Select a model.
4. Wait for the selected model to load.
5. Orbit, pan, and zoom through touch or mouse controls.
6. Use Reset view whenever the camera position becomes unhelpful.
7. Return to the gallery to choose another model.

### Visitor: read model information

1. Open a model.
2. Activate the persistent Info button.
3. Read the description and formatted Markdown notes in a full-screen view.
4. Close the information view and resume inspection.

Preserving the exact camera view on return is proposed behaviour, not yet separately confirmed by the owner.

### Owner: publish or update

1. Export the SketchUp model as `.glb`.
2. Create a thumbnail.
3. Add the model assets and Markdown notes to the project.
4. Add or update its catalog entry.
5. Commit changes and deploy through Vercel.

This file-based workflow is the proposed simplest implementation. No browser-based upload or editing interface is planned.

## 5. Functional requirements

### 5.1 Landing page

- Display the available models as a responsive list or grid.
- Each item includes a thumbnail, title, short description, and clear link to its viewer.
- Keep navigation usable on narrow mobile screens.
- Load thumbnails on the gallery; load 3D assets only when their model is opened.
- Provide a meaningful title for the collection. Branding and final copy remain unspecified.

Search, filtering, categories, and pagination have not been requested. A small curated collection is the working assumption.

### 5.2 Model viewer

- Render the selected `.glb` model as interactive 3D content.
- Initially frame the complete model at a useful angle and scale.
- Support orbit, pan, and zoom.
- Display the model title and a way back to the gallery.
- Keep Reset view and Info available over the viewer.
- Show no on-screen control instructions; gestures are expected to be intuitive (decided after validation on a real phone).
- Show loading feedback and a readable error if loading fails.
- Give unknown model IDs a clear unavailable-model state with a route back to the gallery.

A neutral background and simple lighting are proposed defaults. Exact materials, lighting, background colour, and resemblance to SketchUp's visual style remain to be validated against a real export.

### 5.3 Touch and mouse interaction

Expected mobile gestures:

- One-finger drag: orbit around the model.
- Pinch: zoom.
- Two-finger drag: pan.

Expected desktop gestures:

- Left-drag: orbit.
- Right-drag or modifier-drag: pan.
- Mouse wheel: zoom.

These interactions are supported by the proposed viewer library. Verify behaviour on actual target devices, including conflicts between model gestures, browser navigation, and page scrolling.

The information view must scroll like a normal document. Its scrolling must not move the 3D camera underneath it.

### 5.4 Reset view

- Always available while viewing a model, including when the model is offscreen.
- Works through a single tap or click.
- Restores the initial camera angle, distance/zoom, and pan/orbit target.
- Returns the model to its original complete framing.
- Resets the camera; it does not alter model geometry or content.
- Remains repeatable after any sequence of navigation gestures.

Reset view is the sole explicit camera-control button. A button animation versus an immediate reset is an implementation detail still open; choose whichever produces the clearest, most reliable recovery.

Automatic recovery, special pan boundaries, and custom zoom limits were not agreed. They are not requirements for this snapshot.

### 5.5 Model information

- A persistent Info button opens a full-screen information view.
- Show the model title, description, then model notes.
- Render notes as formatted content rather than raw Markdown.
- Provide an obvious close/back action.
- Use readable typography, sufficient spacing, and normal vertical scrolling.

"Full-screen" means the content fills the available page viewport. It does not imply invoking the browser's fullscreen API.

Proposed return behaviour: close returns to the same model and exact camera view. Browser Back should behave consistently with this. Whether the information view has its own shareable URL remains open.

### 5.6 Markdown content

Required syntax:

- Headings.
- Paragraphs.
- Lists.
- Emphasis, including bold and italic text.
- Links.

Markdown is the maintained source; formatted HTML is the viewing experience. Editing happens outside the website through source control.

Images, tables, embedded video, interactive embeds, and arbitrary raw HTML are outside the agreed MVP scope. The Markdown renderer and exact rendering rules have not been selected.

## 6. Accessibility

The owner requested intuitive and accessible interaction, then chose to keep Reset view as the only camera-control button.

Proposed baseline for implementation:

- Clear text labels and sufficiently large touch targets for Reset view, Info, and back/close actions.
- Visible keyboard focus and keyboard-operable navigation and buttons.
- Preserve the viewer library's keyboard camera controls where supported.
- Meaningful model descriptions, thumbnail alternatives, heading structure, and link text.
- Move focus into the information view when opened and restore it to Info when closed.
- Keep hidden viewer controls out of the information view's keyboard navigation.
- Ensure controls remain legible over the viewer and do not overlap device safe areas.

**Unresolved accessibility tradeoff:** Reset alone is not a single-pointer alternative for orbiting, panning, or zooming. Users unable to perform multipoint gestures may still be unable to perform those actions on a touchscreen. Keyboard support does not by itself solve that touch interaction gap.

No formal WCAG conformance level or audit requirement has been agreed. Do not describe the product as WCAG-conformant without defining and testing the target. If single-pointer alternatives are required, revisit the reset-only toolbar decision. See the [W3C guidance on pointer gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures).

## 7. Proposed technical approach

### Stack

- **Vite + TypeScript:** small static website project.
- **Google `<model-viewer>`:** browser-based GLB rendering with built-in camera controls.
- **Markdown renderer:** selected during implementation; basic syntax only.
- **Vercel:** deployment and delivery of the website and initial model assets.

This is a recommendation, not a user-mandated library choice. The original request allowed WebGL, Three.js, or something similar. Custom Three.js code or React Three Fiber remains an alternative if requirements outgrow the simpler viewer, but neither is necessary for the current agreed interactions.

### Runtime boundaries

The browser renders the 3D model. Vercel serves the site and assets. Model conversion happens before publishing, outside the visitor experience.

The proposed MVP needs no application backend, database, model-conversion service, or account system. Initial model files can live with the site's static assets; larger collections or heavy assets may later justify separate object storage.

### Pages and URLs

Proposed minimal URLs:

- `/`: gallery.
- `/view.html?model=house`: reusable model viewer selected through a stable ID.

These URLs are illustrative and not confirmed requirements. More polished routes such as `/models/house` are possible, with routing configured appropriately. Direct model links and browser refreshes should work in the deployed site.

The information view could be a full-viewport layer over a mounted viewer or a routed screen with saved camera state. Choose based on reliable view restoration and browser Back behaviour; the visual requirement does not mandate one implementation.

## 8. Content and asset structure

Each model needs:

- A unique, stable ID.
- Title.
- Short gallery description.
- Full model description, or reuse of the short description if sufficient.
- GLB asset path.
- Thumbnail path.
- Markdown notes path/content.
- Optional initial camera settings if automatic framing is insufficient.

Proposed source layout, not yet created:

```text
src/
  models.json
  content/
    house.md
public/
  models/
    house.glb
  thumbnails/
    house.webp
```

The catalog drives both gallery content and model lookup. Markdown is bundled or resolved by stable model ID. Exact file organisation, metadata naming, and whether description and notes share a Markdown file remain implementation choices.

If a model has no additional notes, the proposed fallback is to keep Info available and show its description without an empty notes section. Required content validation and this fallback have not been explicitly confirmed.

## 9. Asset preparation and performance

The first technical milestone is a real owner-supplied SketchUp model displayed correctly in the browser.

Validate:

- Geometry and orientation.
- Materials and textures.
- Initial camera framing and reset behaviour.
- Model and texture sizes.
- Loading time, memory use, and responsiveness on phones.
- Whether the exported appearance meets expectations; do not assume exact reproduction of SketchUp rendering styles.

GLB export packages model data for web viewing, but the format alone does not guarantee a small file or good mobile performance. Optimisation may be needed for complex geometry or large textures.

No asset-size cap, loading-time target, frame-rate target, or supported device floor has been agreed. Set practical targets after testing a representative export. Compression, geometry reduction, and texture resizing are possible remedies, not promised launch features.

## 10. Proposed acceptance criteria

### Gallery and publishing

- At least two representative models appear in the gallery during validation.
- Each opens the correct model and matching information.
- Adding a model requires assets and catalog/content changes, not new viewer logic.
- A direct model URL opens correctly and survives a browser refresh on Vercel.

### Mobile viewer

- Orbit, pinch zoom, and two-finger pan work on tested phones.
- The model starts fully visible.
- Reset view reliably recovers after panning into empty background, changing orientation, or zooming too far.
- Reset view and Info remain reachable without navigating the camera back first.
- The interface accommodates portrait and landscape without hiding essential controls.

### Information

- Info opens a full-screen description-and-notes view.
- Every agreed Markdown feature renders as formatted content.
- Notes scroll independently from the camera.
- Close returns to the same model; preserving the exact camera state is proposed pending confirmation.
- Information navigation and focus behaviour work with a keyboard.

### Failure handling

- A missing or invalid model ID shows a useful recovery path.
- An asset-loading failure does not leave an unexplained blank viewer.
- Loading feedback appears while a model is being fetched.

The suggested browser validation set is iOS Safari, Android Chrome, and a desktop browser. Exact versions and devices remain open.

## 11. Delivery sequence

1. **Validate one export:** confirm a real SketchUp GLB renders correctly and performs acceptably on a phone.
2. **Build viewer:** gestures, initial framing, persistent Reset view, title, back navigation, loading/error handling.
3. **Add information:** persistent Info, full-screen description/Markdown notes, close and focus behaviour.
4. **Build gallery:** shared catalog, thumbnails, descriptions, model selection.
5. **Verify complete flow:** two models, mobile gestures, reset recovery, notes, direct links, browser refresh, keyboard use.
6. **Deploy and verify on Vercel:** repeat the principal visitor journeys using the hosted site.

No delivery estimate, budget, repository, Vercel project, domain, or production deployment has been established in this conversation.

## 12. Outside MVP scope

- Screenshot-to-3D or AI reconstruction.
- Automatic `.skp` conversion inside the website.
- Visitor uploads or browser-based content administration.
- Accounts, restricted access, or per-model permissions.
- Interior walkthroughs, first-person navigation, or collision handling.
- Separate zoom, pan, or rotation buttons.
- Editing model geometry or materials.
- Measurement tools, annotations, comments, or collaborative notes.
- AR/VR experiences.
- Advanced Markdown content beyond the agreed syntax.
- Search, filters, categories, and a large-library management system.

These items are exclusions or deferrals, not requests for future implementation.

## 13. Outstanding clarification and assumptions

### Product decisions still open

1. **Accessibility target:** Is the reset-only interface sufficient, or must users have single-pointer alternatives to every camera gesture? This affects the agreed toolbar simplicity.
2. **Camera preservation:** Confirm that closing information and using browser Back restores the exact camera view.
3. **Information URLs:** Should notes have a shareable direct URL, or only be reachable through Info?
4. **Device support:** Confirm portrait/landscape support, target browser versions, and the oldest phone to support.
5. **Visual expectations:** Choose a simple neutral viewer appearance or specify closer SketchUp styling. Validate against an actual export before committing to fidelity.
6. **Collection presentation:** List versus grid, gallery ordering, site name, branding, and final copy remain unspecified.

### Inputs and practical limits not yet known

- A representative model and thumbnail have not been supplied or inspected.
- Initial model count, typical asset size, geometry complexity, and texture sizes are unknown.
- Notes length and actual content are unknown.
- Performance budgets and content-size limits are unset.
- Domain, repository provider, Vercel account/project, and any commercial hosting constraints are unspecified.

### Working assumptions

- Start with a small curated collection and manual publishing through source control.
- Descriptions and notes are public alongside the models.
- Public model assets can be fetched by visitors; download prevention is not a requirement.
- Both desktop mouse use and mobile touch use matter.
- A thumbnail is prepared manually for each model.
- One reusable viewer handles every catalog entry.
- No raw HTML execution is required in Markdown.
- Missing notes can fall back to description-only information.
- Exact routing, Markdown storage layout, and initial camera configuration can be settled during implementation.

The clarification interview established the core scope, then the owner narrowed the camera toolbar to Reset view. The earlier request for confirmation of the complete scope has not received a blanket approval; the current request is to document the PRD. This snapshot does not claim that implementation or deployment is authorised or complete.

## 14. Decision history

1. Initial request: simple Vercel-hosted website with a landing page listing multiple SketchUp models and individual interactive viewers.
2. Source clarified: actual SketchUp models exportable as GLB, rather than flat images.
3. Mobile added as a core requirement: intuitive pinch zoom and two-finger pan.
4. Model information added: persistent overlaid button, description, full-screen notes, Markdown source rendered as formatted content.
5. Clarification round accepted: orbit/pan/zoom only; public access; combined description/notes view; short descriptions on gallery cards; basic Markdown syntax; read-only website content.
6. A broader camera toolbar was proposed for accessibility. The owner requested only Reset view for the MVP because of concern about getting lost away from the model.
7. Current request: capture the complete PRD, including assumptions and remaining clarifications, in a Markdown file.

## 15. Reference documentation

- [SketchUp: exporting GLB files](https://help.sketchup.com/en/sketchup/working-gltf-files).
- [SketchUp: file formats and subscription availability](https://help.sketchup.com/en/sketchup/using-sketchup-data-other-modeling-programs-or-tools).
- [Google model-viewer](https://modelviewer.dev/).
- [model-viewer camera controls and panning behaviour](https://modelviewer.dev/examples/stagingandcameras/).
- [model-viewer keyboard and touch control implementation](https://github.com/google/model-viewer/blob/master/packages/model-viewer/src/three-components/SmoothControls.ts).
- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).
- [W3C: understanding pointer gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures).

Sources informed planning; confirm current APIs and deployment requirements when implementation begins.
