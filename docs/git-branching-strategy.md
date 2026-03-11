# Git Branching Strategy

## Branch Types

| Branch      | Purpose                         | Naming                        | Created From |
| ----------- | ------------------------------- | ----------------------------- | ------------ |
| `main`      | Production-ready code           | `main`                        | —            |
| `develop`   | Integration branch for features | `develop`                     | `main`       |
| `feature/*` | New features                    | `feature/user-authentication` | `develop`    |
| `bugfix/*`  | Bug fixes                       | `bugfix/fix-login-redirect`   | `develop`    |
| `hotfix/*`  | Urgent production fixes         | `hotfix/fix-payment-crash`    | `main`       |
| `release/*` | Release preparation             | `release/v1.2.0`              | `develop`    |

## Flow

```
main ─────────────────────────────────────────────► (production)
  │                                        ▲
  ├── develop ──────────────────────────────┤
  │     │          ▲          ▲             │
  │     ├── feature/auth ─────┤             │
  │     ├── feature/dashboard ┤             │
  │     ├── bugfix/login ─────┘             │
  │     └── release/v1.0 ──────────────────►│
  │                                         │
  └── hotfix/critical ─────────────────────►┘
```

## Branch Naming Rules

- Use lowercase with hyphens: `feature/user-profile`
- Be descriptive: `feature/add-payment-gateway` not `feature/payment`
- Include ticket number if applicable: `feature/JIRA-123-user-auth`

## Workflow

### Feature Development

1. Create branch from `develop`: `git checkout -b feature/my-feature develop`
2. Develop and commit with conventional commits
3. Push and create PR to `develop`
4. Code review + CI checks must pass
5. Squash merge into `develop`

### Release

1. Create branch from `develop`: `git checkout -b release/v1.0.0 develop`
2. Final testing and version bump
3. Merge into `main` and `develop`
4. Tag the release: `git tag v1.0.0`

### Hotfix

1. Create from `main`: `git checkout -b hotfix/critical-fix main`
2. Fix and test
3. Merge into both `main` and `develop`
4. Tag the hotfix release

## Commit Convention

Use conventional commits:

```
<type>(<scope>): <description>

feat(auth): add login page with MUI form
fix(api): handle 401 token refresh correctly
docs(readme): update setup instructions
style(lint): fix eslint warnings in components
refactor(store): simplify user slice reducers
test(auth): add login form tests
chore(deps): update MUI to v6
```

### Types

| Type       | Use For                |
| ---------- | ---------------------- |
| `feat`     | New features           |
| `fix`      | Bug fixes              |
| `docs`     | Documentation          |
| `style`    | Formatting (not CSS)   |
| `refactor` | Code restructuring     |
| `test`     | Adding/modifying tests |
| `chore`    | Build, deps, config    |
