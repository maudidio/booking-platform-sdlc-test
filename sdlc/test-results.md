# Test results

## Summary
Passed: 61 | Failed: 0 | Skipped: 0 | Duration: 0.542s

Command: `node --test "app/**/__tests__/*.test.js"` (run from `app/`), exit 0.

## Test cases
| Test | Status | New/Updated/Existing | Description |
|---|---|---|---|
| AC-1: Every new namespace exists as an object in en and it | PASS | New | Checks home, contact, auth, rooms, checkout, history, profile and payment exist as objects in both dictionaries. |
| AC-1: Italian rooms.search differs from English | PASS | New | it.rooms.search differs from en.rooms.search. |
| AC-1: Italian auth.signIn differs from English | PASS | New | it.auth.signIn differs from en.auth.signIn. |
| AC-1: Italian payment.forbidden differs from English | PASS | New | it.payment.forbidden differs from en.payment.forbidden. |
| AC-1: Italian home.cancel differs from English | PASS | New | it.home.cancel differs from en.home.cancel. |
| AC-1: Italian history.viewRooms differs from English | PASS | New | it.history.viewRooms differs from en.history.viewRooms. |
| AC-1: en.rooms.banner equals the original literal 'Accomodation Options' | PASS | New | English value equals the old literal, typo kept. |
| AC-1: en.auth.signIn equals the original literal 'Sign In' | PASS | New | English value equals the old literal. |
| AC-1: en.auth.signUp equals the original literal 'Sign Up' | PASS | New | English value equals the old literal. |
| AC-1: en.auth.checking equals the original literal 'Checking...' | PASS | New | English value equals the old literal. |
| AC-1: en.payment.forbidden equals the original literal 'Forbidden' | PASS | New | English value equals the old literal. |
| AC-1: en.home.heroLine1 keeps the original typo 'Foriegn' | PASS | New | English value equals the old literal, typo kept. |
| AC-1: en.contact.bannerTitle equals the original literal 'REACHING OUT' | PASS | New | English value equals the old literal. |
| AC-1: en.checkout.banner equals the original literal 'BOOKING CONFIRMATION' | PASS | New | English value equals the old literal. |
| AC-1: en.rooms.from and en.rooms.perNight are non-empty strings | PASS | New | Non-empty English strings. |
| AC-1: it.rooms.from and it.rooms.perNight are non-empty strings | PASS | New | Non-empty Italian strings. |
| 45 pre-existing tests (AC-1 and AC-2 locale, config, parity and non-empty checks) | PASS | Existing | Untouched. All 45 `ok` lines in the run, including dictionary parity and all-values-non-empty. |

## Regression report
| Existing test | Result | Classification | Notes |
|---|---|---|---|
| All 45 pre-existing tests in app/_lib/i18n/__tests__/i18n.test.js | PASS | PASSING | Not modified. The new tests were appended after them. The baseline had no failing tests. |

## Coverage areas
Covered:
- Dictionary key parity between en and it, including the new namespaces (existing parity test).
- All values non-empty (existing test).
- The eight new namespaces exist in both locales.
- English values equal the original hard-coded literals for the spot-checked keys (rooms.banner, auth.signIn, auth.signUp, auth.checking, payment.forbidden, home.heroLine1, contact.bannerTitle, checkout.banner).
- Italian values differ from English for spot-checked keys.
- resolveLocale fallback to en for invalid, missing or differently-cased values (existing tests, unchanged).

Not covered:
- Rendering of the translated components and pages. The suite is pure node:test over dictionaries and config. Design section 8 lists this as a manual check (cookie `lang=it` on /, /rooms, /contact, /signin, /signup and /account/history). It was not executed in this run.
- Exact Italian wording and the full key-by-key English comparison against the old literals. Only the spot checks listed above were added.
- Hard-coded English text left in files not in the design table (see Non-blocking observations).

## Implementation bugs found
None

## Non-blocking observations
- [minor] Several 3b candidates still contain hard-coded English, so Italian mode is not complete on those pages. Observed: BookingForm ("BOOK A ROOM ONLINE", "Arrival", "Departure", "Invalid date range!"), BookingButton ("Book Now", "Processing..."), not-found.js, error.js, the rooms/[room_slug] components, the checkout components (CheckoutForm, CheckoutOverview), reservations/edit/[id] and account/history/_components. Expected: translated, or explicitly tracked as a follow-up. The design marks these as candidates, not deliverables, so this is not a blocker.
- [minor] Run output shows the warning MODULE_TYPELESS_PACKAGE_JSON for i18n.test.js. Cause: app/package.json has no "type" field. Expected: no warning. Not caused by this change.
- [minor] app/.eslintrc.json is invalid JSON (line 4). Lint could not run, as the Coder reported. Pre-existing and not touched by this change.
- [note] Add component-level tests (or a scripted check) for the manual Italian-mode checks in design section 8, so page rendering is covered automatically.
- [note] The i18n test file re-declares resolveLocale locally rather than importing it. This is pre-existing and was kept as is.

A = 0
B = 0
All 61 tests pass (45 existing, 16 new); there are no pre-existing failures and no regressions.
APPROVED
