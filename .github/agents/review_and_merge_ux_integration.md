---
name: review_and_merge_ux_integration
description: "Review, test, and merge UX screen integration into main branch with quality gates and approval workflow"
---

# UX Integration Review & Merge Agent

> **Purpose:** Autonomously review integrated UX screens from the integrate_ux_screens agent, verify quality/tests/accessibility, and safely merge to main branch after approval.
>
> **Input:** 
> - Integration Summary from `output/INTEGRATION_SUMMARY.md`
> - Screen Component Mapping from `output/SCREEN_COMPONENT_MAPPING.md`
> - Git branch with integrated components (feature/integrate-ux-screens)
>
> **Output:** 
> - Code review report with checkpoints
> - Test results and coverage report
> - Accessibility audit findings
> - Approval decision
> - Merge to main branch (if approved)
>
> **Prerequisites:** 
> - Previous agent (integrate_ux_screens) completed successfully
> - Feature branch created with changes
> - User stories and components mapped

---

## Agent Instructions

### Mission
Thoroughly review integrated UX screens for code quality, test coverage, accessibility compliance, and integration correctness. Provide detailed review report and safely merge to main branch only after all quality gates pass.

---

### Phase 1: Pre-Review Preparation

#### 1.1 Verify Integration Completeness
Check that integration agent completed all phases:
```bash
# Check integration artifacts
ls output/INTEGRATION_SUMMARY.md
ls output/SCREEN_COMPONENT_MAPPING.md

# Check components were copied
ls src/components/
ls src/pages/

# Check routing was updated
cat src/routes/route-config.tsx

# Check Redux slices exist
ls src/store/slices/
```

**Expected Output:**
- ✅ Integration summary exists and is recent
- ✅ Screen mapping document present
- ✅ Components in src/components/ and src/pages/
- ✅ Route configuration updated
- ✅ Redux slices created for integrated features

#### 1.2 Understand Changes
Review the integration summary:
```bash
# Read what was integrated
cat output/INTEGRATION_SUMMARY.md

# See component mapping
cat output/SCREEN_COMPONENT_MAPPING.md
```

**Alert conditions:**
- ⚠️ If integration reports incomplete sections (e.g., "Missing US-05")
- ⚠️ If API endpoints are hardcoded or marked "TBD"
- ⚠️ If accessibility issues noted
- ⚠️ If type errors exist

---

### Phase 2: Code Quality Review

#### 2.1 TypeScript Validation
```bash
# Run type checking
npm run type-check

# Or explicit check
npx tsc --noEmit
```

**Pass Criteria:**
- ✅ Zero TypeScript errors
- ✅ All component prop interfaces defined
- ✅ No `any` type usage (except justified)
- ✅ Return types on all functions

**Fail Criteria:**
- ❌ TypeScript errors present
- ❌ Missing prop interface types
- ❌ Untyped props or returns

#### 2.2 ESLint & Code Standards
```bash
# Run linting
npm run lint

# Check for violations
npx eslint src/components/ src/pages/ --report-unused-disable-directives
```

**Pass Criteria:**
- ✅ Zero linting errors
- ✅ All components are arrow functions (not class components)
- ✅ Proper import order (React, 3rd-party, @/, styles)
- ✅ @/ path aliases used (not relative paths)

**Fail Criteria:**
- ❌ ESLint errors or warnings
- ❌ Class components in new files
- ❌ Relative imports like `../../../`
- ❌ Missing or wrong prop typing

#### 2.3 Code Style
```bash
# Check Prettier formatting
npm run format:check

# Auto-fix if needed (optional, for information)
npm run format
```

**Pass Criteria:**
- ✅ Code follows Prettier formatting
- ✅ Consistent indentation and spacing
- ✅ Line length reasonable (<100 chars max)

#### 2.4 Import Path Audit
Review each component file for import consistency:

**Required Pattern:**
```typescript
// ✅ Correct
import { Box, Button } from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { CardSearch } from '@/components/card-search/CardSearch';

// ❌ Wrong - Flag these
import Box from '@mui/material/Box';  // Avoid default imports
import Button from '../Button';        // Use @/ alias
import { api } from '../../../../services/api';  // Use @/
```

