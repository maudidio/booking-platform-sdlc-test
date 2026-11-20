# Technical design: Language selector (English / Italian) with repo-hosted dictionaries

## 1. Overview
Users can pick English or Italian from a drop-down at the top right of the header, which is rendered on every page by the root layout. The choice is stored in a cookie, so server-rendered pages use it on the next request. Translations live in plain JS dictionary files in the repo (`en.js`, `it.js`) that developers can edit directly. No third-party i18n library is used (constraint: standard library only). Default language is English, so existing behaviour is unchanged for anyone who has not chosen a language.

Assumption (no clarification needed): the first delivery translates the shared chrome that appears on all pages (Navbar, Footer, account sidebar) and sets `<html lang>`. The dictionary is namespaced so other pages can be migrated incrementally with the same helper. Translating every page's copy is out of scope (section 12).

Paths below are relative to the target repo root (the Next.js `app/` directory lives at `app/` in that repo).

## 2. Architecture changes
- New module `app/_lib/i18n/`: dictionaries, config (supported locales, default, cookie name), server helpers `getLocale()`/`getDictionary()`, and a server action `setLanguageAction`.
- Locale source of truth: cookie `lang` (`en` | `it`), read on the server with `cookies()` from `next/headers`. Missing or invalid cookie falls back to `en`.
- `RootLayout` resolves locale and dictionary, sets `<html lang={locale}>`, passes `locale` and dictionary slices to Navbar and Footer.
- New client component `LanguageSwitcher` (native `<select>`) in the header, right of the nav and always visible (outside the collapsible mobile menu). It calls the server action, then `router.refresh()`.
- `account/layout.jsx` is a server component; it calls `getDictionary()` directly.

## 3. Files to create or modify
| File | Action | Purpose |
|---|---|---|
| app/_lib/i18n/config.js | CREATE | `SUPPORTED_LOCALES=["en","it"]`, `DEFAULT_LOCALE="en"`, `LOCALE_COOKIE="lang"`, `LOCALE_LABELS={en:"English",it:"Italiano"}`, `isSupportedLocale(value)`. |
| app/_lib/i18n/dictionaries/en.js | CREATE | English dictionary (default export, nested by namespace). |
| app/_lib/i18n/dictionaries/it.js | CREATE | Italian dictionary, identical key set to en.js. |
| app/_lib/i18n/dictionaries/index.js | CREATE | Exports `dictionaries = { en, it }`. |
| app/_lib/i18n/index.js | CREATE | Server helpers `getLocale()`, `getDictionary()`, pure `resolveLocale(value)`. |
| app/_lib/i18n/actions.js | CREATE | `"use server"` action `setLanguageAction(locale)`. |
| app/_ui/LanguageSwitcher/index.jsx | CREATE | Client component: labelled `<select>`. |
| app/_ui/LanguageSwitcher/styles.module.css | CREATE | Styles for the select and visually-hidden label. |
| app/_ui/Navbar.jsx | MODIFY | Accept `dict` and `locale`; replace hard-coded labels (Home, Rooms, Contact Us, Guest Area) with dictionary values; render LanguageSwitcher. |
| app/layout.js | MODIFY | Resolve locale/dictionary; `<html lang={locale}>`; pass props to Navbar and Footer. |
| app/_components/Footer/index.jsx | MODIFY | Read first; accept `dict` prop; replace static text with `dict.footer.*` keeping English output identical. |
| app/account/layout.jsx | MODIFY | Make Layout async, use `await getDictionary()` for History / Profile / Sign out labels. |
| app/_ui/GuestDropdown/GuestDropdown.jsx | MODIFY | Read first; use dictionary for any static labels (English unchanged). Skip if there is no static text. |
| app/_lib/i18n/__tests__/i18n.test.js | CREATE | Tester: dictionary parity, `resolveLocale`, action validation (`node:test`, stdlib). Covers AC-1 and AC-2. |

## 4. Implementation plan
1. `config.js`: export constants; `isSupportedLocale(v)` = `typeof v === "string" && SUPPORTED_LOCALES.includes(v)` (exact, case-sensitive).
2. Dictionaries. `en.js`:
   ```js
   const en = {
     navbar: { home: "Home", rooms: "Rooms", contact: "Contact Us", guestArea: "Guest Area", language: "Language", toggleMenu: "Toggle menu" },
     footer: { /* keys for existing Footer text, same English wording */ },
     account: { history: "History", profile: "Profile", signOut: "Sign out" },
     errors: { invalidLanguage: "Unsupported language. Supported languages: en, it.", languageChangeFailed: "Could not change the language. Please try again." }
   };
   export default en;
   ```
   `it.js` has exactly the same keys (Rooms→"Camere", Contact Us→"Contattaci", Guest Area→"Area ospiti", Language→"Lingua", History→"Cronologia", Profile→"Profilo", Sign out→"Esci", etc.). A header comment in both files explains how to add/fix keys and that both files must keep the same keys.
