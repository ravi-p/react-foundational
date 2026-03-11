---
name: resolve_integration_issues
description: "Autonomously fix code quality, test, and integration issues found during review phase"
---

# Resolve Integration Issues Agent

> **Purpose:** Autonomously diagnose and fix code quality issues, test failures, and integration problems discovered during the review phase.
>
> **Input:** 
> - Code Review Report from `output/CODE_REVIEW_REPORT.md`
> - Test failure logs and coverage reports
> - TypeScript and ESLint errors
> - Integration validation results
>
> **Output:** 
> - Fixed component files
> - Passing test suite
> - 0 TypeScript and ESLint errors
> - Updated Redux slices and services
> - Re-run review checklist
>
> **Prerequisites:** 
> - Review phase completed with identified issues
> - Clear list of blockers and warnings
> - User approval to fix issues

---

## Agent Instructions

### Mission
Systematically diagnose and fix all issues reported during code review. Prioritize critical blockers first, then warnings, then non-critical findings. Re-run full review after each fix to verify resolution.

---

### Phase 1: Issue Prioritization & Analysis

#### 1.1 Read Review Report
```bash
# Open the review report
cat output/CODE_REVIEW_REPORT.md

# Extract issue list
# Sort by: BLOCKERS → HIGH PRIORITY → MEDIUM → LOW
```

**Create Issue Triage:**
```markdown
## Issue Triage

### 🔴 BLOCKERS (Must fix before merge)
1. TypeScript error in CardSearch.tsx line 42 (unmapped API response type)
2. CardEditForm test failing: validation logic not triggering
3. Build error: Missing export in Redux slice

### 🟠 HIGH PRIORITY
4. ESLint: Class component in DirectDepositModal (must be arrow function)
5. Coverage < 60%: BulkActionsPanel needs test cases
6. Accessibility: 3 buttons missing aria-labels

### 🟡 MEDIUM PRIORITY
7. Hardcoded API URL in cardService.ts
8. Incomplete error handling in transaction service

### 🟢 LOW PRIORITY
9. Console warnings in development mode
10. Code comments need updating after refactor
```

#### 1.2 Analyze Root Causes
For each issue, determine root cause:

```
Issue: TypeScript error in CardSearch.tsx

Error: Type 'any' is not assignable to type 'CardSearchResult'
Location: Line 42, response handling

Root Cause: API response type not defined in types/index.ts
Solution: Create CardSearchResponse interface, update cardService.ts response type

Estimated Fix Time: 15 minutes
```

---

### Phase 2: Fix TypeScript Errors

#### 2.1 Find All TypeScript Errors
```bash
# Run type checking and save errors
npm run type-check 2>&1 | tee typescript-errors.log

# Extract error locations
grep -n "error TS" typescript-errors.log
```

**For Each Error:**
```
Error 1: src/components/card-search/CardSearch.tsx:42
  - Type 'unknown' not assignable to 'CardSearchResult'
  - Missing interface definition
  - Fix: Add CardSearchResult interface to src/types/index.ts
    ```typescript
    export interface CardSearchResult {
      cardToken: string;
      cardNumber: string;
      // ... other fields
    }
    ```

Error 2: src/store/slices/card-search-slice.ts:18
  - Property 'filters' does not exist on type 'CardSearchState'
  - Missing state shape
  - Fix: Update CardSearchState interface
    ```typescript
    interface CardSearchState {
      results: CardSearchResult[];
      filters: CardSearchFilters;
      loading: boolean;
      error: string | null;
    }
    ```
```

#### 2.2 Apply Fixes
For each identified error:
1. Add missing interface definitions to `src/types/index.ts`
2. Update component props interfaces
3. Fix Redux slice state types
4. Update service return types
5. Re-run type checking after each fix

```bash
# Verify fix
npm run type-check

# If still errors, iterate
```

**Success Criteria:**
- ✅ `npm run type-check` exits with code 0
- ✅ No remaining TypeScript errors
- ✅ All `.tsx` files compile cleanly

---

### Phase 3: Fix ESLint Violations

#### 3.1 Run ESLint and Capture Issues
```bash
# Find all violations
npm run lint 2>&1 | tee eslint-errors.log

# Extract violations by type
grep "error\|warning" eslint-errors.log | sort | uniq -c
```

**Common Violations to Fix:**

