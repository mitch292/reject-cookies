# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chrome Extension (Manifest v3) that automatically detects and rejects cookie consent popups across 17 cookie management platforms. Zero runtime dependencies — pure TypeScript compiled with webpack.

## Build & Development Commands

```bash
npm run build          # Production build (webpack → dist/)
npm run watch          # Development build with file watching
npm run lint           # ESLint with auto-fix
npm run lint:check     # ESLint check only (no fix)
npm run format         # Prettier format
npm run format:check   # Prettier check only
```

No test framework is configured yet. To test, load `dist/` as an unpacked extension in `chrome://extensions` with developer mode enabled.

## Architecture

The extension uses a **provider-based plugin system** with three layers:

1. **Detection** (`src/checks.ts`) — Boolean functions that check if a specific cookie platform's popup is present in the DOM
2. **Rejection** (`src/rejectFlows/`) — Platform-specific logic to click "reject" buttons or remove popup elements
3. **Registry** (`src/providers.ts`) — Array of `CookiePopupCheck` objects mapping each provider name to its check/reject functions

### Content Script Flow (`src/content.ts`)

The content script runs on all HTTP/HTTPS pages. On `DOMContentLoaded`, it iterates through all registered providers, running each check function and calling the corresponding reject function on matches. It assumes only one CMP is active per page and exits early on the first match. This repeats every 501ms up to `MAX_ATTEMPTS` (5) to catch dynamically loaded popups.

### Side Panel (`src/sidepanel.ts`)

User-facing UI for reporting unblocked cookies or bugs. Sends reports to `https://reject-cookies-api.bymitch.com/api`.

## Registered CMP Providers

These are the provider names as registered in `src/providers.ts`. Check this list before adding a new provider to avoid duplicates:

| Name | Check Selector | Notes |
|---|---|---|
| `onetrust` | `#onetrust-consent-sdk` | |
| `transcend` | `#transcend-consent-manager` | Shadow DOM — element removal only |
| `cookieyes` | `.cky-consent-container` | |
| `cookiebot` | `#CybotCookiebotDialog` | |
| `usercentrics` | `#usercentrics-root`, `#usercentrics-cmp-ui` | Shadow DOM — 3 rejection flows |
| `didomi` | `#didomi-popup`, `#didomi-host` | |
| `trustarc` | `#truste-consent-track` | |
| `dr` | `#dr_cookie_banner_container` | |
| `uc-gdpr` | `#uc-gdpr-notification` | |
| `cc` | `#cc--main` | |
| `generic` | `#gdpr-banner-container` | |
| `trustee` | `#truste-consent-track` | **BUG: shares selector with trustarc — needs its own selector** |
| `cmplz` | `#cmplz-cookiebanner-container` | Complianz |
| `acookie` | `#a-cookie--message` | |
| `sourcepoint` | `[id^="sp_message_container"]` | Cross-origin iframe — element removal only |
| `quantcast` | `.qc-cmp-ui-container`, `#qc-cmp2-container` | v1 and v2 variants |
| `iubenda` | `#iubenda-cs-banner` | |

## Rejection Strategy

Every rejection function follows the same two-step pattern:

1. **Try to click the reject/decline button first.** This is the preferred approach — it properly signals consent rejection to the CMP, which may set the right cookies to prevent the banner from reappearing.
2. **Fall back to element removal.** If no reject button is found, remove the popup element from the DOM. This is a last resort — it hides the banner but doesn't signal rejection, so the banner may return on next visit.

**After either action, always clean up:**
- Remove overlay/backdrop elements (e.g., `.onetrust-pc-dark-filter`, `.cky-overlay`)
- Restore `document.body.style.overflow = ''` if the CMP locked scrolling
- Remove CMP-added body classes (e.g., `ot-overflow-hidden`, `uc-overflow-hidden`, `sp-message-open`)

Skipping cleanup leaves the page frozen/unscrollable.

## Edge Case Patterns

**Shadow DOM** (UserCentrics, Transcend): The CMP renders inside a shadow root. Access elements via `element.shadowRoot?.querySelector()`. If the shadow root is closed or buttons can't be reached, fall back to removing the host element. See `src/rejectFlows/userCentrics.ts` for the full pattern with three fallback flows.

