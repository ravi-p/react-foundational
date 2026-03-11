import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  initialized: false,
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetAppState: () => initialState,
  },
});

export const { setInitialized, setLoading, setError, resetAppState } = appSlice.actions;
export default appSlice.reducer;
