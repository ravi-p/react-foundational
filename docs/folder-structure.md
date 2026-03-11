# Folder Structure

This project uses a **layer-based** folder structure where code is organized by its role/responsibility.

```
react-vibe-coding-template/
├── .agents/                  # Agent skills (SKILL.md files)
│   └── skills/
│       ├── api-integration/
│       ├── react-component/
│       ├── state-management/
│       └── testing/
├── .cursor/                  # Cursor AI rules
│   └── rules/
├── .github/                  # GitHub config
│   ├── copilot-instructions.md
│   └── pull_request_template.md
├── .husky/                   # Git hooks
│   └── pre-commit
├── docs/                     # Standards & guidelines
├── public/                   # Static public assets
├── src/
│   ├── assets/               # Static assets (images, fonts, icons)
│   ├── components/           # Reusable UI components
│   │   ├── common/           # Shared across features
│   │   │   └── toast/        # Toast notification system
│   │   └── error-boundary/   # React error boundary
│   ├── constants/            # App-wide constants
│   ├── contexts/             # React Context providers
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page-level components (route targets)
│   ├── routes/               # Router config and setup
│   ├── services/             # External service integrations
│   │   └── api/              # Axios instance and API services
│   │       └── interceptors/ # Request/response interceptors
│   ├── store/                # Redux Toolkit store
│   │   └── slices/           # Redux slices
│   ├── theme/                # MUI theme configuration
│   ├── types/                # Global TypeScript types/interfaces
│   └── utils/                # Utility/helper functions
├── .env.development          # Dev environment variables
├── .env.uat                  # UAT environment variables
├── .env.production           # Production environment variables
├── .env.example              # Documented env template
├── .eslintrc.cjs             # ESLint config (Airbnb)
├── .prettierrc               # Prettier config
├── .lintstagedrc.json        # Lint-staged config
├── AGENTS.md                 # Universal agent instructions
├── replit.md                 # Replit Agent config
├── index.html                # Vite entry HTML
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript config
├── tsconfig.node.json        # Node TS config
└── vite.config.ts            # Vite config
```

## Directory Responsibilities

| Directory                   | What Goes Here              | Example Files                             |
| --------------------------- | --------------------------- | ----------------------------------------- |
| `src/components/common/`    | Shared UI components        | `Toast.tsx`, `LoadingSpinner.tsx`         |
| `src/components/<feature>/` | Feature-specific components | `user-card/UserCard.tsx`                  |
| `src/pages/`                | Page-level route targets    | `HomePage.tsx`, `LoginPage.tsx`           |
| `src/hooks/`                | Custom reusable hooks       | `use-debounce.ts`, `use-local-storage.ts` |
| `src/services/api/`         | API service files           | `user-service.ts`, `auth-service.ts`      |
| `src/store/slices/`         | Redux slices                | `user-slice.ts`, `app-slice.ts`           |
| `src/contexts/`             | Context providers           | `AuthContext.tsx`, `ToastContext.tsx`     |
| `src/types/`                | Shared types/interfaces     | `user-types.ts`, `api-types.ts`           |
| `src/utils/`                | Pure utility functions      | `format-date.ts`, `validators.ts`         |
| `src/constants/`            | App-wide constants          | `api-endpoints.ts`, `routes.ts`           |
| `src/theme/`                | MUI theme setup             | `theme.ts`, `palette.ts`                  |
| `src/assets/`               | Static files                | `logo.svg`, `fonts/`                      |

## Rules

- **Do NOT create directories outside this structure** without asking the user
- Each component gets its own directory: `src/components/common/toast/Toast.tsx`
- Barrel files (`index.ts`) for directories with multiple exports
- Test files co-located: `ComponentName.test.tsx` alongside `ComponentName.tsx`
