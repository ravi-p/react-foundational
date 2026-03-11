---
name: generate_user_stories
description: "Generate structured user stories for UX Designers and Frontend Developers from the Card Maintenance System user flow document"
---

# User Story Generation Agent

> **Purpose:** Autonomously generate structured user stories from the Card Maintenance System user flow document.
> 
> **Input:** [1_User_Flow_Document.md](../../output/analysis/1_User_Flow_Document.md) - Complete card maintenance flows
> 
> **Output:** Individual user story files in feature-based `user-stories/` folder with metadata tracking
> 
> **Format:** Markdown files following the user story template below + metadata.json updates

## Agent Instructions

### Mission
Parse the user flow document and generate individual user story files for each feature/flow described. Each user story should be complete, actionable, and ready for assignment to UX Designers or Frontend Developers.

### Output Specifications
- **Base Location:** `user-stories/` (root-level folder)
- **Feature-Based Organization:** Stories organized by feature/epic area
  - `user-stories/00-search-and-manage-cards/stories/`
  - `user-stories/01-card-features/stories/`
  - `user-stories/02-administrative-tasks/stories/`
- **File Naming:** `[number]-[story-title].md` (kebab-case, without epic prefix)
  - Example: `01-card-search-interface.md` (stored in feature folder)
- **Metadata Updates:** Update `metadata.json` in each feature folder with:
  - Story file path (relative to metadata.json)
  - Story title and description
  - Initial status: "pending"
  - Hash: null (will be calculated by publish agent)
  - synced_at: null (will be set after Jira publish)
- **File Structure:** One user story per file
- **Format:** Follow the template below exactly

### Processing Steps
1. Read `output/analysis/1_User_Flow_Document.md`
2. Identify each discrete FLOW and break into granular user stories
3. Map each story to an Epic from the flow document
4. Determine target feature folder based on epic:
   - "Search & Manage Cards" → `user-stories/00-search-and-manage-cards/stories/`
   - "Card Features" → `user-stories/01-card-features/stories/`
   - "Administrative Tasks" → `user-stories/02-administrative-tasks/stories/`
5. Estimate story points (3, 5, 8, or 13)
6. Generate markdown files in appropriate feature folder with new naming (no epic prefix)
7. Update feature's `metadata.json` file with story entry:
   - Set file path pointing to stories/ subfolder
   - Set status to "pending"
   - Set hash to null
   - Set synced_at to null
   - Include title and description
8. Include all sections: Description, Acceptance Criteria, API Requirements, Implementation Notes
9. Cross-reference the source flow document for traceability

## User Story Template

```markdown
# User Story: [Story Title]

**Project:** Card Maintenance System  
**Epic:** [Epic Name]  
**Story Points:** [1-13]  
**Assignee:** [UX Designer / Frontend Developer]  
**Source Flow:** [Reference to flow document section]  

## Description
As a [USER_ROLE], I want to [ACTION], so that [BENEFIT]

## Acceptance Criteria (Functional Requirements with Component Names)

### Input Field / Component Name
- **Validation Rules:**
  - Rule 1
  - Rule 2
  - Rule 3

### Validation Indicators
- Visual feedback type (error/success/warning)
- Message display location
- Error message format

### UI Components Required
- Component 1
- Component 2
- Component 3

### API/Data Requirements
- Endpoint: `/path/endpoint`
- Request/Response format
- Error handling

## Implementation Notes
[Additional technical notes for developers]
```

---

## Quality Criteria for Generated User Stories

Each generated user story must meet these criteria:

### Content Requirements
- [ ] Clear, concise user story description in "As a... I want... so that..." format
- [ ] All acceptance criteria tied to specific input fields and components
- [ ] Validation rules clearly documented with examples
- [ ] API endpoints explicitly defined with request/response formats
- [ ] Error scenarios covered (both client-side and server-side)
- [ ] MUI component names referenced (not generic "button" or "input")
- [ ] Story points estimated (never leave blank)

