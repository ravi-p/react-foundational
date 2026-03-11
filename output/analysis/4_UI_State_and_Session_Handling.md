# UI State and Session Handling: Card Maintenance System

### Session Variables (Server-Side State)

#### **Core Session Objects**

| Variable | Type | Access Method | Purpose | Lifetime |
|----------|------|---|---------|----------|
| `userLogon` | LogonBean | `session.getAttribute("LOG ON_SECURITY")` | Current logged-in user identity | Until logout or timeout |
| `userId` | String | `sessionScope.userId` | User ID from logon bean | Session duration |
| `isCustSuperUser` | Boolean | EL: `${isCustSuperUser}` JS: exposed as global | Super user flag (full access) | Session duration |
| `accounts` | Map<String, List<Account>> | `window.accounts[accountId].customers` (JS exposed) | Accounts and customers for user | Session duration, preloaded |
| `cardInSession` | CardMaintenanceBean | `session.getAttribute("CARD_IN_SESSION")` | Currently viewed card data | Per card, cached |
| `cardTokenInSession` | String | `session.getAttribute("CARD_TOKEN_IN_SESSION")` | Token matching card in session | Per card, cached |
| `basicAuth` | String (Base64) | JS scope: `$scope.basicAuth` | Authorization header for typeahead | Session duration |

---

#### **Security & Auth Session Variables**

| Variable | Type | Purpose | Set By |
|----------|------|---------|---------|
| `icdAuthKey` | JWT Cookie | Session authentication token | Login controller |
| `jwtToken` | String | JWT for PCI API authentication | Card detail page (hidden field) |
| `JSESSIONID` | Session ID | Standard servlet session tracking | Container (Tomcat, etc.) |
| `Authorization` (header) | Base64 String | Basic auth for typeahead API calls | AngularJS typeahead controller |

---

### Hidden Form Fields

#### **Card Detail Page Hidden Fields**

```html
<!-- Card Identification -->
<input id="cardToken" type="hidden" value="${cardBasic.cardToken}"/>
<input id="cardDetailToken" type="hidden" value="${cardBasic.cardToken}"/>
<input id="cardDetailType" type="hidden" value="${cardBasic.card.cardType.value}"/>
<input id="cardDetailProfile" type="hidden" value="${cardBasic.card.profile.value}"/>

<!-- Card Characteristics -->
<input id="onRoadCard" type="hidden" value="${cardBasic.card.onRoadCard}"/>
<input id="limitBasedCard" type="hidden" value="${cardBasic.card.balanceOrLimitBasedFlag}"/>

<!-- For Conditional Rendering -->
<input id="accCode" type="hidden" value="${accountCode}"/>
<input id="userId" type="hidden" value="${sessionScope.userId}"/>

<!-- PCI Authentication -->
<input id="jwtToken" type="hidden" value="${jwtToken}"/>
<input id="pciApiUrl" type="hidden" value="${pciApiUrl}"/>

<!-- Form State Tracking -->
<input id="mcc_listOfSelectGroups" type="hidden" value="4512,4722"/> <!-- MCC codes -->
<input id="directDepositAccountSeq" type="hidden"/> <!-- For edit/delete operations -->
```

---

#### **Section Edit State Tracking**

When user enters edit mode in a section, JavaScript caches original values:

```javascript
// In cardBasic section
var originalValues = {
  'firstName': 'John',
  'lastName': 'Doe',
  'dobMMDD': '0123',
  'ssnLast4': '1234',
  'employeeNumber': 'EMP12345',
  // ... all field values
};
$container.data('efr-original-values', originalValues);

// Used for Cancel button to restore values
// Without this, user would see partial updates

// Similarly for EFR data:
$.Topic(EVENT_DETAIL_EFRINFO_LOADED).subscribe(function(arg) {
  // Cache toggle states before allowing edit
  $container.data('original-toggle-states', collectCurrentToggleStates());
});
```

---

### Cookie Usage

#### **Cookies**