**Action Items:**
- List any incorrect import patterns found
- Document which files need fixing
- Note if fix is mandatory or optional

---

### Phase 3: Test Coverage Verification

#### 3.1 Check Test Files Exist
```bash
# List test files for copied components
find src/components -name "*.test.tsx" | head -20
find src/pages -name "*.test.tsx" | head -20
```

**Pass Criteria:**
- ✅ Test files exist for all new components
- ✅ File naming: `ComponentName.test.tsx`
- ✅ Tests co-located with components

**Warn Criteria:**
- ⚠️ Some complex components missing tests (flag for later)
- ⚠️ Test file syntax issues (will fail in next step)

#### 3.2 Run Test Suite
```bash
# Run all tests
npm run test -- --coverage

# Or with watch
npm run test:watch
```

**Pass Criteria:**
- ✅ All tests pass (no failures)
- ✅ Code coverage ≥ 80% for copied components
- ✅ No console errors or warnings during testing

**Fail Criteria:**
- ❌ Test failures (list failing tests)
- ❌ Coverage < 60% for any component
- ❌ Setup errors in test files

#### 3.3 Test Coverage Report
```bash
# Generate coverage report
npm run test:coverage

# Check coverage by file
cat coverage/coverage-summary.json
```

**Review Points:**
- Coverage % for each component
- Lines not covered (identify gaps)
- Branches not tested
- Functions without test cases

**Report Output:**
```
Component Coverage Summary:
- CardSearchInterface: 85% ✅
- SearchResultsTable: 78% ✅
- CardDetailView: 72% ✅
- CardEditForm: 65% ⚠️ (below 80%)
- BulkActionsPanel: 58% ❌ (below 60%)
```

---

### Phase 4: Accessibility Audit

#### 4.1 Manual Accessibility Review
Review each component for WCAG AA compliance:

**Checklist for Each Component:**
- [ ] All buttons have aria-label or visible text
- [ ] Form inputs have associated labels
- [ ] Images have alt text
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Heading hierarchy correct (h1 → h2 → h3, no jumps)
- [ ] Interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] No automated tests (do manual)

**Example Review:**
```markdown
## CardSearchInterface
- ✅ Search button: aria-label="Search for cards"
- ✅ Filter toggle: accessible button
- ✅ Input fields: labels present
- ⚠️ Dropdown options: no aria-selected attribute
- ❌ Filter icon: missing aria-label

## SearchResultsTable
- ✅ Checkbox: accessible with labels
- ⚠️ Sort headers: missing aria-sort
- ❌ Card row interaction: not keyboard accessible
```

#### 4.2 Accessibility Testing Tools
```bash
# Optional: Use axe DevTools or similar
# Run in browser during manual testing
```

**Report Format:**
```
Accessibility Findings:
- Critical Issues: 3 (must fix)
  - Card row not keyboard accessible
  - Missing ARIA labels on 5 buttons
  - Color contrast fails in dark theme
  
- Warnings: 2 (should fix)
  - Sort direction not indicated in aria-attributes
  - Mobile focus order suboptimal
  
- Passed: 15 (good)
  - Form labels properly associated
  - Keyboard navigation works
  - Focus indicators visible
```

---

### Phase 5: Integration Validation

#### 5.1 Routing Test
Test each new route:

**Test Cases:**
```bash
npm run dev

# In browser, test each route:
- /search → CardSearchInterface loads
- /search (with results) → SearchResultsTable displays
- /card/:token → CardDetailView loads with data
- /card/:token (edit mode) → Edit form appears
- /invalid-token → Error handling works
- Back navigation → Works correctly
- Deep linking → Direct URL access works
```

**Pass Criteria:**
- ✅ All routes navigate successfully
- ✅ Components render without errors
- ✅ Breadcrumbs display correctly
- ✅ Back/forward buttons work

**Fail Criteria:**
- ❌ 404 errors on new routes
- ❌ Components fail to render
- ❌ Console errors during navigation

