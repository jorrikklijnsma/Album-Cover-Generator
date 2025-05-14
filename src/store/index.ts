// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
