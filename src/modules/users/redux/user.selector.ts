import { RootState } from "@/core/redux";

export const selectUsers = (state: RootState) => state.users.users;

export const selectSelectedUser = (state: RootState) =>
  state.users.selectedUser;

export const selectUsersLoading = (state: RootState) => state.users.loading;

export const selectCreateUserLoading = (state: RootState) =>
  state.users.createLoading;

export const selectUpdateUserLoading = (state: RootState) =>
  state.users.updateLoading;

export const selectDeleteUserLoading = (state: RootState) =>
  state.users.deleteLoading;

export const selectUserError = (state: RootState) => state.users.error;
