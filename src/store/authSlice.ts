// src/store/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
};

// Async thunk to check current session on app load
export const checkUserSession = createAsyncThunk(
  'auth/checkUserSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (data.session) {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        return { session: data.session, user: userData.user };
      }
      return { session: null, user: null };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserAndSession: (
      state,
      action: PayloadAction<{ user: User | null; session: Session | null }>
    ) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.loading = false;
      state.error = null;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: state => {
      // Synchronous logout action for UI update
      state.user = null;
      state.session = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(checkUserSession.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.loading = false;
      })
      .addCase(checkUserSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null; // Ensure user is null on error
        state.session = null;
      });
  },
});

export const { setUserAndSession, setAuthLoading, setAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
