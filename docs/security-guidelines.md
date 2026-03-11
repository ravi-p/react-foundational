# Security Guidelines

## Environment Variables

- **Never commit secrets** — `.env.*` files are gitignored (except `.env.example`)
- All env vars must be prefixed with `VITE_` (Vite requirement)
- Use `.env.example` as a documented template (no real values)
- Different values per environment: `.env.development`, `.env.uat`, `.env.production`

```bash
# ✅ Good — .env.example
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=MyApp

# ❌ Bad — never commit real secrets
VITE_API_KEY=sk-1234567890abcdef
```

## Authentication

- Store auth tokens in `localStorage` (or `httpOnly` cookies if backend supports it)
- Request interceptor injects `Authorization: Bearer <token>` automatically
- Response interceptor handles 401 → clears token and redirects to login
- Never store passwords or sensitive credentials client-side

## Input Validation

- Validate all user inputs on the client side (for UX) AND server side (for security)
- Sanitize inputs before rendering — React handles XSS prevention for JSX expressions
- Never use `dangerouslySetInnerHTML` unless absolutely necessary and content is sanitized

## API Security

- Use HTTPS for all API endpoints
- Never expose API keys in client-side code (use backend proxy if needed)
- Implement CSRF protection if using cookie-based auth
- Set appropriate CORS headers on the backend

## Dependencies

- Regularly audit dependencies: `npm audit`
- Keep dependencies up to date
- Avoid unnecessary dependencies — each new package increases attack surface
- Review new packages before adding (check npm stats, GitHub stars, maintenance activity)

## Content Security

- Avoid inline scripts and styles where possible
- Use Content-Security-Policy headers (configured on the server/CDN)
- Sanitize any HTML content rendered from external sources

## Sensitive Data

- Never log sensitive data (passwords, tokens, PII) in console or error logs
- Mask sensitive fields in development tools
- Clear sensitive data from Redux store on logout

## Checklist for Security Review

- [ ] No hardcoded secrets or API keys in source code
- [ ] `.env.*` files are in `.gitignore`
- [ ] Auth tokens handled securely
- [ ] User inputs validated and sanitized
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] Dependencies audited (`npm audit`)
- [ ] HTTPS used for all external requests
- [ ] Sensitive data cleared on logout
