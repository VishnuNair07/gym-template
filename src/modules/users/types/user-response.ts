import { User } from "./user";

export interface UserListResponse {
  items: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserResponse {
  data: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}