**Cross-origin iframes** (Sourcepoint): The CMP UI lives in a cross-origin iframe — you cannot access its contents. The only option is removing the container elements. Remember to clean up body classes and overflow styles. See `closeSourcepoint` in `src/rejectFlows/index.ts`.

**Multi-version providers** (Quantcast): Some CMPs have multiple UI versions with different DOM structures. Handle each version separately — check for the newer version first, fall back to older. See `closeOrRejectQuantcast` in `src/rejectFlows/index.ts`.

## Selector Conventions

- **Prefer `getElementById`** for known IDs — it's the fastest and most reliable selector
- **Use `querySelector` with data attributes** (e.g., `[data-testid="uc-deny-all-button"]`) or class prefixes (e.g., `.cmplz-deny`) for elements without stable IDs
- **Use `[id^="prefix"]`** for dynamic IDs with a stable prefix (e.g., Sourcepoint's `sp_message_container_*`)
- **Avoid fragile selectors** — no `nth-child`, deeply nested paths, or selectors that depend on class name hashes

## Adding a New Cookie Provider

1. Add a detection function in `src/checks.ts`
2. Add a rejection function in `src/rejectFlows/index.ts` (or a new file for complex cases)
3. Register both in the `commonCookiePopupChecks` array in `src/providers.ts`

### Simple example: CookieBot

Detection — look for the known container ID:
```typescript
// src/checks.ts
export const checkForCookieBot = (): boolean => !!document.getElementById('CybotCookiebotDialog');
```

Rejection — try the reject button, no cleanup needed:
```typescript
// src/rejectFlows/index.ts
export const rejectCookieBot = () => {
  const popUp = document.getElementById('CybotCookiebotDialog');
  if (!popUp) return false;
  const rejectButton = document.getElementById('CybotCookiebotDialogBodyButtonDecline');
  if (rejectButton) {
    rejectButton.click();
    return true;
  }
  // CookieBot: no removal fallback — declining is required
  return false;
};
```

Registration:
```typescript
// src/providers.ts
{ name: 'cookiebot', check: checkForCookieBot, rejectOrClose: rejectCookieBot, successful: false }
```

### Complex example: UserCentrics (shadow DOM)

Detection — two possible host elements:
```typescript
// src/checks.ts
export const checkForUserCentrics = (): boolean =>
  !!document.getElementById('usercentrics-root') ||
  !!document.getElementById('usercentrics-cmp-ui');
```

Rejection — access buttons through shadow root, with multiple fallback flows:
```typescript
// src/rejectFlows/userCentrics.ts
export const rejectUserCentricsPrimaryFlow = () => {
  const shadowDOMHost = document.getElementById('usercentrics-root');
  if (!shadowDOMHost) return false;
  const rejectBtn = shadowDOMHost.shadowRoot?.querySelector<HTMLButtonElement>(
    '[data-testid="uc-deny-all-button"]'
  );
  if (rejectBtn) {
    rejectBtn.click();
    cleanupUserCentricsOverlay();
    return true;
  }
  shadowDOMHost.remove();
  cleanupUserCentricsOverlay();
  return true;
};
```

The main `rejectUserCentrics` function tries primary → secondary → tertiary flows in sequence. Each targets a different host element or button selector. See `src/rejectFlows/userCentrics.ts` for all three.

## Version Bumping & Releases

The version lives in `public/manifest.json` → `"version"` field (currently `0.0.5`). Bump the patch version (e.g., `0.0.5` → `0.0.6`) when making fixes.

Git tags matching `v*` (e.g., `v0.0.6`) trigger the release workflow (`.github/workflows/release.yml`), which builds, generates checksums, and publishes to the Chrome Web Store.

## PR & Branch Conventions

- **Branch naming:** `fix/cookie-reports-YYYY-MM-DD` for automated cookie fix batches, `feat/description` for features, `fix/description` for manual fixes
- **Commit messages:** Imperative mood, concise summary of what changed. For automated batches, list affected sites.
- **PR body:** Include a summary table of changes. For cookie fix PRs:
  ```
  | Site | CMP | Selectors Added/Changed | Report Count |
  ```

## Key Types (`src/types.ts`)

- `CookiePopupCheck` — Core interface: `{ name, check(), rejectOrClose(), successful }`

## Code Style

- Strict TypeScript (ES2020 target)
- Single quotes, semicolons, trailing commas (ES5), 100 char print width
- Console `warn`/`error` allowed; other console methods trigger lint warnings
