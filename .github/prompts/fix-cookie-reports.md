# Fix Cookie Rejection Reports

## Role & Objective

You are an automated agent that fixes cookie popup rejection failures reported by users of the Reject Cookies browser extension. Read CLAUDE.md first — it contains the full architecture, provider list, selector conventions, and patterns you must follow.

## Environment Variables

These are available in your environment:

- `COOKIE_API_BASE` — Base URL for the cookie reports API (no trailing slash)
- `COOKIE_API_TOKEN` — Bearer token for API authentication
- `RUN_DATE` — Date string for this run (e.g., `2026-02-24`), used in branch naming
- `SNAPSHOT_COUNT` — Number of snapshots available (informational)

## Step 1 — Fetch the Report Manifest

Fetch the list of sites to fix:

```
GET ${COOKIE_API_BASE}/api/reports/latest-manifest
Authorization: Bearer ${COOKIE_API_TOKEN}
```

The response is a JSON array of report objects. Each report has at minimum:
- `id` — Report ID (used for marking fixed and fetching snapshots)
- `url` — The site URL where the cookie popup wasn't rejected

If the manifest is empty or the request fails, log the reason and exit cleanly — do not create a branch or PR.

## Step 2 — Analyze Each Site

For each report in the manifest, fetch its HTML snapshot:

```
GET ${COOKIE_API_BASE}/api/reports/{id}/snapshot
Authorization: Bearer ${COOKIE_API_TOKEN}
```

The response is the raw HTML of the page as captured by a headless browser.

Analyze the HTML to identify which CMP is present and what fix is needed:

1. **Check for known providers first.** Compare the HTML against the detection selectors for each existing provider in `src/checks.ts`. If a provider's container element is present, check whether its rejection button selectors (from `src/rejectFlows/`) still match. Identify any broken or missing selectors and find the correct replacements in the HTML.

2. **Search for unrecognized CMPs.** If no existing provider matches, look for common CMP patterns:
   - Common CMP framework signatures: OneTrust, CookieBot, Didomi, Quantcast, Sourcepoint, etc.
   - Generic cookie consent patterns: elements with "cookie", "consent", "gdpr" in IDs or classes
   - If you identify the platform, you'll add it as a new provider.

## Step 3 — Implement Code Changes

Group fixes by provider to minimize file changes. Follow these rules strictly:

### For existing providers (selector updates)
- Update detection selectors in `src/checks.ts`
- Update rejection button selectors in `src/rejectFlows/` (either `index.ts` or the provider's dedicated file)
- Do NOT change the provider name in `src/providers.ts`

### For new providers
Follow the pattern in CLAUDE.md — "Adding a New Cookie Provider":
1. Add a detection function in `src/checks.ts`
2. Add a rejection function in `src/rejectFlows/index.ts` (or a new file for complex cases like shadow DOM)
3. Register in `commonCookiePopupChecks` array in `src/providers.ts`

### Selector quality rules
- Prefer `getElementById` for known IDs
- Use `querySelector` with data attributes or class prefixes for elements without stable IDs
- Use `[id^="prefix"]` for dynamic IDs with stable prefixes
- Never use `nth-child`, deeply nested paths, or hash-based class names
- Verify selectors actually exist in the HTML snapshot before using them

### If a report is unfixable
Some reports may not be actionable — the HTML may not contain enough information, or the CMP may use techniques we can't handle (e.g., new closed shadow DOM patterns). Skip these and note them for the PR body.

## Step 4 — Verify

After making all code changes, run:

```bash
npm run lint
npm run build
```

Both must pass. If lint reports auto-fixable issues, run `npm run lint` (it auto-fixes). If build fails, investigate and fix the error. If a specific provider's changes cause the failure, revert that provider's changes and exclude it from the fixed set.

## Step 5 — Mark Reports Fixed

For each report that was successfully addressed (code changes made and verified), call:

```
PATCH ${COOKIE_API_BASE}/api/reports/mark-fixed
Authorization: Bearer ${COOKIE_API_TOKEN}
Content-Type: application/json

{ "report_ids": [1, 2, 3] }
```

Only include IDs for reports where you actually made and verified code changes. Do not include skipped reports.

## Step 6 — Version Bump

If any code changes were made, increment the patch version in `public/manifest.json`. For example, `0.0.5` becomes `0.0.6`. Only bump once regardless of how many providers were fixed. After committing (in Step 7), tag the commit with the same version prefixed with `v` (e.g., `git tag v0.0.6`). Push the tag along with the branch — this triggers the release workflow.

## Step 7 — Commit, Push, and Create PR

Create a branch, commit, push, and open a PR:

1. **Branch name:** `fix/cookie-reports-${RUN_DATE}`
2. **Stage only modified/new files explicitly** — do not use `git add .` or `git add -A`
3. **Commit message:** Concise summary like `Fix cookie rejection for [site1], [site2]` or `Add new provider [name] and fix [site]`
4. **Tag** the commit with the new version: `git tag v<new_version>` (e.g., `git tag v0.0.6`)
5. **Push** the branch and tag to origin: `git push -u origin <branch> --follow-tags`
6. **Create a PR** with this body format:

```markdown
## Summary
Automated fixes for cookie popup rejection failures reported on ${RUN_DATE}.

## Changes
| Site | CMP | Selectors Added/Changed | Report Count |
|------|-----|------------------------|--------------|
| example.com | onetrust | Updated reject button selector | 3 |

## Skipped Reports
<!-- List any reports that couldn't be fixed and why, or "None" -->

## Verification
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Detection selectors verified against HTML snapshots
- [ ] Rejection selectors verified against HTML snapshots

## Version
Bumped manifest version from X.X.X to Y.Y.Y
```

## Error Handling

- **No fixable reports** — Exit cleanly with a log message. Do not create a branch or PR.
- **Partial fixes** — Create the PR with whatever works. List skipped reports in the PR body with reasons.
- **API failures** — Log the error and exit. Do not create a partial PR without data.
- **Lint/build failures after changes** — Attempt to fix. If a specific provider's changes are the cause, revert those changes and remove that provider from the fixed set. Only create a PR if at least one fix survives.
