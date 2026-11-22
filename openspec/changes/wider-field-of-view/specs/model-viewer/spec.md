## MODIFIED Requirements

### Requirement: Close zoom
On every Model, visitors SHALL be able to zoom in until the camera is about 0.1 m from the pivot point, using pinch, mouse wheel or keyboard. Zooming SHALL move the camera only and SHALL NOT change the field of view. Zooming out SHALL keep its existing limit. The camera MAY pass inside geometry when very close.

#### Scenario: Zoom in close
- **WHEN** the visitor keeps zooming in on a Model
- **THEN** the camera continues to approach the pivot point until it is about 0.1 m away

#### Scenario: Reset after close zoom
- **WHEN** the visitor has zoomed in close and activates Reset view
- **THEN** the camera returns to Initial framing

#### Scenario: Field of view unchanged by zoom
- **WHEN** the visitor zooms in or out
- **THEN** the field of view stays the same

## ADDED Requirements

### Requirement: Comfortable field of view
Unless its Catalog entry sets a field of view, every Model SHALL be shown with a field of view of about 45° across the screen's shorter side: vertically on desktop and landscape screens, horizontally on portrait screens. The field of view SHALL be the same on load, after zooming, after Reset view and after leaving a Viewpoint.

#### Scenario: Desktop and landscape
- **WHEN** a Model is displayed on a landscape screen
- **THEN** the vertical field of view is about 45°

#### Scenario: Portrait phone
- **WHEN** a Model is displayed on a portrait screen
- **THEN** the horizontal field of view is about 45°

#### Scenario: Catalog override
- **WHEN** a Model's Catalog entry sets a field of view
- **THEN** that field of view is used instead
