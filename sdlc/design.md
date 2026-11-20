# Technical design: Language selector (English / Italian)

## 1. Overview
Users pick the UI language (English `en` or Italian `it`) from a drop-down at the top right of the header, which appears on every page. The choice is stored in a cookie and applied server-side on every request. Translations live in plain JS dictionary files in the repo so developers can edit them easily. No new dependencies (standard library only). Default is `en`, so existing behaviour is unchanged when no cookie exists.

Assumption (no clarification needed): "all pages" means the selector is visible on all pages (it sits in the root layout Navbar). Translated text covers shared chrome (Navbar, Footer, account sidebar) plus the dictionary infrastructure. Page-specific content can be migrated later with the same helper (see Out of scope).

## 2. Architecture changes
- New `app/_lib/i18n/` module (paths below are relative to the target repo root, which contains the Next.js `app/` directory): `locales.js` (supported locales, default, cookie name, `isSupportedLocale`), `dictionaries/en.js`, `dictionaries/it.js`, `index.js` (pure `getDictionary(locale)`), `getLocale.js` (reads cookie via `next/headers`; kept separate so tests do not import Next).
- New server action `setLocaleAction(locale)` in `app/_lib/actions.js`: validates the locale, sets the cookie, calls `revalidatePath("/", "layout")`.
- New client component `LanguageSelector` (native `<select>`) rendered at the right end of the header inside `Navbar`.
- `RootLayout` resolves locale and dictionary, sets `<html lang={locale}>`, passes `locale` and `dict` to `Navbar` and `dict` to `Footer`.
- `account/layout.jsx` (server component) gets `dict` via `getDictionary(getLocale())`.
- Cookie `NEXT_LOCALE`: path `/`, maxAge 1 year, sameSite `lax`, not httpOnly, `secure` in production.

## 3. Files to create or modify
| File | Action | Purpose |
|---|---|---|
| app/_lib/i18n/locales.js | CREATE | `SUPPORTED_LOCALES=["en","it"]`, `DEFAULT_LOCALE="en"`, `LOCALE_COOKIE="NEXT_LOCALE"`, `LOCALE_LABELS`, `isSupportedLocale()` |
| app/_lib/i18n/dictionaries/en.js | CREATE | English dictionary (default export, nested object) |
| app/_lib/i18n/dictionaries/it.js | CREATE | Italian dictionary, identical keys |
| app/_lib/i18n/index.js | CREATE | Pure `getDictionary(locale)` with English fallback |
| app/_lib/i18n/getLocale.js | CREATE | `getLocale()` reads cookie, validates, defaults to en |
| app/_lib/actions.js | MODIFY | Add `setLocaleAction` |
| app/_ui/LanguageSelector/index.jsx | CREATE | Client drop-down component |
| app/_ui/LanguageSelector/styles.module.css | CREATE | Styling |
| app/_ui/Navbar.jsx | MODIFY | Accept `locale`,`dict`; use `dict.nav.*`; render selector top right |
| app/layout.js | MODIFY | Resolve locale/dict, `<html lang>`, pass props |
| app/_components/Footer/index.jsx | MODIFY | Use dictionary strings (read file first; add keys to both dictionaries) |
| app/account/layout.jsx | MODIFY | Sidebar labels from dictionary |
| package.json | MODIFY | Add `"test": "node --test tests/"` |
| tests/i18n.test.mjs | CREATE (Tester) | node:test unit tests (AC-1, AC-2) |

