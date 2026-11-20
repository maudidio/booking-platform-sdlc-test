## 🤖 AI-generated feature: I want that translation functionality applies to all webapp pages, not just head

### Design
I wrote sdlc/design.md and sdlc/deliverables.json. The design moves the remaining hard-coded English text on the home, contact, signin, signup, rooms, checkout, history, profile and payment pages into the en and it dictionaries. Server components call getDictionary(), and client components receive a

### Implementation
Build summary

### Code review
❌ - app/_lib/i18n/__tests__/i18n.test.js: Tester must add tests for the new namesp

### Tests
A = 0

### QA
❌ Pre-existing, not counted: invalid ESLint config in app/.eslintrc.json.

### Cost
Model spend for this run: $7.7034 of $8.00 budget (ModelGateway ledger).

---
See `sdlc/` for full agent reports.

### Criterion traceability

| Criterion | Probe(s) | Test file(s) | Status |
|---|---|---|---|
| **AC-1** Given the application, When a user uses the functionality capability, Then it be | - | app/app/_lib/i18n/__tests__/i18n.test.js | test-linked |
| **AC-2** Given invalid input, When a user uses the functionality capability, Then a clear | - | app/app/_lib/i18n/__tests__/i18n.test.js | test-linked |

Test-linked criteria pass or fail with the suite: PASS


## ⚠️ Needs human review

The pipeline did not resolve the following findings. Do not merge without review.

- **code_review** (rejected): Code review not APPROVED after all retries (sdlc/code-review.md)
- **qa** (rejected): QA review not APPROVED after all retries (sdlc/qa-review.md)
- **code_reviewer** (loop_exhausted): coder_loop exhausted after 2 attempts (code_reviewer still 'rejected'); continuing to 'approved' with the finding recorded
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
