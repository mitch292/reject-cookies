# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chrome Extension (Manifest v3) that automatically detects and rejects cookie consent popups across 18+ cookie management platforms. Zero runtime dependencies — the extension is pure TypeScript compiled with webpack.

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
2. **Rejection** (`src/rejectFlows/`) — Platform-specific logic to click "reject" buttons or remove popup elements. Some providers need special handling (UserCentrics uses shadow DOM, Sourcepoint uses iframes)
3. **Registry** (`src/providers.ts`) — Array of `CookiePopupCheck` objects mapping each provider name to its check/reject functions

### Content Script Flow (`src/content.ts`)

The content script runs on all HTTP/HTTPS pages. On `DOMContentLoaded`, it iterates through all registered providers, running each check function and calling the corresponding reject function on matches. This repeats every 501ms up to `MAX_ATTEMPTS` (5) to catch dynamically loaded popups.

### Side Panel (`src/sidepanel.ts`)

User-facing UI for reporting unblocked cookies or bugs. Sends reports to `https://reject-cookies-api.bymitch.com/api`.

## Adding a New Cookie Provider

1. Add a detection function in `src/checks.ts` that returns `true` when the provider's popup is in the DOM
2. Add a rejection function in `src/rejectFlows/index.ts` (or a new file for complex cases like shadow DOM/iframes)
3. Register both in the `commonCookiePopupChecks` array in `src/providers.ts`

## Key Types (`src/types.ts`)

- `CookiePopupCheck` — Core interface: `{ name, check(), rejectOrClose(), successful }`

## Code Style

- Strict TypeScript (ES2020 target)
- Single quotes, semicolons, trailing commas (ES5), 100 char print width
- Console `warn`/`error` allowed; other console methods trigger lint warnings