### Technical Accuracy
- [ ] Endpoints match `/Blam/` API patterns from flow document
- [ ] Field validation rules are specific: character limits, data types, formats
- [ ] Error messages are user-facing text, not error codes
- [ ] Component props match MUI API (variant, size, color, etc.)
- [ ] Accessibility requirements included (ARIA labels, keyboard navigation)

### Format Compliance
- [ ] File naming follows: `[number]-[epic]-[story].md`
- [ ] All files placed in `output/user_stories/` folder
- [ ] Markdown formatting is clean and consistent
- [ ] Headers use proper hierarchy (H1 for title, H2 for sections, etc.)
- [ ] Code blocks use proper syntax highlighting (json, typescript, etc.)

### Traceability
- [ ] Each story references source flow (FLOW 1, FLOW 2, etc.)
- [ ] Links to 1_User_Flow_Document.md are valid
- [ ] Epic names match flow document epic definitions
- [ ] User roles match flow document user roles

## Naming Convention for Generated Files

```
user-stories/
├── 00-search-and-manage-cards/
│   ├── stories/
│   │   ├── 01-card-search-interface.md
│   │   ├── 02-search-results-table.md
│   │   ├── 03-view-card-details.md
│   │   ├── 04-edit-card-information.md
│   │   └── 05-bulk-operations.md
│   ├── epic.md
│   └── metadata.json
├── 01-card-features/
│   ├── stories/
│   │   └── 06-direct-deposit-management.md
│   ├── epic.md
│   └── metadata.json
├── 02-administrative-tasks/
│   ├── stories/
│   │   ├── 07-reset-card-pin.md
│   │   └── 08-view-card-transaction-history.md
│   ├── epic.md
│   └── metadata.json
├── config.json
├── metadata.template.json
└── README.md
```

**Pattern:** 
- Story files: `[sequence-no]-[story-title-kebab-case].md` (no epic prefix in filename, organized by folder instead)
- Metadata location: Each feature folder contains `metadata.json` tracking all stories in that epic
- Configuration: Root-level `config.json` provides feature mapping and overview

---

### User Story 1: Card Search Interface

```
Project: Card Maintenance System
Epic: Search & Manage Cards
Story Points: 5
Assignee: UX Designer / Frontend Developer

# User Story: Display Card Search Interface with Filters

## Description
As a card administrator, I want to have a searchable interface with filters (Account, Customer, Card Status, Sort), so that I can quickly find specific cards in the system.

## Acceptance Criteria (Functional Requirements with Component Names)

### Search Input Field
- **Validation Rules:**
  - Minimum 2 characters required
  - Accepts: Card number, First name, Last name, Employee ID, Unit number
  - Real-time validation on input

### Validation Indicators
- Error message: "Search criteria must be at least 2 characters"
- Display location: Below search input field
- Visual state: Disabled search button until minimum characters entered

### Filter Dropdown Components
- **Account Filter Dropdown**
  - Typeahead search enabled
  - Minimum 2 characters to trigger autocomplete
  - API: `/Blam/accounts/{accountName}`
  - Display format: Account name with ID in subtitle
  
- **Customer Filter Dropdown**
  - Populates after Account selection
  - API: `/Blam/account/{accountId}/customers?search={name}`
  - Typeahead search with 2+ character trigger
  
- **Card Status Dropdown**
  - Status values: A (Active), B (Blocked), X (Expired), F (Fraudulent), L (Lost), S (Suspended), D (Deleted)
  
- **Sort Options Dropdown**
  - Options: first_name, last_name, card_number, employee_number, unit_number, status

### UI Components Required
- SearchBar (TextField MUI)
  - onChange handler with validation
  - minLength={2}
  - placeholder="Card number, name, or ID"
  
- FilterPanel (Collapsible Container)
  - FilterDropdown × 3 (Account, Customer, Status)
  - SortDropdown
  - FilterButton (toggle visibility)
  
- SearchButton
  - onClick handler triggers search
  - Disabled state when validation fails
  
- ProgressOverlay
  - Delay: 750ms before display
  - Show during API request

### API/Data Requirements
- **Search Endpoint:** `POST /Blam/search`
- **Request Format:**
  ```json
  {
    "action": "SearchAction",
    "searchCriteria": "string",
    "filterByValue": "status_code",
    "filterByType": "status",
    "filterByAccount": "account_id",
    "filterByCust": "customer_id",
    "sortBy": "field_name"
  }
  ```
- **Response Format:** `SearchResponseJsonable[]`
- **Error Handling:** Display generic error, log to console

## Implementation Notes
- Use React Context or Redux for search state
- Debounce autocomplete calls (300ms)
- Cache previous search results for UX
- Publish EVENT_NEW_CARDS on successful search
```

