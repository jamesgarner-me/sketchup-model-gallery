## MODIFIED Requirements

### Requirement: Neutral appearance
The Viewer SHALL display each Model on its Stage. A Model with no Stage set SHALL use the Neutral stage: a neutral light background, daylight-style lighting from a dominant sun direction plus soft sky fill so that differently facing surfaces shade distinctly, and colour rendering that keeps contrast and saturation rather than flattening them.

#### Scenario: Default look
- **WHEN** a Model with no Stage set is displayed
- **THEN** it appears on a neutral background with simple lighting

#### Scenario: Faces shade by direction
- **WHEN** a Model with no Stage set is displayed
- **THEN** surfaces facing the sun direction appear clearly lighter than surfaces facing away from it

## ADDED Requirements

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
