# /api – Route Handlers

This folder contains server-side API endpoints.

Each endpoint must export GET, POST, PUT, DELETE functions.

Example:
- /api/users/route.ts → GET, POST
- /api/login/route.ts → POST

## Rules
- Use `auth-guard.ts` to protect APIs that require authentication.
- Never expose internal errors directly.
- Validate all incoming data using Zod or server-side validation.