---

### User Story 2: Search Results Table

```
Project: Card Maintenance System
Epic: Search & Manage Cards
Story Points: 3
Assignee: UX Designer / Frontend Developer

# User Story: Display Search Results in Sortable Table

## Description
As a card administrator, I want to view search results in a sortable table with card details, so that I can quickly review and select cards for further actions.

## Acceptance Criteria (Functional Requirements with Component Names)

### Results Table Component
- **Table Columns:**
  - Checkbox (bulk selection)
  - Card Holder Name
  - Account Code
  - Card Status
  - Employee ID
  - Unit Number

### Validation Indicators
- Empty state message: "No cards found"
- Result count: "Search Results: X cards found"
- Success visual: Table populated with data

### UI Components Required
- DataTable (MUI Table)
  - Sortable columns
  - Sticky header
  - Hover effects for row selection
  
- Checkbox (bulk selection in header)
  - "Select All" functionality
  - "Clear All" functionality
  - Selection counter display
  
- TableRow
  - onClick handler → navigate to card details
  - Hover state → highlight for click visibility

### API/Data Requirements
- **Response Data:** `SearchResponseJsonable[]`
- **Data Mapping:**
  - Card token → used for detail page navigation
  - Display fields: name, account, status, employee_id, unit_number

## Implementation Notes
- Virtualize table for performance (if 1000+ rows)
- Store selected card tokens in state for bulk operations
- Publish cardSelected event on row click
- Filter results client-side when possible
```

---

### User Story 3: View Card Details (Read-Only)

```
Project: Card Maintenance System
Epic: Search & Manage Cards
Story Points: 8
Assignee: UX Designer / Frontend Developer

# User Story: Display Card Details with Conditional Sections

## Description
As a card administrator, I want to view comprehensive card details organized in sections (Basic Info, Holder Info, Limits, History), so that I can understand the complete card profile and make informed decisions.

## Acceptance Criteria (Functional Requirements with Component Names)

### Card Header Component
- Card number display: Masked format "XXXXXX****1234"
- Eye icon toggle: Show/hide full card number
- Cardholder name display
- Card status badge

### Detail Sections (Conditional Display)
- **Basic Info Section** (always visible)
  - Fields: Card Number, First Name, Last Name, DOB, SSN Last 4, Employee ID, Status, Profile, MCC Controls
  - All read-only by default
  - Edit button visible
  
- **CIP Data Section** (if card type = Proprietary/Master/OnRoad)
- **Driven Data Section** (if card type = Proprietary/Master/OnRoad)
- **Network Restrictions Section** (always visible)
- **Cash Limits Section** (if applicable)
- **Fuel Limits Section** (if OnRoad)
- **Direct Deposit Section** (if applicable)
- **Transaction History Section** (always visible)
- **Recent Updates Section** (audit trail)

### UI Components Required
- CardHeader
  - Typography (MUI) for masked card number
  - IconButton (eye icon) for toggle
  - Status Badge
  
- DetailSection (Reusable Container)
  - Props: title, fields[], editable, sectionType
  - EditButton (visible in view mode)
  - SaveButton, CancelButton (visible in edit mode)
  - Loading state: "Loading..."
  
- FieldDisplay (Read-only)
  - Props: label, value, masked
  - Typography (MUI) for display
  
- FieldInput (Edit mode)
  - Props: label, value, type, validation
  - TextField (MUI) with validation
  - ToggleButtonGroup (for Y/N fields)

### API/Data Requirements
- **Get Card Template:** `GET /Blam/getCardDetailTemplate?cardToken={token}`
  - Returns: `GetCardDetailResponse` with `CardBasic`
  
- **Section Loaders:** (Asynchronous, parallel)
  - `/Blam/getCardBasic` → publishes `cardBasicLoaded`
  - `/Blam/getCardOwner` → publishes `cardOwnerLoaded`
  - `/Blam/getCardCashLimits` → publishes `cardCashLimitsLoaded`
  - `/Blam/getCardTransactionHistory` → publishes `cardTransactionHistoryLoaded`
  - etc.

### Styling & Accessibility
- Masked fields: Use monospace font for consistency
- Read-only fields: Color = neutral gray
- Icons: Tooltips on hover
- ARIA labels: "Masked card number", "Edit section", etc.

## Implementation Notes
- Load sections asynchronously to prevent blocking
- Subscribe to section-loaded events in DetailSection component
- Use React.memo for heavy sections
- Publish events via Redux or Context API
```

