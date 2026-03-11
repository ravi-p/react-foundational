# React Vibe Coding Template

A foundational React 19 template pre-configured for AI-assisted development with **GitHub Copilot**, **Replit Agent**, and **Cursor**.

Clone this template to start new projects with consistent coding standards, agent behavior rules, and production-ready tooling — all pre-configured.

---

## Tech Stack

| Category         | Technology                   |
| ---------------- | ---------------------------- |
| Framework        | React 19                     |
| Build Tool       | Vite                         |
| Language         | TypeScript (strict)          |
| UI Library       | MUI (Material UI)            |
| State Management | Redux Toolkit + Context API  |
| Routing          | React Router v6              |
| HTTP Client      | Axios (global interceptors)  |
| Testing          | Jest + React Testing Library |
| Linting          | ESLint (Airbnb) + Prettier   |
| Git Hooks        | Husky + lint-staged          |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the template
git clone https://github.com/your-org/react-vibe-coding-template.git my-project
cd my-project

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`.

### Available Scripts

| Script                  | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start Vite dev server          |
| `npm run build`         | Type-check + production build  |
| `npm run preview`       | Preview production build       |
| `npm run lint`          | Run ESLint                     |
| `npm run lint:fix`      | Run ESLint with auto-fix       |
| `npm run format`        | Format code with Prettier      |
| `npm run format:check`  | Check formatting               |
| `npm run type-check`    | TypeScript type checking       |
| `npm run test`          | Run Jest tests                 |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |

---

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
│   ├── common/      # Shared components (Toast, etc.)
│   └── error-boundary/
├── constants/       # App-wide constants
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── pages/           # Page-level components
├── routes/          # Router configuration
├── services/api/    # Axios instance + API services
├── store/slices/    # Redux Toolkit store
├── theme/           # MUI theme
├── types/           # Global TypeScript types
└── utils/           # Utility functions
```

See [docs/folder-structure.md](docs/folder-structure.md) for detailed descriptions.

---

## AI Agent Configuration

This template includes configuration files for three AI coding tools:

### GitHub Copilot

- `.github/copilot-instructions.md` — Code generation rules
- `AGENTS.md` — Agent mode instructions

### Replit Agent

- `replit.md` — Auto-read project configuration
- `.agents/skills/` — 4 skill files (components, API, state, testing)

### Cursor

- `.cursor/rules/` — 6 rule files (`.mdc` format):
  - `project-overview.mdc` — Always active
  - `decision-boundaries.mdc` — Always active
  - `react-components.mdc` — Auto-attached to `.tsx` files
  - `api-services.mdc` — Auto-attached to `services/`
  - `state-management.mdc` — Auto-attached to `store/`
  - `testing.mdc` — Auto-attached to test files

### Agent Decision Boundaries

The agents are configured to **ASK before**:

- Adding new dependencies
- Creating files outside defined structure
- Refactoring existing code
- Changing routes, env vars, or configs
- Making architectural or security decisions

---

## Environment Configuration

Three environments are pre-configured:

| File               | Environment       |
| ------------------ | ----------------- |
| `.env.development` | Local development |
| `.env.uat`         | UAT/staging       |
| `.env.production`  | Production        |

All variables must be prefixed with `VITE_`. See `.env.example` for documentation.

---

## Standards Documentation

Detailed guides in the `docs/` directory:

| Document                                         | Description                       |
| ------------------------------------------------ | --------------------------------- |
| [Coding Standards](docs/coding-standards.md)     | Naming, imports, TypeScript rules |
| [Folder Structure](docs/folder-structure.md)     | Directory organization            |
| [Component Patterns](docs/component-patterns.md) | React component patterns          |
| [API Patterns](docs/api-patterns.md)             | Axios and service patterns        |
| [State Management](docs/state-management.md)     | Redux Toolkit and Context API     |
| [Testing Standards](docs/testing-standards.md)   | Jest and RTL conventions          |
| [Accessibility](docs/accessibility-standards.md) | A11y guidelines                   |
| [Git Branching](docs/git-branching-strategy.md)  | Branch naming and workflow        |
| [PR Guidelines](docs/pr-template.md)             | Pull request standards            |
| [Security](docs/security-guidelines.md)          | Security best practices           |

---

## Key Patterns

### Components → Arrow functions with typed props

```tsx
const UserCard: React.FC<UserCardProps> = ({ name, email }) => (
  <Box>
    <Typography>{name}</Typography>
  </Box>
);
```

### Imports → `@/` path alias

```tsx
import { useAppDispatch } from '@/store/hooks';
```

### API → Centralized Axios instance

```tsx
import { apiClient } from '@/services/api/axios-instance';
```

### State → Typed Redux hooks

```tsx
const dispatch = useAppDispatch();
const { users } = useAppSelector((state) => state.users);
```

---

## License

MIT
