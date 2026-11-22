## MODIFIED Requirements

### Requirement: Persistent controls and layout
Reset view, Info, the Viewpoints button (when the Model has Viewpoints) and a back-to-Gallery control SHALL remain reachable over the Viewer in portrait and landscape, with touch targets sized for fingers, visible keyboard focus, and clearance from device safe areas. The back-to-Gallery control SHALL be an icon-only button showing a home icon, with the accessible name "Gallery". The Viewer SHALL show the Model title. It SHALL NOT show on-screen control instructions; gesture controls are expected to be intuitive.

#### Scenario: Landscape controls
- **WHEN** the device is in landscape
- **THEN** Reset view, Info, Viewpoints (where shown) and back remain visible and tappable

#### Scenario: Home icon button
- **WHEN** a Model is displayed
- **THEN** the top-left back control shows a home icon with no text, is announced to assistive technology as "Gallery", and returns to the Gallery when activated
