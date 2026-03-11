---
name: integrate_ux_screens
description: "Integrate UX screens from external repo into main React app, wire up components based on user stories and screen mapping"
---

# UX Screen Integration Agent

> **Purpose:** Autonomously integrate React component screens from UX team's Corpay-UI-Refresh repository into the main Card Maintenance System React application, mapping them to user stories and wiring up routing, state management, and layouts.
>
> **Input:** 
> - UX screens pushed to `C:\Users\2000181447\D\Projects\Corpay\Corpay-UI-Refresh`
> - UX team documentation with screen-to-user-story mapping
> - Updated user story files from `output/user_stories/*.md`
>
> **Output:** 
> - Integrated components in `src/components/` and `src/pages/`
> - Updated routing configuration
> - Wired state management and API calls
> - Component-to-user-story mapping documentation
>
> **Prerequisites:** 
> - UX repo already cloned at fixed location
> - UX components use React 19.x and MUI 7.3.9 (same as main repo)
> - User stories documented with screen references

## Agent Instructions

### Mission
Pull latest screen components from UX team's repository (already cloned), map them to approved user stories, integrate into main React app with proper routing and state management, and ensure accessibility/TypeScript standards compliance. UX team maintains the screens; developer's job is to wire them up with APIs and state management.

### Phase 1: UX Repository Update

#### 1.1 Pull Latest Changes from UX Repository
```bash
# UX repo is already cloned at this location
cd C:\Users\2000181447\D\Projects\Corpay\Corpay-UI-Refresh

# Fetch and update from remote
git fetch origin
git pull origin main
```

#### 1.2 Verify UX Repo Structure
- Confirm structure matches `/client/src/components/` and `/client/src/pages/`
- Check `package.json` in root directory
- Check for `client/src/tsconfig.json` TypeScript setup
- Ensure components use MUI v7.3.9 (matches main repo)
- Verify React 19.x installed

#### 1.3 Compare Dependency Versions
```bash
# Verify compatible versions between UX and Main repos
cat "C:\Users\2000181447\D\Projects\Corpay\Corpay-UI-Refresh\package.json" | grep -E "react|typescript|@mui"
cat "c:\Users\2000181447\D\Repo\react-foundational-main\package.json" | grep -E "react|typescript|@mui"
```
- Alert if React version differs (must be 19.x)
- Alert if MUI differs from 7.3.9
- Flag any missing critical dependencies (Redux, React Router, Axios)

---

### Phase 2: Screen Mapping & Documentation Review

#### 2.1 Read Updated Screen Inventory and User Stories
- UX team updates user stories with screen mapping details in:
  - `C:\Users\2000181447\D\Projects\Corpay\Corpay-UI-Refresh\client\src\` (screen components)
  - Or review updated documentation in project (check for SCREEN_MAPPING.md or similar)
- Extract list of screens with metadata:
  ```
  Screen Name | Component File | User Stories | Routes | Status
  Card Search | CardSearch.tsx | US-01, US-02 | /search | Ready
  Card Details | CardDetail.tsx | US-03 | /card/:token | Ready
  ```

#### 2.2 Cross-Reference with Main Repo User Stories
For each screen, determine which user stories it implements:
- Read user story files from `output/user_stories/` in main repo
- Match screen name/components to story requirements
- Create mapping:
  ```
  CardSearchInterface.tsx 
    → US-01: Card Search Interface
    → US-02: Search Results Table
  ```
- Flag screens without matching user stories (requires clarification)

#### 2.3 Review Screen Completeness
Check UX documentation for:
- Component acceptance criteria met?
- API endpoint specifications documented?
- Validation rules implemented?
- Accessibility attributes included?
- Test coverage included?
- Missing components identified?

#### 2.4 Create/Update Screen Mapping Document
Generate/update mapping file: `output/SCREEN_COMPONENT_MAPPING.md`
```markdown
# Screen to User Story Mapping (Updated from UX Repo)

