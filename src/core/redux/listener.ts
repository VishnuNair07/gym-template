import { createListenerMiddleware } from "@reduxjs/toolkit";

export const listenerMiddleware = createListenerMiddleware();

/**
 * Register application listeners here.
 *
 * Example:
 *
 * listenerMiddleware.startListening({
 *   actionCreator: logout,
 *   effect: async (_, listenerApi) => {
 *      listenerApi.dispatch(resetUserState());
 *   },
 * });
 */
