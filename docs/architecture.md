# Architecture

Status: Draft

Summarizes the decisions in `AGENTS.md`. If they ever disagree, `AGENTS.md` wins; fix this file.

## Stack

WXT, React, TypeScript, Chrome Manifest V3. Dexie (IndexedDB) and Zod are installed for persistence and validation but are not used until a slice needs them. Vitest for unit tests, Playwright for extension e2e tests.

## Execution contexts

| Context | Entry point | Owns | Must not |
| :--- | :--- | :--- | :--- |
| Side panel | `entrypoints/sidepanel/` | Interactive UI, input, presentation state; may use local persistence from the extension origin | Assume React state survives panel closure |
| Content script | `entrypoints/content.ts` | Bounded, permitted reads of webpages; sends structured data | Pass raw page HTML, collect unrelated browsing data, trust page content |
| Background service worker | `entrypoints/background.ts` | Browser events, toolbar action, cross-context coordination | Act as a long-running server or sole owner of durable state; it can be suspended at any time |

Today the background script sets `openPanelOnActionClick` so the toolbar icon opens the panel. The content script is a template stub with a placeholder `matches` pattern, to be replaced by the first slice that needs page access.

## Code layout

```
entrypoints/        # WXT entry points only; thin wiring
src/components/     # genuinely reusable UI
src/features/<name>/ # feature UI, state, domain logic, tests
src/lib/messaging/  # typed cross-context messages
src/lib/storage/    # shared persistence infrastructure
src/schemas/        # shared validation contracts, only where reuse is justified
tests/unit, tests/e2e
docs/               # product, architecture, conventions, slices
```

Directories are created when the first implementation needs them. Feature logic stays in its feature until reuse is demonstrated.

## Messaging

- Explicit message types with validated payloads.
- Validate at every trust boundary (page to content script, content script to extension, storage reads).
- Return structured success or failure results.
- Handle unavailable tabs, missing content scripts, navigation, and disconnected contexts.
- Use native browser APIs; add no messaging framework unless they prove insufficient.

## Persistence

- Durable records go in the approved local store (IndexedDB via Dexie when a slice requires it), accessed outside presentation components.
- Version schemas and test migrations; never change records destructively without an approved migration.
- Distinguish drafts from committed records. Report a save only after persistence confirms it.
- No recovery promise for cleared storage or deleted profiles without a backup mechanism.

## Permissions and privacy

- Least privilege; document every permission and host access with its reason.
- Currently approved: `sidePanel` only. No host permissions are approved yet.
- No transmission of user or browsing data to remote services without explicit authorization.

## Frontend

Narrow, resizable panel (design for about 320px). Semantic, keyboard-accessible HTML with visible focus. No horizontal overflow. Conventions go in `docs/conventions/frontend.md`.

## Optional AI

Not part of the starter. Introduced only through an approved slice with a privacy and data-flow design, a deterministic fallback, and user approval before any persistent change.

## Verification

`lint`, `typecheck`, `test:ci`, `test:e2e`, `build`, plus manual side-panel checks on the built extension. See `AGENTS.md` "Verifying your work".
