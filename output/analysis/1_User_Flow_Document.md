# User Flow Document: Card Maintenance System

### Feature: Card Maintenance System
#### Entry Point: Search & Manage Cards

---

### Primary User Journey: Search and View Card Details

#### **FLOW 1: Card Search**

**Trigger:** User navigates to application or clicks "Search" in main navigation

1. **Page Load (CardSearch.jsp)**
   - Display search interface with:
     - Search bar (input field minimum 2 characters)
     - Filter dropdowns: Account, Customer, Card Status, Sort option
     - Filter button to toggle visibility
     - Results area (initially empty or shows cached results)
   
2. **User Selects Filters**
   - Clicks "Account" dropdown (populated via typeahead from `/Blam/accounts/{name}`)
   - Types account name (minimum 2 characters triggers autocomplete)
   - System calls `/Blam/accounts/{accountName}` → returns matching accounts
   - User selects account
   
3. **User Selects Customer**
   - On account selection, system populates Customer dropdown
   - Calls `/Blam/account/{accountId}/customers?search={name}`
   - User can filter by customer name (minimum 2 chars)
   - User selects customer ID
   
4. **User Enters Search Criteria**
   - Clicks in search bar
   - Types search term (minimum 2 characters required):
     - Card number (16 digits)
     - Cardholder first name
     - Cardholder last name
     - Employee ID
     - Unit number
   - JavaScript validates: `validateSearchCriteria()` checks length > 1
   
5. **User Initiates Search**
   - Clicks search button OR presses Enter
   - `onBeforeSearch()` clears previous results
   - Progress bar overlay appears (delay 750ms for UX)
   - AJAX POST sent to `/Blam/search` with:
     ```
     {
       action: "SearchAction",
       searchCriteria: "user input",
       filterByValue: status code,
       filterByType: "status",
       filterByAccount: account ID,
       filterByCust: customer ID,
       sortBy: "first_name|last_name|card_number|employee_number|unit_number|status"
     }
     ```

6. **Results Returned & Displayed**
   - Server returns SearchResponseJsonable[] (JSON array of matching cards)
   - System publishes EVENT_NEW_CARDS event
   - Progress bar overlay hides (after 750ms)
   - Results table populated with columns:
     - ☑️ Checkbox (for bulk selection)
     - Card Holder Name
     - Account Code
     - Card Status (A/B/X/F/L/S/D)
     - Employee ID
     - Unit Number
   - "Search Results: X cards found" message displayed
   - Results can be sorted client-side

**Success End State:** User sees list of matching cards ready for selection

**Failure/Empty State:** 
- If no results: "No cards found" message
- If validation fails: "Search criteria must be at least 2 characters" error
- If error from server: Progress bar hides, error logged

---

#### **FLOW 2: View Card Details**

**Trigger:** User clicks on a card from search results OR enters card token directly (if bookmarked page)

1. **Card Selection**
   - User clicks on a card row in results table
   - JavaScript captures card token from clicked row

2. **Load Card Detail Template**
   - JavaScript calls `/Blam/getCardDetailTemplate?cardToken={token}`
   - Server returns GetCardDetailResponse with basic CardBasic object
   - `onAfterSearch()` hook executes
   - Page navigates to detail view

3. **Display Card Detail Page (cardDetail.jsp)**
   - Header displayed: Card number (masked as XXXXXX****XXXX), cardholder name
   - Hidden fields populated:
     ```
     cardDetailToken = {token}
     cardDetailType = {P|M|C|etc}
     cardDetailProfile = {profile code}
     onRoadCard = {true|false}
     limitBasedCard = {true|false}
     ```
   - Tabs/sections visible (conditional based on card type):
     - **Basic Info** (always visible)
     - **Card Holder** (always visible)
     - **CIP Data** (if card type = Proprietary, Master, OnRoad)
     - **Driven Data** (if card type = Proprietary, Master, OnRoad)
     - **Network Restrictions** (always visible)
     - **EFR Data** (if applicable)
     - **Cash Limits** (if applicable)
     - **Fuel Limits** (if OnRoad)
     - **Product Limits** (conditional)
     - **MC Limits** (conditional)
     - **Express Cash** (conditional)
     - **Direct Deposit** (conditional)
     - **Transaction History** (always visible)
     - **Recent Updates** (audit trail)

4. **Asynchronous Section Loading**
   - Each section loads independently via AJAX
   - System publishes events: `cardBasicLoaded`, `cardOwnerLoaded`, `cardCashLimitsLoaded`, etc.
   - Corresponding JavaScript handlers subscribe to events and render sections
   - Each section shows "Loading..." until content arrives

