# model-viewer Specification

## Purpose

Lets visitors inspect a single Model in 3D with intuitive gestures and recover from getting lost via Reset view.

## Requirements

### Requirement: Viewer is addressed by Model ID
The Viewer SHALL load the Model whose ID appears in the path `/models/<id>`, and direct links and browser refresh SHALL work.

#### Scenario: Direct link opens Model
- **WHEN** a visitor opens `/models/house` directly
- **THEN** the Viewer for the Model with ID `house` loads

#### Scenario: Refresh keeps Model
- **WHEN** a visitor refreshes `/models/house`
- **THEN** the same Model loads again

### Requirement: Initial framing shows whole Model
The Viewer SHALL start with the complete Model visible at a useful angle and scale, using per-Model camera settings when the Catalog supplies them.

#### Scenario: Model fully visible on load
- **WHEN** a Model finishes loading
- **THEN** the entire Model is within the view

### Requirement: Camera gestures
Outside a Viewpoint, the Viewer SHALL support orbit, zoom and pan. On touch: one-finger drag orbits, pinch zooms, two-finger drag pans. On desktop: left-drag orbits, right-drag or modifier-drag pans, wheel zooms. Keyboard camera controls SHALL remain available. Inside a Viewpoint, gestures SHALL follow the look-around-only behaviour instead.

#### Scenario: Touch orbit
- **WHEN** a visitor drags one finger on the Model
- **THEN** the camera orbits

#### Scenario: Pinch zoom and two-finger pan
- **WHEN** a visitor pinches or drags with two fingers
- **THEN** the camera zooms or pans respectively

#### Scenario: Viewer does not scroll page
- **WHEN** a visitor gestures on the Viewer
- **THEN** the page does not scroll or navigate

### Requirement: Reset view
The Viewer SHALL show a persistent Reset view button that, on a single tap or click, returns the camera to the Initial framing with full camera controls, leaving any Viewpoint. It SHALL work after any gesture sequence, including when the Model is offscreen, and MUST NOT alter the Model.

#### Scenario: Recover after panning away
- **WHEN** a visitor pans until the Model is offscreen and activates Reset view
- **THEN** the camera returns to Initial framing

#### Scenario: Recover after over-zoom
- **WHEN** a visitor zooms far in or out and activates Reset view
- **THEN** the camera returns to Initial framing

#### Scenario: Repeatable
- **WHEN** Reset view is used repeatedly after different gestures
- **THEN** each use reaches the same Initial framing

### Requirement: Reset view animates with fallback
Reset view SHALL glide back over roughly 400 ms and SHALL jump instantly if the animation does not complete.

#### Scenario: Animation stalls
- **WHEN** the glide does not finish in time
- **THEN** the camera is set to Initial framing immediately

### Requirement: Persistent controls and layout
Reset view, Info, the Viewpoints button (when the Model has Viewpoints) and a back-to-Gallery control SHALL remain reachable over the Viewer in portrait and landscape, with touch targets sized for fingers, visible keyboard focus, and clearance from device safe areas. The back-to-Gallery control SHALL be an icon-only button showing a home icon, with the accessible name "Gallery", at the left of the top bar; Info SHALL be at the right of the top bar; Reset view and Viewpoints SHALL be in the bottom controls row. The Viewer SHALL show the Model title between the back control and Info. It SHALL NOT show on-screen control instructions; gesture controls are expected to be intuitive.

#### Scenario: Landscape controls
- **WHEN** the device is in landscape
- **THEN** Reset view, Info, Viewpoints (where shown) and back remain visible and tappable

#### Scenario: Home icon button
- **WHEN** a Model is displayed
- **THEN** the top-left back control shows a home icon with no text, is announced to assistive technology as "Gallery", and returns to the Gallery when activated

#### Scenario: Long title
- **WHEN** a Model's title is too long for the space between the back control and Info
- **THEN** the title is shortened with an ellipsis and both buttons stay fully visible

