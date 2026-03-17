# UX Screen Integration Guide

This guide explains how to use the **generic** `integrate_ux_screens` agent to integrate UX components from an external repository into your React application.

## Overview

The `integrate_ux_screens` agent is **fully generic and configuration-driven**. It does NOT contain hardcoded paths, project names, or component references. Instead, all project-specific settings come from `ux-integration-config.json`.

### Key Principle

> **Agent should NEVER be modified to include project-specific settings. Use config.json instead.**

---

## Quick Start (4 Steps)

### Step 1: Create `ux-integration-config.json`

Copy the template from the project root and customize it:

```json
{
  "project": {
    "name": "Your Project Name",
    "description": "What your project does"
  },
  "uxRepository": {
    "path": "C:\\path\\to\\ux\\repo",
    "sourceFolder": "client/src",
    "refreshBranch": "main"
  },
  "componentMapping": [
    {
      "uxComponentPath": "components/search/Search.tsx",
      "targetPath": "src/components/search/search.tsx",
      "userStories": ["US-01", "US-02"],
      "isPage": false,
      "route": null
    },
    {
      "uxComponentPath": "pages/Detail.tsx",
      "targetPath": "src/pages/detail-page.tsx",
      "userStories": ["US-03"],
      "isPage": true,
      "route": {
        "path": "/detail/:id",
        "label": "Details",
        "breadcrumbs": ["Home", "Details"]
      }
    }
  ],
  "dependencies": {
    "react": "^19.0.0",
    "typescript": "^5.0.0",
    "@mui/material": "^7.3.9",
    "react-router-v6": true,
    "redux": false
  },
  "apiBasePattern": "/api/v1",
  "services": [
    {
      "name": "search-service",
      "endpoint": "/search"
    }
  ]
}
```

### Step 2: Update Paths in Config

**`uxRepository.path`** — Where your external UX repo is located:
```json
"path": "C:\\Users\\YourName\\Projects\\ux-repo"
```

**`uxRepository.sourceFolder`** — Folder in UX repo containing components:
```json
"sourceFolder": "client/src"
```

**`componentMapping`** — List each component you want to integrate:
- `uxComponentPath` — Where file is in UX repo
- `targetPath` — Where file will be copied in main repo
- `userStories` — Which user stories this component implements
- `isPage` — Is this a page-level component?
- `route` — (If isPage: true) The route configuration

### Step 3: Run the Agent

```bash
# Run the integrate_ux_screens agent
# It will read ux-integration-config.json and execute all 7 phases
```

### Step 4: Verify & Commit

```bash
npm run build    # Verify build succeeds
npm run test     # Verify tests pass
git status       # Review changes
git commit -m "feat: integrate UX screens from [project name]"
```

---

## Configuration Reference

### `project` Section
```json
{
  "project": {
    "name": "MyApp",
    "description": "A React application"
  }
}
```
Used in documentation and git commits for context.

### `uxRepository` Section
```json
{
  "uxRepository": {
    "path": "C:\\path\\to\\repo",
    "sourceFolder": "client/src",
    "refreshBranch": "main"
  }
}
```
- **path** — Absolute path to external UX repository
- **sourceFolder** — Folder inside UX repo with components (typically `client/src`, `src`, or `app/src`)
- **refreshBranch** — Branch to pull from (default: `main`)

### `componentMapping` Section
Array of components to integrate. Each entry:

```json
{
  "uxComponentPath": "components/my-component/MyComponent.tsx",
  "targetPath": "src/components/my-component/my-component.tsx",
  "userStories": ["US-01", "US-02"],
  "isPage": false,
  "route": null,
  "description": "Optional description"
}
```

**Required fields:**
- `uxComponentPath` — Relative path in UX repo
- `targetPath` — Where to copy to in main repo  
- `userStories` — Array of user story IDs
- `isPage` — Boolean (true for page components, false for shared components)

**Conditional fields:**
- `route` — **Required if `isPage: true`**. Format:
  ```json
  "route": {
    "path": "/mypage/:id",
    "label": "My Page",
    "breadcrumbs": ["Home", "My Page"]
  }
  ```
- `route` — **Must be `null` if `isPage: false`**

