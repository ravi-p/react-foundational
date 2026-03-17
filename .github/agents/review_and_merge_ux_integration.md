---
name: review_and_merge_ux_integration
description: "Review, test, and merge UX screen integration into main branch with quality gates and approval workflow"
---

# UX Integration Review & Merge Agent (Generic)

> **Purpose:** Autonomously review integrated UX screens from the integrate_ux_screens agent, verify quality/tests/accessibility, and safely merge to main branch after approval.
>
> **Input:** 
> - Integration Summary from `output/INTEGRATION_SUMMARY.md`
> - Component Mapping from componentMapping in `ux-integration-config.json`
> - Feature branch with integrated components
> - Configuration file: `ux-integration-config.json`
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
> - User stories and components mapped in config
> - All integration artifacts generated

---

## Agent Instructions

### Mission
Thoroughly review integrated UX screens for code quality, test coverage, accessibility compliance, and integration correctness. Provide detailed review report and safely merge to main branch only after all quality gates pass. Configuration-driven approach ensures generic operation across any project.

---

### Phase 1: Pre-Review Preparation

#### 1.1 Load Configuration
```bash
# Read ux-integration-config.json
cat ux-integration-config.json
```

Extract:
- Project name and description
- Component mapping (count of components, pages)
- Dependencies (React, TypeScript, framework versions)
- API base pattern
- Services configured

#### 1.2 Verify Integration Artifacts
```bash
# Check integration artifacts exist
test -f output/INTEGRATION_SUMMARY.md && echo "✓ Summary found"
```