## 4. Implementation plan
1. `locales.js`: export constants; `isSupportedLocale = (v) => typeof v === "string" && SUPPORTED_LOCALES.includes(v)`. Labels `{en:"English", it:"Italiano"}`.
2. `en.js`:
```js
const en = {
  language: { label: "Language", invalid: "Unsupported language." },
  nav: { home: "Home", rooms: "Rooms", contact: "Contact Us", guestArea: "Guest Area" },
  account: { history: "History", profile: "Profile", signOut: "Sign out" },
  footer: { /* one key per string in Footer */ },
};
export default en;
```
`it.js` same keys: Home, Camere, Contattaci, Area Ospiti, Cronologia, Profilo, Esci, Lingua, "Lingua non supportata." Add header comment in both: edit strings here, keep keys identical.
3. `index.js`: `const dictionaries = {en, it}; export function getDictionary(locale){ return dictionaries[isSupportedLocale(locale) ? locale : DEFAULT_LOCALE]; }`.
4. `getLocale.js`: `import { cookies } from "next/headers"`; `const v = cookies().get(LOCALE_COOKIE)?.value; return isSupportedLocale(v) ? v : DEFAULT_LOCALE;`.
5. `setLocaleAction(locale)`:
```js
export async function setLocaleAction(locale) {
  if (!isSupportedLocale(locale)) return { ok: false, error: "Unsupported language." };
  cookies().set(LOCALE_COOKIE, locale, { path: "/", maxAge: 31536000, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  revalidatePath("/", "layout");
  return { ok: true, locale };
}
```
No redirect. Ensure `revalidatePath` is imported from `next/cache` and the function is a server action (file-level or function-level "use server").
6. `LanguageSelector` ("use client"): props `locale`, `label`. `<select aria-label={label} value={locale} disabled={pending}>` with options from `SUPPORTED_LOCALES`/`LOCALE_LABELS`. onChange: `startTransition(async () => { const r = await setLocaleAction(v); if (r.ok) router.refresh(); else setError(r.error); })`; wrap in try/catch to set a generic error. Render error in `<span role="alert">`. Value stays at the current `locale` prop on failure.
7. Navbar: replace literals with `dict.nav.*`; render `<LanguageSelector>` inside `.header-items` after `<nav>` and before the toggle button (outside `nav` so it stays visible on mobile). Keep existing class names.
8. layout.js: `const locale = getLocale(); const dict = getDictionary(locale);` `<html lang={locale}>`; pass props.
9. Footer and account layout: replace literals with dictionary values; markup unchanged.
10. package.json: add test script.

## 5. Data model changes
None. Preference lives only in a cookie.

## 6. API design
No HTTP endpoints. One server action (Next.js posts to the current page URL on the same Next server; routing is built into Next, no extra config):
- `setLocaleAction(locale: string)` -> `{ ok: true, locale }` or `{ ok: false, error }`. Auth: none.
Example: `"it"` -> sets `NEXT_LOCALE=it`, returns `{"ok":true,"locale":"it"}`. `"fr"` -> `{"ok":false,"error":"Unsupported language."}`, cookie unchanged.
No runtime probes: no runtime check is configured and there is no REST route. AC-1/AC-2 are covered by `tests/i18n.test.mjs` and manual QA.

## 7. Error handling
| Case | Result |
|---|---|
| Locale unsupported / non-string / empty | Action returns `{ok:false,error:"Unsupported language."}`; cookie unchanged; UI shows the error, keeps previous language |
| Cookie holds invalid value | Treated as `en`, no error |
| Action throws / network failure | Selector shows generic error, keeps current language |

## 8. Testing strategy
`node:test` in `tests/i18n.test.mjs` (must not import `next/headers`):
- AC-1: `SUPPORTED_LOCALES` equals `["en","it"]`; default `en`.
- AC-1: `en` and `it` have identical recursive key sets; all leaves non-empty strings.
- AC-1: `getDictionary("it").nav.rooms === "Camere"`; `getDictionary("en").nav.rooms === "Rooms"`.
- AC-2: `isSupportedLocale` false for `"fr"`, `""`, `null`, `undefined`, `123`, `"EN"`, `"en;x"`.
- AC-2: `getDictionary("fr")` falls back to English.
- Manual QA: pick Italian -> header, footer, account sidebar switch, `<html lang="it">`, persists across navigation and reload; with no cookie the app is English as before.

## 9. Environment variables
None.

## 10. Risks and mitigations
- Partial translation (page bodies stay English): documented; pattern allows incremental migration.
- Stale cached layout: `revalidatePath` plus `router.refresh()`.
- Cookie tampering: allowlist validation on read and write.
- Dictionary drift: key parity test.
- Mobile header hides the nav `ul`: selector placed outside `nav`.

## 11. Guidelines consulted
None found. Queries run (search_restricted, no domain): "UX guidelines language selector dropdown", "accessibility, wording and error messages, testing", "internationalization localization translations", "security input validation cookies". General practice applied instead: labelled native select, allowlist validation, clear error message.

## 11. Out of scope
Translating page-specific content (rooms, booking, checkout, forms, zod validation messages), locale-prefixed URLs, saving preference to user profile, more languages, Accept-Language auto-detection, date/currency formatting.
