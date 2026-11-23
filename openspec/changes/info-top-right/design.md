## Context

The top bar holds the home button (`.btn.btn-icon`, 44 px, inline SVG) and the title (`h1`, ellipsis on overflow). The bottom `.controls-row` holds Reset view, Viewpoints (hidden without Viewpoints) and Info, which is wrapped in an unused `#info-slot` span. Dark Stages restyle `.btn` via `.viewer[data-theme="dark"]`. The `<dialog>` restores focus to the opener on close, so moving the button keeps focus return.

## Goals / Non-Goals

**Goals:** Info at top right, icon-only, clearly noticeable on both Stages; no behaviour change.

**Non-Goals:** changing the Info overlay, restyling home or bottom buttons, reworking the layout for Layers.

## Decisions

1. **Markup:** move `#info-btn` into the `header.topbar` after the title (drop `#info-slot`). Keep `id="info-btn"` and `aria-haspopup="dialog"`, so `main.ts` needs no change. Add `aria-label="Info"` and `title="Info"`; the SVG is `aria-hidden`.
2. **Icon:** inline SVG circled "i" (Feather/Lucide-style `info` icon), drawn at 24 px (home is 22 px) for weight.
3. **Prominence:** a `.btn-accent` modifier: accent background, white glyph, no border, soft shadow; hover slightly darker. On dark Stages: `#8ab4ff` fill with a near-black glyph, matching the existing dark focus/slider accent. Visible focus ring stays (offset outline). Alternative considered: icon plus "Info" text label; rejected (user chose icon-only) but available if the iPhone check finds it too easy to miss.
4. **Layout:** the title takes the flexible middle (`flex: 1; min-width: 0`) so Info is pushed to the right edge and never shrinks; safe-area padding already applies to the top bar.
5. **Tests:** e2e that locate Info by text switch to `getByRole('button', { name: 'Info' })` (still matches via `aria-label`), plus a check that Info's box is in the top-right quadrant on desktop and phone.

## Risks / Trade-offs

- [Icon-only is less discoverable than a text label] → accent fill makes it the most prominent control; judged on the iPhone check, with the text label as fallback.
- [Merge overlap with `model-layers` in `model.html`'s bottom row] → whichever lands second resolves a one-line conflict.
