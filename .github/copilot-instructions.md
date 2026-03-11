# GitHub Copilot Custom Instructions

> These instructions guide GitHub Copilot's code generation for this project.

## Tech Stack

- React 19, Vite, TypeScript (strict)
- MUI (Material UI) for components and theming
- Redux Toolkit for global state, Context API for UI-level state (theme, auth, toast)
- React Router v6 for routing
- Axios with global request/response interceptors
- Jest + React Testing Library for testing
- ESLint (Airbnb) + Prettier for code quality

## Code Generation Rules

### Components

- **Always use arrow function components**: `const MyComponent: React.FC<Props> = () => {}`
- **Never generate class components**
- Define props as TypeScript interfaces with `Props` suffix: `interface MyComponentProps {}`
- Use MUI components (`Box`, `Typography`, `Button`, etc.) — never raw HTML for layout
- Include basic accessibility attributes (aria-labels, roles, alt text)

### Naming

- Components: **PascalCase** (`UserProfile`)
- Files: **kebab-case** (`user-profile.tsx`)
- Hooks: **camelCase** with `use` prefix (`useAuth`)
- Constants: **UPPER_SNAKE_CASE** (`API_BASE_URL`)
- Types/Interfaces: **PascalCase** (`UserProfileProps`)

### Imports

Always use this order:

1. React imports
2. Third-party library imports (MUI, Redux, Router, etc.)
3. Internal imports using `@/` alias
4. Style imports

```typescript
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import { UserCard } from '@/components/common/user-card/UserCard';
```

### Path Aliases

Always use `@/` → `src/`:

```typescript
// ✅ Correct
import { theme } from '@/theme/theme';
// ❌ Wrong
import { theme } from '../../../theme/theme';
```

### State Management

- Global/shared state → Redux Toolkit (`createSlice`, `createAsyncThunk`)
- Local UI state → `useState` / `useReducer`
- Cross-cutting concerns (theme, auth, toasts) → Context API
- Always use typed hooks: `useAppDispatch()`, `useAppSelector()`

### API Calls

- All HTTP requests through `@/services/api/axios-instance.ts`
- Create service files per feature: `@/services/api/user-service.ts`
- Never call `axios` directly — always use the shared instance
- Error handling is centralized in response interceptor

### Testing

- Co-locate test files: `ComponentName.test.tsx`
- Use React Testing Library's `screen` and `render`
- Prefer `getByRole()` over `getByTestId()`
- Test user-visible behavior, not implementation details

### Error Handling

- Wrap page-level components with `ErrorBoundary`
- Use toast notifications for user-facing errors
- API errors handled by response interceptor

### Environment Variables

- Prefix all env vars with `VITE_`
- Access via `import.meta.env.VITE_*`
- Three environments: development, uat, production

## Decision Boundaries

**DO NOT** make these decisions without user approval:

- Adding new dependencies
- Creating files/folders outside the defined structure
- Refactoring existing code
- Changing routing, env vars, or config files
- Choosing between architectural approaches
- Security-related changes

**You MAY** proceed with:

- Fixing obvious bugs
- Adding TypeScript types
- Writing tests for existing code
- Formatting and documentation
