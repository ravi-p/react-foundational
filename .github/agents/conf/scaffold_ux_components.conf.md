# Scaffold UX Components - Configuration Guide

> This file explains how to configure the `scaffold_ux_components` agent to generate React components from your user stories.
> Create a `.github/agents/conf/scaffold_ux_components.conf.json` file and populate it based on templates below.

---

## Configuration Structure

The agent reads a JSON configuration file that defines:
- Component specifications (name, type, props, state)
- User story mappings
- Feature generation flags (Redux, tests, services)
- API requirements

### Minimal Example

```json
{
  "projectName": "My Project",
  "components": [
    {
      "name": "Dashboard",
      "type": "page",
      "description": "Main dashboard page",
      "userStories": ["US-01"]
    }
  ]
}
```

### Complete Component Specification

```json
{
  "projectName": "My Project",
  "description": "Project description",
  "generateRedux": true,
  "generateTests": true,
  "generateServices": true,
  "components": [
    {
      "name": "UserProfile",
      "type": "page",
      "description": "Display and edit user profile",
      "userStories": ["US-01", "US-02"],
      "props": [
        "userId: string",
        "onSave?: (data: User) => void"
      ],
      "state": [
        "user: User",
        "loading: boolean",
        "error?: string"
      ],
      "apis": [
        "userService"
      ],
      "route": "/profile/:userId",
      "requiresAuth": true
    }
  ]
}
```

---

## Configuration Fields

### Root Level

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `projectName` | string | YES | Unique project identifier |
| `description` | string | NO | Project description |
| `generateRedux` | boolean | NO | Create Redux slices (default: true) |
| `generateTests` | boolean | NO | Create test files (default: true) |
| `generateServices` | boolean | NO | Create API service stubs (default: true) |
| `components` | array | YES | Array of component specs |

### Component Specification

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | YES | Component name (PascalCase) |
| `type` | enum | YES | "page" or "component" |
| `description` | string | YES | What the component does |
| `userStories` | array | NO | ["US-01", "US-02"] |
| `props` | array | NO | ["propName: Type", ...] |
| `state` | array | NO | ["stateName: Type", ...] |
| `apis` | array | NO | API service names to create |
| `route` | string | NO | Route path (pages only) |
| `requiresAuth` | boolean | NO | Requires authentication (default: false) |
| `icon` | string | NO | Material Design icon name |

---

## Example Configurations

### Example 1: E-Commerce Dashboard

```json
{
  "projectName": "E-Commerce Dashboard",
  "description": "Product management and order tracking dashboard",
  "generateRedux": true,
  "generateTests": true,
  "generateServices": true,
  "components": [
    {
      "name": "Dashboard",
      "type": "page",
      "description": "Main dashboard with KPIs",
      "userStories": ["DASH-01"],
      "state": [
        "metrics: DashboardMetrics",
        "loading: boolean"
      ],
      "apis": ["dashboardService"],
      "route": "/dashboard",
      "requiresAuth": true
    },
    {
      "name": "ProductGrid",
      "type": "component",
      "description": "Grid display of products",
      "userStories": ["PROD-01", "PROD-02"],
      "props": [
        "products: Product[]",
        "onSelect: (productId: string) => void",
        "loading?: boolean"
      ],
      "state": [
        "selectedIds: Set<string>"
      ]
    },
    {
      "name": "ProductForm",
      "type": "component",
      "description": "Form to create/edit product",
      "userStories": ["PROD-03"],
      "props": [
        "product?: Product",
        "onSubmit: (data: ProductData) => Promise<void>"
      ],
      "state": [
        "formData: ProductData",
        "validationErrors: ValidationError[],
        "submitting: boolean"
      ],
      "apis": ["productService"]
    },
    {
      "name": "OrderList",
      "type": "component",
      "description": "Table of orders with filtering",
      "userStories": ["ORDER-01"],
      "props": [
        "filters?: OrderFilter"
      ],
      "state": [
        "orders: Order[]",
        "totalCount: number",
        "page: number",
        "pageSize: number"
      ],
      "apis": ["orderService"]
    },
    {
      "name": "OrderDetail",
      "type": "page",
      "description": "Detailed order view and management",
      "userStories": ["ORDER-02"],
      "props": [
        "orderId: string"
      ],
      "state": [
        "order: Order",
        "loading: boolean"
      ],
      "apis": ["orderService"],
      "route": "/orders/:orderId",
      "requiresAuth": true
    }
  ]
}
```

### Example 2: Healthcare Portal

