# User Story: Manage Direct Deposit Accounts

**Project:** Card Maintenance System  
**Epic:** Card Features  
**Story Points:** 5  
**Assignee:** Frontend Developer  
**Source Flow:** FLOW 4 - Manage Direct Deposit Accounts  

## Description
As a card administrator, I want to add, edit, and delete direct deposit accounts for a card, so that cardholders can receive funds via direct deposit with flexibility in amount allocation.

## Acceptance Criteria (Functional Requirements with Component Names)

### Direct Deposit Table Display

#### Table Columns
- **Account Number:** Masked format (xxxx1234) - last 4 digits visible
- **Routing Number:** Full number (123456789)
- **Account Name:** Account holder name (e.g., "John Doe Checking")
- **Checking Account:** Yes/No indicator
- **Deposit Type:** "Fixed Amount" or "Percentage"
- **Amount:** "$500.00" or "25%" (formatted based on type)
- **Status:** "Active", "Pending", or "Deleted" (with color coding)
- **Actions:** Edit (pencil icon) and Delete (trash icon) buttons

#### Table Interactions
- Table loads data from `/Blam/getCardDirectDeposit` on Section mount
- Rows display without sorting (order from server)
- Empty state: "No direct deposit accounts configured" message
- Loading state: "Loading..." message with spinner

### Add New Direct Deposit Account

#### "Add Direct Deposit" Button
- **Location:** Above table or as floating action button
- **Button Properties:**
  - MUI Button, variant="contained", color="primary"
  - Label: "Add Direct Deposit"
  - Icon: Plus icon (Add from @mui/icons-material)
  - onClick → opens DirectDepositModal in "Add" mode

#### Direct Deposit Modal (Add Mode)
- **Dialog (MUI):**
  - Title: "Add Direct Deposit Account"
  - maxWidth="sm"
  - Fields displayed in form layout
  
- **Form Fields:**
  ```
  Account Number: [________] (input, masked placeholder)
  Routing Number: [________] (input, 9-digit placeholder)
  Account Name: [_____________________] (input)
  Checking Account: ☐ Yes  ☐ No (radio group)
  Deposit Type: [Fixed Amount ▼] (dropdown)
  Amount: [________] (input, currency/percentage based on type)
  Status: [Active ▼] (dropdown)
  ```

#### Form Field Validation

##### Account Number Field
- **Validation Rules:**
  - Numeric only (0-9)
  - Typical length: 8-17 digits (typical for US bank accounts)
  - Cannot be empty
  - Placeholder: "Enter account number"
- **Error Message:** "Enter valid account number (numbers only)"

##### Routing Number (ABA) Field
- **Validation Rules:**
  - Exactly 9 digits
  - Numeric only
  - Luhn algorithm validation (recommended but optional)
  - Cannot be empty
  - Placeholder: "123456789"
- **Error Message:** "Routing number must be exactly 9 digits"

##### Account Name Field
- **Validation Rules:**
  - Alphanumeric + spaces
  - Max 50 characters
  - Cannot be empty
  - Placeholder: "Checking or Savings"
- **Error Message:** "Enter account name (max 50 characters)"

##### Checking Account Checkbox
- **Validation Rules:**
  - Optional field (can be unchecked)
  - Boolean: Yes/No
  - Display as RadioGroup or checkbox
  - Default: Unchecked (No)

##### Deposit Type Dropdown
- **Options:** "Fixed Amount", "Percentage"
- **Default:** "Fixed Amount"
- **Required:** Yes (must select one)
- **onChange Behavior:** Changes Amount field validation/formatting
  - If "Fixed Amount" selected:
    - Amount field label: "Amount ($)"
    - Validation: Currency (0.00 format)
    - Format on blur: To 2 decimal places
  - If "Percentage" selected:
    - Amount field label: "Percentage (%)"
    - Validation: 0.0-100.0 with 1 decimal
    - Range: 0 to 100
- **Error Message:** "Select deposit type"

##### Amount Field (Dynamic Validation)
- **If Fixed Amount Selected:**
  - Input type: text (currency formatting)
  - Regex: `^\d+(\.\d{0,2})?$`
  - Min: $0.01
  - Max: Depends on card limits (business rule)
  - Format on blur: "1234.56" → "1,234.56"
  - Placeholder: "500.00"
  - Error message: "Enter valid amount (e.g., 500.00)"
  
