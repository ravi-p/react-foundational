---
name: scaffold_ux_components
description: "Scaffold React components from user stories (greenfield - no existing screens)"
---

# Scaffold UX Components Agent (Generic)

> **Purpose:** Autonomously scaffold new React components from user stories when no screens exist yet. Generates TypeScript components, routing, state management, API services, and tests based on configuration.
>
> **Input:**
> - Configuration file: `.github/agents/conf/scaffold_ux_components.conf.json`
> - User stories with component specifications
> - Component requirements (props, state, APIs)
>
> **Output:**
> - React functional components (src/components/, src/pages/)
> - TypeScript interfaces and types
> - Redux slices (if configured)
> - API service stubs (if configured)
> - Route configuration (if pages specified)
> - Component tests (Jest + React Testing Library)
> - Scaffolding summary report
>
> **Prerequisites:**
> - Configuration file exists and is valid
> - User stories defined with component specs
> - Project structure follows React standards

---

## Agent Instructions

### Mission
Generate a complete set of scaffolded React components from user stories and specifications. Create well-typed, tested, and properly structured components ready for implementation. Configuration-driven approach ensures generic operation across any project.

---

### Phase 1: Load and Validate Configuration

#### 1.1 Read Configuration
```bash
# Read config file
cat .github/agents/conf/scaffold_ux_components.conf.json
```

**Extract:**
- Project name and description
- Component specifications (name, type, description, props, state, APIs)
- User story mappings
- Feature flags (generate Redux, generate tests, etc.)
- Output directories

#### 1.2 Validate Configuration
```bash
# Check required fields
jq 'has("projectName") and has("components")' .github/agents/conf/scaffold_ux_components.conf.json
```

**Required Fields:**
- `projectName` — Project identifier
- `components` — Array of component specifications

**Expected Structure:**
```json
{
  "projectName": "string",
  "components": [
    {
      "name": "string",
      "type": "page|component",
      "description": "string",
      "userStories": ["US-01", "US-02"],
      "props": ["prop1: Type1", "prop2: Type2"],
      "state": ["state1: Type1"],
      "apis": ["serviceName"]
    }
  ],
  "generateRedux": true,
  "generateTests": true,
  "generateServices": true
}
```

#### 1.3 Alert on Issues
```
⚠️ If config missing or invalid → Exit with helpful error
⚠️ If component specs incomplete → Continue with defaults
⚠️ If API services not configured but referenced → Generate stubs
```

---

### Phase 2: Plan Component Generation

#### 2.1 Analyze Component Specifications
For each component in config:

```
Component: [name]
├── Type: [page|component]
├── Props: [count]
├── State: [count]
├── APIs: [count]
├── User Stories: [IDs]
└── Tests: [required|optional]
```

**Categorize Components:**
- **Pages** (routes needed): type == "page"
- **Shared Components** (reusable): type == "component"
- **Complex Components** (Redux needed): hasState && generateRedux == true

#### 2.2 Create Generation Plan
```markdown
## Scaffolding Plan

### Pages to Create
- [PageName] → src/pages/[page-name].tsx
- [PageName] → src/pages/[page-name].test.tsx

### Components to Create
- [ComponentName] → src/components/[component-name]/[ComponentName].tsx
- [ComponentName] → src/components/[component-name]/[ComponentName].test.tsx

### Redux Slices (if enabled)
- [sliceName] → src/store/slices/[slice-name].ts

### API Services (if enabled)
- [serviceName] → src/services/api/[service-name].ts

### Routes to Add
- [path] → [ComponentName]
```

---

### Phase 3: Generate Component Files

#### 3.1 Create Page Components
For each component with `type: "page"`:

```bash
# Create directory
mkdir -p src/pages

# Generate component file
cat > src/pages/[page-name].tsx << 'EOF'
import React from 'react';
import { Box, Typography } from '@mui/material';

interface [ComponentName]Props {
  // Props from config
}

const [ComponentName]: React.FC<[ComponentName]Props> = () => {
  return (
    <Box>
      <Typography variant="h4">[Component Description]</Typography>
      {/* TODO: Implement component */}
    </Box>
  );
};

export default [ComponentName];
EOF
```

