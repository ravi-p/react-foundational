---
name: state-management
description: How to manage state with Redux Toolkit and Context API. Use when adding new Redux slices, creating async thunks, or setting up Context providers. Covers when to use Redux vs Context, slice patterns, and typed hooks.
license: MIT
metadata:
  version: '1.0'
---

# State Management

## Decision Guide

| Use Case                                       | Solution                         |
| ---------------------------------------------- | -------------------------------- |
| Global shared state (user data, feature flags) | Redux Toolkit                    |
| Server/API data caching                        | Redux Toolkit (createAsyncThunk) |
| Local UI state (form inputs, toggles)          | useState / useReducer            |
| Cross-cutting concerns (theme, auth, toast)    | Context API                      |

**When in doubt, ASK the user.**

## Adding a New Redux Slice

1. Create `src/store/slices/<feature>-slice.ts`
2. Register in `src/store/store.ts`
3. Use typed hooks from `@/store/hooks`

### Slice Template

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface FeatureState {
  data: SomeType[];
  loading: boolean;
  error: string | null;
}

const initialState: FeatureState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchData = createAsyncThunk('feature/fetchData', async (_, { rejectWithValue }) => {
  try {
    const response = await featureService.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch data');
  }
});

const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetState } = featureSlice.actions;
export default featureSlice.reducer;
```

### Register in Store

```typescript
// src/store/store.ts
import featureReducer from '@/store/slices/feature-slice';

export const store = configureStore({
  reducer: {
    feature: featureReducer,
    // ... other slices
  },
});
```

## Adding a Context Provider

1. Create `src/contexts/<Feature>Context.tsx`
2. Wrap in `App.tsx` provider tree

### Context Template

```tsx
import React, { createContext, useContext, useState, useMemo } from 'react';

interface FeatureContextType {
  value: string;
  setValue: (val: string) => void;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export const FeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [value, setValue] = useState('');
  const contextValue = useMemo(() => ({ value, setValue }), [value]);
  return <FeatureContext.Provider value={contextValue}>{children}</FeatureContext.Provider>;
};

export const useFeature = (): FeatureContextType => {
  const context = useContext(FeatureContext);
  if (!context) throw new Error('useFeature must be used within FeatureProvider');
  return context;
};
```

## Rules

- **Always use typed hooks**: `useAppDispatch()`, `useAppSelector()` — never raw `useDispatch`/`useSelector`
- **Normalize state shape** — flat structures, avoid deep nesting
- **Use `createAsyncThunk`** for all async operations
- **Memoize context values** with `useMemo` to prevent unnecessary re-renders
