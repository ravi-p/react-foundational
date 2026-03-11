# FE Business Logic Document: Card Maintenance System

### Client-Side Business Rules & Validation

#### **Search Validation Rules**

```javascript
// Minimum character requirement
Rule: validateSearchCriteria(searchValue)
  IF searchValue.trim().length > 1 THEN allow search
  ELSE prevent search and show "Minimum 2 characters required"

// Account/Customer Filter Dependency
Rule: Account selection triggers Customer filter
  ON account.change():
    CLEAR customerFilter dropdown
    CALL /Blam/account/{accountId}/customers
    POPULATE customerFilter with results

// Super User Override
Rule: Filter behavior varies by user role
  IF isCustSuperUser == true THEN:
    Allow search across ALL accounts/customers
    No filter restrictions
  ELSE:
    LIMIT account/customer options to user's authorized list
```

---

#### **Card Detail Display Rules**

```javascript
// Card Type Conditional Rendering
Rule: Display sections based on cardType
  IF cardType == "Proprietary" OR "Master" OR "OnRoad" THEN:
    SHOW cipData, drivenData sections
  ELSE:
    HIDE cipData, drivenData sections

  IF cardType == "OnRoad" THEN:
    SHOW fuelLimits, productLimits, mcLimits
  ELSE:
    HIDE fuelLimits, productLimits, mcLimits (or limit visibility)

// Profile-Dependent Field Behavior
Rule: fieldAccess determines editability
  FOR each field in section:
    READ field.access from attribute: data-access="${field.access}"
    IF field.access == "R" THEN:
      DISABLE field (read-only)
    ELSE IF field.access == "U" THEN:
      ALLOW editing

// Card Masking Logic
Rule: Display sensitive data masked
  cardNumber DISPLAY as: "XXXXXX****" + last4
  DOB DISPLAY as: "****" (show as dots)
  SSN DISPLAY as: "****" + last4
  
  ON click eye icon on cardNumber:
    TOGGLE between masked (XXXXXX****1234) and full (4111111111111234)
    With visual warning: "Caution: PCI Data Visible"
```

---

#### **Edit Mode Business Logic**

```javascript
// Edit Mode Toggle
Rule: enterEditMode()
  HIDE: .btn-edit (Edit button)
  SHOW: .btn-save (Save button), .btn-cancel (Cancel button)
  CACHE current field values in container.data('original-values')
  CHANGE display: 'none' span.detail-value TO visibility: hidden
  CHANGE display: 'none' input.editable-value TO visibility: visible
  REMOVE 'disabled' class from all controls in section
  SET focus to first input field

Rule: exitEditMode()
  SHOW: .btn-edit
  HIDE: .btn-save, .btn-cancel
  HIDE: .editable-value inputs
  SHOW: .detail-value spans
  ADD 'disabled' class to controls

Rule: cancelEdit()
  RESTORE all field values from cached original-values
  CALL exitEditMode()
  DO NOT make server call
```

---

#### **Client-Side Input Validation**

```javascript
// Date Field Validation (MMDD Format)
Rule: validateMMDD(value)
  IF value.length != 4 THEN return false "Must be exactly 4 digits"
  IF NOT numeric(value) THEN return false "Numbers only"
  mm = value.substring(0, 2)
  dd = value.substring(2, 4)
  IF mm < 01 OR mm > 12 THEN return false "Invalid month"
  IF dd < 01 OR dd > 31 THEN return false "Invalid day"
  IF mm IN [04,06,09,11] AND dd > 30 THEN return false
  IF mm == 02 AND dd > 29 THEN return false
  return true

// Email Validation
Rule: validateEmail(value)
  IF NOT matches regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/ THEN
    return false "Invalid email format"
  return true

// Currency Validation
Rule: validateCurrency(value)
  IF NOT numeric || contains negative THEN
    return false "Positive currency amount required"
  IF decimals > 2 THEN
    return false "Maximum 2 decimal places"
  return true

// Numeric Field Validation (data-type="N")
Rule: validateNumeric(value)
  ON keypress:
    IF NOT isDigit(event.key) THEN prevent input

// Alphanumeric Field Validation (data-type="A")
Rule: validateAlphanumeric(value)
  ALLOW: A-Z, a-z, 0-9
  REJECT: Special characters

// Special Character Field Validation (data-type="S")
Rule: validateAlphanumericSpecial(value)
  ALLOW: A-Z, a-z, 0-9, -, /, :, comma, &, ', space
  USED FOR: Vehicle Employee Number, etc.
```

