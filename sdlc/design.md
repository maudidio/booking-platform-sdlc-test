# Technical design: Apply translation (en/it) to all web app pages

## 1. Overview
The existing language selector (cookie `lang`, dictionaries in `app/_lib/i18n/dictionaries/{en,it}.js`, `getDictionary()`) only translates the Navbar, Footer, account sidebar and GuestDropdown. This feature extends the same mechanism to every page and component: home, rooms list, room detail, contact, signin, signup, checkout, reservation edit, account history/profile, payment result pages, error and not-found pages, plus user-facing validation/error messages and date display. English output must stay byte-identical ("keep existing behaviour unchanged"). No new dependency (date-fns `locale/it` already ships with the existing date-fns package).

Assumptions: only `en` and `it` are supported (unchanged); room data coming from the database (names, descriptions) is NOT translated (content, not UI); Lorem-ipsum placeholder text in About/Blog is moved into the dictionaries as-is; existing typos (e.g. "Foriegn", "Accomodation") are preserved verbatim in `en` so English output is unchanged.

## 2. Architecture changes
- Keep the pattern already in place: server components call `await getDictionary()` and pass the needed slice as a `dict` prop to client components. No React context, no new library.
- Client components never import `next/headers`; they only receive `dict`.
- Server actions (`_lib/actions.js`, profile `guestUpdateAction`) call `getDictionary()` to return localized error messages.
- Zod schemas become factories taking a `validation` dictionary slice: `makeSignupSchema(v)` etc. The existing named exports (`signupSchema`, ...) remain and are built from the English slice, so existing imports keep working.
- Page `<head>` metadata: static `export const metadata` becomes `export async function generateMetadata()` using `dict.meta.<page>` (title/description).
- Date helpers get an optional `locale` argument (`"en"`|`"it"`) mapped to date-fns locales; default English output unchanged.
- New dictionary namespaces (identical keys in en and it): `meta`, `common`, `home` (hero, bookingForm, about, rooms, gallery, blog, contactSection), `rooms` (banner, filter, item, sort options), `roomDetail`, `contact`, `signin`, `signup`, `checkout`, `edit`, `history`, `profile`, `payment`, `notFound`, `error`, `validation`; existing `errors` is extended.

## 3. Files to create or modify
Paths relative to the target repo root. The Coder MUST read each file before editing and replace every user-visible hard-coded string (text nodes, labels, placeholders, `alt`, `aria-label`, `title`, toast messages, button text) with dictionary values; English values equal the current strings exactly.

