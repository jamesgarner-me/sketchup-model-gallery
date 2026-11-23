## ADDED Requirements

### Requirement: Explode spike
For the spike only, the stairs Model's Viewer SHALL show an Explode slider when its URL has the `explode` query flag, and SHALL NOT show it otherwise or on any other Model. Moving the slider right SHALL pull the Model's visible top-level groups apart in proportion to its position, radially from the centre of the visible groups, and moving it back SHALL reassemble them. Groups hidden with Layers SHALL NOT move. When only one top-level group is visible, both modes SHALL spread that group's own parts instead. A mode toggle SHALL switch between Groups (visible top-level groups only) and Nested (top-level groups, then the groups inside them). The slider SHALL NOT move the camera, and all camera gestures SHALL keep working at any slider position.

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

#### Scenario: Reset view keeps the explode amount
- **WHEN** the Model is exploded and the visitor activates Reset view
- **THEN** the camera returns to Initial framing and the parts stay where the slider puts them

#### Scenario: Mode toggle
- **WHEN** the visitor switches between Groups and Nested
- **THEN** the parts move to the positions the new mode gives for the current slider position

#### Scenario: Only visible groups explode
- **WHEN** some Layers are hidden and the visitor drags the slider right
- **THEN** only the visible groups move apart, around the centre of what is visible, and hidden groups stay in their original places

#### Scenario: Layers change while exploded
- **WHEN** the Model is exploded and the visitor shows or hides a Layer, or restores Layer defaults
- **THEN** the visible groups are re-spread straight away for the current slider position, newly hidden groups return to their original places, and the camera does not move

#### Scenario: Explode within a single group
- **WHEN** only one top-level group is visible and the visitor drags the slider right, in either mode
- **THEN** that group's own parts move apart around its centre

#### Scenario: Layers and slider together on a phone
- **WHEN** the Layers panel is open as a bottom sheet on a narrow screen
- **THEN** the Explode slider stays visible and usable below it
