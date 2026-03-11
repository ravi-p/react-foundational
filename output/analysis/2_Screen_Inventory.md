# Screen Inventory: Card Maintenance System

### UI Components & Pages

#### **Entry Point Pages**

| Page | File | Key Components | Purpose |
|------|------|---|---------|
| Card Search | `CardSearch.jsp` | Typeahead filters, search bar, results table, bulk action dropdown | Main search interface for finding cards |
| Card Detail | `cardDetail.jsp` | Multi-tab layout with sections | Master container for viewing/editing all card details |
| Dashboard | `index.jsp` | Sample data table | Landing page with card summary |
| System Info | `sysInfo.jsp` | Manifest display | Version and build information |

---

#### **Card Detail Sections**

| Section | File | Fields | Purpose |
|---------|------|--------|---------|
| **Basic Information** | `cardBasic.jsp` | cardNumber (masked), firstName, lastName, dobMMDD (****), ssnLast4 (****), employeeNumber, cardStatus, profile, blockedReason, ccControl checkbox, mccCodes (multiple checkboxes) | Core card identity and status |
| **Card Holder/Owner** | `cardOwner.jsp` | displayedOnCard, driverLicenseNumber, driverLicenseState, misc1, misc2 | Vehicle/driver identification |
| **Cash Limits** | `cardCashLimits.jsp` | cashLimit (currency), amountUsed (currency), resetOption (Daily/Trip/Weekly), resetDays (M-Su checkboxes) | Cash withdrawal limits and reset schedule |
| **Fuel Limits** | `cardFuelLimits.jsp` | fuelLimit (currency), fuelType selector, fuelCompanyRestrictions (checkboxes) | Fuel purchase restrictions |
| **Product Limits** | `cardProductLimits.jsp` | mccGroupLimits (multiple), spendingLimits | MCC/product category limits |
| **MC Limits** | `cardMCLimits.jsp` | mccCodeLimits (multiple), merchantLimits | Specific merchant category controls |
| **Network Restrictions** | `cardNetworkRestriction.jsp` | domesticRestriction, internationalRestriction, limitedNetworkSelection | Transaction geography controls |
| **Express Cash/eCash** | `cardExpressCash.jsp` | expressCash (Y/N), maestroPOS (select), vruAccess (Y/N), atmAccess (select), dailyLimit | ATM/POS access and limits |
| **Direct Deposit** | `cardDirectDeposit.jsp` | Table: accountNumber, routingNumber, accountName, checkingAccount, depositType, amount, status; Buttons: Add, Edit, Delete | Bank account management |
| **CIP Data** | `cipData.jsp` | Identity verification fields | Corporate Identifier Program |
| **Driven Data** | `drivenData.jsp` | External system integration data | Driven system interface |
| **EFR Data** | `efrData.jsp` | fuelRestrictionAcc, fuel type toggles (Y/N), gasoline grades, bulk fuel restrictions | Enhanced Fuel Restrictions |
| **Transaction History** | `cardTransactionHistory.jsp` | Table: date, merchant, amount, type, status | Recent transactions |
| **Recent Updates** | `cardRecentUpdates.jsp` | Table: timestamp, field, oldValue, newValue, user | Audit trail |

---

#### **Common Components**

| Component | Location | Purpose |
|-----------|----------|---------|
| Header | `inc/header.jsp` | Navigation, branding, logout |
| Footer | `inc/footer.jsp` | Copyright, links |
| Error Boundary | `cardError.jsp` | Error message display |
| Head/CSS | `inc/head.jsp` | Meta tags, stylesheets |
| JavaScript Includes | `inc/js.jsp` | Library and plugin loading |

---

### Form Inventory

#### **Search Form (CardSearch.jsp)**

