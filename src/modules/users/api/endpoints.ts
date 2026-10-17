export const UserEndpoints = {
  list: "/users",
  create: "/create-user",
  byId: (id: string) => `/users/${id}`,
  update: (id: string) => `/users/${id}`,
  delete: (id: string) => `/users/${id}`,
  activate: (id: string) => `/users/${id}/activate`,
  deactivate: (id: string) => `/users/${id}/deactivate`,
  lock: (id: string) => `/users/${id}/lock`,
  unlock: (id: string) => `/users/${id}/unlock`,
  resetPassword: (id: string) => `/users/${id}/reset-password`,
  roles: "/users/roles",
  permissions: "/users/permissions",
} as const;