#### 5.2 State Management Verification
Test Redux integration:

**Test Cases:**
```
1. Search page → Type search → Dispatch searchCards thunk
   - Results populate CardSearchSlice ✓
   - Loading state shows spinner ✓
   - Error state displays toast ✓

2. Card detail page → Load card
   - CardDetailSlice updates ✓
   - Sections load async ✓
   - Edit button toggles form ✓

3. Bulk operations → Select cards, apply action
   - SelectedCards array updates ✓
   - Bulk action API called ✓
   - Results refresh ✓
```

**Report:**
```markdown
## Redux State Management
- ✅ cardSearch slice wired correctly
- ✅ cardDetail slice async thunks working
- ✅ Form submission dispatches actions
- ⚠️ Bulk operations: API call not yet implemented
- ❌ Direct deposit: Missing Redux slice
```

#### 5.3 API Service Integration
Verify API calls:

**Checklist:**
- [ ] No hardcoded API URLs in components
- [ ] All API calls use service layer (`cardService`, `directDepositService`)
- [ ] Service files import from `axios-instance`
- [ ] Error handling present (try/catch or thunk rejections)
- [ ] Request/response interceptors working

**Example Audit:**
```typescript
// ✅ Correct
import { cardService } from '@/services/api/card-service';
const results = await cardService.search(params);

// ❌ Wrong - flag these
const results = await axios.post('/Blam/search', {...});
const results = await fetch('http://localhost:8080/api/search');
```

---

### Phase 6: Component-to-User-Story Traceability

#### 6.1 Verify Coverage Matrix
Cross-reference each user story with components:

```markdown
## User Story Coverage

| Story | Required | Implemented | Component | Status |
|-------|----------|-------------|-----------|--------|
| US-01 | Search Interface | ✅ | CardSearchInterface | ✅ Complete |
| US-02 | Results Table | ✅ | SearchResultsTable | ✅ Complete |
| US-03 | Card Details | ✅ | CardDetailView | ✅ Complete |
| US-04 | Edit Card | ✅ | CardEditForm | ✅ Complete |
| US-05 | Bulk Ops | ✅ | BulkActionsPanel | ⚠️ Partial |
| US-06 | Direct Deposit | ✅ | DirectDepositModal | ❌ Missing |
| US-07 | Reset PIN | ✅ | ResetPinButton | ⚠️ Needs API |
| US-08 | Transaction History | ✅ | TransactionHistory | ❌ Missing |
```

**Pass Criteria:**
- ✅ All user stories have corresponding components
- ✅ Component completeness matches story requirements
- ✅ APIs mapped correctly

**Fail Criteria:**
- ❌ Any user story without component
- ❌ Component incomplete for required story
- ❌ API endpoints missing

#### 6.2 Create Traceability Report
```markdown
# Component-to-User-Story Traceability Matrix

## Fully Implemented
- ✅ US-01: CardSearchInterface (search bar, filters, validation)
- ✅ US-02: SearchResultsTable (table, bulk selection, sorting)
- ✅ US-03: CardDetailView (tabs, async loading)
- ✅ US-04: CardEditForm (field validation, save/cancel)

## Partially Implemented
- ⚠️ US-05: BulkActionsPanel (UI present, API calls pending)
- ⚠️ US-07: ResetPinButton (UI present, needs API integration)

## Not Implemented
- ❌ US-06: Direct Deposit (component missing)
- ❌ US-08: Transaction History (component missing)

## Recommendation
- Start integration -> merge
- Create follow-up user stories for US-06, US-08
- Complete API wiring for US-05, US-07 in next phase
```

---

### Phase 7: Build Verification

#### 7.1 Build Production Bundle
```bash
# Build for production
npm run build

# Check for errors
echo "Build exit code: $?"
```

**Pass Criteria:**
- ✅ Build completes successfully (exit code 0)
- ✅ No build warnings (or justified warnings only)
- ✅ Output files generated in `dist/`

**Fail Criteria:**
- ❌ Build fails with errors
- ❌ Build warnings indicate issues
- ❌ Dist folder empty or corrupted