| Error | Pattern | Fix |
|-------|---------|-----|
| Class Component | `class MyComponent extends React.Component` | Convert to arrow function `const MyComponent: React.FC<Props> = () => {}` |
| Import Order | Imports not in correct order (React, 3rd-party, @/, styles) | Reorder imports |
| Missing Props Type | Props not in interface | Create `interface MyComponentProps {}` |
| Relative Imports | `import from '../../../'` | Change to `import from '@/...'` |
| Unused Variables | `const x = 5; // never used` | Remove unused code |
| Missing Dependencies | useEffect without dependency array | Add dependency array `[]` |

#### 3.2 Auto-fix Issues
```bash
# ESLint can auto-fix many issues
npm run lint -- --fix

# Re-check remaining violations
npm run lint
```

#### 3.3 Manual Fixes
For issues auto-fix couldn't resolve:

```typescript
// ❌ WRONG: Class component
export class CardEdit extends React.Component<Props> {
  render() { return <form>...</form>; }
}

// ✅ CORRECT: Arrow function component
const CardEdit: React.FC<CardEditProps> = (props) => {
  return <form>...</form>;
};
export default CardEdit;

// ❌ WRONG: Relative imports
import { apiService } from '../../../services/api/service';

// ✅ CORRECT: @ alias
import { apiService } from '@/services/api/card-service';

// ❌ WRONG: Missing types
const handleChange = (e) => { ... }

// ✅ CORRECT: With types
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }
```

**Success Criteria:**
- ✅ `npm run lint` returns 0 violations
- ✅ All components are arrow functions
- ✅ All imports use `@/` alias
- ✅ All props properly typed

---

### Phase 4: Fix Test Failures

#### 4.1 Identify Failing Tests
```bash
# Run tests and capture failures
npm run test -- --verbose 2>&1 | tee test-results.log

# Extract failures
grep "FAIL\|✕" test-results.log
```

**Example Failures:**
```
FAIL  src/components/card-search/CardSearch.test.tsx
  ✕ displays search input (5ms)
  ✕ dispatches search on button click (3ms)
  ✕ shows loading spinner while fetching (2ms)

FAIL  src/store/slices/card-search-slice.test.ts
  ✕ initializes with empty results
  ✕ handles search success action
```

#### 4.2 Fix Test Issues
For each failing test:

```typescript
// Test: "dispatches search on button click"
// Error: "fireEvent.click is not a function"
// Root Cause: Button not found by test query
// Fix: Update test to find button correctly

// ❌ WRONG
const button = screen.getByText('Search');  // Too generic
fireEvent.click(button);

// ✅ CORRECT
const button = screen.getByRole('button', { name: 'Search for cards' });
await userEvent.click(button);

// Also check component has aria-label
<Button aria-label="Search for cards">Search</Button>
```

**Common Test Fixes:**
- Replace `fireEvent` with `userEvent` (better simulation of user behavior)
- Add `screen` queries for finding elements by role/label
- Add `waitFor` for async operations
- Mock Redux store properly with `{preloadedState}`
- Check components render without errors in tests

```bash
# Re-run tests after fixes
npm run test -- --coverage

# Should show: X passed, 0 failed
```

#### 4.3 Improve Test Coverage
For components with coverage < 80%:

```typescript
// Identify uncovered lines in component
// src/components/bulk-actions/BulkActionsPanel.tsx coverage: 58%

// Add test cases for:
// 1. Selection logic (checkbox toggle)
// 2. Action dispatch on button click
// 3. Error state handling
// 4. Success message after action completes
// 5. Bulk action modal interactions

// Example test case to add:
test('should disable action button when no cards selected', () => {
  render(<BulkActionsPanel selectedCards={[]} />);
  const deleteButton = screen.getByRole('button', { name: 'Delete Selected' });
  expect(deleteButton).toBeDisabled();
});
```

**Success Criteria:**
- ✅ All tests passing: `npm run test` (0 failures)
- ✅ Coverage ≥ 80% for all new components
- ✅ No test timeout warnings
- ✅ No console errors during testing

---

### Phase 5: Fix Build Errors

#### 5.1 Identify Build Issues
```bash
# Run build and capture errors
npm run build 2>&1 | tee build-log.txt

# Extract error details
grep -E "error|✖" build-log.txt

# Check build output
ls -lh dist/
```

**Common Build Errors:**
- Missing dependencies in imports
- Incorrect file extensions (`.ts` vs `.tsx`)
- Circular dependencies
- Unused imports causing warnings-as-errors