| Cookie Name | Purpose | Example Value | Scope |
|-------------|---------|---------------|-------|
| `icdBrand` | Brand identifier affecting UI/features | `PN` (Penski), `MA` (Master), etc. | Application-wide |
| `icdAuthKey` | HTTP-only auth cookie | JWT token | Session |
| `JSESSIONID` | Standard session tracking | `ABC123DEF456` | Server-managed |

---

### Client-Side State Management (JavaScript)

#### **Global & Scoped Variables**

```javascript
// Global scope (window object)
// Exposed from JSP EL
var isCustSuperUser = ${isCustSuperUser ? 'true' : 'false'};  // "true" or "false" string
var accounts = ${accountData};  // JSON object: accounts[accountId] = [customers]

// jQuery/AngularJS scope
// In typeahead controller
$scope.selectedAccountId = '';
$scope.selectedCustomerId = '';
$scope.basicAuth = '';  // Base64 authorization header
$scope.userId = ${sessionScope.userId};

// jQuery plugin state
// Power Query modal state
var $searchOverlay = $("#search_overlay");  // Progress bar overlay
var $filterBy = $("#filterBy");  // Status filter dropdown
var $filterByAccount = $("#filterByAccount");  // Account filter dropdown
var $filterByCust = $("#filterByCust");  // Customer filter dropdown
var $sortBy = $("#sortBy");  // Sort option dropdown

// Event pubsub state
// Custom event topic subscriptions
$.Topic(EVENT_NEW_CARDS).subscribe(displaySearchResults);
$.Topic('cardBasicLoaded').subscribe(renderCardBasicSection);
$.Topic('cardOwnerLoaded').subscribe(renderCardOwnerSection);
// ... etc for each section

// Data containers
// Search results
var selectedCards = [];  // Array of card tokens

// Card detail section state
var sectionEditStates = {};  // Tracks which sections are in edit mode
// Example: sectionEditStates['cardBasic'] = { isEditing: true, originalValues: {...} }

// Bulk operation state
var selectedCardTokens = [];  // For bulk operations
var selectedBulkAction = '';  // Current bulk action: 'status', 'profile', 'limit', etc.
```

---

#### **AngularJS Application State**

```javascript
// AngularJS Module: 'blam'
myApp = angular.module('blam', ['ui.bootstrap']);

// TypeaheadCtrl scope variables
$scope.accountFilterEditable = true;
$scope.customerFilterEditable = false;
$scope.selectedAccountId = null;
$scope.selectedCustomerId = null;

// Methods for async data fetching
$scope.accounts = function(accountName) {
  // Typeahead: fetch accounts via GET /Blam/accounts/{name}
  // Returns Promise with filtered list
};

$scope.customers = function(customerName) {
  // Typeahead: fetch customers via GET /Blam/account/{id}/customers
  // Filters by selected account
  // Returns Promise with filtered list
};

// Selection handlers
$scope.onSelectAccount = function($item) {
  $scope.selectedAccountId = $item.id;
  // Trigger customer filter population
};

$scope.onSelectCustomer = function($item) {
  $scope.selectedCustomerId = $item.id;
};
```

---

### State Persistence Across Navigation

#### **Session Caching Pattern**

```
User Flow:
1. User searches cards
   └─ Search results stored in jQuery array (selectedCards)
   └─ Card list cached in DOM (table rows)

2. User clicks on card
   └─ Card token captured
   └─ Server call: GET /getCardDetailTemplate?cardToken={token}
   └─ Server CACHES card data in session: CARD_IN_SESSION
   └─ Server returns template

3. Async sections load
   └─ Each GET /getCard{Section} -> server returns cached or fresh data
   └─ Section HTML cached in session for performance

4. User edits card
   └─ Original values cached in JS: container.data('original-values')
   └─ On Save: POST update, then GET fresh data, re-render
   └─ On Cancel: restore from JS cache, no server call

5. User returns to search
   └─ Previous search results still in DOM
   └─ If re-search triggered: old results cleared first
   └─ Cache in session cleared on new search or logout
```

#### **LocalStorage Strategy (if used)**

