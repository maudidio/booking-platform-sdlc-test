# Test results

## Summary
Passed: 75 | Failed: 0 | Skipped: 0 | Duration: 0.568s

Source: `node --test "app/**/__tests__/*.test.js"` run from `app/` (final run, exit 0). The i18n test file is the only test file in the glob; `node --test app/_lib/i18n/__tests__/i18n.test.js` also reported 75 pass, 0 fail.

## Test cases
| Test | Status | New/Updated/Existing | Description |
|---|---|---|---|
| AC-1: namespace 'home' exists in en and it with identical keys | pass | New | Namespace exists in both locales with identical keys |
| AC-1: namespace 'contact' exists in en and it with identical keys | pass | New | Same check for contact |
| AC-1: namespace 'auth' exists in en and it with identical keys | pass | New | Same check for auth |
| AC-1: namespace 'rooms' exists in en and it with identical keys | pass | New | Same check for rooms |
| AC-1: namespace 'checkout' exists in en and it with identical keys | pass | New | Same check for checkout |
| AC-1: namespace 'history' exists in en and it with identical keys | pass | New | Same check for history |
| AC-1: namespace 'profile' exists in en and it with identical keys | pass | New | Same check for profile |
| AC-1: namespace 'payment' exists in en and it with identical keys | pass | New | Same check for payment |
| AC-1: en values for the new namespaces equal the original hard-coded literals | pass | New | en values equal the original English literals |
| AC-1: it values for spot-checked new keys are the Italian translations | pass | New | Spot-check of Italian values |
| AC-1: Italian values differ from English for spot-checked new keys | pass | New | it and en values differ for spot-checked keys |
| AC-1: en.rooms.from and en.rooms.perNight are non-empty strings | pass | New | Non-empty check for en.rooms.from and en.rooms.perNight |
| AC-2: unsupported lang values ('fr', '', null, 'EN') resolve to 'en' | pass | New | Invalid lang values fall back to en |
| AC-2: unsupported lang falls back to the English strings of the new namespaces | pass | New | Fallback dictionary returns English strings for new namespaces |
| All other tests in i18n.test.js (locale resolution, navbar/footer/account dictionaries, parity, non-empty, AC-2 validation) | pass | Existing | Existing tests of the file; all pass in the final run. Individual result lines beyond ok 41 were truncated in captured output, so only the aggregate is reported. |

Note: the i18n file also contains a second block of new-namespace tests (around line 415: 'Every new namespace exists as an object', 'Italian rooms.search differs from English', and similar). These run as part of the 75 and pass, and overlap with the tests added in this pass.

## Regression report
| Existing test | Result | Classification | Notes |
|---|---|---|---|
| i18n.test.js: existing locale, navbar, footer, account, parity and AC-2 tests | pass | PASSING | Untouched and green in the final run |
| Pre-existing failures (sdlc/test-baseline.txt) | none recorded | PASSING | The baseline captured no FAIL lines |

## Coverage areas
Covered:
- Presence of the eight new namespaces (home, contact, auth, rooms, checkout, history, profile, payment) in en and it, with identical keys.
- Dictionary key parity and non-empty string values across en and it.
- English values equal to the original hard-coded literals (spot checks).
- Italian values differ from English (spot checks).
- Fallback to en for invalid or missing locale values.

Not covered:
- Rendering of components and pages (server components calling getDictionary(), client components receiving dict). No component test harness exists; the manual checks in design section 8 were not run.
- The cookie flow end to end (setLanguageAction, LanguageSwitcher router.refresh()).
- resolveLocale in dictionaries/index.js. The test file replicates it locally, so the AC-2 tests check a copy, not the production module.
- Build: no build command is declared for this project. ESLint could not run because app/.eslintrc.json is invalid JSON (pre-existing, untouched).

## Implementation bugs found
None

## Non-blocking observations
- [minor] The i18n test file has two overlapping blocks of new-namespace tests (the block added in this pass and the block near line 415). Observed: duplicated checks. Expected: one consolidated block.
- [minor] resolveLocale is re-implemented inside the test file instead of imported from dictionaries/index.js, because that module imports next/headers. Observed: the AC-2 tests verify a copy. Expected: a test that exercises the production function, or a note that the production code is untested.
- [note] Candidate files in design section 3b were not translated, per build-summary.md: BookingForm, BookingButton, not-found.js, error.js, rooms/[room_slug]/_components/*, checkout/_components/* (CheckoutForm, CheckoutOverview), reservations/edit/[id]/*, account/history/_components/*. Observed: English text remains on these parts when lang=it. Expected: a follow-up decision on whether they are in scope.
- [note] No automated test covers the manual checks in design section 8 (cookie lang=it on /, /rooms, /contact, /signin, /signup, /account/history). Covering them needs a component or e2e test setup.