**Template Structure:**
```typescript
import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface [ComponentName]Props {
  // From config: props
}

const [ComponentName]: React.FC<[ComponentName]Props> = (props) => {
  // From config: state
  const [loading, setLoading] = useState(false);
  
  return (
    <Box>
      <Typography variant="h4">[Description from config]</Typography>
      {/* Implementation placeholder */}
    </Box>
  );
};

export default [ComponentName];
```

**Pass Criteria:**
- ✅ File created with correct naming (kebab-case file, PascalCase component)
- ✅ React.FC typing present
- ✅ Props interface defined
- ✅ All state variables declared
- ✅ Imports follow project standards (@/ aliases, MUI first)

#### 3.2 Create Shared Components
For each component with `type: "component"`:

```bash
# Create component directory
mkdir -p src/components/[component-name]

# Generate component file
cat > src/components/[component-name]/[ComponentName].tsx << 'EOF'
import React from 'react';
import { Box } from '@mui/material';

interface [ComponentName]Props {
  // Props from config
}

const [ComponentName]: React.FC<[ComponentName]Props> = (props) => {
  return (
    <Box>
      {/* TODO: Implement */}
    </Box>
  );
};

export default [ComponentName];
EOF
```

**Structure:**
```
src/components/[component-name]/
├── [ComponentName].tsx
├── [ComponentName].test.tsx
└── index.ts (export)
```

#### 3.3 Create Component Exports
```bash
# Create index.ts for each component
cat > src/components/[component-name]/index.ts << 'EOF'
export { default as [ComponentName] } from './[ComponentName]';
export type { [ComponentName]Props } from './[ComponentName]';
EOF
```

---

### Phase 4: Create TypeScript Interfaces

#### 4.1 Generate Props Interfaces
For each component:

```typescript
// From config props: ["userId: string", "onSelect: (id: string) => void"]

interface [ComponentName]Props {
  userId: string;
  onSelect: (id: string) => void;
}
```

**File Location:**
- **Pages:** Defined in component file (if simple) or in `src/types/[page-name].ts`
- **Components:** Exported from component file with `Props` suffix

#### 4.2 Generate State Interfaces
If component has state:

```typescript
// From config state: ["user: User", "loading: boolean"]

interface [ComponentName]State {
  user: User;
  loading: boolean;
}
```

#### 4.3 Create Shared Types File
If generating multiple components:

```bash
# Create types file
cat > src/types/scaffold-generated.ts << 'EOF'
// Generated from scaffold_ux_components agent
// DO NOT EDIT MANUALLY - regenerate from config

export interface User { /* ... */ }
export interface LoadingState { /* ... */ }
// ... all inferred types
EOF
```

**Pass Criteria:**
- ✅ All props have types (no `any`)
- ✅ All state variables typed
- ✅ Interfaces exported properly
- ✅ No untyped function parameters

---

### Phase 5: Generate Redux Slices (if enabled)

#### 5.1 Check Config
```bash
jq '.generateRedux' .github/agents/conf/scaffold_ux_components.conf.json
```

If `generateRedux: true` AND component has `state`:

#### 5.2 Create Redux Slice
For each component with state:

```bash
# Create slice file
cat > src/store/slices/[slice-name].ts << 'EOF'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface [SliceName]State {
  // From component config state
}

const initialState: [SliceName]State = {
  // Default values
};

const [sliceName]Slice = createSlice({
  name: '[sliceName]',
  initialState,
  reducers: {
    // TODO: Add reducers
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = [sliceName]Slice.actions;
export default [sliceName]Slice.reducer;
EOF
```

#### 5.3 Create Async Thunk (if APIs referenced)
```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetch[DataName] = createAsyncThunk(
  '[sliceName]/fetch[DataName]',
  async (id: string, { rejectWithValue }) => {
    try {
      // TODO: Call API service
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
```