| User Story | Component Name | File Path | Routes | Status | Notes |
|---|---|---|---|---|---|
| US-01 | CardSearchInterface | client/src/components/card-search/CardSearchInterface.tsx | /search | Ready | From UX Repo |
| US-02 | SearchResultsTable | client/src/components/card-search/SearchResultsTable.tsx | /search | Ready | From UX Repo |
| US-03 | CardDetailView | client/src/pages/CardDetail.tsx | /card/:token | Ready | From UX Repo |
| ... | | | | | |
```

---

### Phase 3: Component Integration from UX Repository

#### 3.1 Copy Components from UX Repository
```bash
# Copy component files from UX repo (client/src/) to main repo (src/)
# UX Repo location: C:\Users\2000181447\D\Projects\Corpay\Corpay-UI-Refresh\client\src

# Windows PowerShell - Copy components
Copy-Item -Path "C:\Users\2000181447\D\Projects\Corpay\Corpay-UI-Refresh\client\src\components\*" `
          -Destination "c:\Users\2000181447\D\Repo\react-foundational-main\src\components\" `
          -Recurse -Force

# Copy pages
Copy-Item -Path "C:\Users\2000181447\D\Projects\Corpay\Corpay-UI-Refresh\client\src\pages\*" `
          -Destination "c:\Users\2000181447\D\Repo\react-foundational-main\src\pages\" `
          -Recurse -Force

# Optional: Copy shared types if UX team maintains types in client/src
Copy-Item -Path "C:\Users\2000181447\D\Projects\Corpay\Corpay-UI-Refresh\client\src\types\*" `
          -Destination "c:\Users\2000181447\D\Repo\react-foundational-main\src\types\" `
          -Recurse -Force
```

**Note:** Only copy `client/src/` folder contents. Do NOT copy `server/`, `shared/`, or `tsconfig.json` from UX repo.

#### 3.2 Verify Imports & Fix Path Issues
For each copied component, check and fix:
- **Import paths:** Ensure `@/` alias is used (not relative paths like `../../../`)
- **MUI imports:** Confirm correct import syntax
  ```typescript
  // ✅ Correct
  import { Box, Typography, Button } from '@mui/material';
  
  // ❌ Wrong - change to above
  import Box from '@mui/material/Box';
  ```
- **Custom component imports:** Update to use `@/` alias
  ```typescript
  // Before (from UX repo context)
  import UserCard from '../../../components/UserCard';
  
  // After (main repo)
  import { UserCard } from '@/components/common/user-card/UserCard';
  ```

#### 3.3 TypeScript Validation
Run type checking on copied files:
```bash
npx tsc --noEmit src/components/ src/pages/
```
- Fix any type errors:
  - Missing prop interfaces
  - Incorrect component props
  - Return type mismatches
  - Missing React.FC type annotations
- Add missing interfaces to `src/types/index.ts` if needed

#### 3.4 ESLint & Code Standards
```bash
npx eslint src/components/ src/pages/ --fix
npx prettier --write src/components/ src/pages/
```
- Auto-fix formatting issues
- Flag violations (e.g., class components, relative imports)
- Verify no styles imported as CSS (must use MUI theme system)

#### 3.5 Verify Component Exports
Check each component file:
```typescript
// ✅ Correct: Default export as named arrow function
const CardSearch: React.FC<CardSearchProps> = () => { ... };
export default CardSearch;

// ✅ Also correct: Named export
export const CardSearch: React.FC<CardSearchProps> = () => { ... };

