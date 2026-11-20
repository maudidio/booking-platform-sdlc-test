# Technical design: Apply translation (en/it) to all web app pages

## 1. Overview
The i18n feature (cookie `lang`, `getDictionary()`, `en.js`/`it.js`) currently translates only Navbar, Footer, account layout and GuestDropdown. This change moves the remaining hard-coded English UI text of the pages verified in this run into the same dictionaries. English output stays identical to today (including existing typos such as "Foriegn", "Accomodation", "chunck"). The Italian text is new.

Assumptions:
- Only the two existing locales (en, it). No new dependency (constraint: standard library only).
- Database content (room names) and Lorem-ipsum placeholder paragraphs are not translated.
- Static `metadata` (tab title/description) stays English (see Out of scope).
- Server-side validation messages from zod/server actions stay as they are (see Out of scope).
- AC-1: every verified page shows its text in the selected language. AC-2: an invalid or missing `lang` cookie falls back to English, and the dictionary parity and non-empty tests fail on a missing key. The existing `resolveLocale`/`setLanguageAction` validation is unchanged.

## 2. Architecture changes
- Pattern: server components call `await getDictionary()` (from `app/_lib/i18n`) and read their namespace. Client components cannot call it (it uses `next/headers`), so they receive the namespace as a `dict` prop from their server parent. This is the pattern already used for Navbar and Footer.
- New dictionary namespaces: `home`, `contact`, `auth`, `rooms`, `checkout`, `history`, `profile`, `payment`. `en.js` and `it.js` keep identical key sets.
- No routing, API or data model changes.

## 3. Files to create or modify
| File | Action | Purpose |
|---|---|---|
| app/_lib/i18n/dictionaries/en.js | MODIFY | Add the new namespaces with the current English strings (read). |
| app/_lib/i18n/dictionaries/it.js | MODIFY | Same keys with Italian values (read). |
| app/page.js | MODIFY | Home server page: `getDictionary()`, pass `dict.home` to HeroSection (search hit shows `<HeroSection bookingSearchAction>`). |
| app/_components/HeroSection/index.jsx | MODIFY | Client component, hero lines and "Cancel" hard-coded (read); accept `dict` prop. |
| app/_components/About/index.jsx | MODIFY | "About Us" heading hard-coded (read). |
| app/_components/Blog/Blog.jsx | MODIFY | "Blog", "Bed Room", "The standard chunck" hard-coded (read). |
| app/_components/Rooms/index.jsx | MODIFY | "Our Rooms" heading hard-coded (search hit). |
| app/_components/Gallery/index.jsx | MODIFY | "Gallery" heading hard-coded (search hit). |
| app/_components/ContactSection/index.jsx | MODIFY | "Contact Us" heading; pass `dict.contact` to ContactForm (read). |
| app/_components/ContactForm/index.jsx | MODIFY | Placeholders, "Send", toasts hard-coded (read); accept `dict` prop. |
| app/contact/page.js | MODIFY | Banner title "REACHING OUT" hard-coded (search hit). |
| app/signin/page.js | MODIFY | Banner title "My Account" (search hit). |
| app/signin/_components/SigninForm/index.jsx | MODIFY | Load `dict.auth`, pass to CredentialsForm (search hit). |
| app/signin/_components/CredentialsForm/index.jsx | MODIFY | Labels, links, alerts, toast fallback hard-coded (read); accept `dict`, pass to SignInButton. |
| app/signin/_components/SignInButton/index.jsx | MODIFY | "Checking..." / "Sign In" hard-coded (read); accept `dict`. |
| app/signin/_components/OAuthProviderButtons/index.jsx | MODIFY | "or", "Continue with Google/Facebook" (read); server component, make async and use `getDictionary()`. |
| app/signup/page.js | MODIFY | Banner title "REGISTER" (search hit). |
| app/signup/_components/SignUpForm/index.jsx | MODIFY | Load `dict.auth`, pass to CredentialsForm (search hit). |
| app/signup/_components/CredentialsForm/index.jsx | MODIFY | Labels, links, toast fallback hard-coded (read); accept `dict`. |
| app/signup/_components/SignUpButton/index.jsx | MODIFY | "Checking..." / "Sign Up" hard-coded (read); accept `dict`. |
| app/rooms/page.jsx | MODIFY | Banner "Accomodation Options"; pass `dict.rooms` to FilterSection (search hit). |
| app/rooms/_components/FilterSection/index.jsx | MODIFY | Sort option labels, labels, placeholders, "Search", toast hard-coded (read); accept `dict`, build `options` inside the component. |
| app/rooms/_components/RoomItem/index.jsx | MODIFY | "From $ / Night" hard-coded (read); make async and use `getDictionary()`. |
| app/reservations/checkout/page.js | MODIFY | Banner "BOOKING CONFIRMATION" (search hit). |
| app/account/history/page.js | MODIFY | "Your History", empty state, "View Rooms" (search hit, full function seen). |
| app/account/profile/page.js | MODIFY | Heading "Edit Profile" (search hit). |
| app/payment/page.js | MODIFY | "Forbidden" heading; pass `dict.payment` to SuccessPage and ExpirePage (search hit). |
| app/payment/_components/ExpirePage/ExpirePage.jsx | MODIFY | Client component with hard-coded text (search hit); accept `dict`. |
| app/payment/_components/SuccessPage/SuccessPage.jsx | MODIFY | Labels, banner, buttons, toast hard-coded (read); accept `dict`. |
| app/_lib/i18n/__tests__/i18n.test.js | MODIFY | Add tests for the new keys (Tester). |

