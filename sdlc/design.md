# Technical design: Language selector (English / Italian)

## 1. Overview
Users pick the UI language (English or Italian) from a drop-down at the top right of the header, which is rendered on every page by the root layout. The choice is stored in a cookie (`lang`) and applies to all later requests. Translations live in plain JS dictionary files in the repo, so developers can edit them easily. No new dependencies are added (standard library only). English stays the default, so existing behaviour is unchanged when no cookie is set.

Assumption: the codebase has no i18n today, and every string is hard-coded. For this iteration the translated surface is the shared chrome that appears on all pages: the Navbar links, the guest drop-down (History, Profile, Logout), the "Guest Area" link and the selector label. The dictionary and helpers are built so that other components can be migrated incrementally. Translating page bodies, DB content (rooms) and zod messages is out of scope.

## 2. Architecture changes
- New `app/_lib/i18n/` module with:
  - `config.mjs`: supported locales and the default.
  - `dictionaries/en.mjs` and `dictionaries/it.mjs`: flat key/value dictionaries.
  - `translate.mjs`: pure functions `isSupportedLocale`, `normalizeLocale`, `getDictionary`, `t`.
  - `server.js`: `getLocale()` and `getDict()` read the `lang` cookie through `next/headers`.
- New server action `setLanguageAction(formData)` in `app/_lib/actions.js`. It validates the value, sets the cookie and calls `revalidatePath("/", "layout")`.
- New client component `app/_ui/LanguageSelector` (a `<select>` that submits the action).
- `RootLayout` (a server component) resolves the locale, sets `<html lang={locale}>` and passes `locale`, `dict` and the action to `Navbar`.
- `Navbar` and `GuestDropdown` use `dict` instead of literals.
- The `.mjs` extension is used for the pure modules so they can be unit-tested with the built-in `node:test` runner without a build step.

## 3. Files to create or modify
| File | Action | Purpose |
|---|---|---|
| app/_lib/i18n/config.mjs | CREATE | `SUPPORTED_LOCALES = ["en","it"]`, `DEFAULT_LOCALE = "en"`, `LOCALE_LABELS` (`{en:"English", it:"Italiano"}`), `LANG_COOKIE = "lang"` |
| app/_lib/i18n/dictionaries/en.mjs | CREATE | English dictionary (default export, flat object) |
| app/_lib/i18n/dictionaries/it.mjs | CREATE | Italian dictionary (same keys as en) |
| app/_lib/i18n/translate.mjs | CREATE | Pure helpers (see section 4) |
| app/_lib/i18n/server.js | CREATE | `getLocale()` and `getDict()` using `cookies()` |
| app/_lib/actions.js | MODIFY | Add `setLanguageAction` |
| app/_ui/LanguageSelector/index.jsx | CREATE | Client drop-down |
| app/_ui/LanguageSelector/styles.module.css | CREATE | Styling |
| app/_ui/Navbar.jsx | MODIFY | Accept `dict`, `locale`, `setLanguageAction`; translate labels; render the selector at the right |
| app/_ui/GuestDropdown/GuestDropdown.jsx | MODIFY | Accept an optional `dict` prop; translate History, Profile, Logout |
| app/layout.js | MODIFY | Resolve locale, set `<html lang>`, pass props to Navbar |
| package.json | MODIFY | Add script `"test": "node --test"` |
| tests/i18n.test.mjs | CREATE (Tester) | Unit tests for the dictionaries and helpers (AC-1, AC-2) |

Paths are relative to the target app repo root (the `app/` checkout), so `app/_lib/...` means the Next.js `app` directory.

## 4. Implementation plan
1. `config.mjs`: export the constants listed above.
2. Dictionaries: keys `nav.home`, `nav.rooms`, `nav.contact`, `nav.guestArea`, `nav.history`, `nav.profile`, `nav.logout`, `lang.label` (aria-label, "Language" / "Lingua"), `lang.error` ("Unsupported language" / "Lingua non supportata").
   - Italian: Home, Camere, Contattaci, Area Ospiti, Cronologia, Profilo, Esci.
   - Both files must have identical key sets.
3. `translate.mjs`:
   - `isSupportedLocale(v)` returns `typeof v === "string" && SUPPORTED_LOCALES.includes(v)`.
   - `normalizeLocale(v)` returns `v` if supported, otherwise `DEFAULT_LOCALE`.
   - `getDictionary(locale)` returns the dictionary of `normalizeLocale(locale)`.
   - `t(dict, key)` returns `dict[key]`, falling back to the English value, then to the key itself. It never throws.
4. `server.js`: `getLocale()` returns `normalizeLocale(cookies().get(LANG_COOKIE)?.value)`. `getDict()` returns `getDictionary(getLocale())`.
5. `setLanguageAction(formData)` in `actions.js` (which already has `"use server"`):
   - `lang = formData.get("lang")`.
   - If `!isSupportedLocale(lang)`, return `{ error: "Unsupported language" }` and do not touch the cookie.
   - Otherwise `cookies().set("lang", lang, { path: "/", maxAge: 31536000, sameSite: "lax" })`, then `revalidatePath("/", "layout")`, then return `{ ok: true, lang }`.
   - The cookie is not httpOnly, because it holds no secret.
