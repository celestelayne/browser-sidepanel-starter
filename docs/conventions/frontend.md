# Frontend Conventions

Status: Draft

Conventions for the React side panel. Rules in `AGENTS.md` ("Frontend and accessibility") take precedence; this file adds practical detail. The current shell in `entrypoints/sidepanel/` is the reference implementation.

## The panel

- Design for a narrow, resizable panel. Treat about 320px as the minimum width and test wider widths too.
- No horizontal overflow. Let long unbroken text wrap (`overflow-wrap: anywhere`), and avoid fixed widths and `min-width` values above 320px.
- Do not assume React state survives closing the panel. Anything the user would be upset to lose is a committed record or a draft handled by the persistence layer, not component state.

## Structure and semantics

- Use landmarks: one `<header>`, one `<main>`, one `<footer>` per view. One `<h1>` per view, with headings in order.
- Use real elements: `<button>` for actions, `<a href>` for navigation, `<label>` tied to each form control. No clickable `<div>`s.
- Give every control an accessible name. Icon-only buttons need `aria-label`.
- Decorative images and emoji that add no meaning should not carry information; put essential information in text.
- Never inject webpage content as raw HTML (no `dangerouslySetInnerHTML` with page data). Render it as text.

## Keyboard and focus

- Everything usable by mouse is usable by keyboard, in a logical tab order.
- Keep the global `:focus-visible` outline. Do not remove outlines without a visible replacement.
- When a view changes or a dialog opens, move focus deliberately, and return it when it closes.

## Status and feedback

- Show explicit loading, empty, error, and success states for anything asynchronous.
- Status text must be accurate. Say "Saved" only after persistence confirms it.
- Announce important changes with `role="status"` (polite) or `role="alert"` (urgent errors).
- Errors say what happened and what the user can do next, and offer retry where it makes sense.

## Styling

- Plain CSS in `style.css` or colocated feature stylesheets. No UI library or CSS framework without approval.
- Use the CSS custom properties defined on `:root` (`--bg`, `--fg`, `--muted`, `--border`, `--focus`) instead of hardcoded colors, so light and dark mode both work.
- Follow `prefers-color-scheme`. Check text contrast in both modes.
- Respect `prefers-reduced-motion` for any animation.
- Prefer `rem` for sizing and spacing.

## Components and state

- Keep feature UI in `src/features/<feature>/`. Move a component to `src/components/` only after a second feature needs it.
- Prefer small function components and composition over variants and configuration props.
- Use React state and hooks. Do not add a global state library while React state and the persistence layer are enough.
- Keep database and messaging calls out of presentation components; call them through feature hooks or modules.
- Validate data from storage and messages before it reaches the UI.

## Testing

- Unit tests in `tests/unit` cover component output and logic. They run in Node; use `react-dom/server` for markup checks until a DOM test library is approved.
- Playwright tests in `tests/e2e` run against the built extension. Check landmarks and roles with `getByRole`, and include a 320px overflow check for new views.
- Verify keyboard navigation and focus manually in the real side panel.
