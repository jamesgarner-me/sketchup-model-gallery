## ADDED Requirements

### Requirement: Exported colours shown as authored
The Viewer SHALL treat each material's exported base colour as an sRGB value and display it as authored in SketchUp, not lightened. This corrects exporters that write sRGB values where glTF expects linear ones. Alpha SHALL be unchanged, and materials whose colour comes from a texture SHALL look the same as before. This SHALL apply to every Model.

#### Scenario: Dark colour stays dark
- **WHEN** a Model whose material declares base colour 0.184 (SketchUp #2F302D, near-black) loads
- **THEN** the surface renders near-black, using a linear value of about 0.029

#### Scenario: Textured material unchanged
- **WHEN** a Model with a textured material (base colour factor 1) loads
- **THEN** its base colour factor stays 1 and the texture looks as before

#### Scenario: Transparency kept
- **WHEN** a material's base colour has an alpha below 1
- **THEN** the alpha value is unchanged