| File | Action | Purpose |
|---|---|---|
| app/_lib/i18n/dictionaries/en.js | MODIFY | Add all new namespaces (English = current strings). |
| app/_lib/i18n/dictionaries/it.js | MODIFY | Same keys with Italian text. |
| app/_lib/i18n/format.js | CREATE | Pure `format(template, values)` replacing `{name}` placeholders. |
| app/_lib/zodSchemas.js | MODIFY | Schema factories taking `validation` dict; keep existing exports (English). |
| app/_lib/actions.js | MODIFY | Localized server-side error messages via `getDictionary()`. |
| app/utils/datetime.js | MODIFY | `formatToAbrFormat(date, locale="en")` using date-fns locale. |
| app/page.js | MODIFY | Dict, `generateMetadata`, pass dict to home sections. |
| app/not-found.js | MODIFY | Localized 404 (server component, see step 6). |
| app/error.js | MODIFY | Localized error boundary (client, cookie + static dictionaries). |
| app/_components/About/index.jsx | MODIFY | Dictionary text. |
| app/_components/Blog/Blog.jsx | MODIFY | Dictionary text. |
| app/_components/BookingButton/index.jsx | MODIFY | Dictionary text via prop. |
| app/_components/BookingForm/index.jsx | MODIFY | Labels, placeholders, toasts via `dict`. |
| app/_components/ContactForm/index.jsx | MODIFY | Labels, placeholders, errors via `dict`. |
| app/_components/ContactSection/index.jsx | MODIFY | Dictionary text, pass dict to ContactForm. |
| app/_components/Gallery/index.jsx | MODIFY | Dictionary text. |
| app/_components/HeroSection/index.jsx | MODIFY | Hero titles, Cancel button, pass dict to children. |
| app/_components/Rooms/index.jsx | MODIFY | Dictionary text. |
| app/_components/RoomCard/index.jsx | MODIFY | Dictionary text. |
| app/_ui/SubmitButton/index.jsx | CREATE_OR_MODIFY_IF_PRESENT | Text via props if hard-coded. |
| app/_ui/SelectCountry/index.jsx | CREATE_OR_MODIFY_IF_PRESENT | Placeholder text if hard-coded. |
| app/contact/page.js | MODIFY | Dict, `generateMetadata`. |
| app/signin/page.js | MODIFY | Dict, `generateMetadata`, pass dict. |
| app/signin/_components/CredentialsForm/index.jsx | MODIFY | Labels, links, alerts, toast fallback. |
| app/signin/_components/OAuthProviderButtons/index.jsx | MODIFY | Button text. |
| app/signin/_components/SignInButton/index.jsx | MODIFY | Button text. |
| app/signin/_components/SigninForm/index.jsx | MODIFY | Pass dict. |
| app/signup/page.js | MODIFY | Dict, `generateMetadata`. |
| app/signup/_components/CredentialsForm/index.jsx | MODIFY | Labels/placeholders/toasts. |
| app/signup/_components/SignUpButton/index.jsx | MODIFY | Button text. |
| app/signup/_components/SignUpForm/index.jsx | MODIFY | Pass dict. |
| app/rooms/page.jsx | MODIFY | Dict, `generateMetadata`, Banner title. |
| app/rooms/_components/FilterSection/index.jsx | MODIFY | Labels, sort options, placeholders, toast. |
| app/rooms/_components/RoomItem/index.jsx | MODIFY | Dictionary text. |
| app/rooms/_components/RoomsSection/index.jsx | MODIFY | Empty-state text, pass dict. |
| app/rooms/[room_slug]/page.js | MODIFY | Dict, `generateMetadata`, pass dict. |
| app/rooms/[room_slug]/_components/BookingPolicy/index.jsx | MODIFY | Dictionary text. |
| app/rooms/[room_slug]/_components/Facilities/index.jsx | MODIFY | Dictionary text. |
| app/rooms/[room_slug]/_components/Features/index.jsx | MODIFY | Dictionary text. |
| app/rooms/[room_slug]/_components/FormDayPicker/index.jsx | MODIFY | Labels/placeholders; DayPicker locale. |
| app/rooms/[room_slug]/_components/ReservationButton/index.jsx | MODIFY | Button text. |
| app/rooms/[room_slug]/_components/RoomBookingForm/index.jsx | MODIFY | Labels, toasts. |
| app/rooms/[room_slug]/_components/RoomContainer/index.jsx | MODIFY | Pass dict. |
| app/rooms/[room_slug]/_components/RoomDescription/index.jsx | MODIFY | Static headings. |
| app/rooms/[room_slug]/_components/RoomSlider/index.jsx | MODIFY | `alt`/aria text. |
| app/reservations/checkout/page.js | MODIFY | Dict, `generateMetadata`. |
| app/reservations/checkout/_components/CancelButton/index.jsx | MODIFY | Text. |
| app/reservations/checkout/_components/CheckoutForm/index.jsx | MODIFY | Labels, placeholders, errors. |
| app/reservations/checkout/_components/CheckoutOverview/index.jsx | MODIFY | Text, localized dates. |
| app/reservations/checkout/_components/CheckoutSection/index.jsx | MODIFY | Pass dict. |
| app/reservations/checkout/_components/ConfirmationButton/index.jsx | MODIFY | Text. |
| app/reservations/edit/[id]/page.js | MODIFY | Dict, `generateMetadata`. |
| app/reservations/edit/[id]/_components/CancelButton/index.jsx | MODIFY | Text. |
| app/reservations/edit/[id]/_components/CheckoutOverview/index.jsx | MODIFY | Text, localized dates. |
| app/reservations/edit/[id]/_components/ConfirmationButton/index.jsx | MODIFY | Text. |
| app/reservations/edit/[id]/_components/EditContainer/index.jsx | MODIFY | Pass dict. |
| app/reservations/edit/[id]/_components/EditSection/index.jsx | MODIFY | Text. |
| app/reservations/edit/[id]/_components/ReservationForm/index.jsx | MODIFY | Labels, errors. |
| app/account/history/page.js | MODIFY | Dict, `generateMetadata`, pass dict. |
| app/account/history/_components/CancelButton/index.jsx | MODIFY | Text. |
| app/account/history/_components/ControlButtons/index.jsx | MODIFY | Text. |
| app/account/history/_components/DeleteFrom/index.jsx | MODIFY | Text. |
| app/account/history/_components/ReservationCard/index.jsx | MODIFY | Text. |
| app/account/history/_components/ReservationOverview/index.jsx | MODIFY | Labels (Arrival, Departure, Guests, ...), localized dates. |
| app/account/history/_components/ReservationUpdate/index.jsx | MODIFY | Text. |
| app/account/profile/page.js | MODIFY | Dict, `generateMetadata`, localized validation errors in `guestUpdateAction`. |
| app/account/profile/_components/ProfileForm/index.jsx | MODIFY | Labels, toasts. |
| app/payment/page.js | MODIFY | Dict, pass to child pages. |
| app/payment/_components/ExpirePage/ExpirePage.jsx | MODIFY | Text. |
| app/payment/_components/SuccessPage/SuccessPage.jsx | MODIFY | Text. |
| README.md | MODIFY | One line in Features about full-site translation. |
| app/_lib/i18n/__tests__/i18n.test.js | MODIFY | (Tester) Namespace and placeholder-parity tests. |
| app/_lib/__tests__/zodSchemas.test.js | CREATE | (Tester) Localized schema factory tests. |
| app/utils/__tests__/datetime.test.js | CREATE | (Tester) Locale-aware date formatting tests. |

