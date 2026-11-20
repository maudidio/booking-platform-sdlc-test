# I want that translation functionality applies to all webapp pages, not just head

### Goal

I want that translation functionality applies to all webapp pages, not just header and footer

### Scope

Changes in the application package; nothing outside the target repository.

### Constraints

Standard library only. Keep existing behaviour unchanged.

### Acceptance criteria

- AC-1: Given the application, When a user uses the functionality capability, Then it behaves as described in the goal.
- AC-2: Given invalid input, When a user uses the functionality capability, Then a clear error is returned and nothing changes.

### Non-goals

No changes to unrelated features.
