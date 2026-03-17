# Review & Merge UX Integration - Configuration Template

> This file defines how to configure the `review_and_merge_ux_integration` agent for your specific project.
> Create a `.github/agents/conf/review_and_merge_ux_integration.conf.md` file in your project and populate it based on this template.

---

## Configuration Structure

The agent uses this configuration to verify integration. Fill in your project-specific details:

### Project Slices & Services

Define the Redux slices and API services that were created during integration:

```json
{
  "reduxSlices": [
    {
      "name": "slice1",
      "description": "Description of what this slice manages",
      "hasThumk": true
    },
    {
      "name": "slice2",
      "description": "Another slice",
      "hasThunk": false
    }
  ],
  "apiServices": [
    {
      "name": "service1",
      "description": "What this service calls"
    },
    {
      "name": "service2",
      "description": "Another service"
    }
  ]
}
```

### User Story Mapping

List the user stories that were integrated and their implementation status:

```json
{
  "userStories": [
    {
      "id": "US-01",
      "title": "Feature Name",
      "status": "Complete",
      "components": ["Component1", "Component2"]
    },
    {
      "id": "US-02",
      "title": "Another Feature",
      "status": "Partial",
      "components": ["Component3"],
      "notes": "API not wired yet"
    },
    {
      "id": "US-03",
      "title": "Missing Feature",
      "status": "Missing",
      "components": []
    }
  ]
}
```

---

## Example Configurations

### Example 1: Card Management System
```json
{
  "projectName": "Card Management System",
  "reduxSlices": [
    {
      "name": "cardSearch",
      "description": "Manages card search results and filters",
      "hasThunk": true
    },
    {
      "name": "cardDetail",
      "description": "Manages selected card details and edit state",
      "hasThunk": true
    },
    {
      "name": "bulkOperations",
      "description": "Manages bulk action selections and result",
      "hasThunk": true
    }
  ],
  "apiServices": [
    {
      "name": "cardService",
      "description": "Search, get, update card information"
    },
    {
      "name": "directDepositService",
      "description": "Manage direct deposit settings"
    },
    {
      "name": "pinService",
      "description": "Reset and manage PIN operations"
    }
  ],
  "userStories": [
    {
      "id": "US-01",
      "title": "Search Cards",
      "status": "Complete",
      "components": ["CardSearchInterface"]
    },
    {
      "id": "US-02",
      "title": "View Results",
      "status": "Complete",
      "components": ["SearchResultsTable"]
    },
    {
      "id": "US-03",
      "title": "Card Details",
      "status": "Complete",
      "components": ["CardDetailView"]
    },
    {
      "id": "US-04",
      "title": "Edit Card",
      "status": "Complete",
      "components": ["CardEditForm"]
    },
    {
      "id": "US-05",
      "title": "Bulk Operations",
      "status": "Partial",
      "components": ["BulkActionsPanel"],
      "notes": "UI complete, API calls pending"
    },
    {
      "id": "US-06",
      "title": "Direct Deposit",
      "status": "Missing",
      "components": [],
      "notes": "Component not yet integrated"
    },
    {
      "id": "US-07",
      "title": "Reset PIN",
      "status": "Partial",
      "components": ["ResetPinButton"],
      "notes": "UI present, needs API integration"
    },
    {
      "id": "US-08",
      "title": "Transaction History",
      "status": "Missing",
      "components": [],
      "notes": "Component not scheduled for this release"
    }
  ]
}
```