```
┌─ Card Search Form ─────────────────────────────────────────┐
│                                                             │
│  [Toggle Search ☰] [Filter ▼]                              │
│                                                             │
│  Search: [________________]  [Search Button]               │
│                                                             │
│  Filters:                                                  │
│  Account: [Typeahead_____]                                 │
│  Customer: [Typeahead_____]                                │
│  Status: [Active ▼]                                        │
│  Sort By: [First Name ▼]                                   │
│                                                             │
│  [Select All ☑] [Clear All]                               │
│  [Bulk Actions ▼]                                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Results (3 cards found)                             │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │ ☑ | Name        | Account | Status | Employee # | │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │ ☐ | John Doe    | ACC001  | A      | EMP12345  | │  │
│  │ ☐ | Jane Smith  | ACC001  | A      | EMP12346  | │  │
│  │ ☐ | Bob Johnson | ACC002  | B      | EMP12347  | │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Form Fields:**
- `searchBar` (text input, min 2 chars)
- `filterByAccount` (select/typeahead)
- `filterByCust` (select/typeahead)
- `filterBy` (select - status)
- `sortBy` (select)
- Checkboxes (select cards)

---

#### **Card Basic Form (cardBasic.jsp)**

```
┌─ Basic Information ────────────────────────────────┐
│                          [Edit] [Save] [Cancel]   │
│                                                   │
│  Card Number: XXXXXX****1234 👁️                   │
│  First Name: [John_____]                          │
│  Last Name: [Doe______]                           │
│  DOB (MMDD): [****]  (format: MMDD)               │
│  SSN Last 4: [****1234]                           │
│  Employee #: [EMP12345_______...]                 │
│  Status: [Active ▼]                               │
│  Profile: [Executive ▼]                           │
│  Blocked Reason: [None ▼]                         │
│                                                   │
│  Corporate Controls:                              │
│  ☑ Enable CC Control                              │
│                                                   │
│  MCC Codes:                                       │
│  ☐ Gasoline Stations    ☐ Hotels                  │
│  ☐ Restaurants          ☐ Parking                 │
│  ☐ Airlines             ☐ Rental Cars             │
│                                                   │
└───────────────────────────────────────────────────┘
```

**Form Fields:**
- `cardDetailToken` (hidden)
- `cardDetailType` (hidden)
- `firstName` (text, data-type="A")
- `lastName` (text, data-type="A")
- `dobMMDD` (text, data-type="N", format MMDD)
- `ssnLast4` (text, data-type="N")
- `employeeNumber` (text)
- `cardStatus` (select)
- `profile` (select)
- `blockedReason` (select)
- `ccControlSelected` (checkbox)
- `mcc_codes` (checkboxes, multiple)
- `mcc_listOfSelectGroups` (hidden, comma-separated)

---

#### **Cash Limits Form (cardCashLimits.jsp)**

```
┌─ Cash Limits ──────────────────┐
│                    [Edit] ... │
│                                │
│ Daily Limit: [$5,000.00]       │
│ Amount Used: [$1,250.00] (ro)  │
│                                │
│ Reset Type: [Daily ▼]          │
│ Reset Days:                    │
│ ☐ Mon ☐ Tue ☐ Wed ☐ Thu      │
│ ☐ Fri ☐ Sat ☐ Sun            │
│                                │
└────────────────────────────────┘
```

**Form Fields:**
- `cashLimit` (currency input, data-type="N")
- `amountUsed` (read-only currency)
- `resetOption` (select: Daily/Trip/Weekly)
- `resetMonday`, `resetTuesday`, ... `resetSunday` (checkboxes)

---

#### **Direct Deposit Modal (directDepositModal)**

```
┌─ Add Direct Deposit Account ───────────────────┐
│                                                │
│ Account Number: [________________]             │
│ Routing Number: [_________] (9 digits)        │
│ Account Name: [________________________]       │
│ Checking Account: ☐ Yes  ☐ No                │
│ Deposit Type: [Fixed Amount ▼]               │
│ Amount: [$500.00 or 25%]                     │
│ Status: [Active ▼]                           │
│                                               │
│              [Save] [Cancel]                 │
└───────────────────────────────────────────────┘
```

**Form Fields:**
- `directDepositAccountNum` (text)
- `directDepositRoutingNum` (text, 9 digits)
- `directDepositAccountName` (text)
- `directDepositChecking` (radio: Yes/No)
- `directDepositDepositType` (select)
- `directDepositAmount` (currency/percent)
- `directDepositStatus` (select)

---

#### **Direct Deposit Accounts Table**

```
┌─ Direct Deposit Accounts ──────────────────────────────────┐
│                                    [Add Account]           │
├───────────────────────────────────────────────────────────┤
│ Account # | Routing # | Name      | Checking | Type | Amt │
├───────────────────────────────────────────────────────────┤
│ ****1234  | 123456789 | John Doe  | Yes      | Fxd  | $500│
│ ****5678  | 987654321 | Jane Doe  | No       | Pct  | 25% │
│ ****9999  | 111111111 | Business  | Yes      | Fxd  | $250│
├───────────────────────────────────────────────────────────┤
│ Actions: [✎ Edit] [🗑 Delete]                             │
└───────────────────────────────────────────────────────────┘
```

---

### Modal Dialogs

| Modal ID | Title | Purpose | Buttons |
|----------|-------|---------|---------|
| `directDepositModal` | Add/Edit Direct Deposit | Add or modify bank account | Save, Cancel |
| `power_query_modal` | Power Query | Advanced search by multiple criteria | Search, Close |
| `bulkStatusModal` | Change Card Status | Select new status for multiple cards | Apply, Cancel |
| `bulkLimitModal` | Change Cash/Fuel Limit | Enter new limit amount | Apply, Cancel |

---

### Data Tables

#### **Card Search Results Table**

```
Columns:
  ☑ Select checkbox
  Name (First Last)
  Account Code
  Card Status
  Employee ID
  Unit Number

