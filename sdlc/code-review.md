# Code review

## Verdict
APPROVED

## Summary
The implementation of the English/Italian language selector is complete and correct. All 13 required files are present. The design is faithfully implemented: cookie-based locale persistence, server helpers with correct fallback logic, a client-side switcher with proper error handling, dictionary-driven translations across the shared chrome (Navbar, Footer, account sidebar), and correct accessibility patterns. English output is unchanged. The only finding is a minor best-practice issue: GuestDropdown should explicitly declare `"use client"` for clarity and to follow Next.js 13+ conventions.

## Findings
| Severity | File | Line / area | Issue | Suggested fix |
|---|---|---|---|---|
| minor | app/_ui/GuestDropdown/GuestDropdown.jsx | Top of file | Client component (uses `useState`, `useEffect`, browser event listeners) lacks `"use client"` directive. While it functions because it is nested in a client component (Navbar), explicit marking is best practice in Next.js 13+ and helps prevent hydration issues. | Add `"use client";` at the very top of the file, before all imports. |

## Checklist
- [x] Implementation matches the design exactly
- [x] All endpoints, parameters, and response shapes are correct
- [x] All error cases are handled as specified in design section 7
- [x] No silent failures or swallowed exceptions
- [x] All inputs are validated before use
- [x] Passwords/secrets are never logged or returned in responses
- [x] Authentication/authorization is enforced on every protected route or MCP tool (where the design requires it)
- [x] No string-interpolated database queries (parameterised Cosmos DB / SQL queries only)
- [x] No sensitive data in error messages
- [x] Code matches the existing style (naming, imports, comments) and passes xo/prettier
- [x] Functions are small and single-purpose
- [x] No dead code or unnecessary complexity
- [x] Type annotations are present and correct (no unjustified `any`)
- [x] New team member could understand this in 6 months
- [x] Magic numbers/strings are extracted to named constants
- [x] Error messages are clear and actionable
- [x] Coder only modified files listed in the design's scope
- [x] Any out-of-scope change is documented under "Unplanned file changes" in build-summary.md
- [x] Regression risk areas identified for each out-of-scope or shared-infrastructure file touched
- [x] Undocumented out-of-scope changes flagged as Major findings

## Regression risk areas
None identified. All changed files are scoped to the new i18n feature or are UI integration points (Navbar, Footer, account layout, GuestDropdown) with dictionary-driven strings. The root layout now calls `getLocale()` and `dictionaries[locale]` on every render, but these operations are synchronous lookups with correct fallback logic, posing no performance or stability risk.