6. `LanguageSelector` (client):
   - Props: `locale`, `action`, `label`.
   - A `<form ref>` with a `<select name="lang" aria-label={label} defaultValue={locale}>`.
   - Options are built from `SUPPORTED_LOCALES` and `LOCALE_LABELS`.
   - `onChange` calls `form.requestSubmit()`. The form uses `action={action}`.
   - A `<noscript>` submit button keeps it usable without JS.
7. `Navbar`: add the props. Place `<LanguageSelector>` as the last element inside `.header-items`, after the toggle button, so it sits at the top right on desktop and mobile. Replace literals with `dict["nav.*"]`. Pass `dict` to `GuestDropdown`.
8. `layout.js`: `const locale = getLocale(); const dict = getDictionary(locale);`. Use `<html lang={locale}>`. Pass `locale`, `dict` and `setLanguageAction` to Navbar.
9. `GuestDropdown`: `dict` is optional, and `t(dict ?? getDictionary("en"), key)` is used so no other call site breaks.
10. CSS: the select is 36px high, has a 1px #333 border, 4px radius and inherits the font, with a margin that keeps it clear of the toggle button.

## 5. Data model changes
None. The preference is stored only in the `lang` cookie. It is not saved to the guest profile, which is out of scope.

## 6. API design
No HTTP endpoints are added. The only interface is the Next.js server action `setLanguageAction`, invoked by a form POST that Next.js handles internally.
- Input: form field `lang` in {`en`, `it`}.
- Success example: `lang=it` returns `{ "ok": true, "lang": "it" }`, sets `Set-Cookie: lang=it; Path=/; Max-Age=31536000; SameSite=Lax`, and the page re-renders in Italian.
- Error example: `lang=fr` returns `{ "error": "Unsupported language" }`, and the cookie is unchanged.
- Client call routing: the selector runs in the browser and the action is on the same Next.js server (same origin). There is no separate backend, and no routing configuration is needed. No runtime probes apply, because server actions have no stable URL.

## 7. Error handling
| Case | Result |
|---|---|
| `lang` missing, empty, non-string or unsupported | Action returns `{ error: "Unsupported language" }`. No cookie change. The UI keeps the current language. |
| Cookie holds an unsupported value (tampered) | `normalizeLocale` falls back to `en`. No error. |
| Missing dictionary key | `t` falls back to the English value, then to the key. |

## 8. Testing strategy
`node --test` runs `tests/i18n.test.mjs` (standard library, no dependencies). No test command was previously detected; the new `npm test` script supplies one.
- AC-1: `SUPPORTED_LOCALES` equals `["en","it"]`.
- AC-1: the key sets of `en` and `it` are identical and every value is a non-empty string.
- AC-1: `getDictionary("it")["nav.home"]` is "Home" and `["nav.rooms"]` is "Camere".
- AC-1: `getDictionary("en")["nav.rooms"]` is "Rooms".
- AC-1: `t(dict, "nav.history")` returns the translated string for each locale.
- AC-2: `isSupportedLocale` is false for `"fr"`, `""`, `undefined`, `null`, `42` and `"IT"`.
- AC-2: `normalizeLocale("fr")` and `normalizeLocale(undefined)` return `"en"`.
- AC-2: `t({}, "nav.home")` returns the English fallback, and `t({}, "unknown.key")` returns `"unknown.key"`.
- AC-2 (action behaviour): covered by manual QA. Submitting an unsupported `lang` returns the error and leaves the cookie unchanged. The action's validation is just `isSupportedLocale`, which is tested above.
- Manual QA: the selector is visible at the top right on `/`, `/rooms`, `/contact`, `/signin` and `/account/*`. Choosing Italiano changes the nav labels and `<html lang>`, and the choice persists after reload. With no cookie the app is in English.

## 9. Environment variables
None added.

## 10. Risks and mitigations
- Partial translation, because only the shared chrome is translated. This is documented, and the dictionary is easy to extend.
- Reading `cookies()` in the root layout makes every route dynamic. The layout already calls `auth()`, which reads cookies, so the impact is nil.
- Passing a server action to a client component: the action is passed as a prop from the server layout, following the existing `signOutAction` pattern.
- `.mjs` imports: Next.js 14 resolves them natively, and relative imports avoid any dependency on the jsconfig alias.

## 11. Guidelines consulted
None found. Queries run with `search_restricted`: "language selector UX dropdown", "translations accessibility naming testing guidelines" and "wording error messages security cookies". All returned no results. `recall` also returned no prior decisions. The design applies sensible defaults: an aria-label on the select, `<html lang>` kept in sync, and a non-sensitive cookie.

## 11. Out of scope
- Translating page bodies, forms, validation messages, emails and DB content.
- Saving the preference to the user profile.
- More than two languages, and Accept-Language auto-detection.
- URL-based locale routing.
- Any new dependency such as next-intl.
