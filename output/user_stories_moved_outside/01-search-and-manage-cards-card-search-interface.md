# User Story: Card Search Interface

**Project:** Card Maintenance System  
**Epic:** Search & Manage Cards  
**Story Points:** 5  
**Assignee:** UX Designer / Frontend Developer  
**Source Flow:** FLOW 1 - Card Search  

## Description
As a card administrator, I want to have a searchable interface with filters (Account, Customer, Card Status, Sort), so that I can quickly find specific cards in the system.

## Acceptance Criteria (Functional Requirements with Component Names)

### Search Input Field
- **Validation Rules:**
  - Minimum 2 characters required
  - Accepts: Card number, First name, Last name, Employee ID, Unit number
  - Real-time validation on input
  - Error message: "Search criteria must be at least 2 characters"

### Validation Indicators
- Error message display location: Below search input field
- Visual state: Disabled search button until minimum characters entered
- Helper text: "Enter card number, name, or ID"

### Filter Dropdown Components

#### Account Filter Dropdown
- Typeahead search enabled
- Minimum 2 characters to trigger autocomplete
- API: `GET /Blam/accounts/{accountName}`
- Display format: Account name with ID
- Required field: No (defaults to "All Accounts")

#### Customer Filter Dropdown
- Populates after Account selection
- API: `GET /Blam/account/{accountId}/customers?search={name}`
- Typeahead search with 2+ character trigger
- Depends on: Account selection
- Display format: Customer name with ID

#### Card Status Dropdown
- Status values: A (Active), B (Blocked), X (Expired), F (Fraudulent), L (Lost), S (Suspended), D (Deleted)
- Single selection
- Optional filter

#### Sort Options Dropdown
- Options: first_name, last_name, card_number, employee_number, unit_number, status
- Default sort: first_name
- Single selection

### UI Components Required
- **SearchBar (TextField MUI)**
  - Props: onChange handler, minLength={2}, placeholder="Card number, name, or ID"
  - variant="outlined"
  - size="small"
  
- **FilterPanel (Collapsible Container)**
  - FilterDropdown × 2 (Account, Customer)
  - StatusDropdown
  - SortDropdown
  - Collapse/Expand button (Filter toggle)
  
- **SearchButton (Button MUI)**
  - onClick handler triggers search
  - Disabled state when validation fails
  - variant="contained"
  - color="primary"
  
- **ProgressOverlay**
  - Delay: 750ms before display
  - Show during API request
  - CircularProgress (MUI) centered
  - Transparent overlay background

### API/Data Requirements
- **Search Endpoint:** `POST /Blam/search`
- **Request Format:**
  ```json
  {
    "action": "SearchAction",
    "searchCriteria": "search_input_string",
    "filterByValue": "status_code",
    "filterByType": "status",
    "filterByAccount": "account_id",
    "filterByCust": "customer_id",
    "sortBy": "field_name"
  }
  ```
- **Response Format:** `SearchResponseJsonable[]` (array of matching cards)
- **Error Handling:** Display generic error toast, log details to console
- **Success Event:** Publish `EVENT_NEW_CARDS` event with results

## Implementation Notes
- Use React Context or Redux for search state management
- Debounce typeahead calls (300ms) to reduce API requests
- Cache previous search results for UX improvement
- Persist last search filters in localStorage or Redux
- Publish `EVENT_NEW_CARDS` on successful search to notify other components
- Show "No cards found" message when results are empty
- Show result count: "Search Results: X cards found"
