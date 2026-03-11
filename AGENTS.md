# AGENTS.md — AI Agent Instructions

> This file provides instructions for AI coding agents (GitHub Copilot, Replit Agent, Cursor, etc.) working on this project. **Read this file first before making any changes.**

---

## Project Overview

This is a **React 19** frontend application built with:

| Category             | Technology                       |
| -------------------- | -------------------------------- |
| **Framework**        | React 19                         |
| **Build Tool**       | Vite                             |
| **Language**         | TypeScript (strict mode)         |
| **UI Library**       | MUI (Material UI)                |
| **State Management** | Redux Toolkit + Context API      |
| **Routing**          | React Router v6                  |
| **HTTP Client**      | Axios (with global interceptors) |
| **Testing**          | Jest + React Testing Library     |
| **Linting**          | ESLint (Airbnb) + Prettier       |
| **Git Hooks**        | Husky + lint-staged              |

---

## ⚠️ DECISION BOUNDARIES — WHEN TO ASK

**STOP and ASK the user before doing ANY of the following:**

### Always Ask

- [ ] Adding new npm dependencies or packages
- [ ] Choosing between two or more architectural approaches
- [ ] Creating new files or folders outside the defined structure (see `docs/folder-structure.md`)
- [ ] Deleting or renaming existing files
- [ ] Changing routing or navigation structure
- [ ] Modifying environment variables or config files (`.env.*`, `vite.config.ts`, `tsconfig.json`)
- [ ] Refactoring existing code (you may suggest, but do not refactor without approval)
- [ ] API endpoint design or changes
- [ ] Database schema decisions
- [ ] Third-party service selection or integration
- [ ] Security-related changes (authentication, authorization, encryption)
- [ ] Breaking changes to existing interfaces or APIs
- [ ] Changes to the build or deployment pipeline
- [ ] Modifications to linting or formatting rules

### You May Proceed Without Asking

- Fixing obvious bugs (typos, syntax errors, missing imports)
- Adding TypeScript types or interfaces for existing code
- Writing tests for existing functionality
- Adding inline code comments or JSDoc documentation
- Formatting code according to Prettier/ESLint rules
- Implementing a feature that has been explicitly described and approved

---

## Coding Standards (Summary)

> Full details: `docs/coding-standards.md`

### Naming Conventions

| Element          | Convention                  | Example            |
| ---------------- | --------------------------- | ------------------ |
| Components       | PascalCase                  | `UserProfile.tsx`  |
| Hooks            | camelCase with `use` prefix | `useAuth.ts`       |
| Files            | kebab-case                  | `user-profile.tsx` |
| Directories      | kebab-case                  | `error-boundary/`  |
| Types/Interfaces | PascalCase                  | `UserProfileProps` |
| Constants        | UPPER_SNAKE_CASE            | `API_BASE_URL`     |
| Functions        | camelCase                   | `fetchUserData`    |

### Component Pattern

- **Functional components ONLY** — no class components
- **Arrow functions** — `const MyComponent: React.FC<Props> = () => {}`
- Props defined as TypeScript interfaces with `Props` suffix

### Import Order (enforced by ESLint)

```typescript
// 1. React
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

// 3. Internal modules (using @/ alias)
import { useAppDispatch } from '@/store/hooks';
import { UserCard } from '@/components/common/user-card/UserCard';

// 4. Styles
import './styles.css';
```

### Path Aliases

Use `@/` alias for all internal imports:

```typescript
// ✅ Good
import { theme } from '@/theme/theme';

// ❌ Bad
import { theme } from '../../../theme/theme';
```

---

## Project Structure

> Full details: `docs/folder-structure.md`

```
src/
├── assets/          # Static assets (images, fonts, icons)
├── components/      # Reusable UI components
│   ├── common/      # Shared components (Toast, Loading, etc.)
│   └── error-boundary/
├── constants/       # App-wide constants
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Page-level components (route targets)
├── routes/          # Router config and AppRouter
├── services/        # API services and Axios setup
│   └── api/
│       └── interceptors/
├── store/           # Redux Toolkit store
│   └── slices/
├── theme/           # MUI theme configuration
├── types/           # Global TypeScript types
└── utils/           # Utility/helper functions
```

---

## State Management Rules

> Full details: `docs/state-management.md`

| Use Case                                         | Solution                          |
| ------------------------------------------------ | --------------------------------- |
| Global app state (shared across many components) | **Redux Toolkit**                 |
| Server/API cache state                           | **Redux Toolkit** (async thunks)  |
| Local UI-only state                              | **React `useState`/`useReducer`** |
| Theme, Auth, Toast context                       | **React Context API**             |

---

## API Patterns

> Full details: `docs/api-patterns.md`

- All HTTP calls go through the centralized Axios instance (`@/services/api/axios-instance.ts`)
- Request interceptor handles: auth token injection, content-type headers
- Response interceptor handles: error normalization, 401 redirects, global logging
- Each feature gets its own service file: `@/services/api/user-service.ts`

---

## Testing Rules

> Full details: `docs/testing-standards.md`

- Test files co-located: `ComponentName.test.tsx`
- Use React Testing Library — test behavior, not implementation
- Avoid testing implementation details (no internal state checks)
- Use `screen.getByRole()` over `getByTestId()` where possible

---

## Error Handling

- Use `ErrorBoundary` component for catching React rendering errors
- Use toast notifications for user-facing error messages
- API errors are normalized in the response interceptor

---

## Accessibility

> Full details: `docs/accessibility-standards.md`

- Basic accessibility is enforced by default (semantic HTML, ARIA labels, keyboard navigation)
- WCAG AA compliance is configurable — see the accessibility standards doc

---

## Environment Configuration

Three environments supported:

- `.env.development` — local dev
- `.env.uat` — UAT/staging
- `.env.production` — production

All env vars must be prefixed with `VITE_`.

---

## References

For detailed standards, refer to:

- [Coding Standards](docs/coding-standards.md)
- [Folder Structure](docs/folder-structure.md)
- [Component Patterns](docs/component-patterns.md)
- [API Patterns](docs/api-patterns.md)
- [State Management](docs/state-management.md)
- [Testing Standards](docs/testing-standards.md)
- [Accessibility Standards](docs/accessibility-standards.md)
- [Git Branching Strategy](docs/git-branching-strategy.md)
- [PR Guidelines](docs/pr-template.md)
- [Security Guidelines](docs/security-guidelines.md)
