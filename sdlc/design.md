# Design: I want that translation functionality applies to all webapp pages, not just head

## 1. Overview
Add `i_want_that_translation_functionality_ap(a, b)` to the `app/feature` package and export it.


Grounded on (search_code, the extended package comes from the top hit):
- `app/Licence.txt:1-21` `<file>` (chunk `ece80c64-92fb-464e-85b3-954ce369143c:Licence.txt#<file>:99510dd98a6d`, commit b3db7893fa)
- `app/supabase/config.toml:174-206` `<file>[6]` (chunk `ece80c64-92fb-464e-85b3-954ce369143c:supabase/config.toml#<file>[6]:32320abf2947`, commit b3db7893fa)
- `app/supabase/config.toml:203-232` `<file>[7]` (chunk `ece80c64-92fb-464e-85b3-954ce369143c:supabase/config.toml#<file>[7]:6f2d23b1ebcd`, commit b3db7893fa)

## 2. Architecture
A pure function in its own module, re-exported from the package `__init__`. No new dependencies.

## 3. Files to create or modify
| Path | Action | Agent | Purpose |
|---|---|---|---|
| `app/feature/i_want_that_translation_functionality_ap.py` | CREATE | Coder | New function `i_want_that_translation_functionality_ap(a, b)`. |
| `app/tests/test_i_want_that_translation_functionality_ap.py` | CREATE | Tester | Unit tests for `i_want_that_translation_functionality_ap`. |

## 4. Implementation plan
1. Create the module with the function and a docstring.
2. Export it from the package.

## 5. Data model
None.

## 6. API design
`i_want_that_translation_functionality_ap(a: number, b: number) -> number`.

## 7. Error handling
Python's own arithmetic errors propagate unchanged.

## 8. Testing strategy
Unit tests with the standard library `unittest`, run with `python3 -m unittest discover -s tests`.
- AC-1: covered by `test_i_want_that_translation_functionality_ap`
- AC-2: covered by `test_i_want_that_translation_functionality_ap`

## 9. Environment variables
None.

## 10. Risks
Low. Additive change.

## 11. Guidelines consulted
Guidelines are not bound for this workspace (guidelines.enabled: false).

Restricted knowledge searched (search_restricted): none returned for this role/clearance.
