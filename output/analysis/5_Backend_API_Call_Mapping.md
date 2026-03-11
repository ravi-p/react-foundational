# Backend API Call Mapping: Card Maintenance System

### Complete API Endpoint Reference

#### **Search Endpoints**

| Endpoint | Method | URL | Parameters | Request Body | Response | Purpose |
|----------|--------|-----|------------|--------------|----------|---------|
| Card Search | POST | `/Blam/search` | N/A | `action=SearchAction&searchCriteria=John&filterByValue=A&filterByType=status&filterByAccount=ACC001&filterByCust=CUST123&sortBy=first_name` | `SearchResponseJsonable[]` | Search cards by criteria with filters |
| Account Typeahead | GET | `/Blam/accounts/{accountName}` | `accountName`, `userId` (opt) | N/A | `Account[] { id, description, fullDescription }` | Fetch accounts for typeahead |
| Customer Typeahead | GET | `/Blam/account/{accountId}/customers` | `accountId`, `search`, `userId` (opt) | N/A | `Customer[] { id, description }` | Fetch customers by account |

---

#### **Card Detail Retrieval Endpoints**

| Endpoint | Method | URL | Parameters | Request Body | Response | Purpose |
|----------|--------|-----|------------|--------------|----------|---------|
| Card Template | GET | `/Blam/getCardDetailTemplate` | `cardToken` | N/A | HTML template + `CardBasic` data | Load card detail page template |
| Card Basic Info | POST | `/Blam/getCardBasic` | N/A | `{ cardToken }` | `CardBasic { cardToken, firstName, lastName, dobMMDD, ssnLast4, employeeNumber, cardStatus, profile, blockedReason, ccControl, mccCodes[] }` | Fetch basic card information |
| Card Owner | POST | `/Blam/getCardOwner` | N/A | `{ cardToken }` | `CardOwner { displayedOnCard, driverLicenseNumber, driverLicenseState, misc1, misc2 }` | Fetch card holder/owner details |
| Card Cash Limits | POST | `/Blam/getCardCashLimits` | N/A | `{ cardToken }` | `CardCashLimits { cashLimit, amountUsed, resetOption, resetDayFlags[] }` | Fetch cash withdrawal limits |
| Card Fuel Limits | POST | `/Blam/getCardFuelLimits` | N/A | `{ cardToken }` | `CardFuelLimits { fuelLimit, fuelTypeRestrictions[], fuelCompanyRestrictions[] }` | Fetch fuel purchase limits |
| Card Product Limits | POST | `/Blam/getCardProductLimits` | N/A | `{ cardToken }` | `CardProductLimits { mccGroupLimits[], productLimits[] }` | Fetch MCC/product category limits |
| Card MC (Merchant) Limits | POST | `/Blam/getCardMCLimits` | N/A | `{ cardToken }` | `CardMCLimits { mccCodeLimits[] }` | Fetch merchant category limits |
| Card Network Restrictions | POST | `/Blam/getCardNetwork` | N/A | `{ cardToken }` | `CardNetworkRestriction { domesticRestriction, internationalRestriction, limitedNetwork }` | Fetch network/geography restrictions |
| Card Express Cash | POST | `/Blam/getCardExpressCash` | N/A | `{ cardToken }` | `CardExpressCash { expressCash, maestroPOS, vruAccess, atmAccess, dailyLimit }` | Fetch ATM/eCash access settings |
| Card Direct Deposit | POST | `/Blam/getCardDirectDeposit` | N/A | `{ cardToken }` | `CardDirectDeposit { accounts[] { accountNum, routingNum, accountName, checkingAccount, depositType, amount, status } }` | Fetch bank account list |
| Card Transactions | POST | `/Blam/getCardTransactionHistory` | N/A | `{ cardToken }` | `CardTransactionHistory { transactions[] { date, merchant, amount, type, status } }` | Fetch card transaction history |
| Card CIP Data | POST | `/Blam/getCIPData` | N/A | `{ cardToken }` | `CIPData { cipFields[] }` | Fetch Corporate Identifier Program data |
| Card Driven Data | POST | `/Blam/getDrivenData` | N/A | `{ cardToken }` | `DrivenData { drivenFields[] }` | Fetch Driven system integration data |
| Card EFR Data | POST | `/Blam/getEfrData` | N/A | `{ cardToken }` | `EfrData { fuelRestrictionAcc, fuelTypeToggles[], gasoline Grades[] }` | Fetch Enhanced Fuel Restrictions data |
| Card Recent Updates | POST | `/Blam/getCardRecentUpdates` | N/A | `{ cardToken }` | `CardRecentUpdates { updates[] { timestamp, field, oldValue, newValue, user } }` | Fetch audit trail of changes |

---

#### **Card Update/Modification Endpoints**

