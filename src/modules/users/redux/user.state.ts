import { User } from "../types";

export interface UserState {
  users: User[];
  selectedUser: User | null;

  loading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  error: string | null;
}

export const initialUserState: UserState = {
  users: [],
  selectedUser: null,

  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  error: null,
};