#### 5.4 Update Store
```typescript
// Add to src/store/store.ts
import [sliceName]Reducer from './slices/[slice-name]';

export const store = configureStore({
  reducer: {
    // ... existing slices
    [sliceName]: [sliceName]Reducer,
  },
});
```

**Pass Criteria:**
- ✅ Slice created with correct name
- ✅ Async thunks for each API call
- ✅ Initial state matches component spec
- ✅ Integrated into store

---

### Phase 6: Generate API Services (if enabled)

#### 6.1 Check Config
```bash
jq '.generateServices' .github/agents/conf/scaffold_ux_components.conf.json
```

#### 6.2 Create Service Files
For each API referenced in config:

```bash
# Create service file
cat > src/services/api/[service-name]-service.ts << 'EOF'
import { axiosInstance } from './axios-instance';

interface [DataType] {
  // TODO: Define data type
}

export const [serviceName] = {
  /**
   * TODO: Add API method
   * GET /api/[endpoint]
   */
  fetch: async (id: string): Promise<[DataType]> => {
    try {
      const response = await axiosInstance.get(`/api/[endpoint]/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add more methods as needed
};
EOF
```

**Structure:**
```typescript
export const [serviceName] = {
  fetch: async (params) => { /* ... */ },
  create: async (data) => { /* ... */ },
  update: async (id, data) => { /* ... */ },
  delete: async (id) => { /* ... */ },
};
```

**Pass Criteria:**
- ✅ Service file uses `axiosInstance`
- ✅ Methods have type signatures
- ✅ Error handling present
- ✅ Comments indicate TODO endpoints

---

### Phase 7: Generate Route Configuration (if pages)

#### 7.1 Identify Page Components
Pages = components with `type: "page"`

#### 7.2 Create Route Entry
```bash
# Read current routes
cat src/routes/route-config.tsx
```

#### 7.3 Add New Routes
For each page:

```typescript
// In src/routes/route-config.tsx

export const routeConfig: Route[] = [
  // ... existing routes
  {
    path: '/[path-from-config]',
    component: [ComponentName],
    userStories: ['US-01', 'US-02'], // From config
    requiresAuth: false, // From config if present
  },
];
```

**Pass Criteria:**
- ✅ All page components have routes
- ✅ Paths are kebab-case
- ✅ Component imports added
- ✅ User story references included

---

### Phase 8: Generate Component Tests

#### 8.1 Check Config
```bash
jq '.generateTests' .github/agents/conf/scaffold_ux_components.conf.json
```

#### 8.2 Create Test Files
For each component:

```bash
# Create test file
cat > src/components/[component-name]/[ComponentName].test.tsx << 'EOF'
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import [ComponentName] from './[ComponentName]';

describe('[ComponentName]', () => {
  const renderComponent = (props = {}) =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <[ComponentName] {...props} />
        </BrowserRouter>
      </Provider>
    );

  it('should render without crashing', () => {
    renderComponent();
    // TODO: Add comprehensive tests
  });

  it('should display correct title', () => {
    renderComponent();
    expect(screen.getByText(/[description]/i)).toBeInTheDocument();
  });

  // TODO: Add more tests
});
EOF
```

**Test Template:**
```typescript
describe('[ComponentName]', () => {
  it('renders correctly', () => { /* ... */ });
  it('handles props correctly', () => { /* ... */ });
  it('handles state changes', () => { /* ... */ });
  it('calls API when mounted', () => { /* ... */ });
  it('handles errors gracefully', () => { /* ... */ });
});
```

**Pass Criteria:**
- ✅ Test file created for each component
- ✅ Basic render test present
- ✅ Redux Provider wrapped (if Redux used)
- ✅ Router Provider wrapped (if routing used)
- ✅ TODO comments for additional tests

---

### Phase 9: Generate Summary Report

#### 9.1 Create Scaffolding Summary
File: `output/SCAFFOLD_SUMMARY.md`

```markdown
# Component Scaffolding Summary

**Date:** [today]
**Project:** [from config.projectName]
**Mode:** Scaffold (greenfield)
**Status:** ✅ SUCCESS

## Components Generated