| Endpoint | Method | URL | Request Body | Response | Validation | Notes |
|----------|--------|-----|--------------|----------|-----------|-------|
| Update Card Basic | POST | `/Blam/updateCardBasic` | `{ cardToken, firstName, lastName, dobMMDD, ssnLast4, employeeNumber, cardStatus, profile, blockedReason, ccControl, mcc_listOfSelectGroups }` | `CardMaintResponse { status, message, cardBasic }` | MMDD format, SSN 4 digits, alphanumeric names | **2-Step:** Save then GET fresh data |
| Update Card Owner | POST | `/Blam/updateCardOwner` | `{ cardToken, driverLicenseNumber, driverLicenseState, misc1, misc2 }` | `CardMaintResponse { status, message, cardOwner }` | License number state validation | **2-Step:** Save then GET fresh data |
| Update Cash Limits | POST | `/Blam/updateCardCashLimits` | `{ cardToken, cashLimit, resetOption, resetMondayFlag, resetTuesdayFlag, ..., resetSundayFlag }` | `CardMaintResponse { status, message, cardCashLimits }` | Positive currency, valid day flags | **2-Step:** Save then GET fresh data |
| Update Fuel Limits | POST | `/Blam/updateCardFuelLimits` | `{ cardToken, fuelLimit, fuelType, fuelCompanyRestrictions[] }` | `CardMaintResponse { status, message, cardFuelLimits }` | Positive currency, fuel types | **2-Step:** Save then GET fresh data |
| Update Product Limits | POST | `/Blam/updateCardProductLimits` | `{ cardToken, mccGroupLimits[] }` | `CardMaintResponse { status, message, cardProductLimits }` | Valid MCC codes | **2-Step:** Save then GET fresh data |
| Update MC Limits | POST | `/Blam/updateCardMCLimits` | `{ cardToken, mccCodeLimits[] }` | `CardMaintResponse { status, message, cardMCLimits }` | Valid MCC codes | **2-Step:** Save then GET fresh data |
| Update Network Restrictions | POST | `/Blam/updateCardNetwork` | `{ cardToken, domesticRestriction, internationalRestriction, limitedNetwork }` | `CardMaintResponse { status, message, cardNetworkRestriction }` | Valid restriction codes | **2-Step:** Save then GET fresh data |
| Update Express Cash | POST | `/Blam/updateCardExpressCash` | `{ cardToken, expressCash, maestroPOS, vruAccess, atmAccess, dailyLimit }` | `CardMaintResponse { status, message, cardExpressCash }` | Valid Y/N for flags, positive limit | **2-Step:** Save then GET fresh data |
| Update CIP Data | POST | `/Blam/updateCIPData` | `{ cardToken, cipDataFields[] }` | `CardMaintResponse { status, message, cipData }` | CIP-specific validations | **2-Step:** Save then GET fresh data |
| Update Driven Data | POST | `/Blam/updateDrivenData` | `{ cardToken, drivenDataFields[] }` | `CardMaintResponse { status, message, drivenData }` | Driven-specific validations | **2-Step:** Save then GET fresh data |
| Update EFR Data | POST | `/Blam/updateEfrData` | `{ cardToken, efrInfo_fuelGasolineGrades, efrInfo_regularGasoline, efrInfo_midPlusGasoline, efrInfo_premiumSuperGasoline, efrInfo_bulkFuelsNotAllowed, efrInfo_dispensedGasoline, ... }` | `CardMaintResponse { status, message, efrData }` | EFR toggle constraints (see FE Logic) | **2-Step:** Save then GET fresh data; Complex business logic |

---

#### **Direct Deposit Management Endpoints**

| Endpoint | Method | URL | Request Body | Response | Validation | Notes |
|----------|--------|-----|--------------|----------|-----------|-------|
| Add Direct Deposit | POST | `/Blam/addDirectDeposit` | `{ cardToken, accountNumber, routingNumber, accountName, checkingAccount, depositType, amount, status }` | `CardMaintResponse { status, message, directDepositList[] }` | Account numeric, routing=9 digits, amount positive/valid percent | Modal dialog -> Add button |
| Edit Direct Deposit | POST | `/Blam/editDirectDeposit` | `{ cardToken, directDepositAccountSeq, accountNumber, routingNumber, accountName, checkingAccount, depositType, amount, status }` | `CardMaintResponse { status, message, directDepositList[] }` | Same as Add + sequence ID | Modal dialog -> Edit row |
| Delete Direct Deposit | POST | `/Blam/deleteDirectDeposit` | `{ cardToken, directDepositAccountSeq }` | `CardMaintResponse { status, message, directDepositList[] }` | Valid sequence ID, card token | Confirmation dialog -> Delete row |

---

#### **Bulk Operation Endpoints**