## 4. Implementation plan
1. Inventory: for each file in section 3 list all user-visible strings and group them by namespace (section 2). Do not translate DB content, URLs, brand names, currency symbol or class names.
2. Extend `en.js` with the new namespaces using the exact current strings (including typos, punctuation, casing). Parameterised strings use `{name}` placeholders rendered with `format(template, values)` from `_lib/i18n/format.js` (pure, standard library only).
3. Add identical keys to `it.js` with Italian text (parity test enforces).
4. Server pages: `const dict = await getDictionary();` pass `dict.<ns>` to children. Replace `export const metadata` with `generateMetadata()` returning `{title, description}` from `dict.meta.*`; English values unchanged.
5. Client components accept a `dict` prop and never call `getDictionary`. Toast/Alert messages use `dict` strings.
6. `not-found.js`: remove `"use client"`, call `getDictionary()`, render the button as a `<Link href="/">` with the existing class. `error.js` stays a client component: read the `lang` cookie from `document.cookie` inside `useEffect`, validate with `isSupportedLocale`, default `en` (initial state `en` to avoid hydration mismatch), and import `dictionaries` directly (pure data).
7. `zodSchemas.js`: add `makeProfileSchema`, `makeSignInSchema`, `makeBookingSchema`, `makeReservationSchema`, `makeSignupSchema`, `makeContactSchema` taking `v = dict.validation`; keep old exports as `makeX(en.validation)` with identical English messages.
8. `actions.js` and profile `guestUpdateAction`: `const dict = await getDictionary()`; use factories with `dict.validation`; replace hard-coded error strings ("Email address already exists!", authentication failure, password length, booking errors) with `dict.errors.*` keys. Flow and return shapes unchanged.
9. `datetime.js`: `formatToAbrFormat(dateString, locale = "en")` -> `format(date, "EEE, MMM dd", { locale: locale === "it" ? itLocale : undefined })` with `import { it as itLocale } from "date-fns/locale"`. Callers pass the locale (server: `await getLocale()`, client: prop). DayPicker/DatePicker receive the matching date-fns locale.
10. Do not change routes, cookie name, or `setLanguageAction`. After `router.refresh()` every page re-renders in the new language because each page reads the cookie on the server.
11. Add tests (section 8) and the README line.