### Pages
[List each page with path]
- [PageName] → `/[path]` (src/pages/[page-name].tsx)
  - Props: [list]
  - State: [list]
  - User Stories: [US IDs]

### Shared Components
[List each component]
- [ComponentName] → src/components/[component-name]/
  - Props: [list]
  - State: [list]

## Files Created

- **Components:** [count] component files
- **Tests:** [count] test files
- **Redux Slices:** [count] (if enabled)
- **API Services:** [count] (if enabled)
- **Routes:** [count] route entries added

## Redux Integration
- Slices created: [count]
- Integrated into store: ✅/❌
- Async thunks: [count]

## API Services
- Service files created: [count]
- All using axios-instance: ✅/❌

## Routes Added
```typescript
[List all new routes]
```

## Next Steps

1. ✅ Component structure scaffolded
2. ⏳ Implement component logic (in each TODO)
3. ⏳ Add actual API endpoints (in service stubs)
4. ⏳ Implement Redux thunks (in slice stubs)
5. ⏳ Write comprehensive tests (in test stubs)
6. ⏳ Run type checking and linting
7. ⏳ Test components in browser

## TypeScript Check
```bash
npm run type-check
# Expected: 0 errors (or expected TODOs noted)
```

## Linting Check
```bash
npm run lint
# Expected: 0 errors
```

## Build Check
```bash
npm run build
# Expected: Success
```

## Statistics

| Category | Count |
|----------|-------|
| Pages | [n] |
| Components | [n] |
| Test Files | [n] |
| Redux Slices | [n] |
| API Services | [n] |
| Route Entries | [n] |
| Lines of Code Generated | [n] |

## Configuration Used
- Project: [name]
- Generate Redux: [true/false]
- Generate Tests: [true/false]
- Generate Services: [true/false]

Reference: `.github/agents/conf/scaffold_ux_components.conf.json`
```

#### 9.2 Create File Manifest
```bash
# Create manifest of all generated files
cat > output/SCAFFOLD_MANIFEST.json << 'EOF'
{
  "timestamp": "[iso-date]",
  "projectName": "[name]",
  "filesCreated": [
    {
      "type": "component",
      "name": "[ComponentName]",
      "path": "src/components/[component-name]/[ComponentName].tsx",
      "userStories": ["US-01"],
      "hasState": false,
      "hasAPIs": false
    }
  ],
  "slicesCreated": [...],
  "servicesCreated": [...],
  "routesAdded": [...]
}
EOF
```

---

### Phase 10: TypeScript & Code Quality Checks

#### 10.1 Type Checking
```bash
npm run type-check
```

**Expected:**
- ✅ 0 errors (or documented issues)
- ⚠️ Missing function implementations is expected (TODOs)

#### 10.2 Linting
```bash
npm run lint -- src/components/ src/pages/
```

**Expected:**
- ✅ 0 errors
- ⚠️ Missing implementations is expected

#### 10.3 Build
```bash
npm run build
```

**Expected:**
- ✅ Build succeeds
- ✅ No critical warnings

---

## Success Criteria

✅ Agent succeeded when:
1. All component files created with correct structure
2. All TypeScript interfaces defined
3. All test files generated (if enabled)
4. All Redux slices created (if enabled)
5. All API services created (if enabled)
6. Routes added to configuration
7. Type checking passes (with documented TODOs)
8. Summary report generated
9. No build errors

❌ Agent failed/halted when:
- Configuration file invalid or missing
- Required directories don't exist
- TypeScript errors present (not TODOs)
- File creation failed due to permissions
- Syntax errors in generated code

---

## Generated Code Quality Standards

All scaffolded code follows:
- ✅ React 19 + TypeScript (strict)
- ✅ Functional components (React.FC)
- ✅ Arrow function syntax
- ✅ MUI components for layout
- ✅ @/ path aliases (not relative imports)
- ✅ Proper prop typing (no `any`)
- ✅ Redux Toolkit with async thunks
- ✅ Axios for API calls (shared instance)
- ✅ Jest + React Testing Library for tests
- ✅ Airbnb ESLint rules + Prettier formatting