---

### User Story 4: Edit Card Information

```
Project: Card Maintenance System
Epic: Search & Manage Cards
Story Points: 8
Assignee: Frontend Developer

# User Story: Edit Card Information with Validation and Save

## Description
As a card administrator, I want to edit card details in-place with validation, so that I can update card information and have changes persist to the database.

## Acceptance Criteria (Functional Requirements with Component Names)

### Edit Mode Activation
- **Edit Button Click**
  - Hide: Edit button, read-only field displays
  - Show: Save button, Cancel button, input fields
  - Cache: Original values in state (`efr-original-values`)

### Input Field Validation

#### Text Input (First Name, Last Name, Account Name)
- **Validation Rules:**
  - `data-type="A"` (alphanumeric): letters, numbers only
  - Max length: 30 characters
  - Trim whitespace on save
  
#### Numeric Input (Employee ID, Unit Number)
- **Validation Rules:**
  - `data-type="N"` (numeric): digits only
  - Reject decimal points
  - Reject special characters
  
#### Alphanumeric + Special (Address, Notes)
- **Validation Rules:**
  - `data-type="S"` (special): -, /, :, comma, ampersand allowed
  - Max length: 50-100 characters
  
#### Date Field (DOB - MMDD format)
- **Validation Rules:**
  - Exactly 4 digits
  - MM: 01-12 (validate month)
  - DD: 01-31 (validate day)
  - Error: "Valid DOB in MMDD format required"
  
#### Currency Field (Limits, Amounts)
- **Validation Rules:**
  - Numeric with optional decimal (2 places max)
  - No negative values
  - No currency symbols in input (format on display)
  - Error: "Enter valid amount (e.g., 5000.00)"
  
#### Toggle Field (Yes/No, Checkboxes)
- **Validation Rules:**
  - Boolean selection (cannot be empty if required)
  - Business logic dependencies:
    - If "Fuel Gasoline Grades" = Y → must select at least one: Regular, Mid-Plus, or Premium
    - If enabled → disable conflicting options
  - Error: "Must select at least one fuel type"

### Validation Indicators
- **Real-time Validation (on blur):**
  - ✓ Green checkmark: Valid input
  - ✗ Red X: Invalid input
  - Helper text below field: "Enter numeric value"
  
- **Save Button State:**
  - Enabled: All fields valid
  - Disabled: Any field invalid (show tooltip on hover with error summary)
  
- **Visual Feedback:**
  - Invalid field: Red border + error text
  - Valid field: Default border + green checkmark icon

### UI Components Required
- FieldInput (Text/Number)
  - TextField (MUI)
  - Props: type, validation, dataType, maxLength, error, helperText
  - onChange → validateField()
  - onBlur → showValidationIndicator()
  
- DateInput
  - TextField (MUI)
  - Placeholder: "MMDD"
  - Validation: 4 digits, valid month/day
  
- CurrencyInput
  - TextField (MUI)
  - InputAdornment (currency symbol)
  - Numpad input only
  - Formatting: 2 decimal places on display
  
- ToggleField (RadioGroup / Checkbox Group)
  - RadioGroup (MUI) for single selection
  - FormGroup (MUI) for multiple selections
  - Props: options array, value, onChange
  - Conditional enable/disable of options
  
- SaveButton, CancelButton
  - Button (MUI)
  - SaveButton: disabled if validation fails
  - SaveButton: shows spinner during API call
  - CancelButton: onclick → restoreOriginalValues()

### API/Data Requirements
- **Save Endpoint:** Dynamic based on `data-save-url` attribute
  - Examples:
    - `/Blam/updateCardBasic`
    - `/Blam/updateCardOwner`
    - `/Blam/updateCardCashLimits`
  
- **Request Format:**
  ```json
  {
    "cardToken": "token",
    "firstName": "John",
    "lastName": "Doe",
    "dobMMDD": "0123",
    "ssnLast4": "1234",
    "employeeNumber": "EMP12345",
    // ... other fields
  }
  ```
  
- **Response Format:**
  ```json
  {
    "status": "SUCCESS",
    "message": "Card basic information updated",
    "data": { /* updated CardBasic object */ }
  }
  ```
  
- **Error Response:**
  ```json
  {
    "status": "ERROR",
    "message": "Cash limit cannot exceed credit limit ($10,000)",
    "errors": {
      "cashLimit": "Invalid amount"
    }
  }
  ```
  
- **Reload Data:** After successful save, call corresponding GET endpoint:
  - POST `/Blam/updateCardBasic` → GET `/Blam/getCardBasic`
  - Publishes event: `data-view-event="cardBasicLoaded"`

### Error Handling
- **Client-side Validation Fails:**
  - Display error inline
  - Disable Save button
  - User sees highlighted invalid fields
  
- **Server Validation Fails:**
  - Display error message: "Cash limit cannot exceed credit limit ($10,000)"
  - Stay in edit mode
  - User can correct and retry
  
- **Server Error (500):**
  - Display toast: "An error occurred. Please try again."
  - Stay in edit mode
  - Allow retry
  
- **Cancel:**
  - Restore `efr-original-values`
  - Toggle back to read-only mode
  - No server call

## Implementation Notes
- Implement custom validation hook: `useFieldValidation(field, rules)`
- Debounce validation triggers (300ms)
- Show validation indicators only after first blur
- Use FormProvider (React Hook Form) for complex forms
- Log all validation errors to console for debugging
- After save, auto-refresh search results if search is active
```

