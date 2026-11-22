## ADDED Requirements

### Requirement: Optional Auto-orbit
A Model whose Catalog entry enables Auto-orbit SHALL rotate slowly about its vertical axis as soon as it loads, at the configured speed (default 18 degrees per second; a negative speed reverses direction). Models without it SHALL stay still. Auto-orbit SHALL NOT run when the device requests reduced motion. On Models with Auto-orbit, the library's idle interaction prompt SHALL NOT be shown.

#### Scenario: Orbit on load
- **WHEN** a Model with Auto-orbit enabled finishes loading
- **THEN** it rotates continuously at its configured speed

#### Scenario: Off by default
- **WHEN** a Model without Auto-orbit is displayed
- **THEN** it does not rotate on its own

#### Scenario: Reduced motion
- **WHEN** the device requests reduced motion
- **THEN** a Model with Auto-orbit enabled stays still

### Requirement: Visitor control ends Auto-orbit
The first visitor camera interaction (orbit, pan or zoom) SHALL stop Auto-orbit for the rest of the page visit. Reset view SHALL also stop Auto-orbit and SHALL return the Model to its Initial framing, including undoing any rotation Auto-orbit applied.

#### Scenario: Touch stops orbit
- **WHEN** the visitor drags, pinches or zooms an orbiting Model
- **THEN** the rotation stops and does not resume

#### Scenario: Reset after orbit
- **WHEN** the visitor activates Reset view on a Model that has been orbiting
- **THEN** the Model returns to its Initial framing and stays still

### Requirement: Info pauses Auto-orbit
While Info is open, Auto-orbit SHALL pause. On closing Info it SHALL resume, unless the visitor had already taken control.

#### Scenario: Pause and resume
- **WHEN** the visitor opens and then closes Info on an orbiting Model they have not touched
- **THEN** rotation pauses while Info is open and resumes after it closes
