## Purpose

Lets visitors browse every published Model from a landing page and open any Model's Viewer.

## ADDED Requirements

### Requirement: Gallery lists all Catalog Models
The Gallery SHALL display one card per Catalog Model, ordered by the Catalog's manual order, each showing thumbnail, title, Description and a link to that Model's Viewer.

#### Scenario: Cards shown in catalog order
- **WHEN** a visitor opens `/`
- **THEN** each Model appears as a card in Catalog order with thumbnail, title and Description

#### Scenario: Card opens its Viewer
- **WHEN** a visitor activates a card
- **THEN** the browser navigates to `/models/<id>` for that Model

### Requirement: Gallery is responsive
The Gallery SHALL present cards in a single column on narrow phone screens and multiple columns on wider screens, without horizontal scrolling.

#### Scenario: Phone portrait
- **WHEN** the viewport is phone-width
- **THEN** cards stack in one column and no horizontal scroll appears

### Requirement: Gallery defers 3D assets
The Gallery SHALL load thumbnails only and MUST NOT fetch any Model GLB until its Viewer is opened.

#### Scenario: No GLB fetched on landing
- **WHEN** the Gallery loads
- **THEN** no `.glb` request is made

### Requirement: Gallery accessibility basics
Each card SHALL have a text title as its link name and its thumbnail SHALL have alternative text.

#### Scenario: Thumbnail alt text
- **WHEN** a screen reader reaches a card thumbnail
- **THEN** it announces the Model title or equivalent alt text