---

### User Story 5: Bulk Operations

```
Project: Card Maintenance System
Epic: Search & Manage Cards
Story Points: 13
Assignee: UX Designer / Frontend Developer

# User Story: Perform Bulk Operations on Selected Cards

## Description
As a card administrator, I want to select multiple cards and perform bulk actions (change status, profile, limits, move cards), so that I can efficiently manage multiple cards at once.

## Acceptance Criteria (Functional Requirements with Component Names)

### Card Selection Toolbar
- **Checkbox Column** (in search results table)
  - Select individual cards
  - "Select All" checkbox (in table header)
  - "Clear All" button
  - Selection counter: "3 cards selected"
  - Display only when results shown

### Bulk Actions Menu
- **Display Condition:** Only shown when cards selected
- **Action Options:**
  1. Change Status (Block/Unblock/Enable/Disable)
  2. Change Profile (Executive/Standard/etc.)
  3. Change Cash Limit
  4. Change Fuel Limit
  5. Move Cards (non-Penski brands only, check `icdBrand` cookie)

### UI Components Required
- SelectionInfoBar
  - Display: "X cards selected"
  - Buttons: "Select All", "Clear All"
  - Position: Above results table
  
- BulkActionsMenu (Hamburger/Dropdown)
  - MenuButton (MUI)
  - MenuItem × 5 (one for each action)
  - Conditional disable: "Move Cards" if `icdBrand === "Penski"`
  - onClick → openBulkActionModal(action)
  
- BulkActionModal (Dynamic based on action)
  - **Change Status Modal:**
    - StatusDropdown (single select)
    - "Apply" button
    
  - **Change Profile Modal:**
    - ProfileDropdown (single select)
    - "Apply" button
    
  - **Change Limits Modal:**
    - CountdownInput (currency)
    - "Apply" button
    
  - **Move Cards Modal:**
    - AccountDropdown (with typeahead)
    - CustomerDropdown (populates after Account select)
    - "Apply" button

### API/Data Requirements
- **Change Status:** `POST /Blam/bulkChangeStatus`
  ```json
  {
    "cardTokens": ["token1", "token2", "token3"],
    "newStatus": "B"
  }
  ```
  
- **Change Profile:** `POST /Blam/bulkChangeProfile`
  ```json
  {
    "cardTokens": ["token1", "token2", "token3"],
    "newProfile": "Executive"
  }
  ```
  
- **Change Cash Limits:** `POST /Blam/bulkChangeCashLimits`
  ```json
  {
    "cardTokens": ["token1", "token2", "token3"],
    "newLimit": "5000.00"
  }
  ```
  
- **Change Fuel Limits:** `POST /Blam/bulkChangeFuelLimits`
  ```json
  {
    "cardTokens": ["token1", "token2", "token3"],
    "newFuelLimit": "200.00"
  }
  ```
  
- **Move Cards:** `POST /Blam/bulkMoveCards`
  ```json
  {
    "cardTokens": ["token1", "token2", "token3"],
    "accountId": "ACC123",
    "customerId": "CUST456"
  }
  ```
  
- **Response Format:**
  ```json
  {
    "status": "SUCCESS",
    "message": "Applied to 3 cards",
    "successCount": 3,
    "failureCount": 0
  }
  ```

### Success & Error Handling
- **Success:**
  - Toast: "Action applied to 3 cards"
  - Modal closes
  - Checkboxes cleared
  - Search auto-refreshes
  - Results table updated with changes
  
- **Partial Success:**
  - Toast: "Applied to 3 of 5 cards"
  - Show list of failed card tokens
  - Allow retry for failed cards
  
- **Error:**
  - Toast: "An error occurred. Please try again."
  - Modal stays open
  - Allow retry

## Implementation Notes
- Store selected card tokens in Redux or Context
- Debounce checkbox changes (prevent multiple API calls)
- Show loading spinner on "Apply" button during API call
- Disable bulk actions menu during processing
- Clear selection after successful operation
```

