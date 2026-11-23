## MODIFIED Requirements

### Requirement: Controls match the Stage
On a dark Stage, the Viewer's back link, title, Reset view, Info button, Viewpoints button and drawer, Layers button and panel, loading indicator and load-failure screen SHALL use a dark style that stays legible. The Info overlay and the "Model not found" screen SHALL keep the light style.

#### Scenario: Dark controls
- **WHEN** a Model on the Showroom stage is displayed
- **THEN** the controls are dark-styled and legible against the background

#### Scenario: Info stays light
- **WHEN** Info is opened on a Showroom-stage Model
- **THEN** the overlay uses the light reading style

## ADDED Requirements

### Requirement: Layers control
A Model with Layers configured SHALL show a Layers button beside Reset view (and Viewpoints, where shown). Activating it SHALL open a panel listing the Model's Layers in Catalog order, each with its label and a checkbox reflecting current visibility, plus a "Restore defaults" action. The panel SHALL appear as a bottom sheet on narrow screens and a side panel on wide screens, SHALL leave the Model visible and interactive around it, and SHALL be closable by its close button, by Escape, and by activating the Layers button again. Models without Layers SHALL NOT show the Layers button.

#### Scenario: Open the panel
- **WHEN** the visitor activates Layers on a Model with Layers
- **THEN** a panel lists each Layer's label with a checkbox showing whether it is visible

#### Scenario: No Layers configured
- **WHEN** a Model without Layers is displayed
- **THEN** no Layers button is shown

#### Scenario: Close the panel
- **WHEN** the panel is open and the visitor presses Escape, the close button or the Layers button
- **THEN** the panel closes and focus returns to the Layers button

### Requirement: Layer visibility
When the Model loads, each Layer SHALL start in its configured default visibility (visible unless configured otherwise). Toggling a Layer's checkbox SHALL immediately show or hide that group and everything inside it. "Restore defaults" SHALL return every Layer to its default visibility. Changing Layers SHALL NOT move the camera, change Initial framing, or start or stop Auto-orbit, and Reset view SHALL NOT change Layer visibility. Layer visibility SHALL NOT be stored in the URL and SHALL return to defaults on page reload.

#### Scenario: Defaults on load
- **WHEN** Bastings Garden loads
- **THEN** Layers 01–09 are visible and the "Existing landing comparison" and "Roof-loaded 4×4 clearance" Layers are hidden

#### Scenario: Toggle a Layer
- **WHEN** the visitor unchecks a visible Layer
- **THEN** that group disappears from the Model and the camera does not move

#### Scenario: Restore defaults
- **WHEN** the visitor has changed several Layers and activates "Restore defaults"
- **THEN** every Layer returns to its default visibility

#### Scenario: Reset view keeps Layers
- **WHEN** the visitor hides a Layer and then activates Reset view
- **THEN** the camera returns to Initial framing and the Layer stays hidden

#### Scenario: Orbit unaffected
- **WHEN** a Model with Auto-orbit is orbiting and the visitor toggles a Layer
- **THEN** the orbit continues
