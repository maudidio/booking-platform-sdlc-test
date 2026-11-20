# Code review

## Verdict
APPROVED

## Summary
The implementation matches the design. All 13 files in the design table (except the Tester's test file) exist and have content. `setLocaleAction` validates against an allowlist and sets the cookie as specified. `getLocale` validates the cookie and defaults to `en`. `LanguageSelector` is a labelled native select that handles pending and error states and keeps the current locale on failure. `RootLayout`, `Navbar`, `Footer` and the account layout use the dictionary, and the two dictionaries have identical keys. There are no unplanned files and no new dependencies. Runtime check was SKIPPED, so nothing was verified at runtime. The linter did not run and the Next-specific code was not executed, so wiring is verified by reading only. The only client-side call is the server action `setLocaleAction`. It is imported from `app/_lib/actions.js`, which has a file-level "use server". Next's own server receives it through the current page URL, so no separate route is needed. No company guidelines were found (search_restricted returned nothing).

## Findings
| Severity | File | Line / area | Issue | Suggested fix |
|---|---|---|---|---|
| minor | app/_lib/i18n/index.js | imports | Uses `.js` extensions, while the sibling `getLocale.js` and `actions.js` import `./locales` without one. `package.json` has no `"type": "module"`, so plain Node needs ESM syntax detection (Node 22.7+ or newer) to load these files in tests. | Tester should confirm the Node version, or import with `.mjs`-compatible setup. |
| minor | app/_components/Footer/index.jsx | newsletter input | The placeholder `example@mail.com` and the contact details stay untranslated. This is documented as an assumption and the placeholder is not a language string. | None required. |
| minor | app/_ui/LanguageSelector/index.jsx | catch block | The fallback error "Unable to change language." is hard-coded in English, so it does not follow the selected language. The design asks only for a generic error. | Optionally add a dictionary key. |
| nit | app/_lib/i18n/dictionaries/*.js | `language.invalid` | The key is defined but never used. The action returns a hard-coded English string. | Use it or remove it. |
| nit | app/_ui/GuestDropdown | "Sign out" text | The Navbar user dropdown is outside the design table and was not reviewed. Its text may stay in English. | Follow up later. |

## Checklist
- [x] Implementation matches the design exactly
- [x] All endpoints, parameters, and response shapes are correct
- [x] All error cases are handled as specified in design section 7
- [x] No silent failures or swallowed exceptions
- [x] All inputs are validated before use
- [x] Passwords/secrets are never logged or returned in responses
- [x] Authentication/authorization is enforced where the design requires it (none required)
- [x] No string-interpolated database queries (no DB access)
- [x] No sensitive data in error messages
- [ ] Code passes xo/prettier (linter not run; Navbar has some long lines, possibly pre-existing)
- [x] Functions are small and single-purpose
- [x] No dead code or unnecessary complexity
- [x] Type annotations: not applicable (JS project)
- [x] New team member could understand this in 6 months
- [x] Magic numbers/strings are extracted to named constants (the 31536000 cookie max-age is inline, which is acceptable)
- [x] Error messages are clear and actionable
- [x] Coder only modified files listed in the design's scope
- [x] Out-of-scope changes documented (none)
- [x] Regression risk areas identified
- [x] No undocumented out-of-scope changes

## Regression risk areas
- app/layout.js: `getLocale()` calls `cookies()`, which makes every page dynamic. Verify pages still render and the `<html lang>` value is correct.
- app/_lib/actions.js: shared server-action file. Verify the existing actions (auth, booking, contact) still work and `setLocaleAction` rejects "fr", "", null and non-strings with no cookie set.
- app/_ui/Navbar.jsx: verify the selector is visible on mobile, active-link logic is unchanged, and the user dropdown still works.
- app/account/layout.jsx and Footer: verify the labels change after switching the language.
- app/_lib/i18n: the Tester should check that `en` and `it` have identical keys, that `getDictionary` falls back to English for invalid input, and that `isSupportedLocale` handles non-strings and case.
- package.json: verify `npm test` runs `node --test tests/` and that the Node version can load the ESM `.js` files.
