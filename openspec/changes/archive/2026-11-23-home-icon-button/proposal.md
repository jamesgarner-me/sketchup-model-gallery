## Why

The Viewer's top-left "← Gallery" text button is wordier than it needs to be and takes space from the Model title on phones. A home icon is a widely understood way back to the start.

## What Changes

- Replace the top-left "← Gallery" text button with an icon-only button showing a house icon, same position next to the title.
- The button keeps the accessible name "Gallery" and shows a "Back to gallery" tooltip on hover.
- The icon is an inline SVG drawn in the button's text colour, so it suits light and dark Stages. No icon library.
- The "Back to Gallery" text buttons on the load-failure and "Model not found" screens stay as they are.

## Capabilities

### New Capabilities

None.

### Modified Capabilities
- `model-viewer`: the persistent back-to-Gallery control becomes an icon button with an accessible name.

## Impact

- `model.html`, `src/viewer/viewer.css` (square icon button), `tests/smoke.e2e.ts` (locates the link by its new accessible name).