### Requirement: Loading feedback
The Viewer SHALL show Model loading progress while the GLB is fetched.

#### Scenario: Progress shown
- **WHEN** a Model is loading
- **THEN** a progress indicator is visible until loading completes

### Requirement: Load failure recovery
If the GLB fails to load, the Viewer SHALL show an explanatory message with Retry and Back to Gallery actions instead of a blank view.

#### Scenario: Asset fetch fails
- **WHEN** the GLB request fails
- **THEN** a message with Retry and Back to Gallery appears

#### Scenario: Retry succeeds
- **WHEN** a visitor activates Retry and the asset is now available
- **THEN** the Model loads normally

### Requirement: Unknown Model ID
If the ID in the path matches no Catalog Model, the page SHALL show a "Model not found" state with a link to the Gallery.

#### Scenario: Bad ID
- **WHEN** a visitor opens `/models/does-not-exist`
- **THEN** "Model not found" and a link to the Gallery are shown

### Requirement: Neutral appearance
The Viewer SHALL display each Model on its Stage. A Model with no Stage set SHALL use the Neutral stage: a neutral light background, daylight-style lighting from a dominant sun direction plus soft sky fill so that differently facing surfaces shade distinctly, and colour rendering that keeps contrast and saturation rather than flattening them.

#### Scenario: Default look
- **WHEN** a Model with no Stage set is displayed
- **THEN** it appears on a neutral background with simple lighting

#### Scenario: Faces shade by direction
- **WHEN** a Model with no Stage set is displayed
- **THEN** surfaces facing the sun direction appear clearly lighter than surfaces facing away from it

### Requirement: Known accessibility gap
The Viewer MUST NOT claim WCAG conformance. Reset view and Viewpoints are the only camera buttons, and single-pointer zoom/pan alternatives are not provided in this version.

#### Scenario: No conformance claim
- **WHEN** site copy or docs describe accessibility
- **THEN** they make no WCAG conformance claim

### Requirement: Showroom stage
The Showroom stage SHALL present the Model as if on display in a dark room: a near-black background with a soft glow beneath the Model and darkened edges, and lighting from several distinct directions (key, fill, rim and overhead) that lights the Model and shows in its reflections. Its lighting asset SHALL be fetched only for Models on the Showroom stage.

#### Scenario: Showroom look
- **WHEN** a Model on the Showroom stage is displayed
- **THEN** it appears on a near-black background, lit from several directions

#### Scenario: No extra download on Neutral
- **WHEN** a Model on the Neutral stage is displayed
- **THEN** the Showroom lighting asset is not requested

### Requirement: Controls match the Stage
On a dark Stage, the Viewer's back link, title, Reset view, Info button, Viewpoints button and drawer, Layers button and panel, loading indicator and load-failure screen SHALL use a dark style that stays legible. The Info overlay and the "Model not found" screen SHALL keep the light style.

#### Scenario: Dark controls
- **WHEN** a Model on the Showroom stage is displayed
- **THEN** the controls are dark-styled and legible against the background

#### Scenario: Info stays light
- **WHEN** Info is opened on a Showroom-stage Model
- **THEN** the overlay uses the light reading style

#### Scenario: Dark drawer
- **WHEN** the Viewpoints drawer is opened on a Showroom-stage Model
- **THEN** the drawer is dark-styled and legible

### Requirement: Optional Auto-orbit
A Model whose Catalog entry enables Auto-orbit SHALL rotate slowly about its vertical axis as soon as it loads, at the configured speed (default 18 degrees per second; a negative speed reverses direction). Models without it SHALL stay still. Auto-orbit SHALL NOT run when the device requests reduced motion. On Models with Auto-orbit, the library's idle interaction prompt SHALL NOT be shown.

#### Scenario: Orbit on load
- **WHEN** a Model with Auto-orbit enabled finishes loading
- **THEN** it rotates continuously at its configured speed

