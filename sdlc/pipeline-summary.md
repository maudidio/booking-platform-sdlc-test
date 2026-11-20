## 🤖 AI-generated feature: I want users to be able to select a different language for the web app using a d

### Design
Design written for: I want users to be able to select a different language for the web app using a d

### Implementation
Build summary (attempt 1)

### Code review
✅ approved

### Tests
Tests written and run; see sdlc/test-results.md.

### QA
❌ REJECTED

### Cost
Model spend for this run: $0.5999 of $5.00 budget (ModelGateway ledger).

---
See `sdlc/` for full agent reports.

### Criterion traceability

| Criterion | Probe(s) | Test file(s) | Status |
|---|---|---|---|
| **AC-1** Given the application, When a user uses the translations capability, Then it beh | - | app/tests/test_i_want_users_to_be_able_to_select_a_diff.py | test-linked |
| **AC-2** Given invalid input, When a user uses the translations capability, Then a clear  | - | app/tests/test_i_want_users_to_be_able_to_select_a_diff.py | test-linked |

Test-linked criteria pass or fail with the suite: FAIL


## ⚠️ Needs human review

The pipeline did not resolve the following findings. Do not merge without review.

- **tester** (bugs_remaining): Implementation bugs remain (sdlc/test-results.md)
- **qa** (rejected): QA review not APPROVED after all retries (sdlc/qa-review.md)
- **tester** (loop_exhausted): impl_loop exhausted after 2 attempts (tester still 'real_bugs'); continuing to 'clean' with the finding recorded
- **tester** (loop_exhausted): impl_loop exhausted after 2 attempts (tester still 'real_bugs'); continuing to 'clean' with the finding recorded
- **qa** (loop_exhausted): qa_loop exhausted after 2 attempts (qa still 'rejected'); continuing to 'approved' with the finding recorded
- **dependency_audit** (vulnerable_dependency): @auth/core: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): @mapbox/node-pre-gyp: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): axios: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): brace-expansion: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): form-data: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): immutable: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): jws: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): minimatch: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): nanoid: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): next: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): next-auth: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): picomatch: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): postcss: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): source-map-js: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): tar: new high/critical advisory
- **dependency_audit** (vulnerable_dependency): zod: new high/critical advisory
