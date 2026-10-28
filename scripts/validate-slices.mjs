// Validates the structure of docs/slices/<slice-name>/{intent,spec,plan}.md.
// Usage: npm run validate:slices
// Exit code 1 if any error is found; warnings do not fail the run.
//
// This checks structure only (files exist, statuses are well formed, criteria
// are identifiable). It cannot judge whether a criterion is actually testable
// or whether an approval really came from a human.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SLICES_DIR = 'docs/slices';
// Every slice must contain all three planning documents.
const FILES = ['intent.md', 'spec.md', 'plan.md'];

// Slice folder names: lowercase words joined by single hyphens, e.g. open-sidepanel.
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Acceptance criterion IDs: an uppercase prefix and a 3-digit number, e.g. PANEL-001.
const ID_RE = /^[A-Z][A-Z0-9]*-\d{3}$/;
// A "Status: ..." line anywhere in the file (multiline so ^ matches each line start).
const STATUS_RE = /^Status:\s*(.+)$/m;
// An approved status must record who approved it and when, e.g.
// "Approved by Jane Doe on 2026-10-28".
const APPROVED_RE = /^Approved by .+ on \d{4}-\d{2}-\d{2}\b/;

// Findings are collected, not thrown, so one run reports every problem at once.
const errors = [];
const warnings = [];
const err = (slice, msg) => errors.push(`${slice}: ${msg}`);
const warn = (slice, msg) => warnings.push(`${slice}: ${msg}`);

// Reads the "Status:" line of one document.
// Returns 'approved', 'draft', or null if the status is missing or invalid.
const parseStatus = (slice, file, text) => {
  const match = text.match(STATUS_RE);
  if (!match) {
    err(slice, `${file} has no "Status:" line`);
    return null;
  }
  const value = match[1].trim();
  if (value.startsWith('Approved')) {
    // "Approved" alone is not enough; the approver and date must be recorded.
    if (!APPROVED_RE.test(value)) {
      err(slice, `${file} is Approved but not in the form "Approved by <name> on YYYY-MM-DD"`);
    }
    return 'approved';
  }
  // Anything starting with "Draft" passes, so notes like "Draft (not approved)" are fine.
  if (value.startsWith('Draft')) return 'draft';
  err(slice, `${file} has unrecognized status "${value}" (expected Draft or Approved)`);
  return null;
};

// Checks the acceptance criteria table in spec.md.
// `seenIds` maps every criterion ID found so far (across all slices) to its slice,
// so an ID reused in a different slice is caught.
const parseCriteria = (slice, text, seenIds) => {
  // A criteria row is a markdown table row whose first cell looks like an ID.
  // The loose "\d+" here (not ID_RE's "\d{3}") lets malformed IDs through to be
  // reported below instead of silently ignored.
  const rows = text.split('\n').filter((line) => /^\|\s*[A-Z][A-Z0-9]*-\d+\s*\|/.test(line));
  if (rows.length === 0) err(slice, 'spec.md has no acceptance criteria rows');

  const ids = new Set(); // IDs seen in this slice, for duplicate detection
  for (const row of rows) {
    // Split "| ID | Criterion | Verification |" into trimmed cells,
    // dropping the empty strings before the first and after the last pipe.
    const cells = row.split('|').slice(1, -1).map((c) => c.trim());
    const [id, criterion, verification] = cells;

    if (!ID_RE.test(id)) err(slice, `criterion ID "${id}" must look like PANEL-001`);
    if (ids.has(id)) err(slice, `duplicate criterion ID ${id}`);
    ids.add(id);
    if (seenIds.has(id)) err(slice, `criterion ID ${id} is also used in slice "${seenIds.get(id)}"`);
    seenIds.set(id, slice);

    // Each criterion needs both a statement and a way to verify it.
    if (cells.length < 3 || !criterion) err(slice, `${id} is missing its criterion text`);
    if (cells.length < 3 || !verification) err(slice, `${id} is missing a verification method`);
  }
};

// Runs every check for one slice folder.
const validateSlice = (slice, seenIds) => {
  if (!NAME_RE.test(slice)) err(slice, 'folder name must be kebab-case');

  const statuses = {}; // file name -> 'draft' | 'approved' | null
  const texts = {}; // file name -> file contents
  for (const file of FILES) {
    const path = join(SLICES_DIR, slice, file);
    if (!existsSync(path)) {
      err(slice, `missing ${file}`);
      continue;
    }
    texts[file] = readFileSync(path, 'utf8');
    statuses[file] = parseStatus(slice, file, texts[file]);
  }

  // Only spec.md holds criteria and the "Done means" checklist.
  if (texts['spec.md']) {
    parseCriteria(slice, texts['spec.md'], seenIds);
    // Accepts a level-2 or level-3 heading, case-insensitive.
    if (!/^#{2,3}\s*Done means\b/im.test(texts['spec.md'])) {
      err(slice, 'spec.md has no "Done means" section');
    }
  }

  // /implement-slice requires both spec and plan to be approved, so a mismatch
  // is worth flagging. It is a warning, not an error: a half-approved slice is
  // a normal state while review is in progress.
  const { 'spec.md': spec, 'plan.md': plan } = statuses;
  if (spec && plan && spec !== plan) {
    warn(slice, `spec.md is ${spec} but plan.md is ${plan}; /implement-slice needs both approved`);
  }
};

// A repo with no slices yet (a fresh template) is valid, not a failure.
if (!existsSync(SLICES_DIR)) {
  console.log(`No ${SLICES_DIR} directory; nothing to validate.`);
  process.exit(0);
}

// Each subdirectory of docs/slices is one slice; stray files are ignored.
const slices = readdirSync(SLICES_DIR)
  .filter((name) => statSync(join(SLICES_DIR, name)).isDirectory())
  .sort();
const seenIds = new Map(); // criterion ID -> slice that first used it
for (const slice of slices) validateSlice(slice, seenIds);

// Report everything, then fail only if there were errors.
for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(
  `Checked ${slices.length} slice(s): ${errors.length} error(s), ${warnings.length} warning(s).`,
);
process.exit(errors.length > 0 ? 1 : 0);
