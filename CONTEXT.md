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
The single camera button; returns the camera to the Model's initial framing.
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