3. `dictionaries/index.js`: import both, `export const dictionaries = { en, it };`.
4. `index.js`: `resolveLocale(v)` returns `v` if supported else `DEFAULT_LOCALE`. `async getLocale()` = `resolveLocale((await cookies()).get(LOCALE_COOKIE)?.value)` (await only if Next >= 15; check `package.json`). `async getDictionary()` = `dictionaries[await getLocale()]`.
5. `actions.js` (`"use server"`): `setLanguageAction(locale)`: if `!isSupportedLocale(locale)` return `{ ok:false, error: dictionaries[DEFAULT_LOCALE].errors.invalidLanguage }` without touching the cookie. Else set cookie `lang` with `{ path:"/", maxAge:31536000, sameSite:"lax", secure: process.env.NODE_ENV==="production" }` and return `{ ok:true, locale }`.
6. `LanguageSwitcher` (`"use client"`), props `locale`, `label`, `errorText`: hidden-visually `<label htmlFor="language-select">` + `<select id="language-select" value={locale}>` with options from `SUPPORTED_LOCALES` labelled by `LOCALE_LABELS`. `onChange` → `startTransition(async () => { try { const res = await setLanguageAction(v); if (res.ok) router.refresh(); else setError(res.error);} catch { setError(errorText);} })`. Disabled while pending. Error shown in a `role="alert"` element; select stays on the current locale because `value` is controlled by the `locale` prop.
7. `Navbar.jsx`: add `dict` (= `dict.navbar` slice) and `locale` props; replace labels; place `<LanguageSwitcher>` in `.header-items` after `<nav>` and before the toggle button; toggle button gets `aria-label={dict.toggleMenu}`.
8. `layout.js`: `const locale = await getLocale(); const dict = dictionaries[locale];` `<html lang={locale}>`; `<Navbar ... dict={dict.navbar} locale={locale} errors={dict.errors} />`; `<Footer dict={dict.footer} />`. Only slices are passed to client components.
9. Footer, account layout, GuestDropdown: swap static strings for dictionary values; English output stays byte-identical.
10. The layout reading cookies makes routes dynamic; it already calls `auth()` so no practical change.

## 5. Data model changes
None. No database changes; persistence is the browser cookie `lang`.

## 6. API design
No new HTTP route and no new client fetch URL. The language change uses a Next.js Server Action (`setLanguageAction`) invoked by the browser through the framework's own POST to the current page URL; routing is handled by Next, nothing to configure. No runtime probes (no new endpoint; snapshot has no runtime-check section).

Action contract:
- Input: `locale` string. Auth: none (public preference, no user data).
- Success example: `{ "ok": true, "locale": "it" }` plus `Set-Cookie: lang=it; Path=/; Max-Age=31536000; SameSite=Lax`.
- Failure example (input `"fr"`): `{ "ok": false, "error": "Unsupported language. Supported languages: en, it." }`, cookie unchanged.

## 7. Error handling
| Case | Behaviour |
|---|---|
| Unsupported / empty / non-string locale to action | `{ok:false, error:"Unsupported language. Supported languages: en, it."}`; cookie unchanged; UI shows message in `role="alert"`; select keeps current locale. |
| Missing or tampered `lang` cookie on a request | Fall back to `en`; page renders normally. |
| Action throws / network failure | Caught in switcher; show `errors.languageChangeFailed`; locale unchanged. |
| Missing key in a dictionary | Prevented by the parity test. |

## 8. Testing strategy
File `app/_lib/i18n/__tests__/i18n.test.js` using `node:test` (stdlib). If `package.json` has no test script, add `"test": "node --test"` (then package.json becomes MODIFY by the Coder).
- AC-1: `resolveLocale("it")==="it"`, `resolveLocale("en")==="en"`; `dictionaries.it.navbar.rooms === "Camere"`; `setLanguageAction("it")` returns `{ok:true,locale:"it"}` and sets cookie `lang=it` (mock `next/headers`).
- AC-1: parity: recursively collected key paths of `en` and `it` are equal; every leaf is a non-empty string.
- AC-1: default: no cookie → English labels identical to previous text ("Home","Rooms","Contact Us","Guest Area").
- AC-2: `setLanguageAction` with `"fr"`, `""`, `null`, `undefined`, `123`, `"IT"`, `"it; Path=/"` returns `{ok:false}` with the error text and never calls cookie set.
- AC-2: `resolveLocale("fr")` and `resolveLocale(undefined)` → `"en"`.
- QA manual: choose Italiano on home → nav shows Camere/Contattaci/Area ospiti; navigate to /rooms and /contact: still Italian; reload persists; mobile width: selector visible; `<html lang="it">`.

## 9. Environment variables
None added.

## 10. Risks and mitigations
- Dictionary drift: parity test.
- Layout becomes dynamic: already dynamic through `auth()`.
- Next version differences for `cookies()` (sync vs async): Coder checks `package.json`.
- Footer/GuestDropdown contents not read at design time: Coder reads them first and keeps English identical.
- Header crowding on mobile: compact select outside the collapsible menu.
- Prompt-injection check: no search results or files contained instructions; nothing to report.

## 11. Guidelines consulted
None found. search_restricted queries run: "UI guidelines dropdown language accessibility" and "error messages wording security testing naming" returned no results. recall() found no prior decisions. General practice applied: labelled form control, `lang` attribute, `role="alert"` for errors.

## 12. Out of scope
- Translating page-specific copy (rooms, booking, checkout, forms, zod validation messages, Stripe pages); can migrate later with `getDictionary()`.
- Languages beyond English and Italian; URL-based locale routing; `Accept-Language` detection; per-user stored preference in the database.
- Translating database content (room names/descriptions).
- Locale-specific date/number formatting.
