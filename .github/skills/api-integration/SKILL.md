---
name: api-integration
description: How to add new API service calls using Axios. Use when creating new API endpoints, adding HTTP calls, or working with the services directory. Covers Axios instance usage, service file patterns, and interceptor behavior.
license: MIT
metadata:
  version: '1.0'
---

# API Integration

## Step-by-step

1. **Create a service file** in `src/services/api/` with the pattern `<feature>-service.ts`
2. **Import the shared Axios instance** — never import `axios` directly
3. **Define endpoints as constants** for consistency
4. **Export a service object** with typed methods

## Service File Template

```typescript
// src/services/api/user-service.ts
import { apiClient } from '@/services/api/axios-instance';
import { User, CreateUserPayload, UpdateUserPayload } from '@/types';

const ENDPOINTS = {
  LIST: '/users',
  BY_ID: (id: string) => `/users/${id}`,
  SEARCH: '/users/search',
} as const;

export const userService = {
  getAll: () => apiClient.get<User[]>(ENDPOINTS.LIST),

  getById: (id: string) => apiClient.get<User>(ENDPOINTS.BY_ID(id)),

  create: (payload: CreateUserPayload) => apiClient.post<User>(ENDPOINTS.LIST, payload),

  update: (id: string, payload: UpdateUserPayload) =>
    apiClient.put<User>(ENDPOINTS.BY_ID(id), payload),

  delete: (id: string) => apiClient.delete(ENDPOINTS.BY_ID(id)),

  search: (query: string) => apiClient.get<User[]>(ENDPOINTS.SEARCH, { params: { q: query } }),
};
```

## Rules

- **NEVER** import `axios` directly — always use `apiClient` from `@/services/api/axios-instance`
- **Type all responses** using generics: `apiClient.get<User[]>(url)`
- **Define endpoints as constants** — never hardcode URL strings in method bodies
- **One service file per feature/domain** — `user-service.ts`, `order-service.ts`, etc.
- **Don't handle errors in services** — let the response interceptor and calling code handle them

## Interceptor Behavior (Already Configured)

### Request Interceptor (`interceptors/request-interceptor.ts`)

- Injects `Authorization: Bearer <token>` from localStorage
- Sets `Content-Type: application/json` by default

### Response Interceptor (`interceptors/response-interceptor.ts`)

- Normalizes error responses into a consistent format
- Handles 401 → clears auth and redirects to login
- Logs errors globally

## Usage in Redux Thunk

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
