## ADDED Requirements

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