- **If Percentage Selected:**
  - Input type: text (numeric with decimal)
  - Min: 0.0%
  - Max: 100.0%
  - Decimal places: 1
  - Validation: Must be between 0 and 100
  - Placeholder: "25.0"
  - Error message: "Enter percentage between 0 and 100"

- **Cannot be empty:** If required field

##### Status Dropdown
- **Options:** "Active", "Pending", "Deleted"
- **Default:** "Active"
- **Required:** Yes
- **Error Message:** "Select status"

### UI Components Required

#### Add/Edit Modal Components
- **Dialog (MUI):**
  - DialogTitle: Dynamic based on mode (Add/Edit)
  - DialogContent: Form fields
  - DialogActions: "Save" and "Cancel" buttons
  - Props: open, onClose, maxWidth="sm", fullWidth
  
- **TextField (MUI)** × 4 (Account Number, Routing Number, Account Name, Amount):
  - Props: type, placeholder, maxLength, value, onChange, onBlur, error, helperText
  - variant="outlined"
  - size="small"
  - fullWidth
  
- **FormControl (MUI)** for RadioGroup or Checkbox:
  - RadioGroup (for Checking Account)
  - RadioGroup (for Deposit Type)
  - Props: value, onChange
  
- **Select (MUI)** for Deposit Type and Status:
  - Props: value, onChange, options
  
- **FormHelperText (MUI)**:
  - Displays below invalid fields
  - Color: error (red)

#### Table Components
- **Table (MUI):**
  - Props: size="small", stickyHeader={false}
  
- **TableHead, TableBody, TableRow, TableCell (MUI)**:
  - Standard structure
  
- **IconButton (MUI)** × 2:
  - Edit button: Edit icon (PencilIcon)
    - onClick → openModal(directDepositId, "edit", data)
  - Delete button: Delete icon (TrashIcon)
    - onClick → openDeleteConfirmation(directDepositId)
    - Color: error (red)

#### Dialog & Alerts
- **Confirmation Dialog** (Delete Operation):
  - Message: "Delete direct deposit account ending in 1234?"
  - Buttons: "Cancel" and "Delete"
  - OnConfirm: Call DELETE endpoint
  
- **Snackbar/Toast (Notifications):**
  - Success: "Direct deposit account saved"
  - Error: "Failed to save account. [Error message from server]"
  - Delete: "Account deleted successfully"

### API/Data Requirements

#### Get Direct Deposit Accounts
- **Endpoint:** `GET /Blam/getCardDirectDeposit`
- **Request Format:**
  ```json
  {
    "cardToken": "token_value"
  }
  ```
- **Response Format:**
  ```json
  {
    "status": "SUCCESS",
    "data": [
      {
        "accountId": "id1",
        "accountNumber": "****1234",
        "routingNumber": "123456789",
        "accountName": "John Doe Checking",
        "checkingAccount": true,
        "depositType": "Fixed",
        "amount": "500.00",
        "status": "Active"
      },
      {
        "accountId": "id2",
        "accountNumber": "****5678",
        "routingNumber": "987654321",
        "accountName": "Savings Account",
        "checkingAccount": false,
        "depositType": "Percentage",
        "amount": "25.0",
        "status": "Pending"
      }
    ]
  }
  ```

#### Add Direct Deposit Account
- **Endpoint:** `POST /Blam/addDirectDeposit`
- **Request Format:**
  ```json
  {
    "cardToken": "token_value",
    "accountNumber": "****1234",
    "routingNumber": "123456789",
    "accountName": "John Doe Checking",
    "checkingAccount": true,
    "depositType": "Fixed",
    "amount": "500.00",
    "status": "Active"
  }
  ```
- **Response Format (Success - HTTP 200):**
  ```json
  {
    "status": "SUCCESS",
    "message": "Direct deposit account added successfully",
    "data": {
      "accountId": "new_id",
      "accountNumber": "****1234",
      "routingNumber": "123456789",
      "accountName": "John Doe Checking",
      "checkingAccount": true,
      "depositType": "Fixed",
      "amount": "500.00",
      "status": "Active"
    }
  }
  ```
- **Response Format (Validation Error - HTTP 400):**
  ```json
  {
    "status": "ERROR",
    "message": "Validation failed",
    "errors": {
      "routingNumber": "Routing number must be exactly 9 digits",
      "amount": "Amount must be greater than 0"
    }
  }
  ```

