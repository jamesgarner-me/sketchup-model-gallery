## MODIFIED Requirements

### Requirement: Initial framing shows whole Model
The Viewer SHALL start with the complete Model visible at a useful angle and scale, using per-Model camera settings when the Catalog supplies them. Unless the Catalog supplies a camera target, the Initial framing SHALL place the Model 10% of the viewport height higher than centred, and Reset view SHALL return to that same framing.

#### Scenario: Model fully visible on load
- **WHEN** a Model finishes loading
- **THEN** the entire Model is within the view

#### Scenario: Model sits above centre on load
- **WHEN** a Model without a Catalog camera target finishes loading
- **THEN** the Model's centre appears about 10% of the viewport height above the viewport centre

#### Scenario: Reset view keeps the lift
- **WHEN** a visitor moves the camera and uses Reset view
- **THEN** the Model returns to the same lifted position as on first load

#### Scenario: Catalog target wins
- **WHEN** a Catalog entry supplies a camera target
- **THEN** the Viewer uses that target without adding the lift
