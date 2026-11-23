## MODIFIED Requirements

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