All paths are under `app/` of the target repo, so the full path in the work dir is `app/app/...`.

### 3b. Candidates to confirm
The Coder confirms each with a text search and changes only files that match, adding keys to both dictionaries. They are not deliverables.
- `app/_components/BookingForm/index.jsx`, `app/_components/BookingButton/index.jsx`: English labels or placeholders (search `placeholder=|label|>[A-Z][a-z]+`). Pass `dict.home` from HeroSection.
- `app/_components/ContactMap/index.jsx`: visible English text.
- `app/rooms/_components/RoomsSection/index.jsx`: empty-state text such as "No rooms".
- `app/rooms/[room_slug]/_components/*` (RoomContainer, RoomBookingForm, BookingPolicy, Facilities, Features, ReservationButton "Book Now"/"Booking...", FormDayPicker): hard-coded English text.
- `app/reservations/checkout/_components/*` (CheckoutForm "Reservation Confirmation", "Fullname", "NationalID"; CheckoutOverview, ConfirmationButton, CancelButton): hard-coded text. Pass `dict` from CheckoutSection.
- `app/reservations/edit/[id]/page.js` and `_components/*`: banner and text.
- `app/account/history/_components/*`, `app/account/profile/_components/ProfileForm/index.jsx`.
- `app/not-found.js`, `app/error.js`, `app/loading.js`, `app/account/loading.js`.
- `app/_lib/i18n/actions.js`: confirm `setLanguageAction` revalidates (`revalidatePath("/", "layout")`) or that LanguageSwitcher calls `router.refresh()`, so every page re-renders after a switch. If neither does, add revalidation.

## 4. Implementation plan
1. Add the namespaces below to `en.js` and `it.js` with identical keys. English values are the current strings verbatim; every value is a non-empty string.
   - `home`: heroLine1 "Find Comfort In a Foriegn Land With Us", heroLine2 "Book Now, Pay On Arrival", cancel "Cancel", aboutUs "About Us", ourRooms "Our Rooms", gallery "Gallery", blog "Blog", bedRoom "Bed Room", standardChunk "The standard chunck".
   - `contact`: bannerTitle "REACHING OUT", heading "Contact Us", name "Name", email "Email", phone "Phone", message "Message", send "Send", sent "Message has been sent", invalidData "Invalid contact data".
   - `auth`: signInBanner "My Account", registerBanner "REGISTER", login "Login", signUpHeading "Sign Up", fullname "Fullname", emailAddress "Email Address", password "Password", confirmPassword "Confirm Password", signIn "Sign In", signUp "Sign Up", checking "Checking...", forgotPassword "Forget Password?", noAccount "Don't have an account?", haveAccount "Already have an account?", signInFirst "Please sign in before confirming your booking!", failedSignIn "Failed to sign in, please try again", or "or", continueGoogle "Continue with Google", continueFacebook "Continue with Facebook".
   - `rooms`: banner "Accomodation Options", sortRooms "Sort Rooms", filterByDate "Filter By Date", arrivalDate "Arrival Date", departureDate "Departure Date", search "Search", invalidDateRange "Invalid date range!", sortDefault "Default Sorting", sortHighPrice "From High to Low price", sortLowPrice "From Low to High price", sortMaxGuests "From Max to Min guests", sortMinGuests "From Min to Max guests", from "From", perNight "/ Night".
   - `checkout`: banner "BOOKING CONFIRMATION".
   - `history`: heading "Your History", noBooking "You have no booked room.", viewRooms "View Rooms".
   - `profile`: heading "Edit Profile".
   - `payment`: forbidden "Forbidden", expiredTitle "Payment Session Expired", expiredMessage (current text), expiredInfo (current text), startNewBooking "Start New Booking", goBack "Go Back", successBanner "CHECKOUT OVERVIEW", reservationDetails "Reservation Details", bookingNumber "Booking Number", roomType "Room Type", checkIn "Check-in Date", checkOut "Check-out Date", guests "Guests", guestsCount "Guests", totalAmount "Total Amount", roomPreview "Room Preview", download "Download Confirmation", notImplemented "This feature hasn't been implemented yet", returnHome "Return to Home".
