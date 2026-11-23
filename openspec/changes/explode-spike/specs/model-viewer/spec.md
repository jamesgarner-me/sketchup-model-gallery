## ADDED Requirements

### Requirement: Explode spike
For the spike only, the stairs Model's Viewer SHALL show an Explode slider when its URL has the `explode` query flag, and SHALL NOT show it otherwise or on any other Model. Moving the slider right SHALL pull the Model's visible top-level groups apart in proportion to its position, radially from the centre of the visible groups, and moving it back SHALL reassemble them. Groups hidden with Layers SHALL NOT move. When only one top-level group is visible, the slider SHALL spread that group's own parts instead. The explode SHALL be nested: the top-level groups separate over the first half of the slider, then the groups inside them over the second half. There SHALL be no mode toggle. The slider SHALL NOT move the camera, and all camera gestures SHALL keep working at any slider position.

#### Scenario: Hidden by default
- **WHEN** a visitor opens the stairs Model without the `explode` flag, or any other Model
- **THEN** no Explode slider is shown and the Model is assembled

#### Scenario: Explode and reassemble
- **WHEN** the visitor drags the slider right and then back to the far left
- **THEN** the parts move apart in proportion and then return exactly to their original places

#### Scenario: Inspect while exploded
- **WHEN** the slider is part-way or fully right
- **THEN** the visitor can still orbit, zoom, pan and tap to set the pivot as usual

#### Scenario: Slider leaves the camera alone
- **WHEN** the visitor drags the slider
- **THEN** the camera does not move and Auto-orbit, if running, keeps turning

#### Scenario: Reset view reassembles
- **WHEN** the Model is exploded and the visitor activates Reset view
- **THEN** the camera returns to Initial framing, the slider returns to the far left and the Model is assembled, with every Layer at its default visibility

#### Scenario: Nested explode
- **WHEN** the visitor drags the slider from the far left to the far right
- **THEN** the top-level groups separate first, then the groups inside them spread out, and no mode toggle is shown

#### Scenario: Only visible groups explode
- **WHEN** some Layers are hidden and the visitor drags the slider right
- **THEN** only the visible groups move apart, around the centre of what is visible, and hidden groups stay in their original places

#### Scenario: Layers change while exploded
- **WHEN** the Model is exploded and the visitor shows or hides a Layer, or restores Layer defaults
- **THEN** the visible groups are re-spread straight away for the current slider position, newly hidden groups return to their original places, and the camera does not move

#### Scenario: Explode within a single group
- **WHEN** only one top-level group is visible and the visitor drags the slider right
- **THEN** that group's own parts move apart around its centre

#### Scenario: Layers and slider together on a phone
- **WHEN** the Layers panel is open as a bottom sheet on a narrow screen
- **THEN** the Explode slider stays visible and usable below it

### Requirement: Layer visibility and Reset
When the Model loads, each Layer SHALL start in its configured default visibility (visible unless configured otherwise). Toggling a Layer's checkbox SHALL immediately show or hide that group and everything inside it. "Restore defaults" SHALL return every Layer to its default visibility. Changing Layers SHALL NOT move the camera, change Initial framing, or start or stop Auto-orbit, and Reset view SHALL return every Layer to its default visibility. Layer visibility SHALL NOT be stored in the URL and SHALL return to defaults on page reload.

#### Scenario: Defaults on load
- **WHEN** Bastings Garden loads
- **THEN** Layers 01–09 are visible and the "Existing landing comparison" and "Roof-loaded 4×4 clearance" Layers are hidden

#### Scenario: Toggle a Layer
- **WHEN** the visitor unchecks a visible Layer
- **THEN** that group disappears from the Model and the camera does not move

#### Scenario: Restore defaults
- **WHEN** the visitor has changed several Layers and activates "Restore defaults"
- **THEN** every Layer returns to its default visibility

#### Scenario: Reset view restores Layers
- **WHEN** the visitor hides a Layer and then activates Reset view
- **THEN** the camera returns to Initial framing and the Layer is shown again

#### Scenario: Orbit unaffected
- **WHEN** a Model with Auto-orbit is orbiting and the visitor toggles a Layer
- **THEN** the orbit continues

## MODIFIED Requirements

### Requirement: Reset view
The Viewer SHALL show a persistent Reset view button that, on a single tap or click, returns the camera to the Initial framing with full camera controls, leaving any Viewpoint, returns every Layer to its default visibility, and reassembles an exploded Model. It SHALL work after any gesture sequence, including when the Model is offscreen, and MUST NOT otherwise alter the Model.

#### Scenario: Recover after panning away
- **WHEN** a visitor pans until the Model is offscreen and activates Reset view
- **THEN** the camera returns to Initial framing

#### Scenario: Recover after over-zoom
- **WHEN** a visitor zooms far in or out and activates Reset view
- **THEN** the camera returns to Initial framing

#### Scenario: Repeatable
- **WHEN** Reset view is used repeatedly after different gestures
- **THEN** each use reaches the same Initial framing

#### Scenario: Reset restores starting Layers
- **WHEN** the visitor has shown or hidden Layers and activates Reset view
- **THEN** every Layer returns to its default visibility, as on load

## REMOVED Requirements

### Requirement: Layer visibility
**Reason**: Reset view now restores default Layers; replaced by "Layer visibility and Reset".
**Migration**: None; same behaviour except Reset view.
