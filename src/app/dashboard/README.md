# /(dashboard)

This folder contains all **protected application routes**.

Examples:
- /dashboard
- /dashboard/users
- /dashboard/settings

## Protected by Middleware
All routes inside this folder are protected by `middleware.ts`.

Only authenticated users can access them.

## Notes
- Use Server Components for pages.
- UI shells (Sidebar, Navbar) can be imported from components/layout.