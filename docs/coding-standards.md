# Coding Standards

## Language & Syntax

- **TypeScript** in strict mode — no `any` types unless absolutely necessary (and documented)
- **ES2020+** syntax — arrow functions, optional chaining, nullish coalescing, template literals
- No `var` — use `const` by default, `let` only when reassignment is needed

## Naming Conventions

| Element          | Convention              | Example            |
| ---------------- | ----------------------- | ------------------ |
| Components       | PascalCase              | `UserProfile`      |
| Component files  | kebab-case              | `user-profile.tsx` |
| Hooks            | camelCase, `use` prefix | `useAuth`          |
| Hook files       | kebab-case              | `use-auth.ts`      |
| Utilities        | camelCase               | `formatDate`       |
| Utility files    | kebab-case              | `format-date.ts`   |
| Types/Interfaces | PascalCase              | `UserProfileProps` |
| Type files       | kebab-case              | `user-types.ts`    |
| Constants        | UPPER_SNAKE_CASE        | `API_BASE_URL`     |
| Constant files   | kebab-case              | `api-constants.ts` |
| Directories      | kebab-case              | `error-boundary/`  |
| Enum values      | PascalCase              | `UserRole.Admin`   |

## Component Rules

- **Functional components only** — no class components
- **Arrow function syntax**: `const MyComponent: React.FC<Props> = () => {}`
- Props as TypeScript interface with `Props` suffix
- Default export for the component, named exports for types

## Import Ordering

Enforced by ESLint. Order:

```typescript
// 1. React
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// 3. Internal modules (using @/ alias)
import { useAppDispatch } from '@/store/hooks';
import { UserCard } from '@/components/common/user-card/UserCard';
import { fetchUsers } from '@/store/slices/user-slice';

// 4. Types (if separate import)
import type { User } from '@/types';

// 5. Styles
import './styles.css';
```

## Path Aliases

Use `@/` for all internal imports:

```typescript
// ✅ Good
import { theme } from '@/theme/theme';
import { useAppDispatch } from '@/store/hooks';

// ❌ Bad — no relative paths beyond one level
import { theme } from '../../../theme/theme';
```

## TypeScript Rules

- Prefer `interface` over `type` for object shapes (interfaces are extendable)
- Use `type` for unions, intersections, and computed types
- Always define return types for exported functions
- Use `unknown` over `any` when type is truly unknown
- Use `as const` for constant objects and arrays
- Avoid type assertions (`as`) — use type guards instead

```typescript
// ✅ Good
interface UserProps {
  name: string;
  age: number;
}

type UserRole = 'admin' | 'editor' | 'viewer';

// ❌ Bad
const user = response as any;
```

## Error Handling

- Use try/catch for async operations
- Always type catch blocks: `catch (error: unknown)`
- Centralized error boundary for React rendering errors
- Toast notifications for user-facing error messages

## Comments & Documentation

- Use JSDoc for exported functions and components
- Inline comments for non-obvious logic only — code should be self-documenting
- TODO format: `// TODO(username): Description of task`

```typescript
/**
 * Formats a date string to a human-readable format.
 * @param dateString - ISO 8601 date string
 * @param locale - Optional locale, defaults to 'en-US'
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, locale = 'en-US'): string => {
  return new Date(dateString).toLocaleDateString(locale);
};
```
