import { combineReducers } from "@reduxjs/toolkit";

import { userReducer } from "@/modules/users/redux";
// import { authReducer } from "@/modules/auth/redux";
// import { dashboardReducer } from "@/modules/dashboard/redux";

export const rootReducer = combineReducers({
  users: userReducer,

  // auth: authReducer,
  // dashboard: dashboardReducer,
});

export type RootReducer = typeof rootReducer;
