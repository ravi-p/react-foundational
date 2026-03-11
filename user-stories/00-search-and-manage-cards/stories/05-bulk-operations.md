# User Story: Bulk Operations on Selected Cards

**Project:** Card Maintenance System  
**Epic:** Search & Manage Cards  
**Story Points:** 13  
**Assignee:** Frontend Developer  
**Source Flow:** FLOW 5 - Bulk Operations  

## Description
As a card administrator, I want to select multiple cards and perform bulk actions (change status, profile, limits, move cards), so that I can efficiently manage multiple cards at once without performing individual updates.

## Acceptance Criteria (Functional Requirements with Component Names)

### Card Selection Toolbar

#### Checkbox Column
- Checkbox in table header (left side before Card Holder Name)
- "Select All" checkbox toggles all visible rows
- Per-row checkboxes for individual card selection
- Visual feedback: Checkbox appears checked when card selected
- Maintain selection state during table pagination (if applicable)

#### Selection Actions Bar
- **Display Trigger:** Only shown when one or more cards selected
- **Visibility:** Appears above results table
- **Components:**
  - Selection counter: "X cards selected" (display count in real-time)
  - "Select All" button: Selects all cards in full result set (not just visible page)
  - "Clear All" button: Deselects all cards
  - Bulk actions menu (hamburger or dropdown) - see below

### Bulk Actions Menu

#### Menu Display
- **Display Condition:** Only shown when cards selected (disabled/hidden if no selection)
- **Menu Style:** Dropdown menu (MenuButton + MenuItem) or Hamburger menu
- **Menu Options:**
  1. Change Status (Block/Unblock/Enable/Disable)
  2. Change Profile (Executive/Standard/etc.)
  3. Change Cash Limit
  4. Change Fuel Limit
  5. Move Cards (conditional - disabled for Penski brand)

#### Menu Item Conditional Disable
- **"Move Cards" Item:**
  - Check `icdBrand` cookie value at runtime
  - If `icdBrand === "Penski"` → disable menu item with tooltip "Not available for Penski cards"
  - If not Penski → enable menu item

### Bulk Action Modals (Dynamic Based on Action)

#### Change Status Modal
- **Form Fields:**
  - StatusDropdown (single select required)
  - Status options: A (Active), B (Blocked), X (Expired), F (Fraudulent), L (Lost), S (Suspended), D (Deleted)
- **Buttons:**
  - "Apply" button - submits action
  - "Cancel" button - closes modal without action
- **Validation:**
  - Status must be selected (cannot be empty)
  - Cannot change to same status (disable Apply if no change)
- **Error handling:** See API/Data section below

#### Change Profile Modal
- **Form Fields:**
  - ProfileDropdown (single select required)
  - Options: Executive, Standard, Budget, Premium (values from backend)
- **Buttons:** Same as Change Status
- **Validation:** Profile must be selected, cannot change to same profile

#### Change Cash Limit Modal
- **Form Fields:**
  - CurrencyInput for new limit amount
  - Validation: Positive number, max 2 decimals
  - Label: "New Cash Limit"
- **Buttons:** Same as above
- **Validation:** Amount must be valid currency, non-zero, non-negative
- **Error message:** "Enter valid amount (e.g., 5000.00)"

#### Change Fuel Limit Modal
- **Form Fields:**
  - CurrencyInput for new fuel limit
  - Label: "New Fuel Limit"
- **Buttons:** Same as above
- **Validation:** Amount must be valid currency

#### Move Cards Modal (Most Complex)
- **Form Fields:**
  - AccountDropdown (with typeahead search)
    - Typeahead trigger: 2+ characters
    - API: `GET /Blam/accounts/{accountName}`
    - Display: Account name with ID
  - CustomerDropdown (populates after Account selection)
    - Typeahead trigger: 2+ characters
    - API: `GET /Blam/account/{accountId}/customers?search={name}`
    - Depends on: Account selection (disabled until account selected)
    - Display: Customer name with ID
- **Buttons:** "Apply" and "Cancel"
- **Validation:**
  - Account must be selected
  - Customer must be selected
  - Cannot move to same account/customer (disable Apply if no change)

