"use client";

import { PropsWithChildren, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { setUser } from "@/store/authSlice";

export function ReduxProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("gym_auth_user");
      if (savedUser) {
        store.dispatch(setUser(JSON.parse(savedUser)));
      }
    } catch {
      // ignore
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}