5. **Display Card Information (View Mode)**
   - **Basic Info Section:**
     - Card Number: _XXXXXX****1234_ (masked with eye icon tooltip to show toggle)
     - First Name: _John_ (read-only)
     - Last Name: _Doe_ (read-only)
     - DOB: _****_ (masked, read-only)
     - SSN Last 4: _****1234_ (read-only)
     - Employee ID: _EMP12345_ (read-only)
     - Status: _Active_ (read-only dropdown)
     - Profile: _Executive_ (read-only)
     - MCC Controls: ☑️ Checkboxes disabled (read-only)
     - Edit Button visible (enabled)
   
   - **Cash Limits Section:**
     - Cash Limit: _$5,000.00_ (formatted currency, read-only)
     - Amount Used: _$1,250.00_ (read-only)
     - Reset Option: _Daily_ (read-only)
   
   - **Other Sections:** Similar read-only display with Edit button

**Success End State:** User can see all card information clearly formatted and masked appropriately

---

#### **FLOW 3: Edit Card Information**

**Trigger:** User clicks "Edit" button on any card detail section

1. **User Clicks Edit Button**
   - Button `class="btn-edit"` clicked on section (e.g., cardBasic section)
   - JavaScript event handler triggered:
     - Cache current field values in `efr-original-values` data object
     - Hide Edit button
     - Show Save button and Cancel button
     - Remove `disabled` class from all toggle/input controls in section
     - Make read-only spans hidden
     - Make editable inputs visible

2. **User Modifies Fields**
   - User types in input fields (firstName, lastName, etc.)
   - For toggle controls (Y/N radiobuttons):
     - User clicks toggle option
     - JavaScript `handleToggleChange()` applies business logic
     - May disable/enable other toggles based on interdependencies
     - Example: If "Fuel Gasoline Grades" = Y, then all non-sub-row fuel fields = N
   
3. **Client-Side Validation (Data Entry)**
   - As user types, JavaScript applies validation based on `data-type` attribute:
     - `data-type="N"` → numeric only (reject letters)
     - `data-type="A"` → alphanumeric (reject special chars)
     - `data-type="S"` → alphanumeric + special chars (-, /, :, comma, ampersand, etc.)
   - For date fields (MMDD):
     - Must be exactly 4 digits
     - Must be valid MM (01-12) and DD (01-31)
   - For currency fields:
     - Must be numeric, optional decimal places
     - No negative values
   - Special logic for EFR (fuel restrictions):
     - If "Fuel Gasoline Grades" = Y → must have one sub-row selected (Regular, Mid-Plus, or Premium)
     - Cannot unselect last fuel type if fuel restrictions required

4. **User Clicks Save**
   - JavaScript validates all fields in section
   - Shows overlay spinner (showOverlay())
   - Collects form data:
     ```
     {
       cardToken: {from hidden field},
       firstName: "John",
       lastName: "Doe",
       dobMMDD: "0123",  // validate MMDD
       ssnLast4: "1234",  // validate 4 digits
       employeeNumber: "EMP12345",
       // ... other fields
     }
     ```
   - Determines correct update endpoint from parent container `data-save-url`:
     - `data-save-url="updateCardBasic"` → POST to `/Blam/updateCardBasic`
     - `data-save-url="updateCardOwner"` → POST to `/Blam/updateCardOwner`
     - etc.

5. **Server Processes Update**
   - Endpoint `/Blam/{updateCardBasic|updateCardOwner|...}` receives request
   - Server validates:
     - Card token is valid
     - User has permission to modify this card
     - All field values are valid (date ranges, type validations, business rules)
   - If validation fails:
     - Returns error response with message
     - JavaScript displays error alert
     - Overlay removed, user stays in edit mode

6. **Successful Update**
   - Server saves changes to database
   - Returns CardMaintResponse:
     ```
     {
       status: "SUCCESS",
       message: "Card basic information updated",
       data: { updated CardBasic object }
     }
     ```
   - JavaScript receives response (Step 2 of 2-step process):
   
7. **Reload Updated Data**
   - System automatically calls GET endpoint:
     - `data-view-url="getCardBasic"` → POST to `/Blam/getCardBasic`
     - Sends: `{ cardToken: {token} }`
   - Server returns fresh CardBasic data with updated values
   - JavaScript publishes `data-view-event`:
     - `data-view-event="cardBasicLoaded"` → publishes `cardBasicLoaded` event
   
