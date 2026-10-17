import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserListResponse,
} from "../types";
import { UserEndpoints } from "./endpoints";
import { ApiClient } from "@/core/api-client/client";

export class UserService {
  static getUsers() {
    return ApiClient.get<UserListResponse>(UserEndpoints.list);
  }

  static getUser(id: string) {
    return ApiClient.get<User>(UserEndpoints.byId(id));
  }

  static createUser(request: CreateUserRequest) {
    return ApiClient.post<User>(UserEndpoints.create, request);
  }

  static updateUser(id: string, request: UpdateUserRequest) {
    return ApiClient.put<User>(UserEndpoints.update(id), request);
  }

  static deleteUser(id: string) {
    return ApiClient.delete<User>(UserEndpoints.delete(id));
  }
}
