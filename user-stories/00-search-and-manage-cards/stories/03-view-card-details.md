# User Story: View Card Details Page

**Project:** Card Maintenance System  
**Epic:** Search & Manage Cards  
**Story Points:** 8  
**Assignee:** UX Designer / Frontend Developer  
**Source Flow:** FLOW 2 - View Card Details  

## Description
As a card administrator, I want to view comprehensive card details organized in collapsible sections (Basic Info, Holder Info, Limits, History), so that I can understand the complete card profile and make informed decisions.

## Acceptance Criteria (Functional Requirements with Component Names)

### Card Header Component
- Card number display: Masked format "XXXXXX****1234"
- Eye icon toggle: Show/hide full card number (with tooltip on hover)
- Cardholder name display: Full name, centered
- Card status badge: Shows current status (A/B/X/F/L/S/D) with color coding
- Page title visible above card info

### Detail Sections (Conditional Display)

#### Basic Info Section (Always Visible)
- Card Number: Masked "XXXXXX****1234" with eye icon toggle
- First Name: Read-only text
- Last Name: Read-only text
- DOB: Masked display
- SSN Last 4: Masked display
- Employee ID: Read-only text
- Status: Read-only dropdown display
- Profile: Read-only dropdown display
- MCC Controls: Disabled checkboxes (read-only)
- Edit Button: Always visible in view mode

#### Card Holder Section (Always Visible)
- Cardholder last name, date of birth, SSN partial
- Edit Button visible in view mode

#### CIP Data Section (If cardType = Proprietary/Master/OnRoad)
- Company Info fields
- Edit Button visible

#### Driven Data Section (If cardType = Proprietary/Master/OnRoad)
- Driver-specific fields
- Edit Button visible

#### Network Restrictions Section (Always Visible)
- Merchant category restrictions
- MCC exclusions
- Edit Button visible

#### Cash Limits Section (If applicable)
- Cash Limit: "$5,000.00" (formatted currency, read-only)
- Amount Used: "$1,250.00" (read-only)
- Reset Option: "Daily" (read-only)
- Edit Button visible

#### Fuel Limits Section (If OnRoad card)
- Fuel limit settings
- Fuel grade restrictions
- Edit Button visible

#### Direct Deposit Section (If applicable)
- Table of direct deposit accounts
- Add Direct Deposit button
- Edit/Delete actions per account

#### Transaction History Section (Always Visible)
- Recent transactions table
- Paginated results
- Transaction date, merchant, amount columns

#### Recent Updates Section (Audit Trail)
- Last 10 updates with timestamp and user
- Field changed + old value → new value
- Read-only display

### UI Components Required
- **CardHeader Component**
  - Box (MUI) for layout
  - Typography (MUI) for card number (monospace font)
  - IconButton (MUI) for eye icon toggle
  - Chip (MUI) for status badge
  
- **DetailSection (Reusable Container)**
  - Props: title, fields[], editable, sectionType, onEdit, onCancel
  - Accordion (MUI) for collapse/expand
  - Loading state shows: Typography "Loading..."
  - Edit Button (visible in view mode)
  - Save Button, Cancel Button (visible in edit mode)
  
- **FieldDisplay (Read-only)**
  - Props: label, value, masked
  - Typography (MUI) for display
  - Uses monospace font for masked fields
  - Gray color (#999) for read-only state
  
- **FieldInput (Edit mode)**
  - Props: label, value, type, validation
  - TextField (MUI) with validation
  - ToggleButtonGroup (MUI) for Y/N fields
  - Display only when section in edit mode

### API/Data Requirements

#### Get Card Detail Template
- **Endpoint:** `GET /Blam/getCardDetailTemplate?cardToken={token}`
- **Response:** GetCardDetailResponse with CardBasic object
- **Purpose:** Load basic card metadata and determine which sections to display
- **Trigger:** On card selection from results

#### Asynchronous Section Loaders (Parallel Requests)
- **`GET /Blam/getCardBasic`** → publishes `cardBasicLoaded` event
  - Response: CardBasic object with basic card info
  
- **`GET /Blam/getCardOwner`** → publishes `cardOwnerLoaded` event
  - Response: CardOwner object with cardholder details
  
- **`GET /Blam/getCardCashLimits`** → publishes `cardCashLimitsLoaded` event
  - Response: CashLimits object
  - Only if applicable card type
  
- **`GET /Blam/getCardDirectDeposit`** → publishes `cardDirectDepositLoaded` event
  - Response: Array of DirectDeposit accounts
  - Only if applicable card type
  
- **`GET /Blam/getCardFuelLimits`** → publishes `cardFuelLimitsLoaded` event
  - Response: FuelLimits object
  - Only if OnRoad card
  
- **`GET /Blam/getCardTransactionHistory`** → publishes `cardTransactionHistoryLoaded` event
  - Response: Array of Transaction objects (paginated)
  
- **`GET /Blam/getCardRecentUpdates`** → publishes `cardRecentUpdatesLoaded` event
  - Response: Array of AuditLog objects

#### Request Format (for all GET endpoints)
```json
{
  "cardToken": "token_value"
}
```

#### Response Format Example (CardBasic)
```json
{
  "status": "SUCCESS",
  "data": {
    "cardToken": "token",
    "cardNumber": "1234567890123456",
    "firstName": "John",
    "lastName": "Doe",
    "dobMMDD": "0123",
    "ssnLast4": "1234",
    "employeeNumber": "EMP12345",
    "status": "A",
    "profile": "Executive",
    "cardType": "P"
  }
}
```

### Styling & Accessibility
- Masked fields: Use monospace font (Courier New, font-family: monospace)
- Read-only fields: Color = #999 (neutral gray)
- Edit mode fields: Normal text color
- Icons: Tooltips on hover ("Click to reveal full card number")
- ARIA labels:
  - "Masked card number ending in 1234"
  - "Edit basic card information"
  - "Expand cash limits section"
  - "Loading card details"
- Focus indicators: Visible outline on interactive elements
- Keyboard navigation: Tab through edit buttons, Enter to activate

## Implementation Notes
- Load sections asynchronously in parallel to prevent blocking
- Use Redux Context to subscribe to section-loaded events
- Memoize DetailSection components to optimize re-renders
- Show loading spinner (CircularProgress) for each section until data arrives
- Cache loaded data to avoid duplicate requests on re-visits
- Publish events via Redux or Context API as sections load
- Handle 404 (card not found) with error page
- If token invalid: Show "Card not found" message and link back to search
- Implement error boundary at page level to catch rendering errors
- Auto-refresh on interval if needed (e.g., every 30 seconds for transaction history)
