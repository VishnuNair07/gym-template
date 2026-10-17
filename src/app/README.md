# /app

This folder contains the entire routing system of the Next.js App Router.

## What goes here
- Route groups `(public)`, `(auth)`, `(dashboard)`
- Route handlers `/api`
- Layout files such as `layout.tsx`
- Server components and page UI

## Rules
- Use Server Components by default.
- Use Client Components only when needed (forms, events, interactivity).
- Authentication and route-level protection is handled by `middleware.ts`.
- No business logic should be written here.