2. Server pages (home, contact, signin, signup, rooms, checkout, history, profile, payment): `const dict = (await getDictionary()).<ns>`. Make `rooms/page.jsx` async (it is a plain function today). Replace each literal with the dictionary value. Import in the style the file already uses (`@/app/_lib/i18n` or relative).
3. Server components About, Blog, Rooms, Gallery, ContactSection, SigninForm, SignUpForm, OAuthProviderButtons, RoomItem: make them `async` where needed and call `getDictionary()` inside. RoomItem and OAuthProviderButtons are rendered by parents that were not fully verified, so they fetch the dictionary themselves.
4. Client components (HeroSection, ContactForm, signin/signup CredentialsForm, SignInButton, SignUpButton, FilterSection, ExpirePage, SuccessPage) get a `dict` prop and replace literals. In FilterSection build `options` inside the component from `dict`, keeping the same `value`s. In the buttons use `{pending ? dict.checking : dict.signIn}` (or `dict.signUp`). Toast fallbacks use `dict.failedSignIn`. Price text: `{dict.from} ${price} {dict.perNight}`.
5. Do not change behaviour: no key, route, `value`, `name` or className changes. Keep date formats in SuccessPage as they are.
6. `layout.js` is unchanged.
7. Resolve each 3b candidate with the same pattern and add the keys to both dictionaries.
8. Extend the tests.

## 5. Data model changes
None. The dictionaries are repo-hosted JS objects.

## 6. API design
No new or changed endpoints. The only client-side call is the existing `setLanguageAction` (sets the `lang` cookie), which is unchanged. No new client calls, so no runtime probes.

## 7. Error handling
- Unsupported or missing `lang` cookie: `resolveLocale` falls back to `en`; pages render in English, no error.
- Invalid language submitted: `setLanguageAction` is unchanged and returns `errors.invalidLanguage`; the cookie stays unchanged and nothing changes.
- A missing key must not reach runtime: the parity test fails.
- Existing toasts, alerts and server error messages keep their behaviour; only hard-coded fallback texts are translated.

## 8. Testing strategy
Extend `i18n.test.js` (run with `node --test`):
- AC-1: each new namespace (home, contact, auth, rooms, checkout, history, profile, payment) exists in en and it.
- AC-1: Italian values differ from English for spot checks (e.g. `it.rooms.search !== en.rooms.search`), and English values equal the old literals (`en.rooms.banner === "Accomodation Options"`, `en.auth.signIn === "Sign In"`, `en.payment.forbidden === "Forbidden"`).
- AC-1: the existing key-parity and non-empty-string tests cover the new keys.
- AC-2: `resolveLocale` with "fr", "", null, "EN" still returns "en" (existing tests stay green).
- `en.rooms.from` and `en.rooms.perNight` are non-empty.
- Manual: with cookie `lang=it`, open /, /rooms, /contact, /signin, /signup and /account/history; all text is Italian. With no cookie the text matches today's English.

## 9. Environment variables
None added.

## 10. Risks and mitigations
- Client components cannot call `getDictionary`. Mitigation: pass `dict` props from server parents.
- Making components `async` breaks them if a parent is a client component. Mitigation: confirm each parent is a server component; otherwise pass `dict` as a prop.
- SuccessPage is an async function marked "use client" (existing oddity). Leave it and only add `dict`.
- Pages calling `cookies()` render dynamically. The layout already depends on the cookie, so the impact is small.
- Unchecked 3b candidates may leave some English text. Mitigation: the Coder checks the list and reports leftovers.
- Italian wording: keep it consistent with existing terms (Camere, Area ospiti, Esci).

## 11. Guidelines consulted
None found. Queries run: "translation localization wording guidelines", "UX accessibility error messages testing" (no results); two further queries ("language dictionary key parity new strings", "naming conventions code style") were blocked by the search limit. Project conventions from earlier runs (recall) were applied: dictionaries in `app/_lib/i18n/dictionaries`, en and it with identical keys, server code uses `getDictionary()`.

## 11. Out of scope
- Static `metadata` titles and descriptions.
- Zod and server-action validation messages, Stripe and Supabase messages.
- Date and number formatting (`LLL, dd yyyy`, `$`) and the react-datepicker locale.
- Lorem-ipsum placeholder paragraphs and database content (room names).
- New locales, URL-based locale routing, and changes to the language switcher UI.