```javascript
// Note: May not be used in this legacy app, but pattern would be:
// Store last search criteria for UX restoration
localStorage.setItem('lastSearchCriteria', 'John');
localStorage.setItem('lastAccountId', 'ACC001');
localStorage.setItem('lastCustomerId', 'CUST123');

// On page reload:
var criteria = localStorage.getItem('lastSearchCriteria');  // "John"
var accountId = localStorage.getItem('lastAccountId');
// Use to pre-populate filters if desired
```

---

### Form State Lifecycle

#### **Card Basic Edit State Lifecycle**

```
┌─ Initial State: View Mode ─────────────────────────┐
│                                                    │
│ .btn-edit: VISIBLE and ENABLED                    │
│ .btn-save, .btn-cancel: HIDDEN                    │
│ input.editable-value: HIDDEN (display: none)      │
│ span.detail-value: VISIBLE                        │
│ All controls: DISABLED (readonly)                 │
│                                                    │
│ IN MEMORY: No state cached                        │
└────────────────────────────────────────────────────┘
          ↓ User clicks Edit
┌─ Transition to Edit Mode ──────────────────────────┐
│                                                    │
│ 1. Cache values                                    │
│    container.data('efr-original-values', {         │
│      firstName: 'John',                           │
│      lastName: 'Doe',                             │
│      //... all field values                       │
│    })                                              │
│                                                    │
│ 2. Show/hide controls                             │
│    .btn-edit: HIDE                                │
│    .btn-save, .btn-cancel: SHOW                   │
│    input.editable-value: SHOW (display: block)    │
│    span.detail-value: HIDE                        │
│                                                    │
│ 3. Enable editing                                 │
│    Remove 'disabled' class from controls          │
│    Set focus to first input                       │
│                                                    │
│ 4. Attach handlers                                │
│    Input: validate on keystroke                   │
│    Save: handleSave() on click                    │
│    Cancel: restoreOriginalValues() on click       │
└────────────────────────────────────────────────────┘
          ↓ User modifies fields
┌─ Edit Mode: User Modifying ────────────────────────┐
│                                                    │
│ .firstname input value: "John" → "Johnny"         │
│ Validation runs on keystroke (data-type check)    │
│                                                    │
│ IN MEMORY:                                         │
│ container.data('efr-original-values'): unchanged │
│ container.val(): updated with user input          │
│                                                    │
│ User sees live error if validation fails          │
└────────────────────────────────────────────────────┘
    ↓ User clicks Save                    ↓ User clicks Cancel
┌─ SAVE PATH ────────────────┐        ┌─ CANCEL PATH ──────────┐
│                            │        │                        │
│ 1. Validate all fields     │        │ 1. Restore values      │
│ 2. Show overlay            │        │    from cache          │
│ 3. POST update data        │        │                        │
│ 4. Server returns okay     │        │ 2. Clear form          │
│ 5. GET fresh data          │        │                        │
│ 6. Publish event           │        │ 3. Return to           │
│ 7. Event re-renders        │        │    view mode           │
│ 8. Return to view mode     │        │                        │
│ 9. Hide overlay            │        │ NO server call         │
└────────────────────────────┘        └────────────────────────┘
          ↓                                     ↓
    Back to View Mode                    Back to View Mode
```

---

### Data Flow: Edit → Save → Reload → Display

