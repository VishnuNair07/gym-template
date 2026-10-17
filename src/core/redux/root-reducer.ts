import { combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "@/modules/users/redux";
import authReducer from "@/store/authSlice";

export const rootReducer = combineReducers({
  users: userReducer,
  auth: authReducer,
});

export type RootReducer = typeof rootReducer;
