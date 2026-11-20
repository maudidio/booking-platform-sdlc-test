# Test results

## Summary
Passed: 21 | Failed: 0 | Skipped: 0 | Duration: 0.19s
(Command: `node --test tests/i18n.test.mjs` in `app/`. Node v22.22.1. `npm test` itself fails, see Implementation bugs found.)

## Test cases
| Test | Status | New/Updated/Existing | Description |
|---|---|---|---|
| AC-1: SUPPORTED_LOCALES equals en and it | PASS | New | Locale list is [en, it] |
| AC-1: default locale is en | PASS | New | DEFAULT_LOCALE |
| AC-1: cookie name is NEXT_LOCALE | PASS | New | LOCALE_COOKIE |
| AC-1: every supported locale has a non-empty label | PASS | New | LOCALE_LABELS |
| AC-1: isSupportedLocale is true for en and it | PASS | New | Positive case |
| AC-2: isSupportedLocale is false for fr / empty string / null / undefined / number / uppercase EN / en;x | PASS (7 tests) | New | Invalid input rejected |
| AC-1: en and it have identical recursive key sets | PASS | New | Dictionary parity |
| AC-1: all dictionary leaves are non-empty strings | PASS | New | Dictionary content |
| AC-1: getDictionary('it').nav.rooms is Camere | PASS | New | Italian lookup |
| AC-1: getDictionary('en').nav.rooms is Rooms | PASS | New | English lookup |
| AC-2: getDictionary falls back to English for fr / empty string / null / undefined / uppercase IT | PASS (5 tests) | New | Fallback |

## Regression report
| Existing test | Result | Classification | Notes |
|---|---|---|---|
| (none: the repo had no existing tests) | n/a | n/a | sdlc/test-baseline.txt is absent |

## Coverage areas
Covered: locales constants, isSupportedLocale, dictionary key parity and non-empty leaves, getDictionary lookup and fallback.
Not covered (needs Next runtime, not executed): getLocale, setLocaleAction, LanguageSelector, Navbar, layout, Footer, account sidebar, cookie persistence, html lang. These are left to manual QA per design section 8.
Build and lint were not run: node_modules is not installed in app/.

## Implementation bugs found
- [major] The `test` script added to `app/package.json` (`node --test tests/`) fails on Node v22.22.1. Observed: `npm test` and `node --test tests/` exit 1 with `Cannot find module '.../app/tests'`, because Node 22 treats `tests/` as a module path and not as a directory. Expected: `npm test` runs the suite and passes. Fix: use `node --test` (auto-discovers `tests/`) or `node --test tests/*.test.mjs`.

## Non-blocking observations
- [note] The client-side fallback error text "Unable to change language." is hard-coded in English (per build summary).
- [note] Lint was not run by the Coder or by me because dependencies are not installed.