#### Scenario: Off by default
- **WHEN** a Model without Auto-orbit is displayed
- **THEN** it does not rotate on its own

#### Scenario: Reduced motion
- **WHEN** the device requests reduced motion
- **THEN** a Model with Auto-orbit enabled stays still

### Requirement: Visitor control ends Auto-orbit
A visitor camera interaction (orbit, pan or zoom) SHALL stop Auto-orbit, and it SHALL NOT resume on its own. On a Model with Auto-orbit enabled, Reset view SHALL return the Model to its Initial framing, including undoing any rotation Auto-orbit applied, and SHALL then restart Auto-orbit once the camera has settled. This applies whether or not the visitor had already stopped it. The next visitor camera interaction SHALL stop it again. When the device requests reduced motion, Reset view SHALL return to Initial framing and leave the Model still.

#### Scenario: Touch stops orbit
- **WHEN** the visitor drags, pinches or zooms an orbiting Model
- **THEN** the rotation stops and does not resume on its own

#### Scenario: Reset restarts orbit
- **WHEN** the visitor activates Reset view on a Model with Auto-orbit enabled after stopping it
- **THEN** the Model returns to its Initial framing and, once the camera settles, starts orbiting again

#### Scenario: Reset while still orbiting
- **WHEN** the visitor activates Reset view while the Model is still orbiting untouched
- **THEN** the Model returns to its Initial framing and continues orbiting from there

#### Scenario: Touch after Reset
- **WHEN** the visitor drags, pinches or zooms after Reset has restarted the orbit
- **THEN** the rotation stops again

#### Scenario: Reset with reduced motion
- **WHEN** the device requests reduced motion and the visitor activates Reset view
- **THEN** the Model returns to its Initial framing and stays still

### Requirement: Info pauses Auto-orbit
While Info is open, Auto-orbit SHALL pause. On closing Info it SHALL resume, unless the visitor had already taken control.

#### Scenario: Pause and resume
- **WHEN** the visitor opens and then closes Info on an orbiting Model they have not touched
- **THEN** rotation pauses while Info is open and resumes after it closes

### Requirement: Close zoom
On every Model, visitors SHALL be able to zoom in until the camera is about 0.1 m from the pivot point, using pinch, mouse wheel or keyboard. Zooming out SHALL keep its existing limit. The camera MAY pass inside geometry when very close.

#### Scenario: Zoom in close
- **WHEN** the visitor keeps zooming in on a Model
- **THEN** the camera continues to approach the pivot point until it is about 0.1 m away

#### Scenario: Reset after close zoom
- **WHEN** the visitor has zoomed in close and activates Reset view
- **THEN** the camera returns to Initial framing

### Requirement: Tap to set pivot
Outside a Viewpoint, tapping or clicking a point on the Model without dragging SHALL make that point the pivot that orbit and zoom centre on. Tapping empty background SHALL NOT change the pivot. Reset view SHALL restore the original pivot. Inside a Viewpoint, tapping SHALL NOT change the pivot or move the camera.

#### Scenario: Tap then zoom
- **WHEN** the visitor taps a point on the Model and then zooms in
- **THEN** the camera moves toward the tapped point

#### Scenario: Reset restores pivot
- **WHEN** the visitor has tapped a new pivot and activates Reset view
- **THEN** orbiting centres on the original pivot again

### Requirement: Non-metallic materials
The Viewer SHALL display exported materials as non-metallic surfaces, so that colours are not dulled by metallic values that exporters write as fallbacks.

#### Scenario: Exporter fallback ignored
- **WHEN** a Model whose materials declare a fallback metallic value of 0.5 loads
- **THEN** its surfaces render as non-metallic