// ❌ Wrong: Class component or default function export
export default function CardSearch() { ... }
```

---

### Phase 4: Routing Integration

#### 4.1 Update Route Configuration
Edit `src/routes/route-config.tsx`:
- Add new routes for integrated screens
- Map to corresponding user stories
- Example:
  ```typescript
  export const routeConfig: RouteConfig[] = [
    // Search & Manage Cards (US-01, US-02, US-03)
    {
      path: '/search',
      component: CardSearchPage,
      label: 'Search Cards',
      userStories: ['US-01', 'US-02'],
      breadcrumbs: ['Home', 'Search Cards']
    },
    {
      path: '/card/:cardToken',
      component: CardDetailPage,
      label: 'Card Details',
      userStories: ['US-03'],
      breadcrumbs: ['Home', 'Cards', 'Details']
    },
    // ... more routes
  ];
  ```

#### 4.2 Update RouterComponent (AppRouter.tsx)
- Import new page components
- Add Route elements to handle new paths
- Implement error boundaries around new routes
- Test routing with React Router Dev Tools

#### 4.3 Navigation Integration
Update navigation menus/breadcrumbs:
- Edit `src/components/common/` navigation components
- Add links to new screens
- Ensure back navigation works correctly
- Test deep linking (direct URL access)

---

### Phase 5: State Management Wiring

#### 5.1 Identify API Dependencies
For each integrated component, find API calls:
- Search in component for `fetch()`, `axios`, `.then()`, `useEffect` with URLs
- Map API endpoints to user stories
- Example:
  ```
  CardSearch.tsx calls:
    - GET /Blam/accounts/{accountName}
    - GET /Blam/account/{accountId}/customers
    - POST /Blam/search
  ```

#### 5.2 Create/Update Service Files
Verify or create service file for each API endpoint:
```bash
# Check if service exists
ls src/services/api/*-service.ts

# Create if missing: src/services/api/card-service.ts
```
- Service example:
  ```typescript
  import axios from '@/services/api/axios-instance';
  
  export const cardService = {
    search: (params) => axios.post('/search', { /* ... */ }),
    getCardDetail: (token) => axios.get(`/getCardDetail?cardToken=${token}`),
    updateCardBasic: (data) => axios.post('/updateCardBasic', data),
  };
  ```

#### 5.3 Replace Hardcoded API Calls
In each component, replace direct API calls:
```typescript
// Before: Direct axios call in component
const response = await axios.post('/Blam/search', { ... });

// After: Use service
const response = await cardService.search({ ... });
```

#### 5.4 Wire Redux State (if applicable)
For global state (search results, selected cards, etc.):
- Check if Redux slice exists in `src/store/slices/`
- Create slice if missing:
  ```typescript
  // src/store/slices/card-search-slice.ts
  const cardSearchSlice = createSlice({
    name: 'cardSearch',
    initialState: { results: [], filters: {}, loading: false },
    reducers: { ... },
    extraReducers: (builder) => { ... }
  });
  ```
- Wire components to Redux:
  ```typescript
  const dispatch = useAppDispatch();
  const { results } = useAppSelector(state => state.cardSearch);
  ```

#### 5.5 Wire Context API (if applicable)
For UI-level state (theme, auth, toasts):
- Verify context exists in `src/contexts/`
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
For each component, add:
```typescript
// Buttons
<Button aria-label="Search for cards">Search</Button>

// Form inputs
<TextField aria-label="Enter card number" placeholder="Card #" />

// Dynamic content
<div role="status" aria-live="polite">Loading...</div>

// Dropdowns
<Select aria-label="Filter by status">...</Select>
```

#### 6.3 Test Keyboard Navigation
- Tab through all interactive elements
- Enter/Space activates buttons
- Arrow keys navigate dropdowns/menus
- Escape closes modals
- Focus indicators visible throughout

#### 6.4 Verify Testing Coverage
Check for test files alongside components:
```bash
# Verify test files exist
ls src/components/**/*.test.tsx
ls src/pages/**/*.test.tsx
```
- If missing, create basic test template (RTL + React Testing Library)
- Test component rendering and user interactions

---

### Phase 7: Documentation & Verification

#### 7.1 Generate Integration Summary
Create `output/INTEGRATION_SUMMARY.md`:
```markdown
# UX Screen Integration Summary

**Date:** 2026-03-10  
**Screens Integrated:** 8  
**User Stories Covered:** 8/8 (100%)  
**Test Coverage:** ✓ Passed  

## Integrated Components
- ✓ CardSearchInterface (US-01, US-02)
- ✓ CardDetailView (US-03)
- ✓ CardEditForm (US-04)
- ✓ BulkActionsPanel (US-05)
- ... (continue for all)

## API Endpoints Verified
- ✓ GET /Blam/accounts/{name}
- ✓ POST /Blam/search
- ... (continue for all)

## Issues Found & Resolution
- [ ] Issue: CardSearch component using class component
  - Resolution: Converted to arrow function, updated to FC type

