---
name: implement-slice
description: Implement an approved vertical slice from docs/slices/<slice-name>/ with code, tests, and verification, then report results against every acceptance criterion. Use when the user runs /implement-slice <slice-name> or asks to build an approved slice. Refuses to start if the spec and plan are not approved.
---

# Implement Slice

Build one approved slice. `AGENTS.md` is the source of truth for architecture guardrails, the "Never" list, and the verification checklist; follow it, do not restate it.

## Input

`/implement-slice <slice-name>`. If the name is missing, ask.

## Workflow

1. **Gate on approval.** Read `docs/slices/<slice-name>/intent.md`, `spec.md`, and `plan.md`. If any is missing, or `spec.md` or `plan.md` is not marked `Approved` by the user, stop and say so. Never mark a document approved yourself.
2. **Check compatibility.** Inspect the current implementation, related tests, `package.json` scripts, and the generated manifest. Look for missing contracts, unresolved decisions in plan.md, and conflicts with existing code.
3. **Stop on material changes.** If the work needs a scope change, new dependency, new permission or host access, schema change, or architecture change not in the approved plan, stop and ask. Do not edit the approved docs to fit.
4. **Implement** within the approved scope, in the plan's sequence:
   - Follow WXT entry-point and feature-folder conventions.
   - Validate data at every trust boundary (messages, storage, webpage input).
   - Handle loading, error, retry, and recovery states from the spec.
   - Add or update tests mapped to acceptance criteria IDs.
   - Preserve existing functionality and user data.
   - Keep the change small enough to review.
5. **Verify.** Run `npm run lint`, `typecheck`, `test:ci`, `test:e2e`, and `build`, then walk the spec's "Done means" list and the `AGENTS.md` "Verifying your work" checklist. Never claim a check passed unless it ran and passed. Report scripts that are missing or fail to run, and anything unverified (for example, manual side-panel checks you could not perform).
6. **Report.**
   - Changed files
   - Behavior completed, per acceptance criterion ID, with how it was verified
   - Actual test and check results
   - Deviations from the plan and known limitations
   - Anything not verified and why

## Rules

- Do not edit or weaken a test solely to make it pass. Fix the code, or raise the spec question.
- Do not implement behavior from other slices or future features.
- Do not commit, merge, publish, or deploy unless the user asks. Completion does not imply approval to merge.
- If a defect is inside approved scope, fix it and rerun the relevant checks. If it reveals a new requirement or changed criterion, return to planning.
- Record implementation status in the slice docs only as facts (for example, "Implemented, pending review"), never as approval.
