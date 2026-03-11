# API Patterns

## Architecture

```
Components/Pages → Redux Thunks → Service Files → Axios Instance → Interceptors → Server
```

## Axios Instance (`src/services/api/axios-instance.ts`)

- Pre-configured with `baseURL` from `VITE_API_BASE_URL`
- Request and response interceptors attached globally
- **All HTTP calls MUST go through this instance**

## Service File Pattern

One service file per domain/feature:

```typescript
// src/services/api/user-service.ts
import { apiClient } from '@/services/api/axios-instance';
import { User, CreateUserPayload } from '@/types';

const ENDPOINTS = {
  LIST: '/users',
  BY_ID: (id: string) => `/users/${id}`,
} as const;

export const userService = {
  getAll: () => apiClient.get<User[]>(ENDPOINTS.LIST),
  getById: (id: string) => apiClient.get<User>(ENDPOINTS.BY_ID(id)),
  create: (payload: CreateUserPayload) => apiClient.post<User>(ENDPOINTS.LIST, payload),
  update: (id: string, payload: Partial<User>) => apiClient.put<User>(ENDPOINTS.BY_ID(id), payload),
  delete: (id: string) => apiClient.delete(ENDPOINTS.BY_ID(id)),
};
```

## Request Interceptor

Automatically handles:

- `Authorization: Bearer <token>` injection from localStorage
- `Content-Type: application/json` default header
- Request logging in development mode

## Response Interceptor

Automatically handles:

- **Error normalization** — transforms various error formats into a consistent shape
- **401 Unauthorized** — clears auth token and redirects to login
- **Error logging** — logs errors in development mode
- **Network errors** — catches and normalizes network failures

## Error Shape

All API errors are normalized to:

```typescript
interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}
```

## Usage in Redux

```typescript
export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getAll();
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch users');
  }
});
```

## Rules

- **Never** import `axios` directly — always use `apiClient`
- **Never** hardcode API URLs — use endpoint constants
- **Always** type responses with generics
- **Don't** handle errors in service files — let interceptors and calling code handle them
- **Do** define endpoints as constants with `as const`
