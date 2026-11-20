# I want users to be able to select a different language for the web app using a d

### Goal

I want users to be able to select a different language for the web app using a drop down list on top right corner of all pages. Languages to support are English and Italian. Translations should be available in the repo as dictionary that developers can easily access and fix if needed.

### Scope

Changes in the application package; nothing outside the target repository.

### Constraints

Standard library only. Keep existing behaviour unchanged.

### Acceptance criteria

- AC-1: Given the application, When a user uses the translations capability, Then it behaves as described in the goal.
- AC-2: Given invalid input, When a user uses the translations capability, Then a clear error is returned and nothing changes.

### Non-goals

No changes to unrelated features.
