# model-info Specification

## Purpose

Lets visitors read a Model's Description and Notes in a full-screen overlay without leaving the Viewer or losing their camera position.

## Requirements

### Requirement: Persistent Info button
The Viewer SHALL show an Info button at all times, at the right end of the top bar, that opens the Info overlay. It SHALL be an icon-only button showing a circled "i", with the accessible name "Info", the same size as the home button and at least a finger-sized touch target. It SHALL be visually prominent: filled with the accent colour so it stands out from the other top-bar controls on every Stage.

#### Scenario: Open Info
- **WHEN** a visitor activates Info
- **THEN** a full-viewport overlay appears showing title, Description, then Notes

#### Scenario: Info in the top right
- **WHEN** a Model is displayed in portrait or landscape
- **THEN** the Info button is at the top right, opposite the home button, announced as "Info", and the title sits between them

#### Scenario: Info is noticeable
- **WHEN** a Model is displayed on the Neutral or Showroom stage
- **THEN** the Info button is filled with the accent colour and clearly stands out against the background and the home button

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
