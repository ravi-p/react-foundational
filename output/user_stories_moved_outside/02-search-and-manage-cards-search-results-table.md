# User Story: Search Results Table Display

**Project:** Card Maintenance System  
**Epic:** Search & Manage Cards  
**Story Points:** 3  
**Assignee:** UX Designer / Frontend Developer  
**Source Flow:** FLOW 1 - Card Search (Results Display)  

## Description
As a card administrator, I want to view search results in a sortable table with card details, so that I can quickly review and select cards for further actions.

## Acceptance Criteria (Functional Requirements with Component Names)

### Results Table Component
- **Table Columns:**
  - Checkbox (bulk selection with select-all in header)
  - Card Holder Name
  - Account Code
  - Card Status
  - Employee ID
  - Unit Number
- **Interactions:**
  - Row click navigates to card details page
  - Hover effect highlights row for visibility
  - Columns are sortable (client-side)

### Validation Indicators
- Empty state message: "No cards found" (centered, gray text)
- Result count message: "Search Results: X cards found" (above table)
- Success visual: Table populated with data rows

### UI Components Required
- **DataTable (MUI Table)**
  - Props: stickyHeader, size="small"
  - Sortable columns (click header to toggle sort)
  - Hover effects on rows
  
- **Checkbox (Bulk Selection)**
  - MUI Checkbox in header for "Select All"
  - Per-row checkboxes for individual selection
  - Props: checked, onChange handlers
  - "Select All" affects all visible rows
  
- **TableRow (MUI)**
  - onClick handler → navigate to card details
  - Hover state → highlight (background color)
  - Cursor pointer on hover
  - Props: onClick event with cardToken
  
- **Typography (MUI)**
  - Empty state message: variant="h6"
  - Result count: variant="body2"

### API/Data Requirements
- **Response Data Source:** `SearchResponseJsonable[]` from `/Blam/search`
- **Data Mapping:**
  - Card token → stored for detail page navigation and bulk operations
  - Display fields: name, account_code, status, employee_id, unit_number
  - Status values: A, B, X, F, L, S, D (display with labels)

### Style & Accessibility
- Table scrollable horizontally on mobile
- Alt text for checkboxes: "Select card for bulk operations"
- ARIA labels on sort headers: "Sort by card holder name, ascending"
- Keyboard navigation: Tab to navigate, Space to select checkboxes

## Implementation Notes
- Virtualize table for performance if 1000+ rows using react-window
- Store selected card tokens in Redux or Context state for bulk operations
- Publish `cardSelected` event on row click
- Allow inline sorting (click column header to sort)
- Filter or sort results client-side when possible to reduce API calls
- Maintain selection state during re-renders
- Disable actions during table loading state
