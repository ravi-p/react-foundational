# PR Guidelines

See the PR template at `.github/pull_request_template.md`.

## PR Checklist

Before submitting a PR:

- [ ] Code follows the [coding standards](./coding-standards.md)
- [ ] Components use arrow function pattern with typed props
- [ ] All imports use `@/` path alias
- [ ] Import order: React → third-party → internal → styles
- [ ] MUI components used for layout/typography (no raw HTML)
- [ ] New/modified components have tests
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] No `console.log` statements left in production code
- [ ] Accessibility basics met (alt text, aria-labels, keyboard nav)
- [ ] No hardcoded strings for user-facing text
- [ ] Environment variables prefixed with `VITE_`

## PR Size Guidelines

| Size   | Lines Changed | Review Time        |
| ------ | ------------- | ------------------ |
| Small  | < 100 lines   | Quick review       |
| Medium | 100–400 lines | Standard review    |
| Large  | 400+ lines    | Consider splitting |

## Review Expectations

- **Every PR requires at least one approval** before merging
- Reviewer should check: logic, types, tests, accessibility, naming
- Use conventional comments: `nit:`, `suggestion:`, `question:`, `blocker:`
