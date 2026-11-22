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
A visitor camera interaction (orbit, pan or zoom) SHALL stop Auto-orbit, and it SHALL NOT resume on its own. On a Model with Auto-orbit enabled, Reset view SHALL return the Model to its Initial framing, including undoing any rotation Auto-orbit applied, and SHALL then restart Auto-orbit once the camera has settled. This applies whether or not the visitor had already stopped it. The next visitor camera interaction SHALL stop it again. When the device requests reduced motion, Reset view SHALL return to Initial framing and leave the Model still.

#### Scenario: Touch stops orbit
- **WHEN** the visitor drags, pinches or zooms an orbiting Model
- **THEN** the rotation stops and does not resume on its own

#### Scenario: Reset restarts orbit
- **WHEN** the visitor activates Reset view on a Model with Auto-orbit enabled after stopping it
- **THEN** the Model returns to its Initial framing and, once the camera settles, starts orbiting again

#### Scenario: Reset while still orbiting
- **WHEN** the visitor activates Reset view while the Model is still orbiting untouched
- **THEN** the Model returns to its Initial framing and continues orbiting from there

#### Scenario: Touch after Reset
- **WHEN** the visitor drags, pinches or zooms after Reset has restarted the orbit
- **THEN** the rotation stops again

#### Scenario: Reset with reduced motion
- **WHEN** the device requests reduced motion and the visitor activates Reset view
- **THEN** the Model returns to its Initial framing and stays still

### Requirement: Info pauses Auto-orbit
While Info is open, Auto-orbit SHALL pause. On closing Info it SHALL resume, unless the visitor had already taken control.

#### Scenario: Pause and resume
- **WHEN** the visitor opens and then closes Info on an orbiting Model they have not touched
- **THEN** rotation pauses while Info is open and resumes after it closes
