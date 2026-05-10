import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  access: string | null;
  refresh: string | null;
  user: any | null;
};

const initialState: AuthState = {
  access: typeof window !== 'undefined' ? localStorage.getItem('access') : null,
  refresh: typeof window !== 'undefined' ? localStorage.getItem('refresh') : null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ access: string; refresh: string; user: any }>) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.user = action.payload.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('access', action.payload.access);
        localStorage.setItem('refresh', action.payload.refresh);
      }
    },
    logout: (state) => {
      state.access = null;
      state.refresh = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
