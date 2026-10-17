import { createAsyncThunk } from "@reduxjs/toolkit";

import { ApiError } from "@/core/api-client/api-error";

import { UserService } from "../api/user.service";

import { CreateUserRequest, UpdateUserRequest } from "../types";

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, thunkApi) => {
    try {
      return await UserService.getUsers();
    } catch (error) {
      return thunkApi.rejectWithValue(ApiError.getMessage(error));
    }
  },
);

export const getUser = createAsyncThunk(
  "users/getUser",
  async (id: string, thunkApi) => {
    try {
      return await UserService.getUser(id);
    } catch (error) {
      return thunkApi.rejectWithValue(ApiError.getMessage(error));
    }
  },
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (request: CreateUserRequest, thunkApi) => {
    try {
      return await UserService.createUser(request);
    } catch (error) {
      return thunkApi.rejectWithValue(ApiError.getMessage(error));
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    {
      id,
      request,
    }: {
      id: string;
      request: UpdateUserRequest;
    },
    thunkApi,
  ) => {
    try {
      return await UserService.updateUser(id, request);
    } catch (error) {
      return thunkApi.rejectWithValue(ApiError.getMessage(error));
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, thunkApi) => {
    try {
      await UserService.deleteUser(id);

      return id;
    } catch (error) {
      return thunkApi.rejectWithValue(ApiError.getMessage(error));
    }
  },
);
