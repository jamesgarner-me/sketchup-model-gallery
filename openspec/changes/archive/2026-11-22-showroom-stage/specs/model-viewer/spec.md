## MODIFIED Requirements

### Requirement: Neutral appearance
The Viewer SHALL display each Model on its Stage. A Model with no Stage set SHALL use the Neutral stage: a neutral light background and simple even lighting.

#### Scenario: Default look
- **WHEN** a Model with no Stage set is displayed
- **THEN** it appears on a neutral background with simple lighting

## ADDED Requirements

### Requirement: Showroom stage
The Showroom stage SHALL present the Model as if on display in a dark room: a near-black background with a soft glow beneath the Model and darkened edges, and lighting from several distinct directions (key, fill, rim and overhead) that lights the Model and shows in its reflections. Its lighting asset SHALL be fetched only for Models on the Showroom stage.

#### Scenario: Showroom look
- **WHEN** a Model on the Showroom stage is displayed
- **THEN** it appears on a near-black background, lit from several directions

#### Scenario: No extra download on Neutral
- **WHEN** a Model on the Neutral stage is displayed
- **THEN** the Showroom lighting asset is not requested

### Requirement: Controls match the Stage
On a dark Stage, the Viewer's back link, title, Reset view, Info button, loading indicator and load-failure screen SHALL use a dark style that stays legible. The Info overlay and the "Model not found" screen SHALL keep the light style.

#### Scenario: Dark controls
- **WHEN** a Model on the Showroom stage is displayed
- **THEN** the controls are dark-styled and legible against the background

#### Scenario: Info stays light
- **WHEN** Info is opened on a Showroom-stage Model
- **THEN** the overlay uses the light reading style
