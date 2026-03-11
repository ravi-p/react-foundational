# User Story: Edit Card Information with Validation

**Project:** Card Maintenance System  
**Epic:** Search & Manage Cards  
**Story Points:** 8  
**Assignee:** Frontend Developer  
**Source Flow:** FLOW 3 - Edit Card Information  

## Description
As a card administrator, I want to edit card details in-place with real-time validation, so that I can update card information and have changes persist to the database.

## Acceptance Criteria (Functional Requirements with Component Names)

### Edit Mode Activation
- **Edit Button Click Behavior:**
  - Hide: Edit button, read-only displays
  - Show: Save button, Cancel button, input fields
  - Cache: Original values in state (`activeSection-original-values`)
  - Disable all other section edit buttons while one section is being edited

### Input Field Validation Rules

#### Text Input Fields (First Name, Last Name, Account Name)
- **Validation Rules:**
  - `data-type="A"` (alphanumeric): letters, numbers, spaces only
  - Max length: 30 characters
  - Trim whitespace on save
  - Required field: Cannot be empty
  - Error message: "Enter text (letters and numbers only)"

#### Numeric Input Fields (Employee ID, Unit Number)
- **Validation Rules:**
  - `data-type="N"` (numeric): digits only, no decimal points
  - No special characters or letters
  - Max length varies by field
  - Required field: Cannot be empty
  - Error message: "Enter numbers only"

#### Alphanumeric + Special Chars (Address, Notes)
- **Validation Rules:**
  - `data-type="S"` (special): letters, numbers, -, /, :, comma, ampersand allowed
  - Max length: 50-100 characters (field-specific)
  - Trim whitespace on save
  - Error message: "Invalid characters entered"

#### Date Field (DOB - MMDD Format)
- **Validation Rules:**
  - Exactly 4 digits (MMDD)
  - MM: 01-12 (validate month range)
  - DD: 01-31 (validate day range, no leap year check needed)
  - Cannot be empty (if required)
  - Error message: "Valid DOB in MMDD format required (e.g., 0615)"
  - Placeholder: "MMDD"

#### Currency Field (Limits, Amounts)
- **Validation Rules:**
  - Numeric with optional decimal places (max 2 places)
  - No negative values
  - No currency symbols in input field
  - Display formatting: Shows dollar sign and comma separators on blur
  - Min/max constraints: Per field business rules
  - Error message: "Enter valid amount (e.g., 5000.00)"
  - Example valid values: 5000, 5000.00, 0.50

#### Toggle/Checkbox Fields (Yes/No, Fuel Grades)
- **Validation Rules:**
  - Boolean selection (cannot be empty if field required)
  - Business logic dependencies:
    - If "Fuel Gasoline Grades" = Y → must select at least one: Regular, Mid-Plus, or Premium
    - If fuel restrictions enabled → disable conflicting options
    - Last required fuel type cannot be deselected
  - Error message: "Must select at least one fuel type"

### Validation Indicators & Error Display

#### Real-time Validation (On Blur)
- **Valid Input:**
  - Green checkmark icon: ✓
  - Display next to field (right side)
  - Border color: Default (no change)
  