### Requirement: Viewpoints button and drawer
On a Model with at least one Viewpoint, the Viewer SHALL show a Viewpoints button in the controls row. Activating it SHALL open a drawer that slides in from the right on all screen sizes, up to about 85% of the viewport width on narrow screens. The drawer SHALL contain a heading, a close button and one entry per Viewpoint, labelled with the Scene name exactly as named in SketchUp and listed in SketchUp's Scene order. Entries SHALL have finger-sized touch targets. The current Viewpoint, if any, SHALL be marked as selected. Escape and the close button SHALL close the drawer and return focus to the Viewpoints button. On a Model with no Viewpoints, the button SHALL NOT be shown. Opening the drawer SHALL NOT pause Auto-orbit or move the camera.

#### Scenario: Button shown with Viewpoints
- **WHEN** a Model with one or more Viewpoints is displayed
- **THEN** the Viewpoints button is visible beside the other controls

#### Scenario: Button hidden without Viewpoints
- **WHEN** a Model whose export contains no saved Scenes is displayed
- **THEN** no Viewpoints button is shown

#### Scenario: Drawer lists Viewpoints in SketchUp order
- **WHEN** the visitor opens the drawer on a Model whose export has Scenes "Street", "Seat" and "Verandah" in that order
- **THEN** the drawer lists "Street", "Seat" and "Verandah" in that order

#### Scenario: Close with Escape
- **WHEN** the drawer is open and the visitor presses Escape
- **THEN** the drawer closes and focus returns to the Viewpoints button

#### Scenario: Current Viewpoint marked
- **WHEN** the visitor is in a Viewpoint and opens the drawer
- **THEN** that Viewpoint's entry is marked as selected

### Requirement: Entering a Viewpoint
Choosing a Viewpoint in the drawer SHALL move the camera instantly, without a glide, to that Scene's eye position, looking in that Scene's direction, with a fixed field of view of about 45°. It SHALL close the drawer. Entering a Viewpoint SHALL stop Auto-orbit. Choosing another Viewpoint while in one SHALL move straight to the new one.

#### Scenario: Jump to Viewpoint
- **WHEN** the visitor chooses a Viewpoint
- **THEN** the camera is immediately at that Scene's eye position looking in its direction, and the drawer is closed

#### Scenario: Switch Viewpoints
- **WHEN** the visitor is in one Viewpoint and chooses another
- **THEN** the camera moves straight to the second Viewpoint

#### Scenario: Auto-orbit stops
- **WHEN** the visitor chooses a Viewpoint on a Model that is auto-orbiting
- **THEN** the rotation stops and does not resume while in the Viewpoint

### Requirement: Look around only in a Viewpoint
While in a Viewpoint, the eye position SHALL stay fixed. Pan, zoom and tap-to-set-pivot SHALL be disabled. One-finger drag, mouse drag and the arrow keys SHALL turn the view in "grab the scene" fashion: dragging left turns the view to the right, as in Street View. The view SHALL turn a full 360° horizontally and SHALL be limited to about 60° above and below level. Geometry close to the eye SHALL render without being clipped away, even though the camera is inside the Model's bounds.

#### Scenario: Drag looks around
- **WHEN** the visitor drags left in a Viewpoint
- **THEN** the view turns to the right and the eye position does not change

#### Scenario: Pan and zoom do nothing
- **WHEN** the visitor pinches, uses the mouse wheel, right-drags or two-finger drags in a Viewpoint
- **THEN** the eye position and field of view do not change

#### Scenario: Tap does not move pivot
- **WHEN** the visitor taps a point on the Model in a Viewpoint
- **THEN** the camera does not move

#### Scenario: Full turn
- **WHEN** the visitor keeps dragging horizontally in a Viewpoint
- **THEN** the view turns continuously through 360°

#### Scenario: Vertical limit
- **WHEN** the visitor keeps dragging vertically in a Viewpoint
- **THEN** the view stops turning at about 60° above or below level

#### Scenario: Nearby geometry visible
- **WHEN** a Viewpoint's eye is about 1 m from a wall or plant
- **THEN** that geometry renders fully, without clipping

