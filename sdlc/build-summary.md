# Build summary

## Summary
Added an English/Italian language selector. A native `<select>` (`LanguageSwitcher`) in the header calls the `setLanguageAction` server action. The action validates the locale and stores it in a `lang` cookie. The root layout reads the cookie through `getLocale()`, sets `<html lang>`, and passes dictionary slices to Navbar and Footer. The account layout and GuestDropdown use the same dictionaries. Dictionaries are plain editable files, `en.js` and `it.js`, with identical keys. English output is unchanged by default. Invalid locales return `{ok:false, error}` and leave the cookie untouched.

## Files changed
| File | Action | Description |
|---|---|---|
| app/_lib/i18n/config.js | create | Locales, default, cookie name, labels, `isSupportedLocale` |
| app/_lib/i18n/dictionaries/en.js | create | English dictionary |
| app/_lib/i18n/dictionaries/it.js | create | Italian dictionary, same keys |
| app/_lib/i18n/dictionaries/index.js | create | Aggregates dictionaries |
| app/_lib/i18n/index.js | create | `resolveLocale`, `getLocale`, `getDictionary` |
| app/_lib/i18n/actions.js | create | `setLanguageAction` server action |
| app/_ui/LanguageSwitcher/index.jsx | create | Client drop-down |
| app/_ui/LanguageSwitcher/styles.module.css | create | Styles |
| app/_ui/Navbar.jsx | modify | Dictionary labels, renders the switcher, aria-label on the toggle button |
| app/layout.js | modify | Resolves locale, sets `html lang`, passes slices |
| app/_components/Footer/index.jsx | modify | Dictionary strings |
| app/account/layout.jsx | modify | Async layout, dictionary labels |
| app/_ui/GuestDropdown/GuestDropdown.jsx | modify | Dictionary labels (History, Profile, Logout) |

## Unplanned file changes
None.

## New dependencies added
None.

## New environment variables required
None.

## Assumptions made
- Next 14: `cookies()` is synchronous, so it is not awaited.
- GuestDropdown labels (History, Profile, Logout) come from `dict.navbar` (extra keys `history`, `profile`, `logout`). The design only named `account.*`, so I added these keys to the navbar namespace in both dictionaries.
- The `languageChangeFailed` error text is passed from the layout to the switcher through Navbar's `errors` prop.

## Verification status
- Lint NOT run successfully. `npm run lint` fails with `next: not found` because `node_modules` is not installed in this environment. `npx eslint` fails because there is no flat config. No lint result exists.
- No targeted tests were run. The project has no test script, and test files belong to the Tester.
- `git diff --stat` shows only the five modified existing files, with small diffs.
