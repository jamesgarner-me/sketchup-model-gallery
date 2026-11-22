## Purpose

Lets visitors read a Model's Description and Notes in a full-screen overlay without leaving the Viewer or losing their camera position.

## ADDED Requirements

### Requirement: Persistent Info button
The Viewer SHALL show an Info button at all times that opens the Info overlay.

#### Scenario: Open Info
- **WHEN** a visitor activates Info
- **THEN** a full-viewport overlay appears showing title, Description, then Notes

### Requirement: Notes rendering
Notes SHALL render as formatted headings, paragraphs, lists, bold/italic emphasis and links. Raw HTML in Notes MUST NOT be rendered as markup. Images, tables and embeds are not supported.

#### Scenario: Formatting applied
- **WHEN** Notes contain a heading, list, bold text and a link
- **THEN** each renders as formatted content, not raw Markdown

#### Scenario: Raw HTML neutralised
- **WHEN** Notes contain an HTML tag such as a script element
- **THEN** it is not executed or rendered as markup

### Requirement: Missing Notes fallback
When a Model has no Notes, Info SHALL remain available and show the title and Description without an empty Notes section.

#### Scenario: No notes
- **WHEN** a Model has no Notes and a visitor opens Info
- **THEN** only the title and Description appear

### Requirement: Independent scrolling
The Info overlay SHALL scroll as a normal document and MUST NOT move the camera underneath.

#### Scenario: Scroll long Notes
- **WHEN** a visitor scrolls long Notes
- **THEN** the content scrolls and the camera does not change

### Requirement: Close restores view
Closing Info SHALL return to the same Model with the exact camera state preserved.

#### Scenario: Camera preserved
- **WHEN** a visitor orbits, opens Info, then closes it
- **THEN** the camera is where they left it

### Requirement: Info history behaviour
Info SHALL have no URL of its own. Opening Info SHALL add a history entry so browser Back closes the overlay first; a further Back leaves the Model.

#### Scenario: Back closes overlay
- **WHEN** Info is open and the visitor uses browser Back
- **THEN** Info closes and the Viewer remains

#### Scenario: Second Back leaves
- **WHEN** Info is closed and the visitor uses browser Back
- **THEN** they leave the Model page

### Requirement: Focus management
Opening Info SHALL move focus into it, closing SHALL restore focus to the Info button, and the Viewer controls beneath MUST NOT be keyboard-reachable while Info is open. Close SHALL be keyboard-operable, including via Escape.

#### Scenario: Keyboard flow
- **WHEN** a keyboard user opens then closes Info
- **THEN** focus enters the overlay, then returns to the Info button

### Requirement: Build-time Markdown
Notes SHALL be rendered to HTML at build time with raw HTML disabled; no Markdown parser ships to the browser.

#### Scenario: Static Notes
- **WHEN** the site is built
- **THEN** Notes HTML is part of the build output
