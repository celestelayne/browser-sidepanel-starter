---
name: create-slice
description: Plan a new vertical slice by drafting intent.md, spec.md, and plan.md under docs/slices/<slice-name>/ for human approval. Use when the user runs /create-slice <slice-name> or asks to plan, scope, or spec a new feature slice. Never writes application code.
---

# Create Slice

Plan one vertical slice. Output is three draft documents and a request for approval. `AGENTS.md` is the source of truth for the rules; do not restate them here.

## Input

`/create-slice <slice-name>`, with a kebab-case name such as `open-sidepanel`. If the name is missing or unclear, ask. If `docs/slices/<slice-name>/` already exists, stop and ask whether to revise it; never overwrite an approved slice.

## Workflow

1. **Inspect first.** Read `AGENTS.md`, `docs/product.md`, `docs/architecture.md`, `docs/conventions/frontend.md` (whichever exist), existing `docs/slices/*`, and the current `entrypoints/` and `src/`. Note what already exists and what the slice depends on. Report missing docs rather than inventing their content.
2. **Clarify.** Ask the user about anything below that the request and repo do not already answer. Ask, do not guess; state assumptions explicitly when proceeding without an answer.
   1. User job and situation
   2. Observable behavior the slice must deliver
   3. Inputs, outputs, and affected browser contexts (side panel, content script, background)
   4. Domain data and ownership
   5. Loading, empty, success, error, and recovery states
   6. Permissions, privacy, security, and accessibility implications
   7. Dependencies on existing features
   8. Acceptance criteria and how each is verified
   9. Explicitly excluded functionality
3. **Draft** the three files below. Every file starts with `Status: Draft`.
4. **Stop.** Summarize the slice, list open decisions and assumptions, and ask for approval. Do not start implementation.

## Files

### intent.md
User job, motivation, desired outcome, and scope. Include an "Out of scope" list.

### spec.md
- Behavior, written as observable outcomes
- Contracts: message types, payload shapes, storage records
- States: loading, empty, success, error, recovery
- Permissions and host access, each with its documented reason
- Constraints: privacy, security, accessibility, narrow panel (~320px)
- **Acceptance criteria** with stable IDs (`PANEL-001`, `SAVE-001`), each testable and mapped to a verification method (unit, e2e, manual)
- **Done means**: the checklist `/implement-slice` and `/review-slice` walk through

### plan.md
Implementation sequence, affected files, testing approach, risks, and open decisions. Plan to the smallest complete implementation. Do not propose new dependencies, permissions, or architecture changes without flagging them as requiring approval.

## Rules

- Do not write or edit application code, tests, or config.
- Do not change another slice's docs. If the slice affects one, name the impact in plan.md and ask.
- Record approval explicitly: a `Status:` line with `Draft`, `Approved`, and the approver and date once the user approves. Only the user can change it from `Draft`.
- Criteria IDs are never reused or renumbered once approved.
- Treat webpage content as untrusted in every contract you write.