Example Row:
☐ John Doe | ACC-001 | A (Active) | EMP12345 | UNIT99
```

---

#### **Transaction History Table**

```
Columns:
  Transaction Date
  Merchant Name
  Amount
  Transaction Type (Purchase, Withdrawal, Load, etc.)
  Status (Completed, Pending, Declined)

Example Row:
2025-03-09 | Shell Gas Station | $45.00 | Fuel Purchase | Completed
```

---

### Buttons & Interactive Elements

| Component | ID | Location | Action | State |
|-----------|----|-----------  |--------|-------|
| Toggle Search | `toggle_search` | Top left | Collapse/expand sidebar | Icon toggle (chevron) |
| Filter Button | `filter_button` | Top right | Show/hide filters | Shows/hides filter section |
| Search Button | `search_button` | Search bar | Execute search | Disabled if criteria < 2 chars |
| Select All | `selectAllCards` | Table header | Select all visible cards | Checkbox |
| Clear All | `clear_all` | Table header | Clear all selections | Button |
| Bulk Actions | Action dropdown | Below table | Show action options | Dropdown menu |
| Edit (Section) | `.btn-edit` | In each section | Enter edit mode | Button → hidden on click |
| Save (Section) | `.btn-save` | In each section | Save changes | Button → hidden after save |
| Cancel (Section) | `.btn-cancel` | In each section | Discard changes | Button → hidden on click |
| Add Direct Deposit | `addDirectDeposit` | DD section | Open DD modal | Button |
| Edit Direct Deposit | (row action) | DD table | Edit account | Pencil icon |
| Delete Direct Deposit | (row action) | DD table | Delete account | Trash icon |
| Reset PIN | `resetPin` | Card header | Reset card PIN | Button |

---

### Input Field Types

| Data Type | Validation | Allowed Characters | Example |
|-----------|------------|-------------------|---------|
| `N` (Numeric) | Digits only, no letters | 0-9 | `123456` |
| `A` (Alphanumeric) | Letters, numbers, no special chars | A-Z, 0-9 | `John123` |
| `S` (Special) | Letters, numbers, special chars | A-Z, 0-9, -, /, :, comma, & | `VEHICLE-01/2025` |
| Currency | Decimal format, no negative | 0-9, . | `5000.00` |
| Date (MMDD) | Valid month/day | 0-9 (exactly 4 digits) | `0325` (March 25) |

---

### Accessibility Features

- ARIA labels on interactive elements
- Semantic HTML (buttons, forms, tables)
- Keyboard navigation (Tab through fields)
- Screen reader support for masked fields (tooltips on hover)
- Color contrast for readability
- Focus indicators on inputs

---

**END OF DOCUMENT 2: SCREEN INVENTORY**