**Expected Output:**
- ✅ Integration summary exists and is recent (today's date)
- ✅ Component mapping lists all items from config
- ✅ Components copied to src/components/ and src/pages/
- ✅ Route configuration updated in src/routes/
- ✅ Service files created in src/services/api/

#### 1.3 Understand Changes
Read integration artifacts:

```bash
# Read what was integrated
cat output/INTEGRATION_SUMMARY.md
```

**Alert conditions:**
- ⚠️ If integration reports incomplete sections
- ⚠️ If API endpoints are marked "TBD"
- ⚠️ If accessibility issues noted
- ⚠️ If type errors exist

---

### Phase 2: Code Quality Review

#### 2.1 TypeScript Validation
```bash
# Run type checking
npm run type-check
# or
npx tsc --noEmit
```

**Pass Criteria:**
- ✅ Zero TypeScript errors
- ✅ All component prop interfaces defined
- ✅ No untyped props (no `any` except justified)
- ✅ Return types on all functions

**Fail Criteria:**
- ❌ TypeScript errors present
- ❌ Missing prop interface types
- ❌ Untyped props or returns

#### 2.2 ESLint & Code Standards
```bash
# Run linting
npm run lint

# Check violations
npx eslint src/components/ src/pages/ --report-unused-disable-directives
```

**Pass Criteria:**
- ✅ Zero linting errors
- ✅ All components are arrow functions (React.FC)
- ✅ Proper import order (React, 3rd-party, @/, styles)
- ✅ @/ path aliases used (not relative ../paths)

**Fail Criteria:**
- ❌ ESLint errors or warnings
- ❌ Class components in new files
- ❌ Relative imports like `../../../`
- ❌ Incorrect prop typing

#### 2.3 Code Formatting
```bash
# Check Prettier formatting
npm run format:check
```

**Pass Criteria:**
- ✅ Code follows Prettier formatting standards
- ✅ Consistent indentation and spacing
- ✅ Line length within configured limits

#### 2.4 Import Path Audit
Review each copied component file for import consistency:

**Required Pattern:**
```typescript
// ✅ Correct
import { Box, Button } from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { CustomComponent } from '@/components/custom/CustomComponent';

// ❌ Wrong - Flag these
import Box from '@mui/material/Box';
import Component from '../../../components/Component';
```

**Action:**
- List any incorrect import patterns
- Document files needing fixes
- Note if mandatory or optional

---

### Phase 3: Test Coverage Verification

#### 3.1 Check Test Files
```bash
# List test files for copied components
find src/components -name "*.test.tsx"
find src/pages -name "*.test.tsx"
```

**Pass Criteria:**
- ✅ Test files exist (filename matches: ComponentName.test.tsx)
- ✅ Tests co-located with components
- ✅ Test setup valid (no syntax errors)

**Warn Criteria:**
- ⚠️ Complex components with minimal tests (flag for follow-up)
- ⚠️ Test setup issues (will fail in next step)

#### 3.2 Run Test Suite
```bash
# Run all tests with coverage
npm run test -- --coverage

# Verify no failures
npm run test
```

**Pass Criteria:**
- ✅ All tests pass (no failures)
- ✅ Code coverage ≥ 80% for new components
- ✅ No console errors during testing

**Fail Criteria:**
- ❌ Test failures (list failing tests)
- ❌ Coverage < 60% for critical components
- ❌ Setup errors in test files

#### 3.3 Coverage Report
```bash
# Generate coverage detail
npm run test:coverage
```

**Review:**
- Coverage % for each new component
- Identify untested code paths
- Document gaps needing follow-up

---

### Phase 4: Accessibility Audit

#### 4.1 Manual Accessibility Review
For each component in `componentMapping`, review:

**Checklist:**
- [ ] All buttons have aria-label or visible text
- [ ] Form inputs have associated labels
- [ ] Images have alt text
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Heading hierarchy correct (no h1 → h4 jumps)
- [ ] Interactive elements keyboard accessible (Tab, Enter, Arrow keys)
- [ ] Focus indicators visible
- [ ] ARIA attributes correct (aria-live, aria-selected, etc.)

**Report Format:**
```markdown
## [Component Name]
- ✅ Buttons labeled
- ✅ Form fields associated with labels
- ⚠️ Color contrast warning (4.3:1)
- ❌ Missing ARIA attributes on dropdown
```

#### 4.2 Accessibility Summary
Document findings:
```
Critical Issues: [count] (must fix)
Warnings: [count] (should fix)
Passed: [count] (good)
```

**Pass Criteria:**
- ✅ Zero critical accessibility violations
- ✅ WCAG AA compliance for interactive elements

**Fail Criteria:**
- ❌ Critical accessibility violations blocking usability

---

### Phase 5: Integration Validation

#### 5.1 Routing Test
Test all routes from `componentMapping` where `isPage: true`:

**For each route in config:**
```
- Load route directly (deep link)
- Verify component renders without error
- Check breadcrumbs display correctly
- Test back/forward navigation
- Test error scenarios (invalid params)
```

**Pass Criteria:**
- ✅ All routes navigate successfully
- ✅ Components render without console errors
- ✅ No 404 errors on valid routes
- ✅ Navigation flow works

**Fail Criteria:**
- ❌ 404 errors on new routes
- ❌ Components fail to render
- ❌ Navigation errors

#### 5.2 State Management
For each Redux slice defined in `.github/conf/review_and_merge_ux_integration.conf.md`:

**Test Each Slice:**
```
1. For slices with hasThunk=true:
   - Component dispatch action
   - Redux DevTools shows state update
   - Loading state displays correctly
   - Error state handles failures

2. For slices with hasThunk=false:
   - Synchronous actions dispatch
   - State updates immediately
   - No async operations
```

**Verify:**
- [ ] All slices from config created in src/store/slices/
- [ ] Async thunks dispatch and update state correctly
- [ ] State updates visible in Redux DevTools
- [ ] Context providers (if configured) working
- [ ] No state leaks between components

**Report Issues:**
- Missing slices (compare to config)
- Incorrect dispatches
- State not updating
- Async thunks failing

#### 5.3 API Service Integration
For each API service defined in `.github/conf/review_and_merge_ux_integration.conf.md`:

**Verify:**
- [ ] No hardcoded API URLs in components
- [ ] All calls use services from `src/services/api/`
- [ ] Service files import `axios-instance` (uses shared interceptors)
- [ ] Error handling present (try/catch or thunk rejections)
- [ ] Request/response interceptors working

**For Each Service in Config:**
```bash
# Check service file exists
test -f src/services/api/[service-name]-service.ts && echo "✓ Found"

# Verify it imports axios-instance
grep "axios-instance" src/services/api/[service-name]-service.ts

# Check usage in components
grep -r "[service-name]" src/components/ src/pages/
```

**Flag Any:**
- Hardcoded URLs in components
- Direct axios imports (should use service layer)
- Services not using `axios-instance`
- Unhandled errors

---

### Phase 6: Component-to-User-Story Traceability

**Prerequisite:** Read `.github/conf/review_and_merge_ux_integration.conf.md` for user story mapping.

#### 6.1 Coverage Matrix
Cross-reference each user story with components that were actually integrated:

**Process:**
1. Read all user stories from config file
2. For each story, verify the listed components exist in src/components/ or src/pages/
3. Create verification matrix

**Template:**
```
| Story ID | Title | Status in Config | Implemented? | Component | Review Status |
|----------|-------|------------------|--------------|-----------|---------------|
| [ID] | [name] | Complete/Partial/Missing | ✓/✗ | [name] | ✅/⚠️/❌ |
```

**Pass Criteria:**
- ✅ All stories marked "Complete" have components that render
- ✅ All stories marked "Partial" have partially working components with notes
- ✅ Stories marked "Missing" have empty component list (expected)
- ✅ Component file count matches config

**Warn Criteria:**
- ⚠️ Complete story with missing component file
- ⚠️ Component file exists but not mentioned in config
- ⚠️ Status mismatch between config and actual implementation

#### 6.2 Completeness Assessment
Analyze integration completeness based on config:

**Metrics to Calculate:**
- Total components integrated: Count from `componentMapping` in config
- User stories fully implemented: Count of stories with status="Complete"
- User stories partially implemented: Count of stories with status="Partial"
- User stories not implemented: Count of stories with status="Missing"
- Implementation percentage: (Complete + Partial) / Total * 100

**Example Report:**
```
Integration Status Summary
- Total User Stories: 8
- Complete: 4 (50%)
- Partial: 2 (25%)
- Missing: 2 (25%)
- Overall Implementation: 75% (6 of 8)

Components Integrated: 12
- Pages: 4
- Features: 5
- Shared: 3
```

**Decision Threshold:**
- ✅ 80%+ implementation → Ready to merge
- ⚠️ 60-80% implementation → Conditional merge (document limitations)
- ❌ <60% implementation → Hold (too incomplete)

---

### Phase 7: Build Verification

#### 7.1 Production Build
```bash
# Build for production
npm run build

# Check exit code
echo "Build status: $?"
```

**Pass Criteria:**
- ✅ Build succeeds (exit code 0)
- ✅ No critical warnings
- ✅ `dist/` folder created with output

**Fail Criteria:**
- ❌ Build fails
- ❌ Build warnings indicating issues

#### 7.2 Bundle Size Check
```bash
# Check dist size
du -sh dist/
```

**Acceptable:**
- JavaScript bundle: < 500KB (gzipped recommended)
- Total dist: < 1MB

---

### Phase 8: Generate Review Report

#### 8.1 Create Code Review Document
File: `output/CODE_REVIEW_REPORT.md`

**Template:**
```markdown
# UX Screen Integration - Code Review Report

**Date:** [today]
**Project:** [from config.project.name]
**Status:** ✅ APPROVED / ⚠️ CONDITIONAL / ❌ REJECTED

## Quality Gates Summary

| Gate | Result | Details |
|------|--------|---------|
| TypeScript | ✅/⚠️/❌ | [details] |
| ESLint | ✅/⚠️/❌ | [details] |
| Tests | ✅/⚠️/❌ | [% coverage] |
| Build | ✅/⚠️/❌ | [bundle size] |
| Accessibility | ✅/⚠️/❌ | [issues count] |
| Routing | ✅/⚠️/❌ | [working/broken] |
| State Mgmt | ✅/⚠️/❌ | [store integration] |

## Findings

### ✅ Strengths
- [positive observations]

### ⚠️ Areas for Improvement
- [minor issues, non-blocking]

### ❌ Blockers
- [critical issues requiring fix]

## Component Coverage

- **Total Components:** [count]
- **Pages:** [count]
- **Shared Components:** [count]
- **User Stories Covered:** [count]/[total]

## Recommendation
✅ APPROVED / ⚠️ CONDITIONAL / ❌ REJECTED

[Decision and any conditions]
```

#### 8.2 Document Issues Found
If problems found, reference the config and create follow-up items:

**For each issue found:**
```markdown
### Issue: [Title]
- Type: [Bug/Missing Feature/Needs Polish]
- Severity: [Critical/High/Medium/Low]
- Related to: [Story ID from config]
- Action: [What needs to be done]
- Blocking Merge: [Yes/No]
```

**Examples of follow-up issues:**
- Story marked "Complete" but component needs fixes
- Story marked "Partial" with incomplete features
- Story marked "Missing" with deferred components
- API services missing implementations
- Redux slices incomplete or incorrectly configured

---

### Phase 9: Approval Decision

#### 9.1 Quality Gate Checklist

**MUST PASS (Blockers):**
- [ ] TypeScript: 0 errors
- [ ] Tests: All passing
- [ ] Build: Successful (exit 0)
- [ ] No critical accessibility violations
- [ ] Routing: All routes working

**SHOULD PASS (Recommended):**
- [ ] ESLint: 0 violations
- [ ] Prettier: No formatting needed
- [ ] Test coverage ≥ 80% for new components
- [ ] User story coverage ≥ 80%

**NICE TO HAVE:**
- [ ] 100% test coverage
- [ ] Zero accessibility warnings
- [ ] All API endpoints implemented
- [ ] Complete documentation

#### 9.2 Decision Logic

```
IF (TypeScript errors) OR (Tests failing) OR (Build failed)
  → ❌ REJECT: Fix blockers first

IF (Critical accessibility issues)
  → ❌ REJECT: Fix accessibility issues

IF (All blockers passed) AND (Coverage ≥ 80%)
  → ✅ APPROVE: Safe to merge

IF (Minor issues) AND (All blockers passed)
  → ⚠️ CONDITIONAL APPROVE: 
    - Create follow-up issues
    - Note limitations in PR

ELSE
  → 🔴 HOLD: Resolve before merging
```

---

### Phase 10: Merge to Main

#### 10.1 Pre-Merge Checks
```bash
# Verify clean state
git status
git log --oneline -5

# Update from remote
git fetch origin
git rebase origin/main

# Final test
npm run build && npm run test
```

**Verification:**
- [ ] No merge conflicts
- [ ] Tests passing
- [ ] Build succeeding

#### 10.2 Merge
```bash
# Recommended: Squash merge for clean history
git checkout main
git pull origin main
git merge --squash [feature-branch]
git commit -m "feat: integrate UX screens from [project name]

- Integrated [count] components
- [count] pages, [count] shared components
- Mapped to [count]/[total] user stories
- All tests passing
- Build successful

See: output/INTEGRATION_SUMMARY.md
See: output/CODE_REVIEW_REPORT.md
"

git push origin main
```

#### 10.3 Post-Merge Verification
```bash
# Confirm merge
git log --oneline -5

# Monitor CI/CD
# Wait for tests on main branch to pass
```

---

## Success Criteria

✅ Agent succeeded when:
1. All code quality gates passed
2. Test coverage ≥ 80%
3. Build successful
4. Routing working correctly
5. State management verified
6. Accessibility audit completed
7. Code review report generated
8. Merged to main successfully
9. No post-merge CI/CD failures

❌ Agent failed/halted when:
- Build errors
- Critical tests failing
- Accessibility violations blocking usability
- TypeScript errors present


- ✅ All routes navigate successfully
- ✅ Components render without errors
- ✅ Breadcrumbs display correctly
- ✅ Back/forward buttons work

**Fail Criteria:**
- ❌ 404 errors on new routes
- ❌ Components fail to render
- ❌ Console errors during navigation

---

### Phase 6: Component-to-User-Story Traceability



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
- Accessibility issues found — can be addressed post-merge
- Some API endpoints still pending backend work
- Test coverage below 80% in some components — opportunities to improve

### ❌ Blockers
- None (this example shows good state; adjust as needed)

## Component Summary
- **Total Components:** [Count from componentMapping]
- **Pages:** [Count of isPage: true]
- **Shared Components:** [Count of isPage: false]
- **User Stories Covered:** [Complete count] of [Total count]
- **Estimated Completeness:** [Calculate percentage]

## Recommendation
Based on config and actual implementation:
- ✅ If 80%+ coverage and all blockers passed → APPROVED FOR MERGE
- ⚠️ If 60-80% coverage → CONDITIONAL APPROVE (document limitations)
- ❌ If <60% coverage → HOLD (too incomplete)

## Risk Assessment
- **Overall Risk:** [Assess based on completeness]
- **Production Impact:** [Document scope]
- **Rollback Difficulty:** [Easy/Moderate/Hard]
- **Need Code Review:** ✅ YES (recommended before merge)

## Approval Criteria Checklist
- [x] TypeScript validation passed
- [x] Tests passing with coverage ≥ 80% (or documented gaps)
- [x] ESLint/Prettier clean
- [x] Build successful
- [x] Routing verified
- [x] State management working
- [x] Accessibility audit completed
- [x] All blockers resolved
```

#### 8.2 Create Issues for Follow-up
If any issues found (reference config status field):

```markdown
## Issues Found During Integration Review

### Issue: [Title]
- Type: [Bug/Missing Feature/Needs API/Polish]
- Severity: [Critical/High/Medium/Low]
- Related Story: [Story ID from config]
- Action: [What needs to be done]
- Blocking Merge: [Yes/No]

### Issue: [Another issue]
...
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
git commit -m "feat: integrate UX screens from [project-name]

- Integrated [N] screen components from UX repository
- Wired routing, state management, and API calls
- Mapped components to user stories ([X]/[Y] complete)
- Added accessibility attributes (WCAG AA)
- All tests passing, build successful ([size]KB)
- Code review approved

See: output/INTEGRATION_SUMMARY.md
See: output/COMPONENT_MAPPING.md
See: output/CODE_REVIEW_REPORT.md

Related user stories: [IDs from config]
Follow-up needed: [IDs from config if any]
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

