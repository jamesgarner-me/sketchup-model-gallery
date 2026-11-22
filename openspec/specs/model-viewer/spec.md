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
The Viewer SHALL support orbit, zoom and pan. On touch: one-finger drag orbits, pinch zooms, two-finger drag pans. On desktop: left-drag orbits, right-drag or modifier-drag pans, wheel zooms. Keyboard camera controls SHALL remain available.

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
The Viewer SHALL show a persistent Reset view button that, on a single tap or click, returns the camera to the Initial framing. It SHALL work after any gesture sequence, including when the Model is offscreen, and MUST NOT alter the Model.

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
Reset view, Info and a back-to-Gallery link SHALL remain reachable over the Viewer in portrait and landscape, with touch targets sized for fingers, visible keyboard focus, and clearance from device safe areas. The Viewer SHALL show the Model title. It SHALL NOT show on-screen control instructions; gesture controls are expected to be intuitive.

#### Scenario: Landscape controls
- **WHEN** the device is in landscape
- **THEN** Reset view, Info and back remain visible and tappable

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
The Viewer MUST NOT claim WCAG conformance; Reset view is the only camera button, and single-pointer zoom/pan alternatives are not provided in this version.

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
On a dark Stage, the Viewer's back link, title, Reset view, Info button, loading indicator and load-failure screen SHALL use a dark style that stays legible. The Info overlay and the "Model not found" screen SHALL keep the light style.

#### Scenario: Dark controls
- **WHEN** a Model on the Showroom stage is displayed
- **THEN** the controls are dark-styled and legible against the background

#### Scenario: Info stays light
- **WHEN** Info is opened on a Showroom-stage Model
- **THEN** the overlay uses the light reading style

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
Tapping or clicking a point on the Model without dragging SHALL make that point the pivot that orbit and zoom centre on. Tapping empty background SHALL NOT change the pivot. Reset view SHALL restore the original pivot.

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
