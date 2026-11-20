# QA review

## Verdict
REJECTED

## Regression verdict
CLEAN — no regressions

The Tester's regression report lists no REGRESSION-classified failures. The final run reports 75 pass, 0 fail, 0 skipped. sdlc/test-baseline.txt holds no FAIL lines, so there are no pre-existing failures to exclude. The existing i18n tests (locale resolution, navbar/footer/account dictionaries, parity, non-empty values, AC-2 validation) stay green.

Code-review risk areas (sdlc/code-review.md, "Regression risk areas"): existing behaviour on the modified pages is not exercised by any component or runtime test (no component harness; runtime check SKIPPED). These risks are covered only indirectly by dictionary-level tests and are recorded as informational gaps. They are not REGRESSION failures.

## Coverage audit

| Endpoint / scenario | Tested? | Test name |
|---|---|---|
| AC-1: namespace home exists in en and it, identical keys | Yes | AC-1: namespace 'home' exists in en and it with identical keys |
| AC-1: namespace contact | Yes | AC-1: namespace 'contact' exists in en and it with identical keys |
| AC-1: namespace auth | Yes | AC-1: namespace 'auth' exists in en and it with identical keys |
| AC-1: namespace rooms | Yes | AC-1: namespace 'rooms' exists in en and it with identical keys |
| AC-1: namespace checkout | Yes | AC-1: namespace 'checkout' exists in en and it with identical keys |
| AC-1: namespace history | Yes | AC-1: namespace 'history' exists in en and it with identical keys |
| AC-1: namespace profile | Yes | AC-1: namespace 'profile' exists in en and it with identical keys |
| AC-1: namespace payment | Yes | AC-1: namespace 'payment' exists in en and it with identical keys |
| AC-1: en values equal original English literals | Yes | AC-1: en values for the new namespaces equal the original hard-coded literals |
| AC-1: it spot-check values | Yes | AC-1: it values for spot-checked new keys are the Italian translations |
| AC-1: it differs from en for spot-checked keys | Yes | AC-1: Italian values differ from English for spot-checked new keys |
| AC-1: en.rooms.from and en.rooms.perNight non-empty | Yes | AC-1: en.rooms.from and en.rooms.perNight are non-empty strings |
| AC-1: key parity and non-empty values cover new keys | Yes | AC-1: Dictionary parity - en and it have identical key structures; AC-1: All dictionary values are non-empty strings |
| AC-2: resolveLocale 'fr', '', null, 'EN' return 'en' | Yes (local copy of resolveLocale) | AC-2: unsupported lang values ('fr', '', null, 'EN') resolve to 'en' |
| AC-2: unsupported lang falls back to English new-namespace strings | Yes (local copy) | AC-2: unsupported lang falls back to the English strings of the new namespaces |
| AC-2: undefined and non-string inputs return 'en' | Yes (local copy) | AC-1: Default language behavior; AC-2: isSupportedLocale(undefined / null / 123) |
| Manual: cookie lang=it on / (home hero, booking form, button) | No | none. Runtime check SKIPPED; no component test |
| Manual: cookie lang=it on /rooms | No | none |
| Manual: cookie lang=it on /contact | No | none |
| Manual: cookie lang=it on /signin and /signup | No | none |
| Manual: cookie lang=it on /account/history | No | none |
| Manual: no cookie shows today's English | No | none (only resolveLocale fallback unit-tested, not rendering) |
| Checkout page body with lang=it | No (and not translated, see Implementation bugs) | none |

Error cases: the AC-2 invalid-locale cases (fr, empty, null, undefined, 'EN', 'IT', non-string, injected cookie value) are unit-tested. Design section 7 was not re-read, so E is computed over the AC-2 error cases only.

## Test quality assessment

The new assertions check concrete values (exact English literals and Italian translations), not just existence. Dictionary parity uses sorted key comparison, so a missing key in either locale fails. Tests are independent and order-agnostic. No flakiness reported.

Weaknesses:
- resolveLocale is re-implemented inside the test file, so AC-2 tests check a copy, not the production module in dictionaries/index.js. They would still pass if the production function regressed.
- Two overlapping blocks of new-namespace checks (one added in this pass, one around line 415). Duplication adds no coverage.
- No test renders any page or component; the design's manual lang=it checks are unverified.
- Italian spot checks cover only a handful of keys.

## Gaps identified

- Design section 8 manual checks (cookie lang=it on /, /rooms, /contact, /signin, /signup, /account/history; no cookie matches English) are not automated and were not run. Required flow with Tested = No (counts in F).
- AC-1 not met for home hero: BookingForm and BookingButton (via HeroSection/app/page.js) remain hard-coded English. No test catches this. Design step 7 item.
- AC-1 not met for checkout body: CheckoutForm and CheckoutOverview remain English. No test catches this.
- Other 3b candidates left in English (informational, per Code Reviewer): rooms/[room_slug]/_components/*, reservations/edit/[id]/*, account/history/_components/*, not-found.js, error.js. Design step 7 still requires them.
- account/profile/_components/ProfileForm/index.jsx not confirmed by text search or read.
- Informational regression risks without component coverage: server-to-client dict chain (page -> HeroSection, About, Blog, Rooms, Gallery, ContactSection, ContactForm, SigninForm, CredentialsForm, SignInButton, OAuthProviderButtons, SignUpForm, FilterSection, RoomItem, SuccessPage, ExpirePage); async OAuthProviderButtons and RoomItem; sort-option values and defaultValue in FilterSection; redirects and dict loading in account/history and profile; payment Forbidden branch.
- setLanguageAction revalidation and LanguageSwitcher router.refresh() flow not verified (design 3b item).
- Test-quality: duplicated new-namespace blocks; resolveLocale tested only as a copy.
- Build and lint: no build declared; ESLint cannot run because app/.eslintrc.json is invalid JSON (pre-existing).

## Implementation bugs

Re-rated Code Reviewer findings (Tester listed none):

- MAJOR — Home hero booking form and button (BookingForm, BookingButton via HeroSection/app/page.js) still show English ('BOOK A ROOM ONLINE', 'Arrival', 'Departure', 'Invalid date range!', 'Book Now', 'Processing...'). A user who selects Italian sees English on the home page, violating AC-1. Counted in B.
- MAJOR — Checkout page body (CheckoutSection, CheckoutForm, CheckoutOverview) remains English while only the banner is translated. Checkout is a verified page; violates AC-1. Counted in B.

No critical bugs found. en.js / it.js key parity intact.

## Recommendation

Do not merge. The regression gate is clean and the dictionary-level work is correct, but AC-1 is not met on two verified pages (home hero booking form and button; checkout body), which a real user hits through normal use. The design's manual lang=it checks are untested and the runtime check was SKIPPED. The Tester should:

1. Translate BookingForm and BookingButton, add keys to en.js and it.js, pass dict from HeroSection; add a test or probe checking the home hero in Italian.
2. Translate CheckoutSection, CheckoutForm and CheckoutOverview, add keys to both dictionaries, pass dict from CheckoutSection.
3. Add automated checks (component render tests or runtime probe) for lang=it on /, /rooms, /contact, /signin, /signup and /account/history, as design section 8 requires, or record an agreed exclusion for each.
4. Replace the local resolveLocale copy with an import of the production function, or document that it is untested.
5. Remove the duplicated new-namespace test block.
6. Complete design step 7 for remaining 3b candidates or record an agreed follow-up with the design owner; confirm ProfileForm and setLanguageAction revalidation.

Pre-existing, not counted: invalid ESLint config in app/.eslintrc.json.