---

### User Story 6: Direct Deposit Management

```
Project: Card Maintenance System
Epic: Card Features
Story Points: 5
Assignee: UX Designer / Frontend Developer

# User Story: Manage Direct Deposit Accounts

## Description
As a card administrator, I want to add, edit, and delete direct deposit accounts for a card, so that cardholders can receive funds via direct deposit.

## Acceptance Criteria (Functional Requirements with Component Names)

### Direct Deposit Table
- **Columns:**
  - Account Number (masked: xxxx1234)
  - Routing Number
  - Account Name
  - Checking Account (Yes/No)
  - Deposit Type (Fixed Amount / Percentage)
  - Amount ($500 / 25%)
  - Status (Active / Pending / Deleted)
  - Actions (Edit, Delete icons)

### UI Components Required
- DirectDepositTable
  - Table (MUI)
  - Rows populated from `/Blam/getCardDirectDeposit`
  - IconButton (edit) → openEditModal(accountId)
  - IconButton (delete) → confirmDelete(accountId)
  
- AddButton
  - Button (MUI, Primary variant)
  - Label: "Add Direct Deposit"
  - onClick → openAddModal()
  
- DirectDepositModal (Add/Edit)
  - TextInput: Account Number
  - TextInput: Routing Number
  - TextInput: Account Name
  - Checkbox: Checking Account
  - Dropdown: Deposit Type [Fixed Amount, Percentage]
  - CurrencyInput: Amount
  - Dropdown: Status [Active, Pending, Deleted]
  - SaveButton, CancelButton

### Input Field Validation

#### Account Number
- **Validation Rules:**
  - Numeric only
  - 8-17 digits typical (varies by bank)
  - Cannot be empty

#### Routing Number (ABA)
- **Validation Rules:**
  - Exactly 9 digits
  - Numeric only
  - Luhn algorithm validation (optional)
  - Error: "Routing number must be 9 digits"

#### Account Name
- **Validation Rules:**
  - Alphanumeric + spaces
  - Max 50 characters
  - Cannot be empty

#### Deposit Type & Amount
- **Validation Rules:**
  - If Fixed Amount: Currency field (max 2 decimal places)
  - If Percentage: 0-100 numeric (1 decimal place)
  - Amount cannot be zero
  - Error: "Enter valid amount"

### API/Data Requirements
- **Get Direct Deposits:** `GET /Blam/getCardDirectDeposit`
  - Response: Array of DirectDepositAccount objects
  
- **Add Direct Deposit:** `POST /Blam/addDirectDeposit`
  ```json
  {
    "cardToken": "token",
    "accountNumber": "****1234",
    "routingNumber": "123456789",
    "accountName": "John Doe Checking",
    "checkingAccount": true,
    "depositType": "Fixed",
    "amount": "500.00"
  }
  ```
  
- **Update Direct Deposit:** `POST /Blam/updateDirectDeposit`
  ```json
  {
    "cardToken": "token",
    "accountId": "id",
    "amount": "600.00",
    "status": "Active"
  }
  ```
  
- **Delete Direct Deposit:** `POST /Blam/deleteDirectDeposit`
  ```json
  {
    "cardToken": "token",
    "accountId": "id"
  }
  ```

### Error Handling
- **Validation Fails:**
  - Display error inline under field
  - Disable Save button
  
- **Server Error:**
  - Toast: "Failed to save direct deposit account"
  - Modal stays open
  
- **Successful Save:**
  - Toast: "Direct deposit account saved"
  - Modal closes
  - Table refreshes via `/Blam/getCardDirectDeposit`

## Implementation Notes
- Mask account number in table display
- Use confirm dialog before delete
- Reload table after each add/edit/delete operation
- Validate ABA routing number format
```