8. **Re-render Section**
   - Event subscriber renders updated section HTML
   - Overlay hidden (removeOverlay())
   - UI toggles back to view-only mode
     - Edit button shown
     - Save/Cancel buttons hidden
     - Read-only spans visible
     - Input fields hidden
   - If search is active (search button visible):
     - JavaScript clicks search button to refresh search results with updated data

**Success End State:** User sees updated card information in read-only mode, search results refreshed with latest data

**Failure/Cancel State:**
- User clicks Cancel button:
  - Cached original values restored from `efr-original-values`
  - UI toggles back to view-only mode
  - Changes discarded (no server call)
  - Overlay removed

---

#### **FLOW 4: Manage Direct Deposit Accounts**

**Trigger:** User navigates to Direct Deposit section on card detail page OR clicks "Add Direct Deposit" button

1. **Load Direct Deposit Section**
   - Section loads via `/Blam/getCardDirectDeposit`
   - Displays table of existing direct deposit accounts with columns:
     - Account Number: _xxxx1234_ (masked)
     - Routing Number: _123456789_
     - Account Name: _John Doe Checking_
     - Checking Account: _Yes/No_
     - Deposit Type: _Fixed Amount / Percentage_
     - Amount: _$500 / 25%_
     - Status: _Active / Pending / Deleted_
     - Actions: Edit (pencil icon), Delete (trash icon)

2. **Add New Direct Deposit Account**
   - User clicks "Add Direct Deposit" button
   - Modal dialog opens: `directDepositModal`
   - Modal contains form fields:
     ```
     Account Number: ___________________
     Routing Number: ___________________
     Account Name: ___________________
     Checking Account: ☐ Yes  ☐ No
     Deposit Type: [Fixed Amount ▼]
     Amount: ___________________
     Status: [Active ▼]
     ```
   - User fills in all required fields
   - Client-side validation:
     - Account Number: numeric, reasonable length
     - Routing Number: exactly 9 digits (ABA format)
     - Account Name: text
     - Deposit Type: Fixed Amount or Percentage
     - Amount: positive number
   - User clicks "Save" button in modal

3. **Server Saves Direct Deposit**
   - AJAX POST to `/Blam/addDirectDeposit`:
     ```
     {
       cardToken: {token},
       accountNumber: "****1234",
       routingNumber: "123456789",
       accountName: "John Doe Checking",
       checkingAccount: true,
       depositType: "Fixed",
       amount: "500.00"
     }
     ```
   - Server validates and saves to database
   - Returns success response with updated account list

4. **Refresh Direct Deposit Table**
   - JavaScript receives response
   - Calls `/Blam/getCardDirectDeposit` again
   - Table re-renders with new account added
   - Modal closes
   - User sees new account in table

**Success End State:** New direct deposit account appears in table

---

#### **FLOW 5: Bulk Operations (Select Multiple Cards)**

**Trigger:** User selects multiple cards in search results and performs bulk action

1. **Select Cards**
   - User clicks checkboxes next to desired cards in results table
   - Checkbox states saved in JavaScript array
   - "Select All" checkbox can toggle all visible cards
   - "Clear All" button clears all selections
   - Selected card count displayed: _"3 cards selected"_

2. **Choose Bulk Action**
   - Bulk actions panel displays (hamburger menu or dropdown):
     - _Change Status_ (Block/Unblock/Enable/Disable)
     - _Change Profile_ (Executive/Standard/etc.)
     - _Change Cash Limit_
     - _Change Fuel Limit_
     - _Move Cards_ (non-Penski brands only, determined by `icdBrand` cookie)
   - User clicks desired action

3. **Action Dialog Appears**
   - Modal opens with action-specific form:
     - **Change Status:** Select new status from dropdown
     - **Change Profile:** Select new profile from dropdown
     - **Change Limits:** Enter new limit amount
     - **Move Cards:** Select destination Account and Customer via typeahead
   - User fills in parameters
   - Clicks "Apply" button

4. **Server Processes Bulk Action**
   - AJAX POST to appropriate endpoint:
     - `/Blam/bulkChangeStatus`
     - `/Blam/bulkChangeProfile`
     - `/Blam/bulkChangeCashLimits`
     - `/Blam/bulkChangeFuelLimits`
     - `/Blam/bulkMoveCards`
   - Request includes:
     ```
     {
       cardTokens: [token1, token2, token3, ...],
       newStatus: "B",  // or newProfile, newLimit, etc.
     }
     ```
   - Server applies changes to all selected cards
   - Returns status response