### Example 2: E-Commerce Dashboard
```json
{
  "projectName": "E-Commerce Dashboard",
  "reduxSlices": [
    {
      "name": "productCatalog",
      "description": "Product listing and filtering",
      "hasThunk": true
    },
    {
      "name": "orderManagement",
      "description": "Order creating, viewing, and status tracking",
      "hasThunk": true
    },
    {
      "name": "inventory",
      "description": "Stock levels and availability",
      "hasThunk": true
    },
    {
      "name": "analytics",
      "description": "Sales metrics and dashboard KPIs",
      "hasThunk": true
    }
  ],
  "apiServices": [
    {
      "name": "productService",
      "description": "CRUD operations for products"
    },
    {
      "name": "orderService",
      "description": "Order processing and status updates"
    },
    {
      "name": "inventoryService",
      "description": "Stock monitoring and adjustments"
    },
    {
      "name": "analyticsService",
      "description": "Performance metrics and reporting"
    }
  ],
  "userStories": [
    {
      "id": "PROD-01",
      "title": "Product Management",
      "status": "Complete",
      "components": ["ProductGrid", "ProductForm", "ProductDetail"]
    },
    {
      "id": "PROD-02",
      "title": "Order Tracking",
      "status": "Complete",
      "components": ["OrderList", "OrderDetail", "OrderTimeline"]
    },
    {
      "id": "PROD-03",
      "title": "Stock Management",
      "status": "Partial",
      "components": ["InventoryTable"],
      "notes": "Bulk updates not yet implemented"
    },
    {
      "id": "PROD-04",
      "title": "Sales Analytics",
      "status": "Complete",
      "components": ["SalesChart", "MetricsPanel", "ReportGenerator"]
    }
  ]
}
```

### Example 3: Healthcare Admin Portal
```json
{
  "projectName": "Healthcare Admin Portal",
  "reduxSlices": [
    {
      "name": "patientRegistry",
      "description": "Patient records and demographics",
      "hasThunk": true
    },
    {
      "name": "appointments",
      "description": "Appointment scheduling and management",
      "hasThunk": true
    },
    {
      "name": "medicalRecords",
      "description": "Clinical notes, test results, diagnoses",
      "hasThunk": true
    },
    {
      "name": "staffManagement",
      "description": "Provider schedules and credentials",
      "hasThunk": false
    }
  ],
  "apiServices": [
    {
      "name": "patientService",
      "description": "Patient data CRUD operations"
    },
    {
      "name": "appointmentService",
      "description": "Appointment booking and rescheduling"
    },
    {
      "name": "recordsService",
      "description": "Clinical records storage and retrieval"
    },
    {
      "name": "providerService",
      "description": "Provider profile and schedule management"
    }
  ],
  "userStories": [
    {
      "id": "HEALTH-01",
      "title": "Patient Registration",
      "status": "Complete",
      "components": ["PatientForm", "DemographicsEditor", "InsurancePanel"]
    },
    {
      "id": "HEALTH-02",
      "title": "Appointment Booking",
      "status": "Complete",
      "components": ["AppointmentCalendar", "AvailabilityChecker", "ConfirmationDialog"]
    },
    {
      "id": "HEALTH-03",
      "title": "Medical Records",
      "status": "Partial",
      "components": ["RecordViewer", "LabResultsTable"],
      "notes": "Document upload feature pending"
    },
    {
      "id": "HEALTH-04",
      "title": "Provider Management",
      "status": "Complete",
      "components": ["ProviderDirectory", "ScheduleEditor"]
    }
  ]
}
```

---

## How to Use This Configuration

1. **Create the conf file** in your project:
   ```bash
   touch .github/agents/conf/review_and_merge_ux_integration.conf.md
   ```

2. **Fill in your project details** based on the examples above

3. **The agent will read** this configuration during the review phase

4. **In your review report**, the agent will reference:
   - Your Redux slices
   - Your API services
   - Your user story mapping
   - Your implementation status

---

## Minimal Configuration Example

If you want a minimal setup, you can provide just the essentials:

```json
{
  "projectName": "My Project",
  "reduxSlices": [
    { "name": "featureSlice", "description": "Main feature state", "hasThunk": true }
  ],
  "apiServices": [
    { "name": "featureService", "description": "Feature API calls" }
  ],
  "userStories": [
    {
      "id": "US-01",
      "title": "Core Feature",
      "status": "Complete",
      "components": ["FeatureComponent"]
    }
  ]
}
```

---

## Notes

- This file is **project-specific** — each project should have its own configuration
- Store this in `.github/agents/conf/` alongside other agent configurations
- The review agent will fail gracefully if this file is missing (and provide helpful error message)
- Update this configuration whenever new slices, services, or user stories are integrated