---

## How to Generate User Stories

### Step 1: Identify User Journey from Flow Document
- Review [1_User_Flow_Document.md](../../output/1_User_Flow_Document.md) - Complete card maintenance flows
- Select a specific FLOW (e.g., FLOW 1: Card Search)
- Extract the user action sequence

### Step 2: Break Down into Granular Stories
- Each story = one user-visible feature or component
- Keep story to ~1 week of work (5-8 story points)
- If larger → break into multiple stories

### Step 3: Fill Out Template
1. **Project:** Card Maintenance System
2. **Epic:** Identify from flow document (e.g., "Search & Manage Cards")
3. **Story Points:** Estimate: 3 (simple), 5 (medium), 8 (complex), 13 (very complex)
4. **Assignee:** UX Designer or Frontend Developer (based on complexity)

### Step 4: Write User Story Description
- Format: "As a [ROLE], I want to [ACTION], so that [BENEFIT]"
- Roles: Card Administrator, Regular User, Super User, Cardholder
- Keep concise and user-focused

### Step 5: Define Acceptance Criteria
- **For each input/component:** List validation rules
- **For each field:** Specify data type, format, length
- **For validation:** Define error messages and where they display
- **For API:** Document endpoint, request format, response format
- **For UI:** List MUI components needed + props

### Step 6: Document API Requirements
- Reference endpoint from flow document
- Include request/response JSON format
- Describe error scenarios and handling

