# QA review

## Verdict
REJECTED

## Regression verdict
CLEAN — no regressions detected. Code Review identified zero regression risk areas. All 34 tests passed. Baseline file not found (empty baseline rule applied); no failures in feature-owned test files.

## Coverage audit

| Endpoint / scenario | Tested? | Test name |
|---|---|---|
| `isSupportedLocale('en')` returns true | Yes | AC-1: isSupportedLocale('en') returns true |
| `isSupportedLocale('it')` returns true | Yes | AC-1: isSupportedLocale('it') returns true |
| `isSupportedLocale('fr')` returns false | Yes | AC-2: isSupportedLocale('fr') returns false |
| `isSupportedLocale(undefined)` returns false | Yes | AC-2: isSupportedLocale(undefined) returns false |
| `isSupportedLocale(null)` returns false | Yes | AC-2: isSupportedLocale(null) returns false |
| `isSupportedLocale(123)` returns false | Yes | AC-2: isSupportedLocale(123) returns false |
| `isSupportedLocale('')` returns false | Yes | AC-2: isSupportedLocale('') returns false |
| `isSupportedLocale('EN')` case-sensitive rejection | Yes | AC-2: isSupportedLocale('EN') returns false (case-sensitive) |
| `isSupportedLocale('IT')` case-sensitive rejection | Yes | AC-2: isSupportedLocale('IT') returns false (case-sensitive) |
| `isSupportedLocale("it; Path=/")` injection rejection | Yes | AC-2: isSupportedLocale("it; Path=/") returns false |
| **`resolveLocale("it")==="it"`** | **No** | **Missing: design section 8 explicitly requires testing this function** |
| **`resolveLocale("en")==="en"`** | **No** | **Missing: design section 8 explicitly requires testing this function** |
| **`resolveLocale("fr")` → "en"** | **No** | **Missing: design section 8 explicitly requires this behavior** |
| **`resolveLocale(undefined)` → "en"** | **No** | **Missing: design section 8 explicitly requires this behavior** |
| `dictionaries.it.navbar.rooms === "Camere"` | Yes | AC-1: dictionaries.it.navbar.rooms equals 'Camere' |
| `dictionaries.en.navbar.rooms === "Rooms"` | Yes | AC-1: dictionaries.en.navbar.rooms equals 'Rooms' |
| `dictionaries.it.navbar.contact === "Contattaci"` | Yes | AC-1: dictionaries.it.navbar.contact equals 'Contattaci' |
| `dictionaries.en.navbar.contact === "Contact Us"` | Yes | AC-1: dictionaries.en.navbar.contact equals 'Contact Us' |
| `dictionaries.it.navbar.guestArea === "Area ospiti"` | Yes | AC-1: dictionaries.it.navbar.guestArea equals 'Area ospiti' |
| `dictionaries.en.navbar.guestArea === "Guest Area"` | Yes | AC-1: dictionaries.en.navbar.guestArea equals 'Guest Area' |
| Footer translations (contactUs, etc.) | Yes | AC-1: Footer dictionaries are defined |
| Account translations (signOut, history, profile) | Yes | AC-1: Account sidebar translations |
| Dictionary parity: en and it key structures identical | Yes | AC-1: Dictionary parity - en and it have identical key structures |
| All dictionary values are non-empty strings | Yes | AC-1: All dictionary values are non-empty strings |
| **`setLanguageAction("it")` returns `{ok:true, locale:"it"}` and sets cookie** | **No** | **Missing: design section 8 requires testing (note: framework constraint: mocking next/headers not possible in pure Node.js stdlib)** |
| **`setLanguageAction` with invalid input 'fr' returns error** | **No** | **Missing: design section 8 explicitly requires testing rejection of unsupported locales** |
| **`setLanguageAction` with invalid inputs (empty string, null, undefined, 123, case variants, injection)** | **No** | **Missing: design section 8 specifies testing with 'fr', '', null, undefined, 123, 'IT', 'it; Path=/' and verifying error returned** |
| Error message: invalidLanguage (English) | Yes | AC-2: Error message exists for invalid language |
| Error message: invalidLanguage (Italian) | Yes | AC-2: Error message in Italian for invalid language |
| Error message: languageChangeFailed | Yes | AC-2: Error message exists for language change failure |
| **Default language behavior: no cookie → English labels remain unchanged** | **No** | **Missing: design section 8 explicitly requires testing "no cookie → English labels identical to previous text"** |
| **Runtime: select Italiano on home page** | **No** | **Unverified: design section 8 lists "QA manual: choose Italiano on home → nav shows Camere/Contattaci/Area ospiti"; runtime-check.md is SKIPPED** |
| **Runtime: navigate to /rooms and /contact with Italian selected** | **No** | **Unverified: design section 8 lists "navigate to /rooms and /contact: still Italian"; runtime-check.md is SKIPPED** |
| **Runtime: language selection persists on reload** | **No** | **Unverified: design section 8 lists "reload persists"; runtime-check.md is SKIPPED** |
| **Runtime: `<html lang="it">` attribute set correctly** | **No** | **Unverified: design section 8 lists "`<html lang="it">`"; runtime-check.md is SKIPPED** |
| **Runtime: language selector visible at mobile width** | **No** | **Unverified: design section 8 lists "mobile width: selector visible"; runtime-check.md is SKIPPED** |

