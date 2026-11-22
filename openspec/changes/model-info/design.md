## Context

The archived `model-viewer` change delivered a catalog-driven Viewer (`model.html`, `src/viewer/main.ts`) with an empty `#info-slot` in the controls and a Vite build that already validates the catalog. The catalog entry has an optional `notes` field. The viewer element stays mounted for the page's life, so overlay approaches keep camera state for free. See proposal.md and the `model-info` spec.

## Goals / Non-Goals

**Goals:**
- Info overlay meeting every scenario in the spec, with keyboard and focus handled by the platform where possible.
- Notes rendered at build time with no Markdown parser shipped to the browser.

**Non-Goals:**
- Gallery changes, Notes authoring UI, images/tables/embeds in Notes.

## Decisions

1. **Overlay is a native `<dialog>` opened with `showModal()`.** It gives a top-layer full-viewport surface, makes everything behind it inert (so Viewer controls are not keyboard-reachable), traps focus, moves focus in, restores focus to the opener on close, and handles Escape. Alternative: hand-rolled `div` plus `inert` and focus trapping; rejected as more code for the same result.
2. **History:** opening Info calls `history.pushState({info: true})`. `popstate` closes the dialog. The Close button and Escape (via the dialog's `cancel` event, with default prevented) call `history.back()` when Info owns the top history entry, so Back and Close behave identically; a further Back leaves the Model. Info has no URL of its own. If Info is closed by other means, no stray entry remains because every close goes through `history.back()`.
3. **Camera preservation:** the `<model-viewer>` is never unmounted or hidden, only covered, so camera state is untouched.
4. **Markdown:** `marked` run in a small Vite plugin that transforms `src/content/*.md?html`-style imports into an exported HTML string at build time. A pure `renderNotes(markdown)` function in `src/markdown.ts` does the work so Vitest can test it. Raw HTML tokens are escaped to text; links with schemes other than `http`, `https` and `mailto` are rendered as plain text; external links get `rel="noopener noreferrer"`. Alternative: runtime parser; rejected (payload, XSS surface).
5. **Notes lookup:** `import.meta.glob('/src/content/*.md')` keyed by filename. A Model's Notes are `src/content/<id>.md` unless its catalog `notes` field names another file in that folder. No file means no Notes, never a build error (matches `content-publishing`).
6. **Fallback:** with no Notes, Info shows only title and Description; the Notes section is not rendered.
7. **Scrolling:** content area is the scroll container with `overscroll-behavior: contain`; the dialog sits above the viewer so wheel and touch scrolling never reach the camera. `touch-action` on the overlay is left at default.
8. **Layout:** Info button lives in `#info-slot` using the existing `.btn` style. Dialog respects safe-area insets and has a visible, 44 px Close button, readable typography and a comfortable measure.
9. **Tests:** Vitest for `renderNotes` (headings, paragraphs, lists, bold/italic, links, raw HTML escaped, `javascript:` link neutralised, empty input). Browser behaviour checked with a Playwright script against the dev server and manually on an iPhone; the permanent Playwright smoke test arrives in `model-gallery`.

## Risks / Trade-offs

- [Safari `<dialog>` quirks (focus, scroll lock, `cancel` event)] → test on iPhone Safari; fall back to explicit handlers if needed.
- [History entry gets out of sync if the user navigates away while Info is open] → `popstate` handler is the single source of truth for closing.
- [Placeholder Notes could be mistaken for real content] → mark clearly as placeholder in the file and ask the owner to replace.
- [Markdown dependency footprint] → build-time only; nothing added to the browser bundle.

## Open Questions

- Exact typography and overlay styling can be settled during implementation.