### Requirement: Leaving a Viewpoint
Reset view SHALL be the only way to leave a Viewpoint. It SHALL restore orbit, pan, zoom and tap-to-set-pivot, the Model's field of view and Initial framing, and SHALL then behave as Reset view does elsewhere, including restarting Auto-orbit where enabled.

#### Scenario: Reset leaves Viewpoint
- **WHEN** the visitor is in a Viewpoint and activates Reset view
- **THEN** the camera returns to Initial framing and orbit, pan and zoom work again

#### Scenario: Reset restarts Auto-orbit from a Viewpoint
- **WHEN** the visitor leaves a Viewpoint with Reset view on a Model with Auto-orbit enabled
- **THEN** once the camera settles the Model starts orbiting again

### Requirement: Exported colours shown as authored
The Viewer SHALL treat each material's exported base colour as an sRGB value and display it as authored in SketchUp, not lightened. This corrects exporters that write sRGB values where glTF expects linear ones. Alpha SHALL be unchanged, and materials whose colour comes from a texture SHALL look the same as before. This SHALL apply to every Model.

#### Scenario: Dark colour stays dark
- **WHEN** a Model whose material declares base colour 0.184 (SketchUp #2F302D, near-black) loads
- **THEN** the surface renders near-black, using a linear value of about 0.029

#### Scenario: Textured material unchanged
- **WHEN** a Model with a textured material (base colour factor 1) loads
- **THEN** its base colour factor stays 1 and the texture looks as before

#### Scenario: Transparency kept
- **WHEN** a material's base colour has an alpha below 1
- **THEN** the alpha value is unchanged

### Requirement: Layers control
A Model with Layers configured SHALL show a Layers button beside Reset view (and Viewpoints, where shown). Activating it SHALL open a panel listing the Model's Layers in Catalog order, each with its label and a checkbox reflecting current visibility, plus a "Restore defaults" action. The panel SHALL appear as a bottom sheet on narrow screens and a side panel on wide screens, SHALL leave the Model visible and interactive around it, and SHALL be closable by its close button, by Escape, and by activating the Layers button again. Models without Layers SHALL NOT show the Layers button.

#### Scenario: Open the panel
- **WHEN** the visitor activates Layers on a Model with Layers
- **THEN** a panel lists each Layer's label with a checkbox showing whether it is visible

#### Scenario: No Layers configured
- **WHEN** a Model without Layers is displayed
- **THEN** no Layers button is shown

#### Scenario: Close the panel
- **WHEN** the panel is open and the visitor presses Escape, the close button or the Layers button
- **THEN** the panel closes and focus returns to the Layers button

### Requirement: Layer visibility
When the Model loads, each Layer SHALL start in its configured default visibility (visible unless configured otherwise). Toggling a Layer's checkbox SHALL immediately show or hide that group and everything inside it. "Restore defaults" SHALL return every Layer to its default visibility. Changing Layers SHALL NOT move the camera, change Initial framing, or start or stop Auto-orbit, and Reset view SHALL NOT change Layer visibility. Layer visibility SHALL NOT be stored in the URL and SHALL return to defaults on page reload.

#### Scenario: Defaults on load
- **WHEN** Bastings Garden loads
- **THEN** Layers 01–09 are visible and the "Existing landing comparison" and "Roof-loaded 4×4 clearance" Layers are hidden

#### Scenario: Toggle a Layer
- **WHEN** the visitor unchecks a visible Layer
- **THEN** that group disappears from the Model and the camera does not move

#### Scenario: Restore defaults
- **WHEN** the visitor has changed several Layers and activates "Restore defaults"
- **THEN** every Layer returns to its default visibility

#### Scenario: Reset view keeps Layers
- **WHEN** the visitor hides a Layer and then activates Reset view
- **THEN** the camera returns to Initial framing and the Layer stays hidden

#### Scenario: Orbit unaffected
- **WHEN** a Model with Auto-orbit is orbiting and the visitor toggles a Layer
- **THEN** the orbit continues
