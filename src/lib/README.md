# /lib

The **lib** folder contains reusable library-style logic that is shared across the application.

It is used for code that is:
- More complex than a small utility function
- Used by multiple modules
- Not related to framework infrastructure (core)
- Not tied to a single business module

## Examples of what belongs here
- Token manager (e.g., getToken(), setToken(), removeToken())
- Storage helpers (localStorage/sessionStorage wrappers)
- Cookie helpers
- Shared mappers (convert API response → UI model)
- Shared data transformers
- Complex formatting utilities (date, currency)
- Shared browser API wrappers
- File upload/download helpers

## What does NOT belong here
- Infrastructure code (goes into /core)
- Small pure utilities (go into /utils)
- Module-specific logic (belongs in /modules/<module>/utils)
- UI components (go in /components)

## Purpose
`lib/` serves as a middle ground between core infrastructure and high-level business logic, providing powerful reusable logic that multiple modules depend on.