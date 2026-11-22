# content-publishing Specification

## Purpose

Lets the owner publish or update Models through files and Catalog data, with build-time checks, and deploy them to Vercel without changing viewer logic.

## Requirements

### Requirement: Catalog entry fields
Each Catalog entry SHALL have a unique stable ID, title, Description, GLB path, thumbnail path and manual order, and MAY have a Notes path, initial camera settings and a Stage name.

#### Scenario: Add a Model
- **WHEN** the owner adds a GLB, thumbnail, optional Notes and a Catalog entry
- **THEN** the Model appears in the Gallery and opens in the Viewer with no viewer code changes

#### Scenario: Choose a Stage
- **WHEN** the owner sets an entry's Stage to `showroom`
- **THEN** that Model is displayed on the Showroom stage with no viewer code changes

### Requirement: Build-time validation
The build SHALL fail with a clear message when an entry has a duplicate ID, a missing GLB or thumbnail file, or an unknown Stage name. A missing Notes file or path SHALL NOT fail the build.

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