## Test quality assessment

The unit test suite demonstrates strong coverage of dictionary structure, configuration constants, and input validation. Tests are well-isolated, use stdlib `node:test` with `assert` module, properly named with AC identifiers, and verify both positive and negative cases. Dictionary parity is validated with recursive key traversal and non-empty string checks. Error message localization is tested in both languages.

However, the test suite is **limited in scope** compared to the design requirements. The design explicitly mandates testing of `resolveLocale()` and `setLanguageAction()` functions, which are absent from the test file. The test file documents that this is due to inability to mock `next/headers` in pure Node.js test environment—a framework constraint that acknowledges the limitation but does not resolve it. Additionally, default language behavior (absence of cookie) and all runtime verification scenarios are untested, with the runtime check marked as SKIPPED in sdlc/runtime-check.md.

The tests that ARE present are of good quality: assertions verify values precisely (not just status), tests are independent, mocks of dictionary imports work correctly, and error messages are validated in both languages.

## Gaps identified

1. **`resolveLocale()` function not tested** — Design section 8 requires testing `resolveLocale("it")==="it"`, `resolveLocale("en")==="en"`, `resolveLocale("fr")→"en"`, and `resolveLocale(undefined)→"en"`. These tests are absent from i18n.test.js. The function itself is imported from config.js but never called in a test. **Action: Add direct tests of `resolveLocale()` covering valid locales (en, it), invalid locales (fr, en-US), and undefined/null inputs to verify fallback to English.**

2. **`setLanguageAction()` function not tested** — Design section 8 requires testing that `setLanguageAction("it")` returns `{ok:true, locale:"it"}` and sets the cookie, and that `setLanguageAction` with invalid inputs (`"fr"`, `""`, `null`, `undefined`, `123`, `"IT"`, `"it; Path=/"`) returns `{ok:false}` with error text. Test file notes this is not possible without mocking `next/headers` in pure Node.js. **Action: Either (a) add integration tests or server-side test harness that can mock headers, or (b) clarify in design that setLanguageAction validation is tested indirectly via isSupportedLocale and defer cookie/response behavior to integration tests or QA manual.** Current state blocks approval.

3. **Default language behavior (no cookie) not tested** — Design section 8 states: "AC-1: default: no cookie → English labels identical to previous text ('Home','Rooms','Contact Us','Guest Area')". No test verifies that absence of a language cookie results in English output. **Action: Add test that simulates request without `lang` cookie and verifies DEFAULT_LOCALE is used.**

4. **Runtime / QA manual verification is SKIPPED** — Design section 8 lists comprehensive runtime acceptance criteria: "choose Italiano on home → nav shows Camere/Contattaci/Area ospiti; navigate to /rooms and /contact: still Italian; reload persists; mobile width: selector visible; `<html lang="it">`". The runtime-check.md is marked SKIPPED (not configured). These critical user-facing behaviors are unverified. **Action: Enable and run runtime checks, or document and sign off on manual QA for these scenarios.**

5. **No test of error return value structure for setLanguageAction** — Design section 8 specifies error return must include error text (not just `{ok:false}`). No test of this return format exists. **Action: Add test verifying `setLanguageAction("fr")` returns `{ok:false, error: <non-empty message>}` or equivalent structure.**

## Implementation bugs
None found. Code Review reported no blocking issues (only a minor best-practice suggestion: GuestDropdown should include `"use client"` directive, which is non-blocking).

## Recommendation

**Do not merge.** The test suite has critical gaps against the design's explicit testing strategy. Three required function behaviors (`resolveLocale`, `setLanguageAction` valid/invalid cases, default language) and all runtime acceptance criteria are untested or unverified. The 34 passing tests provide good foundation for dictionary structure and input validation, but leave the core feature flows (cookie persistence, language switching, error handling) unvalidated. 

The framework constraint (inability to mock `next/headers` in pure Node.js stdlib) is real and legitimate; however, the design chose this constraint. Either the design must be revised to remove these test requirements, or the test suite must be expanded to include integration tests or a server-side test harness capable of mocking headers, or runtime/manual QA must be enabled and documented.

Specific actions:
1. Add tests for `resolveLocale()` covering all specified cases.
2. Clarify with product: are `setLanguageAction()` and default-language tests in-scope for unit tests (framework limitation), or should they move to integration/manual QA? Update design and test suite accordingly.
3. Enable runtime-check.md or document signed-off manual QA for the five runtime criteria listed in design section 8.
4. Rerun tests after adding missing coverage.