---

#### **EFR (Enhanced Fuel Restrictions) Toggle Logic**

```javascript
// Complex Fuel Restrictions Business Logic
Rule: fuelRestrictionVisibility()
  IF fuelRestrictionAcc == 'U' THEN:
    SHOW efrInfoDetailId section
    SHOW .efr-info elements
  ELSE:
    HIDE efrInfoDetailId section
    HIDE .efr-info elements

Rule: handleToggleChange(fieldName, newValue)
  
  // Group 1: Fuel Gasoline Grades (main toggle)
  IF fieldName == 'efrInfo_fuelGasolineGrades':
    IF newValue == 'Y':
      SET all otherFuelFields TO 'N' (bulk fuels, specific dispensed types)
      ENSURE at least one sub-row (Regular/Mid-Plus/Premium) == 'Y'
      IF no sub-rows are 'Y':
        AUTO-SET first sub-row (regularGasoline) = 'Y'
    ELSE:
      SET all subRowFields (Regular/Mid-Plus/Premium) TO 'N'
  
  // Group 2: Sub-row fields (Regular, Mid-Plus, Premium Gasoline)
  ELSE IF fieldName IN [regularGasoline, midPlusGasoline, premiumSuperGasoline]:
    IF newValue == 'Y':
      SET fuelGasolineGrades = 'Y' (enable parent)
      SET all OTHER sub-rows = 'N' (only one grade allowed)
      SET all otherFuelFields = 'N'
    ELSE:
      // Block de-selection if this is only field
      IF this is last sub-row with 'Y':
        PREVENT change
        SHOW alert "At least one fuel type must be selected"
  
  // Group 3: Other fuel fields (Bulk, Dispensed types)
  ELSE IF fieldName IN [bulkFuelsNotAllowed, dispensedGasoline, ...]:
    IF newValue == 'Y':
      SET fuelGasolineGrades = 'N' (disable parent)
      SET all sub-rows = 'N'
    ELSE:
      // Prevent deselection if no other fields are 'Y'
      IF no OTHER otherFields have 'Y':
        PREVENT change
        SHOW alert "At least one fuel type must be selected"

Rule: constraints must be satisfied
  CONSTRAINT: If fuelGasolineGrades = 'Y' THEN exactly one sub-row = 'Y'
  CONSTRAINT: If fuelGasolineGrades = 'N' THEN at least one otherField = 'Y'
  CONSTRAINT: Sub-rows and otherFields are mutually exclusive
```

---

#### **Save & Reload Pattern (2-Step Process)**

```javascript
Rule: handleSave()
  STEP 1: Save Changes
    SHOW overlay spinner
    COLLECT form data from all controls
    GET saveUrl from parent container.data('save-url')
    CALL AJAX POST to saveUrl with form data
    
    ON success:
      PROCEED to Step 2
    ON error:
      HIDE overlay
      SHOW error alert with message
      STAY in edit mode for user correction
  
  STEP 2: Reload Updated Data
    GET viewUrl from parent container.data('view-url')
    CALL AJAX POST to viewUrl with cardToken
    GET viewEvent from parent container.data('view-event')
    
    ON success:
      PUBLISH viewEvent with updated data
      HIDE overlay
      EVENT subscriber re-renders section to view-only mode
      IF search is active:
        TRIGGER search button click to refresh results
    
    ON error:
      HIDE overlay
      SHOW error message
      Optionally reload view anyway
```

---

#### **Master-Detail Navigation**

```javascript
Rule: cardBasicLoaded event
  ON $.Topic('cardBasicLoaded').subscribe():
    $container.html(data)
    CALL applyFuelRestrictionVisibility($container)
    CALL initializeDefaultToggleValues($container)
    CALL setUpEditControls($container)
    CALL setUpDataAccess($container)
    CALL setUpInputTypes($container)

Rule: asynchrounous section loading
  FOR each section in cardDetail.jsp:
    PUBLISH event (e.g., cardBasicLoaded)
    JS subscriber listens for event
    Re-render section with fresh HTML
    Apply initialization functions
    Attach event handlers
```

---

#### **Field Dependencies & Cascading Updates**