#### 7.2 Bundle Size Check
```bash
# Check bundle size
ls -lh dist/

# Look for size regression
# Compare to baseline (if available from previous build)
```

**Acceptable Ranges:**
- JavaScript bundle: < 500KB (gzipped)
- Total dist: < 1MB
- Max single file: 200KB

---

### Phase 8: Generate Review Report

#### 8.1 Create Comprehensive Review Document
File: `output/CODE_REVIEW_REPORT.md`

```markdown
# UX Screen Integration - Code Review Report

**Date:** 2026-03-10  
**Reviewer:** [Agent Name]  
**Branch:** feature/integrate-ux-screens  
**Status:** ✅ APPROVED / ⚠️ CONDITIONAL / ❌ REJECTED  

## Quality Gates Summary

| Gate | Result | Details |
|------|--------|---------|
| TypeScript | ✅ PASS | 0 errors |
| ESLint | ✅ PASS | 0 violations |
| Tests | ✅ PASS | 95% coverage, 150/150 passing |
| Build | ✅ PASS | 425KB bundle |
| Accessibility | ⚠️ WARN | 2 issues found (minor) |
| Routing | ✅ PASS | All routes working |
| State Mgmt | ✅ PASS | Redux wired correctly |
| API Integration | ⚠️ WARN | 2 APIs still hardcoded |

## Detailed Findings

### ✅ Strengths
- All tests passing with good coverage
- Code follows Airbnb style guide
- Components are properly typed
- Routing structure clean and organized
- Accessibility fundamentals in place

### ⚠️ Areas for Improvement
- Two accessibility issues (ARIA labels) — minor, can be fixed post-merge
- API integration incomplete for 2 endpoints — needs backend team
- Test coverage 72% for CardEditForm — could improve

### ❌ Blockers
- None

## Component Summary
- **Total Components:** 8
- **Pages:** 3
- **Common Components:** 5
- **User Stories Covered:** 6 of 8 (75%)
- **Estimated Completeness:** 75%

## Recommendation
✅ **APPROVED FOR MERGE** with follow-up tasks:
1. Fix accessibility issues (US-06, US-07 scope)
2. Complete API endpoints with backend team
3. Implement missing components (US-06 Direct Deposit, US-08 Transaction History)

## Risk Assessment
- **Overall Risk:** 🟢 LOW
- **Production Impact:** Minimal (new pages, not modifying existing)
- **Rollback Difficulty:** Easy (feature branch isolated)
- **Need Code Review:** ✅ YES (recommended before merge)

## Approval Signature
- [x] TypeScript validation passed
- [x] Tests passing with coverage ≥ 80%
- [x] ESLint/Prettier clean
- [x] Build successful
- [x] Routing verified
- [x] State management working
- [x] Ready for merge
```

#### 8.2 Create Issues for Follow-up
If blockers or critical issues found:

```markdown
## Issues Found During Integration Review

### Issue 1: Direct Deposit Component Missing (US-06)
- Type: Missing Feature
- Severity: High
- User Story: US-06
- Action: Create new component or implement UI

### Issue 2: Transaction History Not Implemented (US-08)
- Type: Missing Feature
- Severity: High
- User Story: US-08
- Action: Create new component or implement UI

### Issue 3: Two REST APIs Not Yet Available (CardService)
- Type: Backend Dependency
- Severity: Medium
- Action: Coordinate with backend team for API release
```

---

### Phase 9: Approval Decision

#### 9.1 Quality Gate Checklist

**MUST PASS (Blockers):**
- [ ] TypeScript: 0 errors
- [ ] Tests: All passing, coverage ≥ 80%
- [ ] Build: Successful (exit code 0)
- [ ] No critical accessibility violations
- [ ] All new routes working

**SHOULD PASS (Highly Recommended):**
- [ ] ESLint: 0 violations
- [ ] Prettier: No formatting needed
- [ ] Test coverage ≥ 80% for new components
- [ ] All user stories with components mapped