### Step 7: Add Implementation Notes
- Performance considerations (virtualization, caching, debouncing)
- Browser compatibility
- Accessibility requirements
- Testing approach

---

## Naming Conventions for Components

Based on project standards from [copilot-instructions.md](../copilot-instructions.md):

| Element | Convention | Example |
|---------|-----------|---------|
| Component files | kebab-case | `card-search.tsx` |
| Component names | PascalCase | `CardSearch` |
| Props interfaces | PascalCase + Props | `CardSearchProps` |
| Hooks | camelCase + use prefix | `useCardSearch` |
| Constants | UPPER_SNAKE_CASE | `MIN_SEARCH_CHARS` |
| API service files | kebab-case | `card-service.ts` |
| Store slices | kebab-case | `card-slice.ts` |
| Validation rules | camelCase | `validateAccountNumber()` |

---

## User Roles & Permissions Reference

From [1_User_Flow_Document.md](../../output/1_User_Flow_Document.md) (see User Roles & Permissions section):

- **Regular User:**
  - Search within assigned accounts/customers
  - View all card details
  - Edit assigned cards
  - Limited bulk operations (no Move Cards)

- **Super User:**
  - Search all accounts/customers
  - Edit any card
  - All bulk operations (including Move Cards)

---

## MUI Components Reference

| Flow Element | MUI Component | Props |
|--------------|--------------|-------|
| Text input | TextField | variant="outlined", size="small", |
| Dropdown | Select | multiple, onChange, options |
| Button | Button | variant="contained", color="primary" |
| Checkbox | Checkbox | checked, onChange |
| Toggle option | ToggleButtonGroup | exclusive, onChange |
| Table | Table + TableHead + TableBody + TableRow + TableCell | size="small", stickyHeader |
| Icon button | IconButton | size="small", color="inherit" |
| Dialog/Modal | Dialog | open, onClose |
| Alert/Message | Alert | severity="error\|success\|warning" |
| Loading | CircularProgress | size="small" / "large" |
| Badge | Badge | badgeContent, color |
| Tooltip | Tooltip | title, placement |

---

## Testing Considerations

For each user story, include test cases for:

1. **Happy Path:**
   - User completes action successfully
   - Server returns success response
   - UI updates correctly

2. **Validation Failures:**
   - Each validation rule (e.g., min length, numeric only)
   - Error message displays
   - Button remains disabled

3. **Server Errors:**
   - 500 error response
   - 401 unauthorized
   - Network timeout

4. **Edge Cases:**
   - Empty results
   - Expired session during action
   - Permission denied
   - Keyboard navigation

---

## Accessibility Requirements

All user stories must include:

- [ ] ARIA labels on inputs: `aria-label="Search card number"`
- [ ] Error associations: `aria-describedby="error-message"`
- [ ] Button labels: `aria-label="Edit card details"`
- [ ] Alt text: Images and icons
- [ ] Keyboard navigation: Tab order, Enter to submit
- [ ] Color contrast: WCAG AA (4.5:1 for text)
- [ ] Focus indicators: Visible outline on interactive elements

---

**END OF DOCUMENT: USER STORY GENERATION AGENT**

---

## Running This Agent

### Invocation
```bash
# Run the generate_user_stories agent
# The agent will read from output/1_User_Flow_Document.md
# and generate files in output/user_stories/
```

### Expected Output
- 8-10 user story markdown files in `output/user_stories/` folder
- Each file follows the template exactly
- All stories include acceptance criteria, API requirements, and implementation notes
- Files are numbered sequentially for easy reference

### Success Criteria
- All flows from 1_User_Flow_Document.md are converted to user stories
- Each story is atomic (one feature per story)
- All stories follow the template format
- No required fields are missing
- References to flow document are valid and traceable

### Troubleshooting
If a generated story is incomplete:
1. Check that source flow has enough detail
2. Verify API endpoints exist in `/Blam/` namespace
3. Ensure component names match MUI library
4. Cross-reference with copilot-instructions.md for naming standards

---
