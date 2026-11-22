# SketchUp Model Gallery

A public website where visitors browse curated SketchUp models and inspect each in an interactive 3D viewer, with supporting notes.

## Language

**Model**:
A single SketchUp design published to the gallery, identified by a stable ID.
_Avoid_: Asset, file, project

**Catalog**:
The owner-maintained list of Models that drives both the gallery and Model lookup.
_Avoid_: Database, manifest, index

**Gallery**:
The landing page listing every Model in the Catalog as cards.
_Avoid_: Home, collection page

**Viewer**:
The interactive 3D screen for one Model.
_Avoid_: Player, scene, canvas

**Reset view**:
The button that returns the camera to the Model's initial framing with full camera controls, leaving any Viewpoint.
_Avoid_: Recenter, home, reset camera

**Initial framing**:
The camera angle, distance and target that show the whole Model on load.
_Avoid_: Default view, home position

**Info**:
The full-screen overlay on a Viewer showing a Model's description followed by its notes.
_Avoid_: Details, modal, about

**Notes**:
Markdown-authored supporting content for a Model, shown inside Info after the description.
_Avoid_: Docs, readme, article

**Description**:
The short summary of a Model shown on its Gallery card and at the top of Info.
_Avoid_: Blurb, summary, caption

**Stage**:
The named background-and-lighting preset a Model is displayed in. Every Model has exactly one; the default is the Neutral stage.
_Avoid_: Scene, environment, backdrop, theme

**Neutral stage**:
The default Stage: light neutral background with simple even lighting.
_Avoid_: Default background, light mode

**Showroom stage**:
A Stage that shows the Model as if on display in a dark room lit by several lights.
_Avoid_: Dark mode, night mode, dark background

**Auto-orbit**:
An optional slow turntable rotation a Model performs when its Viewer opens, until the visitor first takes control.
_Avoid_: Auto-rotate, spin, turntable mode

**Layer**:
A named top-level SketchUp group in a Model's export that visitors can show or hide. Only groups listed for the Model in the Catalog are Layers.
_Avoid_: Tag, part, SketchUp layer

**Viewpoint**:
A fixed eye position, taken from a saved SketchUp Scene in a Model's export, that visitors jump to and look around from without moving. Every saved Scene in the export is a Viewpoint.
_Avoid_: Scene, saved view, camera, bookmark

**Explode**:
Pulling a Model's parts apart, by a visitor-controlled amount, so its inside can be inspected; the camera still moves freely at any amount. Parts are the Model's top-level SketchUp groups and, optionally, the groups inside them.
_Avoid_: Expand, blow up, disassemble