```
STEP 1: Edit Mode Entered
  User clicks [Edit] button
  JavaScript caches original field values
  UI transitions to edit mode
  
STEP 2: User Modifies Field
  User types "Johnny" in firstName input
  onChange event: validate input (data-type="A" → alphanumeric)
  Visual feedback: green checkmark OR red X
  
STEP 3: User Clicks [Save]
  JavaScript validates all section fields
  Collects form data into object:
    { cardToken, firstName, lastName, dobMMDD, ssnLast4, ... }
  
STEP 4a: Save Request (POST)
  AJAX POST to /Blam/updateCardBasic
  HTTP Request Body: form data (form-encoded or JSON)
  showOverlay() displays spinner
  
STEP 4b: Server Processes
  Endpoint: cards/updateCardBasic
  Validates:
    - Card token is valid
    - User has permission
    - All field values pass validation
    
  If error:
    Return error response
    JavaScript receives error
    alert("Error: " + error.message)
    removeOverlay() hides spinner
    User stays in edit mode
    [END workflow]
  
  If success:
    Save to database
    Return CardMaintResponse with status=SUCCESS
    Server does NOT re-render here (2-step approach)
    
STEP 5: Reload Data Request (POST)
  JavaScript sends 2nd AJAX request:
    POST to /Blam/getCardBasic
    Data: { cardToken }
  
  Server retrieves fresh card data from database
  Returns HTML fragment with updated values
  
STEP 6: Event Publishing
  JavaScript receives fresh HTML
  Publishes event: $.Topic('cardBasicLoaded').publish({
    data: freshHTML,
    container: $container
  })
  
STEP 7: Re-render Section
  Event subscriber receives event
  $container.html(freshHTML)
  applyFuelRestrictionVisibility($container)
  initializeDefaultToggleValues($container)
  setUpEditControls($container)
  
STEP 8: Return to View Mode
  removeOverlay() hides spinner
  Button visibility toggles:
    .btn-edit: SHOW
    .btn-save, .btn-cancel: HIDE
  Input/span visibility toggles:
    input.editable-value: HIDE
    span.detail-value: SHOW
  Controls disabled again
  
STEP 9: Optional: Refresh Search Results
  IF search button visible AND results table exists:
    jQuery('#search_button').focus().click()
    Search re-executes with same criteria
    Results table updates with new card data
    
[END: User sees updated card, back in view mode, search refreshed]
```

---

### Memory Footprint & Performance Notes

#### **Client-Side Memory Usage**

| Item | Size (Approx) | Lifetime | Notes |
|------|---------------|----------|-------|
| All sections (cardBasic, etc.) HTML | 5-20KB each | Per card view | Retrieved via AJAX, stored in DOM |
| selectedCards array (card tokens) | 1KB per 100 cards | Search results lifetime | In-memory JS array |
| Original values cache per section | 500B-2KB | Edit mode | Cleared on exit edit mode |
| Typeahead results cache | 1-5KB | Dropdown open | Cleared on blur |
| AngularJS scope ($scope) | 1-2KB | Session lifetime | Controller instance |
| Event subscriptions | Variable | Session lifetime | Multiple $.Topic listeners |

---

### Security: Session & State Protection

#### **Security Mechanisms**

| Mechanism | Implementation | Purpose |
|-----------|---|---------|
| JWT Tokens | `jwtToken` hidden field | PCI API authentication (iframe) |
| CSRF Protection | Likely token in form (not visible in code) | Prevent cross-site form submission |
| Session Timeout | Server-side timeout on JSESSIONID | Expire stale sessions |
| Hidden Card Token | Validated server-side on every request | Prevent card data access across card tokens |
| Masked Display | Client-side masking (CSS display) + server-side masking | Prevent accidental PCI data exposure |
| Authorization Header | Basic auth header for typeahead calls | Validate user access to accounts/customers |
| isCustSuperUser check | JS && Server validation | Prevent super user operations by tampering JS |

#### **Preventing State Tampering**

```javascript
// Client-side masking can be bypassed by developer tools
// Server MUST validate:

// 1. Card token is valid for this user
// 2. Field values pass business logic validation
// 3. User has permission to modify card
// 4. Date/currency values in valid ranges

// Example: Client sends
POST /Blam/updateCardBasic
{ cardToken: "...", cashLimit: "-5000.00" } // User tries negative value

// Server validation:
IF cashLimit < 0:
  REJECT with error "Cash limit must be positive"
ELSE IF cashLimit > cardCreditLimit:
  REJECT with error "Exceeds credit limit"
ELSE:
  SAVE

// Result: Negative value is rejected server-side
// Frontend validation provides UX feedback, not security
```

---

**END OF DOCUMENT 4: UI STATE & SESSION HANDLING**