| Endpoint | Method | URL | Request Body | Response | Notes |
|----------|--------|-----|--------------|----------|-------|
| Bulk Change Status | POST | `/Blam/bulkChangeStatus` | `{ cardTokens: [token1, token2, ...], newStatus }` | `BulkOperationResponse { successCount, failureCount, errors[] }` | Multi-card status update (A/B/X/F/L/S/D) |
| Bulk Change Profile | POST | `/Blam/bulkChangeProfile` | `{ cardTokens: [token1, token2, ...], newProfile }` | `BulkOperationResponse { successCount, failureCount, errors[] }` | Multi-card profile migration |
| Bulk Change Cash Limits | POST | `/Blam/bulkChangeCashLimits` | `{ cardTokens: [token1, token2, ...], newCashLimit }` | `BulkOperationResponse { successCount, failureCount, errors[] }` | Apply same limit to multiple cards |
| Bulk Change Fuel Limits | POST | `/Blam/bulkChangeFuelLimits` | `{ cardTokens: [token1, token2, ...], newFuelLimit }` | `BulkOperationResponse { successCount, failureCount, errors[] }` | Apply same fuel limit to multiple cards |
| Bulk Move Cards | POST | `/Blam/bulkMoveCards` | `{ cardTokens: [token1, token2, ...], destinationAccount, destinationCustomer }` | `BulkOperationResponse { successCount, failureCount, errors[] }` | Move cards between accounts/customers (non-Penski only) |

---

#### **Legacy/Administrative Endpoints**

| Endpoint | Method | URL | Request Body | Response | Purpose |
|----------|--------|-----|--------------|----------|---------|
| Reset PIN | POST | `/Blam/resetPin` | `{ cardToken }` | `CardMaintResponse { status, message }` | Reset card PIN (secure send to cardholder) |
| Card Status (OC) | POST | `/Blam/updateCardStatus` (via updateOCCardStatus action) | `{ cardToken, newStatus }` | `CardMaintResponse { status, message }` | Update via Opportunity Connect system |
| Express Cash Activity | POST | `/Blam/getCardExpressCashActivity` | `{ cardToken }` | `CardExpressCashActivity { loads[], activity[] }` | Get eCash transaction activity |
| Cancel Express Load | POST | `/Blam/cancelExpressCashLoad` | `{ cardToken, loadId }` | `CardMaintResponse { status, message }` | Cancel pending eCash load |
| System Info | GET | `/Blam/sysInfo` | N/A | Manifest, version, build info | Get application version/build info |
| Authenticate (PCI) | POST | `/Blam/authenticate` | `{ jwtToken }` | `{ accessToken }` | Get ACSS token for PCI API iframe |

---

### API Response Patterns

#### **Success Response (Card Update)**

```json
{
  "status": "SUCCESS",
  "message": "Card basic information updated successfully",
  "data": {
    "cardToken": "...",
    "firstName": "John",
    "lastName": "Doe",
    "dobMMDD": "0325",
    "ssnLast4": "1234",
    "employeeNumber": "EMP12345",
    "cardStatus": "A",
    "profile": "Executive",
    "blockedReason": null,
    "ccControlSelected": true,
    "mccCodes": [4512, 4722],
    "mcc_listOfSelectGroups": "4512,4722"
  }
}
```

---

#### **Error Response (Validation Failure)**

```json
{
  "status": "ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "field": "dobMMDD",
      "message": "Invalid date format. Must be MMDD with valid month/day."
    },
    {
      "field": "cashLimit",
      "message": "Cash limit cannot exceed credit limit of $10,000.00"
    }
  ]
}
```

---

#### **Bulk Operation Response**

```json
{
  "status": "PARTIAL_SUCCESS",
  "successCount": 2,
  "failureCount": 1,
  "errors": [
    {
      "cardToken": "token3",
      "message": "Card no longer exists or access denied"
    }
  ]
}
```

---

### Request/Response Flow Diagrams

#### **Single Card Update Flow**

```
Client                                Server
  │                                     │
  │ 1. POST /Blam/updateCardBasic     │
  │    { cardToken, firstName, ... }  │
  ├────────────────────────────────→   │
  │                                     │ Validate input
  │                                     │ Check permissions
  │                                     │ Save to DB
  │                                     │
  │ 2. CardMaintResponse { SUCCESS }  │
  │←────────────────────────────────   │
  │                                     │
  │ 3. POST /Blam/getCardBasic        │
  │    { cardToken }                   │
  ├────────────────────────────────→   │
  │                                     │ Query fresh data
  │                                     │ Render HTML
  │                                     │
  │ 4. HTML { updated values }        │
  │←────────────────────────────────   │
  │                                     │
  │ JavaScript:                        │
  │ - Publish 'cardBasicLoaded' event │
  │ - Re-render section                │
  │ - Exit edit mode                   │
  │ - If search active: re-search      │
```

---

**END OF DOCUMENT 5: BACKEND API CALL MAPPING**
