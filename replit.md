# Replit Agent Configuration

> This file is automatically read by Replit Agent. It provides project context, coding style, and behavior rules.

## Project Context

This is a **React 19 frontend application** built as a foundational template. It uses Vite as the build tool, TypeScript in strict mode, MUI for the UI library, Redux Toolkit + Context API for state management, React Router v6 for routing, and Axios with global interceptors for API calls.

This is a **configuration/foundational repo** — new projects are created by cloning this template.

## Tech Stack

- React 19 + Vite + TypeScript (strict)
- MUI (Material UI) for theming and components
- Redux Toolkit (global state) + Context API (UI state like theme, auth, toasts)
- React Router v6
- Axios with request/response interceptors
- Jest + React Testing Library
- ESLint (Airbnb config) + Prettier
- Husky + lint-staged for pre-commit hooks

## Coding Style

### Components

- Use **functional components only** with **arrow function syntax**
- Pattern: `const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => { ... }`
- Define props as TypeScript interfaces with `Props` suffix
- Use MUI components for all UI elements — avoid raw HTML for layout

### Naming Conventions

- Components: PascalCase (`UserProfile`)
- Files: kebab-case (`user-profile.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Types/Interfaces: PascalCase (`UserProfileProps`)
- Directories: kebab-case (`error-boundary/`)

### Import Order

1. React imports
2. Third-party libraries (MUI, Redux, Router)
3. Internal modules using `@/` path alias
4. Styles

### Path Aliases

Use `@/` alias for all imports from `src/`:

```typescript
import { store } from '@/store/store';
import { UserCard } from '@/components/common/user-card/UserCard';
```

## Project Structure (Layer-Based)

```
src/
├── assets/          # Static files
├── components/      # Reusable UI components
│   ├── common/      # Shared components
│   └── error-boundary/
├── constants/       # App constants
├── contexts/        # React Context providers
├── hooks/           # Custom hooks
├── pages/           # Route-level page components
├── routes/          # Router setup
├── services/api/    # Axios instance and API services
├── store/slices/    # Redux store and slices
├── theme/           # MUI theme
├── types/           # Global TypeScript types
└── utils/           # Utility functions
```

## Agent Behavior Rules

### ⚠️ ALWAYS ASK before:

- Adding new npm packages or dependencies
- Creating files/folders outside the defined structure
- Deleting or renaming existing files
- Refactoring code (you may suggest, but ask before changing)
- Changing routes, env vars, or config files
- Choosing between architectural approaches
- Making security-related changes
- Modifying build/deployment pipeline
- API endpoint design decisions
- Third-party service selection

### ✅ You MAY proceed without asking:

- Fixing obvious bugs (typos, syntax errors, missing imports)
- Adding TypeScript types/interfaces
- Writing tests for existing code
- Adding documentation and comments
- Code formatting per Prettier/ESLint rules
- Implementing explicitly approved features

## API Integration

- All API calls go through `@/services/api/axios-instance.ts`
- Never use `axios` directly — always use the shared instance
- Request interceptor: auth tokens, content-type
- Response interceptor: error normalization, 401 handling
- Each feature gets its own service file

## State Management

- Global/shared state → Redux Toolkit
- Local UI state → useState/useReducer
- Theme, auth, toasts → Context API
- Use typed hooks: `useAppDispatch()`, `useAppSelector()`

## Error Handling

- Centralized `ErrorBoundary` for React errors
- Toast notifications for user-facing messages
- API errors normalized in response interceptor

## Environment Config

- Three environments: `.env.development`, `.env.uat`, `.env.production`
- All vars prefixed with `VITE_`
- Access: `import.meta.env.VITE_API_BASE_URL`

## Testing

- Jest + React Testing Library
- Co-located tests: `ComponentName.test.tsx`
- Test behavior, not implementation
- Prefer `getByRole()` over `getByTestId()`

## References

See `docs/` directory for detailed standards on coding, components, API patterns, state management, testing, accessibility, git branching, and security.