**NICE TO HAVE (Non-blocking):**
- [ ] 100% test coverage
- [ ] Zero accessibility warnings
- [ ] All API endpoints implemented
- [ ] Documentation complete

#### 9.2 Decision Logic

```
IF (TypeScript errors > 0) OR (Tests failing) OR (Build failed)
  → REJECT: Must fix blockers

IF (Critical accessibility issues) OR (Routing broken)
  → REJECT: Must fix safety issues

IF (All blockers passed) AND (Coverage ≥ 80%) AND (Build < 500KB)
  → APPROVE: Safe to merge

IF (Minor issues found) AND (All blockers passed)
  → APPROVE WITH CONDITIONS: 
    - Create follow-up issues
    - Document in PR description
    - Note limitations

ELSE
  → HOLD: Wait for resolution
```

---

### Phase 10: Merge to Main

#### 10.1 Pre-merge Verification
```bash
# Final check before merge
git status
git log --oneline -5

# Ensure feature branch is up to date
git fetch origin
git rebase origin/main
```

**Verification:**
- [ ] No merge conflicts
- [ ] Branch is clean and ready
- [ ] All tests still passing after rebase
- [ ] Build still succeeds

#### 10.2 Merge Strategy
```bash
# Create PR (if using GitHub)
# Title: "feat: integrate UX screens for Card Maintenance System"
# Description: Include integration summary and code review results

# Option 1: Squash merge (recommended for clean history)
git checkout main
git pull origin main
git merge --squash feature/integrate-ux-screens
git commit -m "feat: integrate UX screens for Card Maintenance System

- Integrated 8 screen components from UX repository
- Wired routing, state management, and API calls
- Mapped components to user stories (6/8 complete)
- Added accessibility attributes (WCAG AA)
- All tests passing, build successful (425KB)
- Code review approved

See: output/INTEGRATION_SUMMARY.md
See: output/SCREEN_COMPONENT_MAPPING.md
See: output/CODE_REVIEW_REPORT.md

Related user stories: US-01, US-02, US-03, US-04, US-05, US-07
Follow-up needed: US-06 (Direct Deposit), US-08 (Transaction History)
"

# Option 2: Merge with merge commit (preserves feature branch history)
git merge --no-ff feature/integrate-ux-screens

# Option 3: Rebase and fast-forward (linear history, same as squash but keeps original commits)
git rebase main
git checkout main
git merge --ff-only feature/integrate-ux-screens
```

**Recommended:** Squash merge for clean history

#### 10.3 Push to Remote
```bash
# Push to main
git push origin main

# Delete feature branch (optional)
git push origin --delete feature/integrate-ux-screens
git branch -d feature/integrate-ux-screens
```

#### 10.4 Post-merge Verification
```bash
# Verify merge completed
git log --oneline -10

# Confirm main branch has new commits
git show HEAD

# Verify CI/CD passes on main
# (Wait for GitHub Actions or CI pipeline to complete)
```

---

## Success Criteria

✅ Agent succeeded when:
1. All code quality gates passed (TypeScript, ESLint, Tests, Build)
2. Test coverage ≥ 80% for integrated components
3. Routing and navigation working correctly
4. State management properly wired
5. Accessibility audit completed (issues documented)
6. Component-to-user-story mapping verified
7. Code review report generated and documented
8. Successfully merged to main branch
9. No post-merge CI/CD failures

❌ Agent halted when:
- TypeScript or build errors present
- Critical tests failing
- Accessibility violations blocking usability
- Unresolved dependencies or missing components
- User intervention needed for approval

---

## Inputs Expected

User should provide:
- ✅ Integration Summary (`output/INTEGRATION_SUMMARY.md`)
- ✅ Feature branch with integrated components
- ✅ User approval for merge (if required by team policy)

Agent outputs:
- Code Review Report: `output/CODE_REVIEW_REPORT.md`
- Test Coverage Report: `output/TEST_COVERAGE_REPORT.md` (if needed)
- Accessibility Audit: `output/ACCESSIBILITY_AUDIT.md` (if needed)
- Approval/Rejection decision with details
- Merged main branch (if approved)
- Follow-up issues (if applicable)

