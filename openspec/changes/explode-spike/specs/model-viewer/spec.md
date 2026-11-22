## ADDED Requirements

### Requirement: Explode spike
For the spike only, the stairs Model's Viewer SHALL show an Explode slider when its URL has the `explode` query flag, and SHALL NOT show it otherwise or on any other Model. Moving the slider right SHALL pull the Model's parts apart in proportion to its position, radially from the Model's centre, and moving it back SHALL reassemble them. A mode toggle SHALL switch between Groups (top-level groups only) and Nested (top-level groups, then the groups inside them). The slider SHALL NOT move the camera, and all camera gestures SHALL keep working at any slider position.

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
