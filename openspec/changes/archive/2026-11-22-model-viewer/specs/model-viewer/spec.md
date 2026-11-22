## Purpose

Lets visitors inspect a single Model in 3D with intuitive gestures and recover from getting lost via Reset view.

## ADDED Requirements

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
Reset view, Info and a back-to-Gallery link SHALL remain reachable over the Viewer in portrait and landscape, with touch targets sized for fingers, visible keyboard focus, and clearance from device safe areas. The Viewer SHALL show the Model title and brief control instructions.

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
The Viewer SHALL use a neutral light background and simple even lighting.

#### Scenario: Default look
- **WHEN** a Model is displayed
- **THEN** it appears on a neutral background with simple lighting

### Requirement: Known accessibility gap
The Viewer MUST NOT claim WCAG conformance; Reset view is the only camera button, and single-pointer zoom/pan alternatives are not provided in this version.

#### Scenario: No conformance claim
- **WHEN** site copy or docs describe accessibility
- **THEN** they make no WCAG conformance claim
