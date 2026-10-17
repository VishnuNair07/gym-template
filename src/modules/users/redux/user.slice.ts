import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { User } from "../types";
import { initialUserState } from "./user.state";

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./user.thunks";

const userSlice = createSlice({
  name: "users",

  initialState: initialUserState,

  reducers: {
    clearUsers: (state) => {
      state.users = [];
    },

    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },

    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },

    clearUserError: (state) => {
      state.error = null;
    },

    resetUserState: () => initialUserState,
  },

  extraReducers: (builder) => {
    builder

      /**
       * Get Users
       */
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.items;
      })

      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch users.";
      })

      /**
       * Get User
       */
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })

      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to fetch user.";
      })

      /**
       * Create User
       */
      .addCase(createUser.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.createLoading = false;

        state.users.unshift(action.payload);
      })

      .addCase(createUser.rejected, (state, action) => {
        state.createLoading = false;
        state.error = (action.payload as string) ?? "Failed to create user.";
      })

      /**
       * Update User
       */
      .addCase(updateUser.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false;

        const index = state.users.findIndex(
          (user) => user.id === action.payload.id,
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }

        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = (action.payload as string) ?? "Failed to update user.";
      })

      /**
       * Delete User
       */
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;

        state.users = state.users.filter((user) => user.id !== action.payload);

        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = (action.payload as string) ?? "Failed to delete user.";
      });
  },
});

export const {
  clearUsers,
  clearSelectedUser,
  setSelectedUser,
  clearUserError,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
