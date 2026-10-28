# Chrome Browser Sidepanel Starter

A reusable Chrome browser-extension starter built with WXT, React, TypeScript, and Manifest V3, designed for incremental product development with Claude Code.

Build browser side-panel applications through small, testable vertical slices using an explicit plan → approve → implement → review workflow.

> Project status: Usable starter. Clicking the toolbar icon opens a minimal React side panel (header, main region, footer). It contains no product features; add them one slice at a time.

## Overview
Browser Side Panel Starter provides a foundation for building applications that remain accessible alongside the websites people visit.

The starter emphasizes:
- A React interface inside Chrome's side panel
- WXT-managed Manifest V3 entry points
- Clear boundaries between the side panel, content scripts, and background service worker
- TypeScript and explicit data contracts
- Accessible, responsive interfaces
- Browser lifecycle awareness
- Automated verification
- Human-reviewed AI-assisted development

The starter is intended to be reusable across different browser-extension products.

## Getting Started
### Prerequisites
- Node.js compatible with the installed WXT version
- npm
- Google Chrome or a compatible Chromium browser
- Git
- Claude Code (optional for running the extension; used for the documented development workflow)

### 1. Create your repository

Click **Use this template** on GitHub to create a new repository.

Alternatively, clone this repository:

```
git clone <repository-url>
cd browser-sidepanel-starter
```
Replace <repository-url> with the actual repository URL.

### 2. Install dependencies

```
npm install
```

### 3. Start the development environment

```
npm run dev
```

WXT builds the development extension to `.output/chrome-mv3-dev` and may launch a browser with it loaded.

Follow WXT's development instructions to load the extension into Chrome, or use the browser-launch behavior configured by your project.

For manual loading:

- Open chrome://extensions.
- Enable Developer mode.
- Select Load unpacked.
- Select `.output/chrome-mv3-dev` (or `.output/chrome-mv3` after `npm run build`).
- Pin the extension to the toolbar.

### 4. Open the side panel

Click the extension's toolbar icon.

The side panel opens alongside the current webpage and shows the starter shell.

If it does not open, inspect the generated manifest, the sidePanel permission, and the extension service-worker console.

### 5. Build for production

```
npm run build
```

Check the WXT build output and generated manifest before packaging or distributing the extension.

The starter requests only the `sidePanel` permission and ships no content script or host access. When a slice needs to read a webpage, add `entrypoints/content.ts` with a narrow `matches` pattern and document the host access in that slice's spec.

## Checks

| Command | Purpose |
| :--- | :--- |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run test` / `npm run test:ci` | Vitest unit tests (watch / one-shot) |
| `npm run build` then `npm run test:e2e` | Playwright smoke tests against the built extension in `.output/chrome-mv3` |
| `npm run validate:slices` | Check the structure of `docs/slices/*` |

The end-to-end tests load the built extension in Chromium, so run `npm run build` first. On a new machine, install the browser once with `npx playwright install chromium`.

The e2e tests open the built `sidepanel.html` in a tab. They do not verify that the toolbar click opens the real side panel; check that manually in Chrome.

## AI-assisted development workflow

The project uses three Claude Code skills.

| Skill | Responsibility |
| :----------- | :---------------- |
| /create-slice | Clarify the user job, draft requirements and implementation plan |
| /implement-slice | Implement an approved slice and run verification |
| /review-slice | Review the implementation against requirements and engineering standards |

The skills live in `.claude/skills/`. If Claude Code does not list them, restart it.

### Example: building your first slice

Start Claude Code in the repository:
```
claude
```
Plan a slice, replacing `<slice-name>` with a short kebab-case name for your feature:
```
/create-slice <slice-name>
```
Review the generated files:
```
docs/slices/<slice-name>/
  intent.md
  spec.md
  plan.md
```
Approve the specification and plan before implementation by marking each `Status:` line `Approved by <name> on YYYY-MM-DD`, then run `npm run validate:slices`.

Then run:
```
/implement-slice <slice-name>
```
After implementation and testing:

```
/review-slice <slice-name>
```

Resolve any blocking findings, review the result, and merge through the project's normal GitHub workflow.

The skills guide development behavior. They do not replace automated tests, repository permissions, or human approval.

See `AGENTS.md` for the full operating rules.

## Documentation
- [Agent instructions](./AGENTS.md)
- [Product definition](./docs/product.md)
- [Architecture](./docs/architecture.md)
- [Frontend conventions](./docs/conventions/frontend.md)
- [Slice specifications](./docs/slices)

## References

- [WXT](https://wxt.dev/)
- [Chrome Extensions documentation](https://developer.chrome.com/docs/extensions/)
- [Chrome Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
- [Manifest V3 service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)
- [Playwright Chrome extension testing](https://playwright.dev/docs/chrome-extensions)

## License
[MIT](./LICENSE)