#### 5.2 Fix Build Issues
```typescript
// ❌ WRONG: Importing from .js when should be .ts
import { utils } from '@/utils.js';

// ✅ CORRECT: Don't specify extension for TypeScript files
import { utils } from '@/utils';

// ❌ WRONG: Missing import
const { Box } = '@mui/material';  // Forgot 'from'

// ✅ CORRECT
import { Box } from '@mui/material';

// ❌ WRONG: Unused import (causes build to fail)
import { unused } from '@/services';

// ✅ CORRECT: Remove if not used
// (If needed later, add back)
```

```bash
# After fixes, rebuild
npm run build

# Verify success
echo "Build exit code: $?"  # Should be 0
ls -lh dist/index.html     # Should exist and be non-empty
```

**Success Criteria:**
- ✅ Build completes successfully (exit code 0)
- ✅ No build errors or critical warnings
- ✅ `dist/` folder contains all assets
- ✅ Bundle size < 500KB (gzipped)

---

### Phase 6: Fix Accessibility Issues

#### 6.1 Identify Accessibility Problems
```markdown
From Code Review Report:

## Accessibility Issues Found:
1. CardSearch component: Filter button missing aria-label
2. SearchResultsTable: Column headers missing aria-sort
3. CardDetailView: Section headers lack proper semantics
4. CardEditForm: Error messages not associated with inputs
```

#### 6.2 Apply Accessibility Fixes
For each issue:

```typescript
// Issue 1: Button missing aria-label
// ❌ WRONG
<Button startIcon={<FilterIcon />} />  // Icon-only button not accessible

// ✅ CORRECT
<Button 
  startIcon={<FilterIcon />}
  aria-label="Open card filters"
>
  Filter
</Button>

// Or if icon-only:
<IconButton aria-label="Open filters">
  <FilterIcon />
</IconButton>

// Issue 2: Table headers need aria-sort
// ❌ WRONG
<TableCell>Card Number</TableCell>

// ✅ CORRECT
<TableCell 
  sortDirection={sortBy === 'cardNumber' ? sortOrder : false}
  onClick={() => handleSort('cardNumber')}
>
  <TableSortLabel active={sortBy === 'cardNumber'}>
    Card Number
  </TableSortLabel>
</TableCell>

// Issue 3: Error messages not linked to inputs
// ❌ WRONG
<TextField label="Amount" />
<span>Amount must be greater than 0</span>  // Not associated

// ✅ CORRECT
<TextField 
  label="Amount"
  aria-describedby="amount-error"
  error={!!errors.amount}
/>
<Typography id="amount-error" role="alert">
  {errors.amount}
</Typography>
```

#### 6.3 Test Accessibility Fixes
```bash
# Can use axe-core or similar if available
# Or manual testing:
# 1. Tab through components → all interactive elements reachable
# 2. Screen reader test → all labels, descriptions announced
# 3. Color contrast → ratio ≥ 4.5:1 for text
```

**Success Criteria:**
- ✅ All buttons have labels or text
- ✅ Form inputs have associated labels
- ✅ Images have alt text
- ✅ Color contrast sufficient
- ✅ Keyboard navigation works

---

### Phase 7: Fix API & State Management Issues

#### 7.1 Resolve Hardcoded URLs
```typescript
// ❌ WRONG: Hardcoded API URLs
const response = await axios.post('http://localhost:8080/api/search', params);

// ✅ CORRECT: Use service layer
import { cardService } from '@/services/api/card-service';
const response = await cardService.search(params);

// Verify all service files exist:
// - src/services/api/card-service.ts ✅
// - src/services/api/direct-deposit-service.ts ✅
// - src/services/api/transaction-service.ts ✅
```

#### 7.2 Complete Redux Integration
Ensure all components using Redux:
```typescript
// ✅ Correct pattern
const dispatch = useAppDispatch();
const { results, loading } = useAppSelector(state => state.cardSearch);

// Wire API calls through Redux thunks
useEffect(() => {
  dispatch(searchCards(searchParams));
}, [searchParams, dispatch]);

// Verify Redux slices exist and have:
// - initialState
// - reducers
// - extraReducers for async thunks
```

#### 7.3 Fix Error Handling
```typescript
// ❌ WRONG: Silent failures
const response = await apiCall();
setResults(response.data);

// ✅ CORRECT: Error handling
try {
  const response = await apiCall();
  setResults(response.data);
} catch (error) {
  showToast('Failed to load results', 'error');
  setError(error.message);
}

// Or with async thunks:
extraReducers: (builder) => {
  builder
    .addCase(searchCards.pending, (state) => {
      state.loading = true;
    })
    .addCase(searchCards.fulfilled, (state, action) => {
      state.loading = false;
      state.results = action.payload;
      state.error = null;
    })
    .addCase(searchCards.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
}
```

