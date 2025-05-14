// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    // Add other reducers here if you have more features
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
