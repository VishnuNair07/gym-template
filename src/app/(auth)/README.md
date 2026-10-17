# /(auth)

Authentication-related routes belong here:

- /login
- /register
- /forgot-password
- /reset-password

## Notes
- These routes load client components because they use forms.
- If a logged-in user visits these pages, middleware redirects them to /dashboard.