#### Update Direct Deposit Account
- **Endpoint:** `POST /Blam/updateDirectDeposit`
- **Request Format:**
  ```json
  {
    "cardToken": "token_value",
    "accountId": "id_to_update",
    "accountNumber": "****1234",
    "routingNumber": "123456789",
    "accountName": "John Doe Checking",
    "checkingAccount": true,
    "depositType": "Fixed",
    "amount": "600.00",
    "status": "Active"
  }
  ```
- **Response Format:** Same as Add (HTTP 200 = success)

#### Delete Direct Deposit Account
- **Endpoint:** `POST /Blam/deleteDirectDeposit`
- **Request Format:**
  ```json
  {
    "cardToken": "token_value",
    "accountId": "id_to_delete"
  }
  ```
- **Response Format (Success - HTTP 200):**
  ```json
  {
    "status": "SUCCESS",
    "message": "Direct deposit account deleted successfully"
  }
  ```
- **Response Format (Error - HTTP 400/500):**
  ```json
  {
    "status": "ERROR",
    "message": "Cannot delete account. [Reason]"
  }
  ```

### Modal Modes: Add vs. Edit

#### Add Mode
- **Title:** "Add Direct Deposit Account"
- **Form Fields:** All empty (no default values)
- **Account Name Field:** No mask in display (doesn't exist yet)
- **Actions:** "Save" button (enabled if valid), "Cancel" button
- **OnSave:** Call `/Blam/addDirectDeposit`
- **OnSuccess:** Close modal, reload table, show success toast

#### Edit Mode
- **Title:** "Edit Direct Deposit Account"
- **Form Fields:** Pre-populated with account data
- **Account Number Display:** Masked (xxxx1234) in both table and form
- **Actions:** "Save" button (enabled if changes made), "Cancel" button
- **OnSave:** Call `/Blam/updateDirectDeposit`
- **OnSuccess:** Close modal, reload table, show success toast

### Error Handling

#### Client-Side Validation Fails
- Display error text below field (red)
- Red border on TextField
- "Save" button disabled
- No server call made

#### Server Validation Fails (HTTP 400)
- Display error toast: "Failed to save account. [Error message]"
- Show field-specific errors inline if `errors` object provided
- Modal stays open (user can correct and retry)
- Form data retained

#### Server Error (HTTP 500)
- Display error toast: "An error occurred. Please try again."
- Modal stays open
- "Save" button re-enabled (allow retry)

#### Delete Confirmation Dismissed
- No action taken
- Table unchanged

#### Delete API Error
- Display error toast: "Failed to delete account. [Reason]"
- Table unchanged
- Confirmation dialog closed

### State Management
- Load table data on Component mount: Call `/Blam/getCardDirectDeposit`
- Store in local state or Redux: `directDepositAccounts: []`
- Store modal state:
  - `isModalOpen: boolean`
  - `modalMode: "add" | "edit"`
  - `selectedAccountData: DirectDepositAccount | null`
- Track original values to detect changes:
  - `originalFormData` on edit mode activation
  - Disable save if form unchanged

## Implementation Notes
- Mask account number in table display (only show last 4 digits)
- Display format for Amount:
  - Fixed: "$500.00" (currency format)
  - Percentage: "25.0%" (with percent sign)
- Use confirm dialog before delete to prevent accidental deletion
- Reload table data after each add/edit/delete operation via `/Blam/getCardDirectDeposit`
- Validate ABA routing number format (9 digits required)
- Handle edge case: If user selects "Percentage" then back to "Fixed" - reset amount field
- Consider ACH transfer limits in validation (not specified in flow, may require server-side check)
- Implement custom form hook `useDirectDepositForm()` for reuse
- Test with multiple direct deposit accounts (ensure no conflicts)
- Display status with color coding:
  - "Active" = Green badge
  - "Pending" = Yellow badge
  - "Deleted" = Red badge (strikethrough text)
- Performance: Cache account list in Redux if other pages need access
- Accessibility:
  - ARIA labels: "Account number input, ends in 1234", "Delete account button"
  - Keyboard: Tab navigates fields, Enter submits, Escape closes modal
  - Focus management: Focus modal on open, focus first field after close
