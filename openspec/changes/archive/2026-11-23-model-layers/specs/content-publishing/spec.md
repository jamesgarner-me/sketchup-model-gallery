## MODIFIED Requirements

### Requirement: Catalog entry fields
Each Catalog entry SHALL have a unique stable ID, title, Description, GLB path, thumbnail path and manual order, and MAY have a Notes path, initial camera settings, a Stage name, an Auto-orbit setting and a list of Layers. Each Layer SHALL name a top-level group in the GLB and MAY give a display label (defaulting to the group name) and a default visibility (defaulting to visible).

#### Scenario: Add a Model
- **WHEN** the owner adds a GLB, thumbnail, optional Notes and a Catalog entry
- **THEN** the Model appears in the Gallery and opens in the Viewer with no viewer code changes

#### Scenario: Choose a Stage
- **WHEN** the owner sets an entry's Stage to `showroom`
- **THEN** that Model is displayed on the Showroom stage with no viewer code changes

#### Scenario: Enable Auto-orbit
- **WHEN** the owner sets an entry's Auto-orbit to `true` or to a speed in degrees per second
- **THEN** that Model orbits on load with no viewer code changes

#### Scenario: Add Layers
- **WHEN** the owner lists top-level group names as Layers in an entry
- **THEN** visitors can show and hide those groups with no viewer code changes

### Requirement: Build-time validation
The build SHALL fail with a clear message when an entry has a duplicate ID, a missing GLB or thumbnail file, an unknown Stage name, an invalid Auto-orbit setting, or a Layer that is malformed, duplicated within the entry, or not a top-level group in that entry's GLB. A missing Notes file or path SHALL NOT fail the build.

#### Scenario: Missing GLB
- **WHEN** an entry's GLB path does not exist
- **THEN** the build fails naming the entry and file

#### Scenario: Duplicate ID
- **WHEN** two entries share an ID
- **THEN** the build fails naming the ID

#### Scenario: No Notes
- **WHEN** an entry omits Notes
- **THEN** the build succeeds

#### Scenario: Unknown Stage
- **WHEN** an entry's Stage is not a known Stage name
- **THEN** the build fails naming the entry and the Stage

#### Scenario: Invalid Auto-orbit
- **WHEN** an entry's Auto-orbit is neither a boolean nor an object with a non-zero numeric `degreesPerSecond`
- **THEN** the build fails naming the entry

#### Scenario: Layer not in model
- **WHEN** an entry lists a Layer whose group name is not a top-level group in its GLB
- **THEN** the build fails naming the entry and the Layer