### `dependencies` Section
Expected versions in UX repo. Used for validation:

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "typescript": "^5.0.0",
    "@mui/material": "^7.3.9",
    "react-router-v6": true,
    "redux": false
  }
}
```

Alerts if UX repo has different versions.

### `apiBasePattern` Section
Base URL for all API calls:

```json
{
  "apiBasePattern": "/api/v1"
}
```

This is prepended to all service endpoint definitions.

### `services` Section
API services to create:

```json
{
  "services": [
    {
      "name": "user-service",
      "endpoint": "/users",
      "description": "User API operations"
    },
    {
      "name": "item-service",
      "endpoint": "/items",
      "description": "Item management"
    }
  ]
}
```

For each entry, agent will:
- Create `src/services/api/[name]-service.ts`
- Use `apiBasePattern + endpoint` as base URL
- Export service with methods for CRUD operations

---

## Example Configurations

### Example 1: Card Management App

```json
{
  "project": {
    "name": "Card Management System",
    "description": "Manage bank and payment cards"
  },
  "uxRepository": {
    "path": "C:\\Projects\\card-ui-refresh",
    "sourceFolder": "client/src",
    "refreshBranch": "develop"
  },
  "componentMapping": [
    {
      "uxComponentPath": "components/card-search.tsx",
      "targetPath": "src/components/card-search/card-search.tsx",
      "userStories": ["US-01"],
      "isPage": false,
      "route": null
    },
    {
      "uxComponentPath": "pages/CardDetail.tsx",
      "targetPath": "src/pages/card-detail.tsx",
      "userStories": ["US-02", "US-03"],
      "isPage": true,
      "route": {
        "path": "/card/:cardId",
        "label": "Card Details",
        "breadcrumbs": ["Home", "Cards", "Details"]
      }
    }
  ],
  "dependencies": {
    "react": "^19.0.0",
    "typescript": "^5.0.0",
    "@mui/material": "^7.3.9",
    "react-router-v6": true,
    "redux": true
  },
  "apiBasePattern": "/api/cards",
  "services": [
    {
      "name": "card-service",
      "endpoint": ""
    }
  ]
}
```

### Example 2: E-Commerce Platform

```json
{
  "project": {
    "name": "E-Commerce Platform",
    "description": "Online shopping platform"
  },
  "uxRepository": {
    "path": "C:\\Workspace\\ecommerce-ui",
    "sourceFolder": "src",
    "refreshBranch": "main"
  },
  "componentMapping": [
    {
      "uxComponentPath": "components/ProductCard.tsx",
      "targetPath": "src/components/product/product-card.tsx",
      "userStories": ["US-01"],
      "isPage": false,
      "route": null
    },
    {
      "uxComponentPath": "pages/ProductListPage.tsx",
      "targetPath": "src/pages/products-page.tsx",
      "userStories": ["US-01", "US-02"],
      "isPage": true,
      "route": {
        "path": "/products",
        "label": "Products",
        "breadcrumbs": ["Home", "Products"]
      }
    },
    {
      "uxComponentPath": "pages/CartPage.tsx",
      "targetPath": "src/pages/cart-page.tsx",
      "userStories": ["US-03"],
      "isPage": true,
      "route": {
        "path": "/cart",
        "label": "Shopping Cart",
        "breadcrumbs": ["Home", "Cart"]
      }
    }
  ],
  "dependencies": {
    "react": "^19.0.0",
    "typescript": "^5.0.0",
    "@mui/material": "^7.3.9",
    "react-router-v6": true,
    "redux": true
  },
  "apiBasePattern": "/api/v1",
  "services": [
    {
      "name": "product-service",
      "endpoint": "/products"
    },
    {
      "name": "cart-service",
      "endpoint": "/cart"
    },
    {
      "name": "order-service",
      "endpoint": "/orders"
    }
  ]
}
```

---

## Common Scenarios

### Scenario: UX Repo Uses Different Folder Structure

**Problem:** UX repo has components in `src/ui/components` instead of `client/src/components`

**Solution:** Update `sourceFolder` in config:
```json
"sourceFolder": "src/ui"
```

Then update `uxComponentPath` accordingly:
```json
"uxComponentPath": "components/MyComponent.tsx"
```

### Scenario: Component Paths Different Than UX Repo

**Problem:** UX uses `Button.tsx`, but you want it named `custom-button.tsx` in your repo

**Solution:** Update `targetPath`:
```json
{
  "uxComponentPath": "components/Button.tsx",
  "targetPath": "src/components/buttons/custom-button.tsx"
}
```

### Scenario: Adding Services Later

**Problem:** You want to add more API services after initial integration

**Solution:** Update `services` array in config and run agent again

---

## Troubleshooting

**Q: "Component not found" error**
- Verify `uxComponentPath` matches actual file in UX repo
- Check `sourceFolder` is correct
- Verify file exists: `[uxRepository.path]/[sourceFolder]/[uxComponentPath]`

**Q: Build fails after integration**
- Check TypeScript errors: `npm run tsc --noEmit`
- Check import paths — should use `@/` alias
- Verify no duplicate component names

**Q: Routes don't work**
- Verify `route.path` is unique
- Ensure `isPage: true` for page components only
- Check routing in `src/routes/route-config.tsx` was updated

**Q: User story IDs in `userStories` are wrong**
- Verify user story files exist matching the IDs
- Update `userStories` array with correct IDs
- Re-run agent if config is updated

---

## Key Files

- **Configuration:** `ux-integration-config.json` (root)
- **Agent:** `.github/agents/integrate_ux_screens.md`
- **Output:** `output/INTEGRATION_SUMMARY.md` (after running)
- **Routing:** `src/routes/route-config.tsx` (updated)
- **Components:** `src/components/`, `src/pages/` (integrated)
- **Services:** `src/services/api/[name]-service.ts` (created)

---

## Remember

✅ **Config-driven:** All settings in `ux-integration-config.json`
✅ **Repeatable:** Same config → same results
✅ **Generic:** Works with any project
✅ **No hardcoding:** Agent never modified for specific projects

If something needs to change, **update config.json**, not the agent.