5. **Refresh Search Results**
   - JavaScript receives response
   - Clears bulk selection checkboxes
   - Automatically triggers search refresh (clicks search button)
   - Results table updated with latest data
   - User sees changes applied to all selected cards

**Success End State:** Bulk action applied to all selected cards, results refreshed

---

### Secondary User Journey: Card Administrative Tasks

#### **FLOW 6: Reset Card PIN**

**Trigger:** User clicks "Reset PIN" button on card detail page

1. User clicks "Reset PIN" button
2. Confirmation dialog appears: "Reset PIN for card ending in 1234?"
3. User clicks "Confirm"
4. AJAX POST to `/Blam/resetPin` with cardToken
5. Server generates new PIN and sends secure notification to cardholder
6. User sees success message: "PIN has been reset and sent to registered phone"

---

#### **FLOW 7: View Card Transaction History**

**Trigger:** User navigates to Transaction History section

1. Section loads via `/Blam/getCardTransactionHistory`
2. Table displays transactions with columns:
   - Date: _2025-03-09_
   - Merchant: _Shell Gas Station_
   - Amount: _$45.00_
   - Transaction Type: _Purchase / Withdrawal / Load_
   - Status: _Completed / Pending / Declined_
3. Table is sortable and paginable
4. User can filter by date range if needed

---

## Error Scenarios

### **Scenario 1: Search Validation Fails**
- **Condition:** User enters < 2 characters in search box
- **Result:** Search disabled, validation message: "Please enter at least 2 characters"
- **Recovery:** User types more characters, search becomes enabled

### **Scenario 2: No Results Found**
- **Condition:** Search criteria matches no cards
- **Result:** "No cards found" message displayed, search results area remains empty
- **Recovery:** User modifies search criteria and tries again

### **Scenario 3: Server Error During Search**
- **Condition:** Network failure or server error (500)
- **Result:** Progress bar hides, error logged to console, generic error message may display
- **Recovery:** User retries search after waiting

### **Scenario 4: Card Expired/Deleted Between Loads**
- **Condition:** User has card detail page open, card is deleted/expired by another user
- **Result:** When clicking Edit or Detail section loads, server returns 404 or error
- **Result:** Error message: "Card no longer available"
- **Recovery:** User returns to search to find another card

### **Scenario 5: Save Fails Due to Business Rule Violation**
- **Condition:** User enters cash limit greater than cardholder's credit limit
- **Result:** Server returns validation error
- **Result:** JavaScript displays alert: "Cash limit cannot exceed credit limit ($10,000)"
- **Recovery:** User corrects value and saves again

### **Scenario 6: Date Validation Fails**
- **Condition:** User enters DOB as "1315" (invalid day)
- **Result:** Client-side validation blocks save, message: "Valid DOB in MMDD format required"
- **Recovery:** User corrects to valid date (e.g., "0113" for Jan 13)

### **Scenario 7: Session Expires During Edit**
- **Condition:** User is editing card details, session times out
- **Result:** AJAX POST returns 401 Unauthorized
- **Result:** User redirected to login page
- **Recovery:** User logs in again and navigates back to card

### **Scenario 8: Permission Denied**
- **Condition:** User tries to edit a card from account they don't have access to
- **Result:** Server returns 403 Forbidden or server-side validation error
- **Result:** Error message: "You do not have permission to modify this card"
- **Recovery:** User can only view card details (read-only mode)

---

## User Roles & Permissions

### **Regular User:**
- Can search cards within their assigned accounts/customers
- Can view all card details
- Can edit card information they have permission for
- Can manage direct deposit account
- Can perform limited bulk operations (status, profile, limits)
- Cannot move cards between accounts
- Cannot access "Super User" account filter

### **Super User (isCustSuperUser=true):**
- Can search cards across all accounts and customers
- Can view all card details
- Can edit any card information
- Can perform all bulk operations including "Move Cards"
- Account/Customer filters are pre-populated but allow any selection

---

## Page State & Transitions

```
[Search Page]
    ↓ (Click card or use token)
[Card Detail Template Load]
    ↓
[Card Basic Info Loaded]
    ↓
[All Sections Load Asynchronously]
    ↓
[Card Detail Full Page Loaded] ←→ [Edit Mode] ←→ [Save/Cancel]
    ↓
[View Transaction History / Recent Updates]
```

---

**END OF DOCUMENT 1: USER FLOW DOCUMENT**
