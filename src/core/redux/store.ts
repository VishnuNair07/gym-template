import {
  configureStore,
  type Action,
  type ThunkAction,
} from "@reduxjs/toolkit";

import { rootReducer } from "./root-reducer";
import { listenerMiddleware } from "./listener";

export const store = configureStore({
  reducer: rootReducer,

  devTools: process.env.NODE_ENV !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: process.env.NODE_ENV !== "production",
    }).prepend(listenerMiddleware.middleware),
});

/**
 * Infer the `RootState` type from the store itself
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Inferred type: {dispatch}
 */
export type AppDispatch = typeof store.dispatch;

/**
 * Store type
 */
export type AppStore = typeof store;

/**
 * Generic Thunk Type
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