```javascript
Rule: Profile-Dependent Field Cascading
  IF profile changed:
    FOR each section.field with data-profile-dependent="true":
      CHECK if field is applicable to new profile
      IF not applicable:
        HIDE or DISABLE field
        CLEAR field value
      ELSE:
        SHOW or ENABLE field

Rule: Card Type-Dependent Section Visibility
  IF cardType == 'OnRoad':
    SHOW fuelLimits section (conditional display)
  IF cardType != 'OnRoad':
    HIDE fuelLimits section

Rule: Effective Date Validation
  IF fromDate AND toDate both provided:
    IF toDate <= fromDate:
      SHOW error "End date must be after start date"
      PREVENT save
```

---

#### **Bulk Selection Logic**

```javascript
Rule: Select All Behavior
  ON click selectAllCheckbox:
    IF currently checked:
      CHECK all visible card checkboxes
      ENABLE bulk actions dropdown
      SHOW selected count "X cards selected"
    ELSE:
      UNCHECK all card checkboxes
      DISABLE bulk actions dropdown
      SHOW selected count "0 cards selected"

Rule: Individual Card Selection
  ON click individual card checkbox:
    UPDATE selectedCards array
    UPDATE selected count display
    IF no cards selected:
      DISABLE bulk actions dropdown
    ELSE:
      ENABLE bulk actions dropdown

Rule: Clear All Button
  ON click clearAll:
    UNCHECK all checkboxes
    CLEAR selectedCards array
    HIDE bulk action panel
    SHOW selected count "0 cards selected"
```

---

#### **MCC (Merchant Category Code) Selection Logic**

```javascript
Rule: MCC Code Selection
  ON click mcc checkbox:
    IF checked:
      ADD mcc code to mcc_listOfSelectGroups (comma-separated)
    ELSE:
      REMOVE mcc code from mcc_listOfSelectGroups
  
  ENSURE no duplicates in list
  
  ON save:
    SEND mcc_listOfSelectGroups as hidden field value
    Server stores comma-separated list
    
Rule: CC Control Toggle
  ON change ccControlSelected checkbox:
    IF checked:
      SHOW ccGroupSection (MCC controls)
    ELSE:
      HIDE ccGroupSection
      CLEAR all mcc selections
```

---

#### **Direct Deposit Validation**

```javascript
Rule: directDepositAdd()
  account_number: numeric, length >= 8
  routing_number: EXACTLY 9 digits (ABA format)
  account_name: text, not empty
  deposit_type: SELECT value (Fixed or Percentage)
  amount: 
    IF deposit_type == Fixed: positive currency
    IF deposit_type == Percentage: 0-100 decimal
  
  IF validation fails:
    SHOW error alert with specific field error message
    PREVENT modal close
  
  ELSE:
    SUBMIT to /Blam/addDirectDeposit
    ON success: CLOSE modal, refresh table
    ON error: SHOW error alert, STAY in modal

Rule: directDepositEdit()
  Same validation as Add
  Include directDepositAccountSeq (hidden field)
  SUBMIT to /Blam/editDirectDeposit

Rule: directDepositDelete()
  SHOW confirmation alert "Delete this account?"
  ON confirm: SUBMIT to /Blam/deleteDirectDeposit with accountSeq
  ON success: REFRESH table
```

---

### Business Rules Summary Table

| Rule | Condition | Action | Notes |
|------|-----------|--------|-------|
| Search Min Chars | searchCriteria.length < 2 | Disable search, show error | jQuery validation via searchBar plugin |
| Super User Access | isCustSuperUser==true | All accounts/customers accessible | No filter restrictions |
| Card Masking | Display card number | Show XXXXXX****XXXX format | Reveal on icon click with warning |
| EFR Fuel Lock | Sub-row fuel selected | Cannot have 0 fuel types | Business constraint prevents savings |
| Date Sequencing | toDate < fromDate provided | Block save with date error | Server-side validation also enforced |
| Routing Number | directDepositRoutingNum | Exactly 9 digits (ABA) | Format validation on form |
| Currency Positive | All monetary fields | No negative values allowed | data-type validation |
| Profile Dependent | Field.profileDependent==true | Field visibility changes with profile | Cascading updates |
| MCC Deduplication | mcc_listOfSelectGroups | Remove duplicate codes | Client-side array deduplication |

---

**END OF DOCUMENT 3: FE BUSINESS LOGIC DOCUMENT**
