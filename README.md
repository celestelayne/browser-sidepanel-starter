# Chrome Browser Sidepanel Starter

A reusable Chrome browser-extension starter built with WXT, React, TypeScript, and Manifest V3, designed for incremental product development with Claude Code.

Build browser side-panel applications through small, testable vertical slices using an explicit plan → approve → implement → review workflow.

> Project status: In development. The first milestone is a working React side panel that opens from the Chrome extension toolbar.

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

Use Use this template on GitHub to create a new repository.

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

WXT generates the development extension in its output directory.

Follow WXT's development instructions to load the extension into Chrome, or use the browser-launch behavior configured by your project.

For manual loading:

- Open chrome://extensions.
- Enable Developer mode.
- Select Load unpacked.
- Select the generated Chrome extension directory.
- Pin the extension to the toolbar.

### 4. Open the side panel

Click the extension's toolbar icon.

Once the open-sidepanel slice is implemented, this action should open the React interface alongside the current webpage.

If it does not open, inspect the generated manifest, the sidePanel permission, and the extension service-worker console.

### 5. Build for production

```
npm run build
```

Check the WXT build output and generated manifest before packaging or distributing the extension.

## AI-assisted development workflow

The project uses three Claude Code skills.

| Skill | Responsibility |
| :----------- | :---------------- |
| /create-slice | Clarify the user job, draft requirements and implementation plan |
| /implement-slice | Implement an approved slice and run verification |
| /review-slice | Review the implementation against requirements and engineering standards |

### Example: building the first slice

Start Claude Code in the repository:
```
claude
```
Plan the first slice:
```
/create-slice open-sidepanel
```
Review the generated files:
```
docs/slices/open-sidepanel/
  intent.md
  spec.md
  plan.md
```
Approve the specification and plan before implementation.

Then run:
```
/implement-slice open-sidepanel
```
After implementation and testing:

```
/review-slice open-sidepanel
```

Resolve any blocking findings, review the result, and merge through the project's normal GitHub workflow.

The skills guide development behavior. They do not replace automated tests, repository permissions, or human approval.

See `AGENTS.md` for the full operating rules.

## Documentation
- [Agent instructions](./AGENTS.md)
- [Product definition](./docs/product.md)
- [Architecture](./docs/architecture.md)
- [Slice specifications](./docs/slices)

## References

- [WXT](https://wxt.dev/)
- [Chrome Extensions documentation](https://developer.chrome.com/docs/extensions/)
- [Chrome Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
- [Manifest V3 service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)
- [Playwright Chrome extension testing](https://playwright.dev/docs/chrome-extensions)

## License
License to be determined before public release.