## Next Steps
1. Run full test suite
2. Test in browser with dev tools
3. Code review by team lead
4. Merge to main branch
```

#### 7.2 Build & Test
```bash
# Build the app
npm run build

# Check for build errors
echo $?  # Should output 0

# Run all tests
npm run test -- --coverage
```
- Flag any build warnings/errors
- Verify test coverage ≥ 80%
- No console errors in dev mode

#### 7.3 Component-to-User-Story Audit
Verify each user story is implemented:
```
✓ US-01 (Search Interface) → CardSearchInterface + SearchBar
✓ US-02 (Results Table) → SearchResultsTable
✓ US-03 (Card Details) → CardDetailView + DetailSections
✓ US-04 (Edit Card) → CardEditForm + FieldInputs
✓ US-05 (Bulk Operations) → BulkActionsPanel + ModalsDB
✓ US-06 (Direct Deposit) → DirectDepositSection + DirectDepositModal
✓ US-07 (Reset PIN) → ResetPinButton + ResetPinDialog
✓ US-08 (Transaction History) → TransactionHistorySection + TransactionTable
```
- Create "Traceability Matrix" document linking components ↔ user stories

#### 7.4 Git Commit
```bash
git add src/components/ src/pages/ src/routes/ src/store/ src/services/
git commit -m "feat: integrate UX screens for Card Maintenance System

- Integrated 8 screen components from UX repository
- Wired routing, state management, and API calls
- Mapped components to user stories (100% coverage)
- Added accessibility attributes (WCAG AA)
- All tests passing, build successful

Closes: [GitHub Issue or PR Number if applicable]

Components integrated:
- CardSearchInterface (US-01, US-02)
- CardDetailView (US-03)
- CardEditForm (US-04)
- BulkActionsPanel (US-05)
- DirectDepositSection (US-06)
- ResetPinButton (US-07)
- TransactionHistorySection (US-08)
- SearchResultsTable (US-02)
"
git push origin feature/integrate-ux-screens
```

---

## Error Handling & Edge Cases

### Scenario 1: Version Mismatch
**Condition:** UX repo React v18, main repo React v19
**Action:** Alert: "Cannot integrate - React version mismatch. Update UX repo to v19"
**Recovery:** Manual coordination with UX team to update dependencies

### Scenario 2: Component Name Conflicts
**Condition:** UX repo has `Button` component that conflicts with MUI Button
**Action:**
- Rename UX component: `CustomButton` instead of `Button`
- Update all imports in copied files
- Document rename in INTEGRATION_SUMMARY.md

### Scenario 3: Missing User Story Mapping
**Condition:** Screen exists but doesn't map to any user story
**Action:**
- Flag in mapping document with ⚠️ UNMAPPED
- Require manual approval before integration
- Alert: "Screen [ScreenName] has no user story mapping"

### Scenario 4: API Endpoint Not Documented
**Condition:** Component calls endpoint not in user stories (API/Data section)
**Action:**
- Log warning: "Component uses undocumented API: POST /Blam/customEndpoint"
- Request API documentation from backend team
- Proceed with caution, mark as "Requires Backend Verification"

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

UX team should:
1. **Push updated screens** to: `C:\Users\2000181447\D\Projects\Corpay\Corpay-UI-Refresh`
2. **Document screen mapping** with user story references
3. **Update component acceptance criteria** (validation rules, API endpoints, etc.)
4. **Ensure React 19.x and MUI 7.3.9** installed

Agent will:
1. Pull latest changes from UX repo
2. Copy components from `client/src/` to main repo `src/`
3. Wire routing, state management, API integration
4. Add/verify tests and accessibility
5. Generate integration summary

The agent outputs:
- Integrated components in `src/components/`, `src/pages/`
- Updated `src/routes/route-config.tsx`
- Updated Redux slices in `src/store/slices/`
- Updated service files in `src/services/api/`
- Integration Summary: `output/INTEGRATION_SUMMARY.md`
- Component Mapping: `output/SCREEN_COMPONENT_MAPPING.md`
- Git commit ready to push