- **Invalid Input:**
  - Red X icon: ✗
  - Display next to field (right side)
  - Border color: Red (#d32f2f)
  - Helper text below field: Descriptive error message
  - Text color red: Same as error border

- **Validation Timing:**
  - Trigger on blur (onBlur event)
  - Real-time as user types optional (debounced 300ms)
  - Show validation indicator only after first blur

### Save Button State Management
- **Enabled State:**
  - All visible fields valid
  - At least one field changed from original value
  - No API call in progress
  
- **Disabled State:**
  - Any field invalid (show tooltip on hover)
  - All fields unchanged from original (no modifications)
  - API call in progress
  - Tooltip text: "Save disabled: [reason]" or error summary
  - Cursor: not-allowed

### UI Components Required

#### FieldInput (Text/Number/Currency)
- **MUI TextField:**
  - Props: type, validation, dataType, maxLength, error, helperText
  - onChange → debounced validateField(fieldName, value)
  - onBlur → showValidationIndicator(fieldName)
  - variant="outlined"
  - size="small"
  - Suffix icon (checkmark/X) displayed conditionally
  
#### DateInput
- **MUI TextField:**
  - Placeholder: "MMDD"
  - inputMode="numeric"
  - maxLength={4}
  - onChange → validate as user types
  - onBlur → show validation indicator
  
#### CurrencyInput
- **MUI TextField with InputAdornment:**
  - InputAdornment (MUI) prefix: "$" symbol
  - inputMode="numeric"
  - Allow decimal point in input
  - onBlur → format to 2 decimal places
  - onChange → reject non-numeric characters
  
#### ToggleField (RadioGroup / Checkbox Group)
- **MUI RadioGroup** (single selection):
  - Props: defaultValue, value, onChange
  - Row orientation (horizontal) or Column (vertical)
  - Conditional enable/disable of options
  
- **MUI FormGroup** (multiple selections):
  - Props: value[], onChange
  - Checkboxes for each option
  - Conditional dependencies applied via onChange handlers

#### SaveButton
- **MUI Button:**
  - variant="contained"
  - color="success" or "primary"
  - onClick → validateAllFields() then callSaveAPI()
  - Disabled state applied when validation fails
  - Show spinner (CircularProgress) during API call
  - Label: "Save Changes"
  
#### CancelButton
- **MUI Button:**
  - variant="outlined"
  - color="error"
  - onClick → cancelEdit() (restore original values)
  - Disabled state only during API call
  - Label: "Cancel"

### API/Data Requirements

#### Save Endpoints (Dynamic Based on Section)
- **Endpoint determined by `data-save-url` attribute:**
  - `/Blam/updateCardBasic` → POST to save basic info
  - `/Blam/updateCardOwner` → POST to save cardholder info
  - `/Blam/updateCardCashLimits` → POST to save cash limits
  - `/Blam/updateCardFuelLimits` → POST to save fuel limits
  - etc.

#### Request Format (updateCardBasic Example)
```json
{
  "cardToken": "token_value",
  "firstName": "John",
  "lastName": "Doe",
  "dobMMDD": "0615",
  "ssnLast4": "1234",
  "employeeNumber": "EMP12345",
  "status": "A",
  "profile": "Executive",
  "mccControls": ["1234", "5678"],
  "timestamp": "2026-03-09T14:30:00Z"
}
```

#### Success Response (HTTP 200)
```json
{
  "status": "SUCCESS",
  "message": "Card basic information updated successfully",
  "data": {
    "cardToken": "token",
    "firstName": "John",
    "lastName": "Doe",
    "dobMMDD": "0615",
    "ssnLast4": "1234",
    "employeeNumber": "EMP12345",
    "status": "A",
    "profile": "Executive"
  }
}
```

#### Validation Error Response (HTTP 400)
```json
{
  "status": "ERROR",
  "message": "Validation failed",
  "errors": {
    "firstName": "Maximum 30 characters",
    "dobMMDD": "Valid DOB in MMDD format required"
  }
}
```

#### Business Logic Error Response (HTTP 422)
```json
{
  "status": "ERROR",
  "message": "Cash limit cannot exceed credit limit ($10,000)",
  "errors": {
    "cashLimit": "Invalid amount"
  }
}
```

#### Server Error Response (HTTP 500)
```json
{
  "status": "ERROR",
  "message": "An error occurred while saving changes. Please try again.",
  "code": "INTERNAL_SERVER_ERROR"
}
```

#### Data Reload After Success
- **System automatically calls corresponding GET endpoint:**
  - POST `/Blam/updateCardBasic` → GET `/Blam/getCardBasic`
  - Sends: `{ cardToken: {token} }`
- **Server returns fresh data with updated values**
- **JavaScript publishes event:**
  - `data-view-event="cardBasicLoaded"` → publishes `cardBasicLoaded`
  - Other components subscribe and re-render

### Error Handling Strategy

#### Client-Side Validation Fails
- Display error inline under field (red text, red border)
- Disable Save button
- User sees highlighted invalid fields
- No server call made

#### Server Validation Fails (HTTP 400)
- Display toast error: "Validation failed. Please check your entries."
- Show field-specific errors inline
- Stay in edit mode
- User can correct and retry
- No data reload

#### Business Logic Error (HTTP 422)
- Display toast error with specific message: "Cash limit cannot exceed credit limit ($10,000)"
- Show detailed error in expandable alert
- Stay in edit mode
- User can correct and retry

#### Server Error (HTTP 500)
- Display toast error: "An error occurred. Please try again."
- Stay in edit mode
- Allow retry (Save button stays enabled)
- Log error to console for debugging

#### User Clicks Cancel
- Restore `activeSection-original-values` to all fields
- Toggle back to read-only mode
- No server call made
- Discard all changes without confirmation (can add confirmation modal if desired)

### Form State Management
- Store original values on Edit button click
- Track form dirty state (any field changed)
- Prevent accidental data loss (warn if unsaved changes and user navigates away)
- Clear validation errors on field reset (Cancel)

## Implementation Notes
- Implement custom validation hook: `useFieldValidation(field, rules)` for reuse
- Debounce validation triggers (300ms) to avoid excessive re-renders
- Show validation indicators only after first blur (avoid spam on fresh input)
- Use FormProvider + useFormContext from React Hook Form for complex forms
- Prevent double-submit: Disable Save button after click until response received
- Log all validation errors to console for debugging (include timestamp, field, rule)
- After successful save:
  - Auto-refresh search results if search is active
  - Publish event for other subscribed components
  - Show success toast: "Changes saved successfully"
- Implement optimistic UI updates if desired (show changes immediately, then confirm/rollback)
- Test field validation with edge cases:
  - Empty strings (if required)
  - Maximum length (exactly at limit)
  - Special characters in restricted fields
  - Date boundaries (leap year handling optional)
  - Currency edge cases (0.00, very large amounts)