## 5. Data model changes
None. No database or schema change. Locale stays in the `lang` cookie.

## 6. API design
No new HTTP endpoints and no new client-side HTTP calls, so no routing or entrypoint concerns. Existing server action `setLanguageAction(locale)` is unchanged:
- Request `"it"` -> response `{"ok": true}`.
- Request `"fr"` -> response `{"ok": false, "error": "Unsupported language. Supported languages: en, it."}`.
Auth: unchanged (none for the language action). Routes under `app/api/*` return machine-oriented responses and are not translated.

## 7. Error handling
| Case | Behaviour |
|---|---|
| Unsupported/empty/non-string locale to `setLanguageAction` | `{ok:false, error: dict.errors.invalidLanguage}`; cookie unchanged (AC-2, existing). |
| Missing/tampered `lang` cookie | Falls back to `en` on every page. |
| Form validation failure (signin, signup, contact, profile, booking, reservation) | Same structure as today (`{field: message}`), message from `dict.validation` in the active language; nothing persisted (AC-2). |
| Server-side errors (duplicate email, auth failure, booking conflict) | Message from `dict.errors.*` in the active language; same flow as today. |
| Missing key in a dictionary | Prevented by the parity and non-empty tests. |
| `error.js` cookie unreadable | Falls back to English. |

## 8. Testing strategy
Test command: `node --test "app/**/__tests__/*.test.js"` (pure Node; no `next/headers` imports).
- i18n.test.js (AC-1): existing parity and non-empty tests cover new keys automatically; add: every required namespace exists in both languages; `it` differs from `en` for sample strings (e.g. `signin` heading); `en.notFound` title equals "Oops! Page Not Found"; every `{placeholder}` in an `en` string also appears in the matching `it` string.
- zodSchemas.test.js (AC-2): `makeSignupSchema(it.validation)` with mismatched passwords gives the Italian message at path `confirm_password`; with `en.validation` gives "Password doesn't match confirmation"; legacy `signupSchema` still gives English; invalid email/phone/short name/over-long message for contact/profile/reservation return `success:false` with the localized message.
- datetime.test.js (AC-1): `formatToAbrFormat("2024-03-04")` equals the previous English output; with `"it"` returns Italian weekday/month; unknown locale falls back to English.
- format.js: placeholder substitution, missing value left untouched.
- Page-level AC-1 is verified by the parity test plus a QA manual checklist: switch to Italian and visit every route in section 3.

## 9. Environment variables
None added.

## 10. Risks and mitigations
- Large surface: missed strings. Mitigation: inventory step; reviewer greps for remaining JSX text literals.
- English regressions: values copied verbatim; tests assert key English strings.
- Props-less client components (`error.js`): cookie read plus static dictionaries.
- Static caching ignoring the cookie: pages call `cookies()` and are dynamic.
- Hydration mismatch in `error.js`: initial state `en`, switch in `useEffect`.
- Mixed-language content: DB room data stays in original language (out of scope).

## 11. Guidelines consulted
None found in the knowledge base. Queries run: "translation localization wording guidelines", "accessibility and testing rules for UI changes", "UX copy language guidelines", "security input validation server actions" (all empty); "naming conventions and code style" was blocked by the search limit. Applied project conventions from previous runs instead: dictionaries in `_lib/i18n`, identical keys in en/it, `role="alert"` errors, English output unchanged, `<html lang>` already set.

## 12. Out of scope
- Languages beyond en/it; URL-based locale routing.
- Translating database content (room names/descriptions), API route responses, Stripe/third-party hosted pages, console logs.
- Currency or number localisation.
- Changing the language selector UI or cookie behaviour.