### Modal Container Component (Dialog MUI)

#### Dialog Props & Structure
- **Dialog (MUI):**
  - props: open, onClose, maxWidth="sm", fullWidth
  - Title: "Change [Action Type]" (e.g., "Change Status")
  - Content: Action-specific form fields
  - Actions: Cancel and Apply buttons

#### Modal Control Flow
- **Opening:** User clicks menu item → modal opens with empty form
- **Form Submission:** User fills form → clicks Apply
- **Loading State:** 
  - Show spinner on Apply button
  - Disable Apply button during request
  - Disable Cancel button during request (optional)
  - Show overlay with "Processing..." message
- **Closing:** User clicks Cancel → modal closes without action OR API call completes

### UI Components Required

#### SelectionInfoBar (Container at top)
- **Box (MUI)** for layout
- **Typography (MUI)** for "X cards selected" counter
- **Button (MUI)** for "Select All"
- **Button (MUI)** for "Clear All"
- **Conditional rendering:** Only visible when selectedCards.length > 0
- **Background:** Light gray (#f5f5f5)
- **Padding:** 16px
- **Border bottom:** 1px solid #ddd

#### BulkActionsMenu
- **MenuButton (MUI):**
  - Icon: Three horizontal dots (MoreVert from @mui/icons-material)
  - Disabled when no cards selected
  - Tooltip on hover: "Bulk Actions"
  
- **Menu (MUI):**
  - MenuItem × 5 (one for each action)
  - Props: onClick handlers
  - Conditional disabled state on "Move Cards"
  - Icons for each action (optional but recommended)

#### BulkActionModal Container
- **Dialog (MUI):**
  - DialogTitle: Dynamic title based on action
  - DialogContent: Form content (action-specific)
  - DialogActions: Cancel and Apply buttons
  - onClose handler: Reset form and clear selection (optional)

#### Form Components Inside Modal
- **TextField (MUI)** for currency inputs
- **Select (MUI)** for dropdown selections
- **Autocomplete (MUI)** for typeahead fields (Account, Customer)
- **CircularProgress (MUI)** on Apply button during loading

### API/Data Requirements

#### Change Status Endpoint
- **Endpoint:** `POST /Blam/bulkChangeStatus`
- **Request Format:**
  ```json
  {
    "cardTokens": ["token1", "token2", "token3"],
    "newStatus": "B"
  }
  ```
- **Response Format (Success):**
  ```json
  {
    "status": "SUCCESS",
    "message": "Status changed for 3 cards",
    "data": {
      "successCount": 3,
      "failureCount": 0,
      "failedCards": []
    }
  }
  ```
- **Response Format (Partial Success):**
  ```json
  {
    "status": "PARTIAL_SUCCESS",
    "message": "Status changed for 3 of 5 cards",
    "data": {
      "successCount": 3,
      "failureCount": 2,
      "failedCards": ["token4", "token5"]
    }
  }
  ```

#### Change Profile Endpoint
- **Endpoint:** `POST /Blam/bulkChangeProfile`
- **Request Format:**
  ```json
  {
    "cardTokens": ["token1", "token2", "token3"],
    "newProfile": "Executive"
  }
  ```
- **Response Format:** Same as Change Status

#### Change Cash Limits Endpoint
- **Endpoint:** `POST /Blam/bulkChangeCashLimits`
- **Request Format:**
  ```json
  {
    "cardTokens": ["token1", "token2", "token3"],
    "newLimit": "5000.00"
  }
  ```
- **Response Format:** Same as Change Status

#### Change Fuel Limits Endpoint
- **Endpoint:** `POST /Blam/bulkChangeFuelLimits`
- **Request Format:**
  ```json
  {
    "cardTokens": ["token1", "token2", "token3"],
    "newFuelLimit": "200.00"
  }
  ```
- **Response Format:** Same as Change Status

#### Move Cards Endpoint
- **Endpoint:** `POST /Blam/bulkMoveCards`
- **Request Format:**
  ```json
  {
    "cardTokens": ["token1", "token2", "token3"],
    "accountId": "ACC123",
    "customerId": "CUST456"
  }
  ```
- **Response Format:** Same as Change Status

#### Error Response (HTTP 400/422)
```json
{
  "status": "ERROR",
  "message": "Invalid status code provided",
  "code": "VALIDATION_ERROR"
}
```

#### Error Response (HTTP 500)
```json
{
  "status": "ERROR",
  "message": "An error occurred. Please try again.",
  "code": "INTERNAL_SERVER_ERROR"
}
```

### Success & Error Handling

#### Success Case (All Cards Updated)
- API returns HTTP 200 with successCount = number of selected cards
- Toast displays: "Action applied to 3 cards"
- Modal closes
- Checkboxes cleared (reset selection state)
- Selection bar hidden (no cards selected)
- Search results auto-refresh (trigger search again)
- Results table updated with new values
- User sees changes reflected in table

#### Partial Success (Some Cards Failed)
- API returns HTTP 200 with successCount < total cards
- Toast displays: "Applied to 3 of 5 cards"
- Show expandable alert in modal:
  - "Failed Cards: [list of tokens]"
  - Reason for failure (if provided by server)
- Provide "Retry Failed" button to re-attempt just those cards
- Allow user to close modal and inspect results
- Results auto-refresh to show partial changes

#### API Error (HTTP 400/422 - Validation/Business Logic)
- Modal stays open
- Display error alert in modal: "Invalid status code provided"
- Apply button re-enabled (allow retry)
- Toast does NOT display (error shown in modal)
- User can correct form and retry

#### API Error (HTTP 500 - Server Error)
- Modal stays open
- Display error alert in modal: "An error occurred. Please try again."
- Apply button re-enabled (allow retry)
- Toast displays error summary
- User can retry or cancel

#### Network Timeout
- Modal stays open
- Display error: "Network request timed out"
- Apply button re-enabled
- Suggest user check connection and retry

### Selection State Management
- **Store selected card tokens in Redux or React Context:**
  - `selectedCardTokens: string[]`
  - `isAllSelected: boolean` (tracks if "Select All" was clicked)
  
- **Maintain selection during:**
  - Modal open/close
  - Form field changes
  - Pagination (if table is paginated)

- **Clear selection after:**
  - Successful bulk operation
  - User clicks "Clear All" button
  - User navigates away from search results (optional)

### Disable Conditions
- **Bulk actions menu disabled when:** No cards selected
- **Apply button disabled when:**
  - No form value selected (or all fields empty)
  - Form value same as current (no change)
  - API call in progress
  - Form validation fails
- **Menu item "Move Cards" disabled when:** Cookie `icdBrand === "Penski"`

## Implementation Notes
- Store selected card tokens in Redux slice `bulkOperations` with actions:
  - `addToSelection(token)`
  - `removeFromSelection(token)`
  - `clearSelection()`
  - `selectAll(tokens)`
  
- Use custom hook `useBulkOperations()` to manage state and API calls

- Implement debounced selection change handler (100ms) to avoid excessive re-renders

- Show loading spinner overlay during bulk operation (not just button spinner)

- Toast notifications should persist for 5 seconds (standard duration)

- After successful operation, trigger search refresh automatically:
  - Call `performSearch()` with existing search criteria
  - Or call `/Blam/search` with same original parameters

- Error scenarios to test:
  - User selects cards and closes browser tab (no loss of selection in local state)
  - API timeout during bulk operation
  - Partial success with some cards failing
  - User selects same card multiple times (deduplicate)
  - User moves to unsupported Penski card → warning shown

- Accessibility:
  - ARIA label on menu button: "Open bulk actions menu"
  - Checkbox labels: "Select card [card number for accessibility]"
  - Menu items keyboard accessible: Arrow keys navigate, Enter/Space to select
  - Dialog keyboard accessible: Escape to close, Tab to navigate fields

- Performance:
  - Debounce checkbox changes (100ms) to prevent excessive state updates
  - Use virtualization if result set has 1000+ cards
  - Avoid re-rendering entire table on single checkbox change
