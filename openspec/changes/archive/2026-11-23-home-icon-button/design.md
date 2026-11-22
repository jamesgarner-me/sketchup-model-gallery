## Context

`model.html` has `<a class="btn" id="back" href="/">&larr; Gallery</a>` in the top bar. `.btn` (in `src/base.css`) is a 44 px tall, padded, pill-cornered button; dark Stages restyle it via `[data-theme="dark"] .btn`. The smoke test finds the link by the name "← Gallery".

## Goals / Non-Goals

**Goals:** icon-only home button, same position and behaviour, accessible name "Gallery", works on light and dark Stages.

**Non-Goals:** changing the recovery buttons on error screens, adding an icon library.

## Decisions

1. **Markup:** keep the same `<a id="back" href="/">`, add `aria-label="Gallery"` and `title="Back to gallery"`, and replace the text with an inline `<svg aria-hidden="true" focusable="false">` house outline (`stroke="currentColor"`, 22 px).
2. **Styling:** a `.btn-icon` modifier makes the button a 44×44 px square with no horizontal padding. Colour comes from `currentColor`, so the existing dark-theme rule recolours it with no extra CSS.
3. **Test:** the smoke test clicks `getByRole('link', { name: 'Gallery', exact: true })`, so it also checks the accessible name.

## Risks / Trade-offs

- [Icon-only is less explicit than text] → the house icon is widely understood; tooltip on desktop; accessible name for assistive technology.
