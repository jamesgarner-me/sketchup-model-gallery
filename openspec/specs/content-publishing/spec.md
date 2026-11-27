# content-publishing Specification

## Purpose

Lets the owner publish or update Models through files and Catalog data, with build-time checks, and deploy them to Vercel without changing viewer logic.

## Requirements

### Requirement: Catalog entry fields
Each Catalog entry SHALL have a unique stable ID, title, Description, GLB path, thumbnail path and manual order, and MAY have a Notes path, initial camera settings, a Stage name, an Auto-orbit setting, an Explode setting (true or false; default off) and a list of Layers. Each Layer SHALL name a top-level group in the GLB and MAY give a display label (defaulting to the group name) and a default visibility (defaulting to visible). When a single group wraps the whole Model, its sections SHALL count as the top-level groups.

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

#### Scenario: Model wrapped in one group
- **WHEN** a GLB's only top-level group wraps the whole Model (e.g. "Final staircase") and the owner lists its sections as Layers
- **THEN** the build accepts them and visitors can show and hide each section

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

### Requirement: Hosting and routing
The site SHALL deploy to Vercel on push, with `/models/<id>` served by the single Viewer page, on the default `*.vercel.app` URL.

#### Scenario: Hosted direct link
- **WHEN** a visitor opens `/models/<id>` on the deployed site
- **THEN** the Viewer loads that Model, including after refresh

### Requirement: Public content
All Models, Descriptions and Notes SHALL be publicly accessible without sign-in.

#### Scenario: Anonymous access
- **WHEN** an unauthenticated visitor opens the site
- **THEN** all content is available

### Requirement: Viewpoints from saved Scenes
Every saved SketchUp Scene in a Model's GLB export SHALL become a Viewpoint, with no Catalog fields required. The export's `Active View` SHALL NOT become a Viewpoint. Viewpoint labels SHALL be the Scene names and their order SHALL be the export's Scene order. A Model whose export has no saved Scenes SHALL build and display normally, with no Viewpoints.

#### Scenario: Add a Viewpoint
- **WHEN** the owner adds a Scene in SketchUp, re-exports the GLB and rebuilds
- **THEN** the Model shows that Scene as a Viewpoint, with no Catalog or viewer code changes

#### Scenario: Active View excluded
- **WHEN** an export contains `Active View` and one saved Scene
- **THEN** the Model has exactly one Viewpoint

#### Scenario: No Scenes
- **WHEN** an export contains no saved Scenes
- **THEN** the build succeeds and the Model has no Viewpoints