**Success Criteria:**
- ✅ No hardcoded URLs in components
- ✅ All API calls through service layer
- ✅ Redux slices properly wired
- ✅ Error handling present everywhere
- ✅ Loading states managed

---

### Phase 8: Re-run Full Review Checklist

After all fixes, run complete review cycle:

#### 8.1 Quality Gate Checks
```bash
# TypeScript
npm run type-check

# ESLint/Prettier
npm run lint
npm run format:check

# Tests
npm run test -- --coverage

# Build
npm run build

# Routing (manual)
npm run dev
# Test each route in browser
```

#### 8.2 Update Report
```markdown
# Integration Issue Resolution Report

**Date:** 2026-03-10  
**Issues Found:** 12  
**Issues Fixed:** 11  
**Issues Remaining:** 1 (non-blocking)  

## Fixed Issues
✅ TypeScript: 3 errors fixed (type definitions added)
✅ ESLint: 5 violations fixed (imports reorganized, class→arrow functions)
✅ Tests: 4 failures fixed (queries corrected, mocks added)
✅ Build: 2 errors fixed (missing imports, unused code)
✅ Accessibility: 3 issues fixed (ARIA labels, error associations)
✅ API: 2 hardcoded URLs replaced with service calls
✅ Redux: 1 missing slice created (directDepositSlice)

## Remaining Issues
⚠️ BulkActionsPanel: Coverage 72% (target 80%)
  → Recommendation: Add 2-3 more test cases in next iteration

## Final Quality Gate Results
| Gate | Status | Notes |
|------|--------|-------|
| TypeScript | ✅ PASS | 0 errors |
| ESLint | ✅ PASS | 0 violations |
| Tests | ✅ PASS | 145/150 passing, 82% coverage |
| Build | ✅ PASS | 430KB bundle |
| Accessibility | ✅ PASS | All critical issues fixed |
| Routing | ✅ PASS | All routes tested |
| API Integration | ✅ PASS | All services wired |

## Status: ✅ READY FOR MERGE
```

---

### Phase 9: Commit Fixes

#### 9.1 Stage Changes
```bash
# Review all changes
git status

# Stage specific files or all
git add src/
git add package.json (if deps added)
```

#### 9.2 Commit with Clear Message
```bash
git commit -m "fix: resolve code review issues from integration

- Fix: Add CardSearchResult and CardSearchFilters types to src/types/index.ts
- Fix: Convert DirectDepositModal from class to arrow function component
- Fix: Reorganize imports to follow Airbnb style guide (React, 3rd-party, @/, styles)
- Fix: Update CardSearch and CardEditForm tests with proper RTL queries
- Fix: Add missing aria-labels to 3 buttons (Filter, Actions, Confirm)
- Fix: Add aria-describedby and aria-invalid to form error messages
- Fix: Replace hardcoded API URLs with cardService and directDepositService calls
- Fix: Create directDepositSlice Redux slice and wire to component
- Fix: Add error handling in all async operations
- Fix: Improve BulkActionsPanel test coverage (added 4 new test cases)
- Chore: Run Prettier formatting on all modified files

Results:
- TypeScript: 0 errors
- ESLint: 0 violations
- Tests: 145/150 passing, 82% coverage
- Build: 430KB, successful

All quality gates now passing. Ready for review/merge.
"

# Push to feature branch
git push origin feature/integrate-ux-screens
```

---

## Success Criteria

✅ Agent succeeded when:
1. All TypeScript errors resolved (exit code 0)
2. All ESLint violations fixed (0 errors)
3. All tests passing (0 failures, coverage ≥ 80%)
4. Build succeeds (exit code 0, bundle < 500KB)
5. Accessibility issues resolved
6. API calls use service layer (no hardcoded URLs)
7. Redux properly wired
8. Error handling present
9. Code review report updated with "READY FOR MERGE"
10. Changes committed and pushed

❌ Agent halted when:
- Unable to resolve blocker (requires user intervention)
- Breaking changes introduced by fixes
- Test failures persist after multiple fix attempts
- Build still failing after dependency updates

---

## Inputs Expected

User should provide:
- ✅ Code Review Report with identified issues
- ✅ Test failure logs (if available)
- ✅ TypeScript/ESLint error reports (if available)
- ✅ Green light to proceed with automated fixes

Agent outputs:
- Fixed component, test, and Redux files
- Updated Issue Resolution Report
- All quality gates passing
- Feature branch ready for merge review

