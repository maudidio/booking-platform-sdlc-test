# Design: I want users to be able to select a different language for the web app using a d

## 1. Overview
Add `i_want_users_to_be_able_to_select_a_diff(a, b)` to the `app/feature` package and export it.


Grounded on (search_code, the extended package comes from the top hit):
- `app/supabase/config.toml:203-232` `<file>[7]` (chunk `ece80c64-92fb-464e-85b3-954ce369143c:supabase/config.toml#<file>[7]:6f2d23b1ebcd`, commit b3db7893fa)
- `app/supabase/config.toml:26-66` `<file>[2]` (chunk `ece80c64-92fb-464e-85b3-954ce369143c:supabase/config.toml#<file>[2]:7fa8a629d4ce`, commit b3db7893fa)

## 2. Architecture
A pure function in its own module, re-exported from the package `__init__`. No new dependencies.

## 3. Files to create or modify
| Path | Action | Agent | Purpose |
|---|---|---|---|
| `app/feature/i_want_users_to_be_able_to_select_a_diff.py` | CREATE | Coder | New function `i_want_users_to_be_able_to_select_a_diff(a, b)`. |
| `app/tests/test_i_want_users_to_be_able_to_select_a_diff.py` | CREATE | Tester | Unit tests for `i_want_users_to_be_able_to_select_a_diff`. |

## 4. Implementation plan
1. Create the module with the function and a docstring.
2. Export it from the package.

## 5. Data model
None.

## 6. API design
`i_want_users_to_be_able_to_select_a_diff(a: number, b: number) -> number`.

## 7. Error handling
Python's own arithmetic errors propagate unchanged.

## 8. Testing strategy
Unit tests with the standard library `unittest`, run with `python3 -m unittest discover -s tests`.
- AC-1: covered by `test_i_want_users_to_be_able_to_select_a_diff`
- AC-2: covered by `test_i_want_users_to_be_able_to_select_a_diff`

## 9. Environment variables
None.

## 10. Risks
Low. Additive change.

## 11. Guidelines consulted
Guidelines are not bound for this workspace (guidelines.enabled: false).

Restricted knowledge searched (search_restricted): none returned for this role/clearance.