```json
{
  "projectName": "Healthcare Portal",
  "description": "Patient management and appointment scheduling",
  "generateRedux": true,
  "generateTests": true,
  "generateServices": true,
  "components": [
    {
      "name": "PatientRegistry",
      "type": "page",
      "description": "Search and manage patient records",
      "userStories": ["HEALTH-01"],
      "state": [
        "patients: Patient[]",
        "searchQuery: string",
        "totalCount: number"
      ],
      "apis": ["patientService"],
      "route": "/patients",
      "requiresAuth": true
    },
    {
      "name": "PatientForm",
      "type": "component",
      "description": "Register or edit patient information",
      "userStories": ["HEALTH-02"],
      "props": [
        "patient?: Patient",
        "onSubmit: (data: PatientData) => Promise<void>"
      ],
      "state": [
        "formData: PatientData",
        "errors: FieldError[],
        "submitting: boolean"
      ],
      "apis": ["patientService"]
    },
    {
      "name": "AppointmentCalendar",
      "type": "page",
      "description": "Schedule and manage appointments",
      "userStories": ["HEALTH-03"],
      "state": [
        "appointments: Appointment[]",
        "selectedDate: Date",
        "loading: boolean"
      ],
      "apis": ["appointmentService"],
      "route": "/appointments",
      "requiresAuth": true
    },
    {
      "name": "MedicalRecords",
      "type": "page",
      "description": "View and upload medical documents",
      "userStories": ["HEALTH-04"],
      "props": [
        "patientId: string"
      ],
      "state": [
        "records: MedicalRecord[]",
        "uploading: boolean"
      ],
      "apis": ["recordsService"],
      "route": "/records/:patientId",
      "requiresAuth": true
    }
  ]
}
```

### Example 3: SaaS Admin Panel

```json
{
  "projectName": "SaaS Admin Panel",
  "description": "Admin tools for SaaS platform",
  "generateRedux": true,
  "generateTests": true,
  "generateServices": true,
  "components": [
    {
      "name": "AdminDashboard",
      "type": "page",
      "description": "Admin overview and metrics",
      "userStories": ["ADMIN-01"],
      "state": [
        "stats: AdminStats",
        "loading: boolean"
      ],
      "apis": ["adminService"],
      "route": "/admin",
      "requiresAuth": true
    },
    {
      "name": "UserManagement",
      "type": "page",
      "description": "Manage platform users",
      "userStories": ["ADMIN-02"],
      "state": [
        "users: User[]",
        "selectedUser?: User",
        "page: number"
      ],
      "apis": ["userAdminService"],
      "route": "/admin/users",
      "requiresAuth": true
    },
    {
      "name": "UserDetailModal",
      "type": "component",
      "description": "Modal to view/edit user details",
      "userStories": ["ADMIN-03"],
      "props": [
        "user: User",
        "onClose: () => void",
        "onSave?: (user: User) => Promise<void>"
      ],
      "state": [
        "editMode: boolean",
        "saving: boolean"
      ],
      "apis": ["userAdminService"]
    },
    {
      "name": "BillingOverview",
      "type": "page",
      "description": "Billing and subscription management",
      "userStories": ["ADMIN-04"],
      "state": [
        "billingData: BillingInfo",
        "invoices: Invoice[]"
      ],
      "apis": ["billingService"],
      "route": "/admin/billing",
      "requiresAuth": true
    }
  ]
}
```

---

## How to Use

### Step 1: Create Configuration File
```bash
touch .github/agents/conf/scaffold_ux_components.conf.json
```

### Step 2: Copy Template
Choose from examples above and customize for your project.

### Step 3: Define Components
For each component/page you want to scaffold:
- Name (PascalCase)
- Type (page or component)
- Props (TypeScript types)
- State (if managing state)
- APIs (services to create)

### Step 4: Run Agent
```bash
# Agent reads the config and generates components
```

### Step 5: Review Generated Files
```bash
# Check output/SCAFFOLD_SUMMARY.md for details
cat output/SCAFFOLD_SUMMARY.md
```

---

## Props and State Format

### Props Examples

```json
"props": [
  "title: string",
  "count: number",
  "onChangeint: (value: number) => void",
  "data?: User[]",
  "config?: { [key: string]: any }",
  "disabled?: boolean"
]
```

### State Examples

```json
"state": [
  "loading: boolean",
  "user: User | null",
  "errors: string[]",
  "data: Record<string, unknown>"
]
```

---

## Feature Flags

### generateRedux (default: true)
- If true: Creates Redux slices for components with state
- If false: Uses React local state only
- Recommended: true (for consistency)

### generateTests (default: true)
- If true: Creates Jest + RTL test files
- If false: No tests generated
- Recommended: true (for quality)

### generateServices (default: true)
- If true: Creates API service stub files
- If false: No services generated
- Recommended: true (for structure)

---

## Type Definitions

Common types to use in props/state:

```
Primitives: string, number, boolean, null, undefined
Arrays: string[], User[], Record<string, any>[]
Objects: User, Product, { id: string; name: string }
Unions: User | null, 'active' | 'inactive' | 'pending'
Generics: T[], Record<K, V>, Map<K, V>
```

---

## Notes

- Component names must be **PascalCase** (e.g., "UserProfile")
- File names will be **kebab-case** (e.g., "user-profile.tsx")
- Props should include full TypeScript type annotations
- State should include expected data types
- Use "page" for routable components, "component" for reusable
- APIs listed will generate service stubs in `src/services/api/`

