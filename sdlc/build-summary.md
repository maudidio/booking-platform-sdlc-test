# Build summary

## Summary
Added a cookie-based English/Italian language selector. A native drop-down sits at the top right of the header, inside `Navbar` but outside `nav`, so it stays visible on mobile. The `setLocaleAction` server action validates the locale against an allowlist and stores it in the `NEXT_LOCALE` cookie (path `/`, 1 year, sameSite lax, secure in production). `RootLayout` resolves the locale and dictionary, sets `<html lang>`, and passes `locale` and `dict` to `Navbar` and `dict` to `Footer`. The account sidebar reads its labels from the dictionary. Dictionaries are plain JS files with identical keys, and `getDictionary` falls back to English. The default is `en`, so behaviour is unchanged when no cookie exists.

## Files changed
| File | Action | Description |
|---|---|---|
| app/_lib/i18n/locales.js | create | Locales, default, cookie name, labels, `isSupportedLocale` |
| app/_lib/i18n/dictionaries/en.js | create | English dictionary |
| app/_lib/i18n/dictionaries/it.js | create | Italian dictionary, same keys |
| app/_lib/i18n/index.js | create | Pure `getDictionary` with English fallback; imports use explicit `.js` extensions so plain Node can load it for tests |
| app/_lib/i18n/getLocale.js | create | Reads and validates the cookie, defaults to `en` |
| app/_lib/actions.js | modify | Added `setLocaleAction` and the locales import |
| app/_ui/LanguageSelector/index.jsx | create | Client drop-down with pending and error states |
| app/_ui/LanguageSelector/styles.module.css | create | Styles |
| app/_ui/Navbar.jsx | modify | Uses `dict.nav.*`, renders the selector |
| app/layout.js | modify | Locale and dictionary resolution, `html lang`, props |
| app/_components/Footer/index.jsx | modify | Strings from the dictionary |
| app/account/layout.jsx | modify | Sidebar labels from the dictionary |
| package.json | modify | Added the `test` script `node --test tests/` |

(Paths are relative to the target repo root, i.e. `app/app/...` in the pipeline repo.)

## Unplanned file changes
None.

## New dependencies added
None.

## New environment variables required
None.

## Verification
- Linter: not run. `next lint` could not run because `node_modules` is not installed in `app/`. `npx` tried to fetch an unrelated Next version, and that run failed with `unknown option '--dir'`. This is an environment limitation, not a clean result.
- Targeted tests: none exist yet, because `tests/i18n.test.mjs` belongs to the Tester. I ran a manual Node check of the pure helpers. It printed `getDictionary('it').nav.rooms` as `Camere`, `getDictionary('en').nav.rooms` as `Rooms`, and `getDictionary('fr')` as the English fallback. `isSupportedLocale('EN')` was false and `isSupportedLocale('it')` was true.
- The Next-specific parts (`getLocale`, `setLocaleAction`, the components) were not executed.

## Assumptions made
- "All pages" means the selector is visible everywhere. Only shared chrome is translated (Navbar, Footer, account sidebar).
- The Footer contact details (email, phone, address) are not translated.
- The client-side fallback error text "Unable to change language." is hard-coded in English. The server error text is also English, as the design specifies.
- No company guidelines were found. The `search_restricted` query returned no results.
