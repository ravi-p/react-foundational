---
name: integrate_ux_screens
description: "Integrate UX screens from external repo into main React app, wire up components based on config and user stories"
---

# UX Screen Integration Agent (Generic)

> **Purpose:** Autonomously integrate React component screens from external UX repository into main React application, mapping them to user stories and wiring up routing, state management, and layouts.
>
> **Input:** 
> - UX repository location (specified in config.json), ask if not found
> - Configuration file `.github\agents\conf\ux-integration-config.json` with component mappings
> - User story files from `user-stories/`
>
> **Output:** 
> - Integrated components in `src/components/` and `src/pages/`
> - Updated routing configuration
> - Wired state management and API calls
> - Component-to-user-story mapping documentation
>
> **Prerequisites:** 
> - UX repo already exists at configured location
> - Components use same React version and TypeScript as main repo
> - User stories documented with screen references in config.json

## Agent Instructions

### Configuration (REQUIRED BEFORE RUNNING)

Create/update **`ux-integration-config.json`** in `.github\agents\conf\` with the following structure:

```json
{
  "project": {
    "name": "Your Project Name"
  },
  "uxRepository": {
    "path": "C:\\path\\to\\ux\\repo",
    "sourceFolder": "client/src",
    "refreshBranch": "main"
  },
  "componentMapping": [
    {
      "uxComponentPath": "components/card-search/CardSearch.tsx",
      "targetPath": "src/components/card-search/CardSearch.tsx",
      "userStories": ["US-01", "US-02"],
      "isPage": false,
      "route": null
    },
    {
      "uxComponentPath": "pages/CardDetail.tsx",
      "targetPath": "src/pages/card-detail.tsx",
      "userStories": ["US-03"],
      "isPage": true,
      "route": {
        "path": "/card/:cardToken",
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
    "redux": false
  },
  "apiBasePattern": "/api/v1",
  "services": [
    {
      "name": "card-service",
      "endpoint": "/cards"
    }
  ]
}

```json
{
  "project": {
    "name": "Your Project Name"
  },
  "uxRepository": {
    "path": "C:\\path\\to\\ux\\repo",
    "sourceFolder": "client/src",
    "refreshBranch": "main"
  },
  "componentMapping": [
    {
      "uxComponentPath": "components/card-search/CardSearch.tsx",
      "targetPath": "src/components/card-search/CardSearch.tsx",
      "userStories": ["US-01", "US-02"],
      "isPage": false,
      "route": null
    },
    {
      "uxComponentPath": "pages/CardDetail.tsx",
      "targetPath": "src/pages/card-detail.tsx",
      "userStories": ["US-03"],
      "isPage": true,
      "route": {
        "path": "/card/:cardToken",
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
    "redux": false
  },
  "apiBasePattern": "/api/v1",
  "services": [
    {
      "name": "card-service",
      "endpoint": "/cards"
    }
  ]
}
```

### Mission
Pull latest screen components from configured UX repository, map them to approved user stories, integrate into main React app with proper routing and state management, and ensure accessibility/TypeScript standards compliance. Configuration (not hardcoded values) drives all integration decisions.

### Phase 1: UX Repository Update

#### 1.1 Read Configuration
- Load `ux-integration-config.json` from `.github\agents\conf\`
- Extract:
  - `uxRepository.path` - location of external UX repo
  - `uxRepository.sourceFolder` - source folder in UX repo (e.g., "client/src")
  - `componentMapping` - array of components to integrate
  - `dependencies` - expected versions of React, TypeScript, etc.

#### 1.2 Pull Latest Changes from UX Repository
```bash
cd [uxRepository.path from config]
git fetch origin
git pull origin [refreshBranch from config]
```

#### 1.3 Verify UX Repo Structure
- Confirm source folder exists: `[uxRepository.path]/[sourceFolder]/`
- Check `package.json` versions match config.dependencies
- Verify React, TypeScript match specified versions
- Flag any dependency mismatches

#### 1.4 Validate Component Files
For each component in `componentMapping`:
- Verify source exists: `[uxRepository.path]/[sourceFolder]/[uxComponentPath]`
- Confirm component is TypeScript (`.tsx` or `.ts`)
- Check file has default or named export
- Flag missing components before proceeding

---

### Phase 2: Screen Mapping & Component List

#### 2.1 Read Component Configuration
From `./.github/agents/conf/ux-integration-config.json`, extract `componentMapping` array:
```json
[
  {
    "uxComponentPath": "components/search/Search.tsx",
    "targetPath": "src/components/search/Search.tsx",
    "userStories": ["US-01", "US-02"],
    "isPage": false,
    "route": null
  },
  {
    "uxComponentPath": "pages/Detail.tsx",
    "targetPath": "src/pages/detail.tsx",
    "userStories": ["US-03"],
    "isPage": true,
    "route": {
      "path": "/detail/:id",
      "label": "Details",
      "breadcrumbs": ["Home", "Details"]
    }
  }
]
```

#### 2.2 Cross-Reference with User Stories
For each component in mapping:
- Read corresponding user story files from `user-stories/` or `output/user_stories/`
- Verify component implements stories listed in `userStories` array
- Flag stories not implemented
- Flag components without story references

#### 2.3 Validate Configuration
Ensure all components in mapping:
- Have valid `uxComponentPath` (file exists in UX repo)
- Have valid `targetPath` (where file will be copied)
- List at least one user story
- If `isPage: true`, have route configuration
- If `isPage: false`, have `route: null`

#### 2.4 Summary & Validation Report
Create summary:
```
Components to integrate: [count]
Pages (route-ready): [count]
Components (non-routable): [count]
Total user stories: [count]
Missing user story refs: [if any]
```

---

---

### Phase 3: Component Integration from UX Repository

#### 3.1 Copy Components from UX Repository
For each component in `componentMapping`:
```bash
# Generic pattern - loop through each mapping entry:
# Source: [uxRepository.path]/[uxRepository.sourceFolder]/[componentMapping[i].uxComponentPath]
# Target: [componentMapping[i].targetPath]

# Example (from config):
Copy-Item -Path "[uxRepository.path]/[sourceFolder]/[uxComponentPath]" `
          -Destination "[targetPath]" `
          -Recurse -Force
```

**Rules:**
- Only copy files listed in `componentMapping` array
- Preserve folder structure from UX repo
- Do NOT copy UX repo's `tsconfig.json`, `package.json`, or build files
- Create target directories if they don't exist

#### 3.2 Verify Imports & Fix Path Issues
For each copied component, check and fix:
- **Import paths:** Ensure `@/` alias is used (not relative paths)
- **Framework imports:** Verify correct import syntax for configured framework
  - If config.dependencies includes `@mui/material`, verify MUI imports
  - If config includes other UI library, verify those imports
- **Custom component imports:** Update to use `@/` alias
  ```typescript
  // Before (from UX repo context)
  import Component from '../../../components/Component';
  
  // After (main repo)
  import { Component } from '@/components/folder/Component';
  ```

#### 3.3 TypeScript Validation
Run type checking on copied files:
```bash
npx tsc --noEmit src/components/ src/pages/
```
- Fix any type errors
- Add missing interfaces to `src/types/index.ts`
- Verify all props are properly typed

#### 3.4 Code Quality Standards
```bash
npx eslint src/components/ src/pages/ --fix
npx prettier --write src/components/ src/pages/
```
- Auto-fix formatting issues
- Flag violations specific to project standards

#### 3.5 Verify Component Exports
For each component:
```typescript
// ✅ Correct: Default export or named export with React.FC typing
const MyComponent: React.FC<MyComponentProps> = () => { ... };
export default MyComponent;

// OR named export
export const MyComponent: React.FC<MyComponentProps> = () => { ... };


// ✅ Also correct: Named export
export const CardSearch: React.FC<CardSearchProps> = () => { ... };

// ❌ Wrong: Class component or default function export
export default function CardSearch() { ... }
```

---

### Phase 4: Routing Integration

#### 4.1 Update Route Configuration
For components with `isPage: true` in config:
- Read `componentMapping` from `ux-integration-config.json`
- For each component where `isPage: true`, extract route from `route` property
- Update `src/routes/route-config.tsx` to add new routes
- Example:
  ```typescript
  export const routeConfig: RouteConfig[] = [
    {
      path: '[route.path from config]',
      component: [ImportedComponent],
      label: '[route.label from config]',
      userStories: [from config.userStories],
      breadcrumbs: [from route.breadcrumbs]
    },
    // ... more routes from config
  ];
  ```

#### 4.2 Update Router Component (AppRouter.tsx)
- Import new page components
- Add Route elements matching paths from config
- Wrap routes with ErrorBoundary component
- Verify routing links match config paths

#### 4.3 Navigation Integration
Update top navigation/menu:
- Add navigation links for new routes (from `route.label` in config)
- Test breadcrumb generation (from `route.breadcrumbs` in config)
- Verify back navigation works
- Test deep linking with config-defined paths

---

### Phase 5: State Management Wiring

#### 5.1 Identify API Dependencies
From `./.github/agents/conf/ux-integration-config.json`, read `services` array:
```json
"services": [
  { "name": "service-name", "endpoint": "/api/endpoint" },
  { "name": "user-service", "endpoint": "/api/users" }
]
```
- For each service, create or verify service file
- Map API calls in components to service methods
- Use `apiBasePattern` from config for endpoint prefixes

#### 5.2 Create/Update Service Files
For each entry in config.services:
```bash
# Create: src/services/api/[name]-service.ts
# Using apiBasePattern from config
```
- Service structure:
  ```typescript
  import axios from '@/services/api/axios-instance';
  
  const baseEndpoint = '[config.apiBasePattern][config.endpoint]';
  
  export const [name]Service = {
    method1: (...) => axios.post(`${baseEndpoint}/path`, ...),
    method2: (...) => axios.get(`${baseEndpoint}/path/:id`, ...)
  };
  ```

#### 5.3 Replace Hardcoded API Calls
In each integrated component:
- Replace inline axios/fetch calls with service methods
- Use `apiBasePattern` from config for endpoint construction
- Update all API endpoint strings

#### 5.4 Wire State Management (if configured)
If config.dependencies includes `redux`:
- Check if Redux slices exist for components
- Create slices if missing
- Wire components using `useAppDispatch` and `useAppSelector`

#### 5.5 Wire Context API (if configured)
For UI-level state (theme, auth, toasts):
- Verify contexts exist in `src/contexts/`
- Wire components to consume context:
  ```typescript
  const { showToast } = useToast();
  const { user } = useAuth();
  ```

---

### Phase 6: Accessibility & Standards Compliance

#### 6.1 Run Accessibility Audit
```bash
# Check for a11y issues
npx axe-core src/components/ src/pages/
# or use browser extension during testing
```
- Verify WCAG AA compliance:
  - All buttons have aria-labels
  - Images have alt text
  - Form fields have labels
  - Color contrast ratio ≥ 4.5:1

#### 6.2 Add Missing ARIA Attributes
For each component, ensure:
```typescript
// All buttons have accessible labels
<Button aria-label="[descriptive action]">Text</Button>

// Form fields connected to labels
<label htmlFor="fieldId">Label Text</label>
<input id="fieldId" type="text" />

// Dynamic content has live regions
<div role="status" aria-live="polite">Feedback message</div>

// Dropdown/select elements accessible
<select aria-label="[accessible label]">...</select>
```

#### 6.3 Code Quality Checks
- Run TypeScript checks: `npx tsc --noEmit`
- Run linter: `npx eslint src/components/ src/pages/`
- Run formatter: `npx prettier --check src/components/ src/pages/`
- All should pass without errors

#### 6.4 Component Testing
For each integrated component:
- Check if test file exists (`.test.tsx`)
- If missing, create basic test structure
- Test rendering and basic interactions
- Verify component inputs/outputs work correctly

---

### Phase 7: Documentation & Verification

#### 7.1 Verify All Config Requirements Met
Check completion checklist:
```
□ All componentMapping entries processed
□ All .tsx files copied to target locations
□ All imports updated to use @/ alias
□ TypeScript validation passes (no errors)
□ ESLint validation passes (no violations)
□ All page components have routing entries
□ All service files created or updated
□ Context/Redux wiring complete
□ Accessibility standards verified
□ Tests exist for components
```

#### 7.2 Create Integration Summary Document
Generate summary document at `output/audits/INTEGRATION_SUMMARY.md`:

```markdown
# UX Screen Integration Summary

**Date:** [today's date]  
**Project:** [from config.project.name]
**Screens Integrated:** [count from componentMapping]  
**User Stories Covered:** [count]/[total]

## Integrated Components
[List each component from componentMapping]
- ✓ [Component Name] ([user story IDs])
- ✓ [Component Name] ([user story IDs])

## Routing Added
[List each route from componentMapping with isPage: true]
- [path] → [component name]
- [path] → [component name]

## Services Created
[List each service from config.services]
- [service name] → [endpoint]
- [service name] → [endpoint]

## Verification Results
- TypeScript: ✓/✗
- ESLint: ✓/✗
- Test Coverage: [%]
- Build Status: ✓/✗

## Issues Found & Resolution
[Document any issues and how they were resolved]
```

#### 7.3 Build & Verification
```bash
# Build the app
npm run build

# Run tests
npm run test -- --coverage

# Run type checking
npx tsc --noEmit

# Run linting
npx eslint src/components/ src/pages/
```
- All commands should complete without errors
- No TypeScript errors
- No ESLint violations
- Test coverage should meet project standards

#### 7.4 Component-to-User-Story Verification
Create traceability matrix (can be in comment or document):
```
Component Name | User Stories | Routes | Status
[from mapping] | [US IDs]     | [path] | ✓ Integrated
```
- Verify every user story in componentMapping is represented
- Verify every component is mapped to at least one user story
- Document any unmapped components or user stories

---

## Configuration Requirements

**Must create `ux-integration-config.json` before running agent:**

| Section | Purpose | Required |
|---------|---------|----------|
| `project` | Project metadata | ✓ Yes |
| `uxRepository` | Where to find UX components | ✓ Yes |
| `componentMapping` | List of components to integrate | ✓ Yes |
| `dependencies` | Expected versions (validation) | ✓ Yes |
| `apiBasePattern` | API base URL for services | ✓ Yes |
| `services` | API services to create | ✓ Yes |

---

## Error Handling & Edge Cases

### Scenario 1: Version Mismatch
**Condition:** UX repo React version differs from config.dependencies
**Action:** Alert and flag as incompatible
**Recovery:** Coordinate with UX team to update versions

### Scenario 2: Component Not Found
**Condition:** File specified in componentMapping.uxComponentPath doesn't exist
**Action:** Alert: "Component not found at [path]"
**Recovery:** Verify path in config matches actual file location

### Scenario 3: Missing User Story Mapping
**Condition:** Component in mapping has empty or missing userStories array
**Action:** Flag with ⚠️ - require clarification
**Recovery:** Update config.json with correct user story IDs

### Scenario 4: Import Path Failures
**Condition:** Component imports fail after copying (missing dependencies, wrong paths)
**Action:** Log error with line number
**Recovery:** Fix imports manually or update source in UX repo

### Scenario 5: Build Failure
**Condition:** `npm run build` fails with TypeScript errors
**Action:**
- Halt integration
- List all errors with file paths
- Request: "Fix TypeScript errors in components:"
- Do not proceed until build succeeds

### Scenario 6: Test Failures
**Condition:** `npm run test` shows failing tests
**Action:**
- Determine if failures are in copied components or main app
- If copied component: Fix component or create test stubs
- If main app: Likely integration issue, debug routing/state

---

## Decision Boundaries

**ALWAYS ASK USER:**
- Are any breaking changes introduced by UX screens acceptable?
- Should we create a feature branch or commit directly to main/develop?
- If screens are incomplete, should integration proceed or wait for completeness?
- Any naming convention changes from UX team accepted?

**YOU MAY DECIDE:**
- Import path conversions (`../` → `@/`)
- Component file organization/naming
- Redux slice structure for state management
- Test file creation/modification
- Git commit message formats
- Which API service files to create

---

## Success Criteria

✅ Agent succeeded when:
1. All components copied from UX repo to main repo
2. No TypeScript errors: `npm run build` succeeds
3. No ESLint/Prettier violations
4. All tests pass: `npm run test --coverage`
5. Routing configured and tested
6. State management wired (Redux/Context)
7. Accessibility verified (WCAG AA)
8. Every user story has corresponding component(s)
9. Integration Summary generated and accurate
10. Git commit created with clear message

❌ Agent failed if:
- Build fails with errors
- TypeScript errors remain
- Tests fail
- Routing broken (404 on new routes)
- API calls missing or hardcoded
- User story without screen component (unmapped)
- Accessibility issues (WCAG AA violations)

---

## Inputs Expected

Before running this agent:

1. **Create `ux-integration-config.json`** with:
   - UX repository path and source folder
   - Component mapping (source → target paths)
   - Expected dependency versions
   - API services configuration

2. **Ensure UX repository is ready:**
   - Components are in specified source folder
   - All dependencies match config.dependencies
   - Components use TypeScript
   - Components export default or named functions

3. **Ensure user stories are documented:**
   - User story files exist in `user-stories/`
   - Each story has clear acceptance criteria
   - Component mapping references valid user story IDs

Agent will:
1. Validate UX repository and configuration
2. Copy components per componentMapping
3. Fix imports and validate TypeScript
4. Wire routing, state management, API services
5. Add tests and verify accessibility
6. Generate integration summary

The agent outputs:
- Integrated components in `src/components/`, `src/pages/`
- Updated routing configuration (`src/routes/`)
- Updated/created service files (`src/services/api/`)
- Updated state management if configured (`src/store/slices/`)
- Integration Summary: `output/audits/INTEGRATION_SUMMARY.md`
- Git commit ready to push

---

## When Agent Should NOT Modify Itself

✅ **Configuration-driven:** All project-specific values come from `.github/agents/conf/ux-integration-config.json`
✅ **Repeatable:** Running agent twice with same config produces same results
✅ **No hardcoding:** No Card Maintenance, specific project names, or hardcoded paths
✅ **Generic:** Works with ANY project that has valid config.json

❌ **Agent modifications needed?** → Update config.json instead
❌ **Component paths wrong?** → Fix in componentMapping in config.json
❌ **API pattern different?** → Change apiBasePattern in config.json
❌ **Dependency versions?** → Update dependencies section in config.json

Every integration is controlled by **config.json**, not by editing this agent file.

