# State Management

## Decision Guide

| Use Case               | Solution                     | Example                          |
| ---------------------- | ---------------------------- | -------------------------------- |
| Global shared state    | Redux Toolkit                | User profile, feature flags      |
| API data caching       | Redux Toolkit (async thunks) | Fetched user list, orders        |
| Local component state  | `useState` / `useReducer`    | Form inputs, toggles, modals     |
| Cross-cutting concerns | Context API                  | Theme, auth, toast notifications |

**Rule: When unsure, ask the user.**

## Redux Toolkit

### Slice Pattern

See `src/store/slices/app-slice.ts` for a working example.

### Typed Hooks

Always use from `@/store/hooks`:

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// ❌ Never use raw hooks
import { useDispatch, useSelector } from 'react-redux';
```

### Async Thunks

Use `createAsyncThunk` for API calls:

```typescript
export const fetchData = createAsyncThunk('feature/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await featureService.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch');
  }
});
```

### Selectors

Create reusable selectors for derived data:

```typescript
export const selectActiveUsers = (state: RootState) =>
  state.users.data.filter((user) => user.active);
```

## Context API

### When to Use

- Theme provider (MUI theme)
- Authentication state
- Toast/notification system
- Any cross-cutting concern that doesn't need Redux devtools

### Pattern

```typescript
// 1. Define the type
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// 2. Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create provider with memoized value
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. Create custom hook with error guard
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

## Rules

- Always memoize context values with `useMemo`
- Always throw in custom hooks if context is undefined
- Normalize Redux state — flat structures, avoid deep nesting
- One slice per feature/domain
- Register all slices in `src/store/store.ts`
