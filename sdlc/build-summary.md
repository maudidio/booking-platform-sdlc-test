# Build summary

## Summary
Added an English/Italian language selector. The header, rendered by the root layout, has a native `<select>` that calls the `setLanguageAction` server action. The action validates the locale and stores it in the `lang` cookie, then the client calls `router.refresh()`. Dictionaries live in editable `en.js` and `it.js` files with identical key sets. The root layout resolves the locale (default `en`), sets `<html lang>`, and passes dictionary slices to Navbar and Footer. The account layout and GuestDropdown also use dictionary strings. English output is unchanged.

## Files changed
| file | action | description |
|---|---|---|
| app/app/_lib/i18n/config.js | create | Locales, default, cookie name, labels, `isSupportedLocale`. |
| app/app/_lib/i18n/dictionaries/en.js | create | English dictionary. |
| app/app/_lib/i18n/dictionaries/it.js | create | Italian dictionary, same keys as en.js. |
| app/app/_lib/i18n/dictionaries/index.js | create | Aggregates dictionaries by locale. |
| app/app/_lib/i18n/index.js | create | `resolveLocale`, `getLocale`, `getDictionary`. |
| app/app/_lib/i18n/actions.js | create | `setLanguageAction` server action with validation. |
| app/app/_ui/LanguageSwitcher/index.jsx | create | Client drop-down with a labelled select and a `role="alert"` error. |
| app/app/_ui/LanguageSwitcher/styles.module.css | create | Styles for the drop-down. |
| app/app/_ui/Navbar.jsx | modify | Dictionary labels and the language switcher. |
| app/app/layout.js | modify | Locale resolution, `<html lang>`, props passed to Navbar and Footer. |
| app/app/_components/Footer/index.jsx | modify | `dict.footer` strings. |
| app/app/account/layout.jsx | modify | Async layout using `dict.account`. |
| app/app/_ui/GuestDropdown/GuestDropdown.jsx | modify | `dict.history`, `dict.profile` and `dict.logout`. |

## Unplanned file changes
None. The test file listed in the design belongs to the Tester. `package.json` was not changed.

## New dependencies added
None.

## New environment variables required
None.

## Assumptions made
- The project uses Next 14, so `cookies()` is synchronous. `getLocale` is still async so callers can `await` it.
- GuestDropdown receives the navbar slice. That slice has the extra keys `history`, `profile` and `logout`.
- No `test` script was added to `package.json`. The Coder must not change the manifest beyond what the design names.
- Footer contact details (email, phone, address) and the newsletter placeholder are data rather than translatable copy, so they stay hard-coded.

## Verification
- `next lint` could not run: the installed `next` rejects the invocation and treats `lint` as a project directory.
- `npx eslint` picked up ESLint 10, which needs a flat config, so it failed.
- No test script exists in the project, so no targeted tests were run.
