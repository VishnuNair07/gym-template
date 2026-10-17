export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  role: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  role?: string;
}

export interface UserListRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}
