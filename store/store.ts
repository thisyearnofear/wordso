import { configureStore, type ThunkAction, type Action } from "@reduxjs/toolkit";
import appReducer from "./appSlice";

export const store = configureStore({
  reducer: appReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
