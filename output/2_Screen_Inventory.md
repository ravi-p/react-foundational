# Screen Inventory - Transaction Categorizer

## Executive Summary
This document provides a complete catalog of all screens, components, form fields, buttons, modals, tables, and input validations in the Transaction Categorizer frontend application.

---

## 1. Screen Components Overview

### 1.1 Application Main Screen

**Component Name**: `App.js`  
**File Path**: `src/App.js`  
**Screen Type**: Main Landing/Dashboard Page  
**Framework**: React Functional Component  

**Screen Layout**:
```
┌─────────────────────────────────────┐
│ Bank Statement Categorizer (h2)     │
├─────────────────────────────────────┤
│ [ExcelUpload Component]             │
│ ├─ File Input Field                 │
│ └─ Upload Button                    │
├─────────────────────────────────────┤
│ [Grouped Results Display] (if data) │
│ ├─ Main Category Groups (h3)        │
│ │  ├─ Subcategories (h4)            │
│ │  └─ Transaction List (ul/li)      │
│ └─ Repeat for each main type        │
└─────────────────────────────────────┘
```

**Styling**: 
- Padding: 20px
- Uses inline styles for spacing
- No CSS classes applied directly

---

## 2. Component Inventory

### 2.1 ExcelUpload Component

**File Path**: `src/ExcelUpload.js`  
**Purpose**: File upload handler for Excel bank statements  
**Component Type**: Functional Component with State

**Visual Elements**:

| Element | Type | Attributes | State Dependency |
|---------|------|---------|------------------|
| File Input | `<input>` | type="file", accept=".xlsx" | `file` (state) |
| Upload Button | `<button>` | onClick={handleUpload} | `disabled={!file \|\| loading}` |

**Form Fields**:

| Field | Type | Required | Validation | Default | Display |
|-------|------|----------|-----------|---------|---------|
| File | File Input | Yes | .xlsx only | null | "Choose File" |

**Button States**:
- **Enabled**: When file selected and loading is false
- **Disabled**: When no file selected OR uploading in progress
- **Text States**: "Upload Excel" (default) or "Uploading..." (loading)

**State Variables**:
```javascript
file: null              // Selected file object
loading: false         // Upload in progress flag
```

---

### 2.2 TransactionForm Component

**File Path**: `src/components/TransactionForm.js`  
**Purpose**: Manual transaction entry form  
**Component Type**: Functional Component with State  

**Visual Elements**:

```
┌─────────────────────────────────────┐
│ [Form Layout] (className="mb-4")    │
├─────────────────────────────────────┤
│ Description Input | Amount Input    │
│ [Save Button]                       │
└─────────────────────────────────────┘
```

**Form Fields**:

| Field Name | Type | Required | Validation | Display Label | CSS Class |
|-----------|------|----------|-----------|--------------|-----------|
| description | Text Input | Yes | Not empty | "Description" | col-md-5, form-control |
| amount | Number Input | Yes | Not empty, numeric | "Amount" | col-md-3, form-control |

**Button Details**:

| Button | Type | Action | CSS Class | Width |
|--------|------|--------|-----------|-------|
| Save | Submit | POST /categorize | btn btn-primary | 100% (w-100) |

**Styling Classes Used**:
- `mb-4`: Margin bottom
- `row g-2 align-items-end`: Bootstrap grid responsive
- `col-md-5`, `col-md-3`, `col-md-2`: Responsive columns
- `form-control`: Bootstrap form styling
- `w-100`: Full width

**State Variables**:
```javascript
description: ''        // Transaction description
amount: ''            // Transaction amount
```

---

### 2.3 TransactionList Component

**File Path**: `src/components/TransactionList.js`  
**Purpose**: Display transactions in tabular format  
**Component Type**: Functional Component (No State)  

**Table Structure**:

```
┌──────────────────────────────────────────────────────┐
│ All Transactions (h5)                                │
├──────────────────────────────────────────────────────┤
│ Description │ Amount │ Category │ Subcategory │ Sub- │
│             │        │          │             │Sub-  │
├──────────────────────────────────────────────────────┤
│ Tx Desc 1   │ 1000   │ Food     │ Restaurants │ -    │
│ Tx Desc 2   │ 500    │ Travel   │ Transport   │ Bus  │
│ ...         │ ...    │ ...      │ ...         │ ...  │
└──────────────────────────────────────────────────────┘
```

**Table Columns**:

| Column Header | Data Field | Data Type | Display Format |
|---------------|-----------|-----------|-----------------|
| Description | transaction.description | String | Plain text |
| Amount | transaction.amount | Number | Plain number |
| Category | transaction.category?.category | String | Plain text |
| Subcategory | transaction.category?.subcategory | String | Plain text |
| Sub-Subcategory | transaction.category?.subsubcategory | String | Plain text |

**Styling Classes**:
- `table`: Bootstrap table
- `table-bordered`: Border styling
- `table-sm`: Compact size

**Props**:
```javascript
transactions: Array    // Array of transaction objects
```

**Transaction Data Structure**:
```javascript
{
  description: String,
  amount: Number,
  category: {
    category: String,
    subcategory: String,
    subsubcategory: String
  }
}
```

---

### 2.4 CategoryGroups Component

**File Path**: `src/components/CategoryGroups.js`  
**Purpose**: Display transactions grouped by category hierarchy  
**Component Type**: Functional Component with State & Hooks  

**Visual Structure**:

```
┌──────────────────────────────────────┐
│ Grouped by Category (h5)             │
├──────────────────────────────────────┤
│ [Category 1] (h6)                    │
│ ├─ Transaction 1 - ₹Amount           │
│ ├─ Transaction 2 - ₹Amount           │
│ └─ Transaction 3 - ₹Amount           │
│                                      │
│ [Category 2] (h6)                    │
│ ├─ Transaction 4 - ₹Amount           │
│ └─ Transaction 5 - ₹Amount           │
└──────────────────────────────────────┘
```

**Display Elements**:

| Element | Type | Use | Content |
|---------|------|-----|---------|
| Category Header | h6 | Category name | Dynamic from data |
| List Container | list-group | Bootstrap styling | Each category |
| List Item | li.list-group-item | Each transaction | Description - ₹Amount |

**Data Display**:
```
Nested Object Structure:
{
  "Category Name": {
    "Subcategory/Subtype": [
      { description: "...", amount: 123 },
      { description: "...", amount: 456 }
    ]
  }
}
```

**Styling Classes**:
- `mb-3`: Margin between categories
- `list-group`: Bootstrap list styling
- `list-group-item`: Individual list items

**State Variables**:
```javascript
grouped: {}            // Grouped transaction data
```

---

## 3. Input Fields Inventory

### Summary Table - All Input Fields

| Component | Field Name | Type | Required | Validation | Placeholder | Input Mask |
|-----------|-----------|------|----------|-----------|-------------|-----------|
| ExcelUpload | File | File Input | Yes | .xlsx extension only | N/A | N/A |
| TransactionForm | description | Text | Yes | Not empty string | N/A | N/A |
| TransactionForm | amount | Number | Yes | Not empty, numeric | N/A | N/A |

### Input Field Validation Details

#### 1. File Input (ExcelUpload)
- **Type**: File picker
- **Accepted Files**: `.xlsx` only (Excel spreadsheets)
- **Validation Type**: Browser accept filter
- **Error Handling**: User cannot select other file types
- **Client Validation**: None (relies on accept attribute)
- **Server Validation**: Expected on backend

#### 2. Description Field (TransactionForm)
- **Type**: Text input
- **HTML Type**: `type="text"` (default)
- **Required**: Yes
- **Validation Logic**: `if (!description) return;` (prevents submission)
- **Validation Message**: No client-side message; form just doesn't submit
- **Character Limits**: None specified
- **Special Characters**: Allowed

#### 3. Amount Field (TransactionForm)
- **Type**: Numeric input
- **HTML Type**: `type="number"`
- **Required**: Yes
- **Validation Logic**: `if (!amount) return;` (prevents submission)
- **Validation Message**: No client-side message; form just doesn't submit
- **Min/Max**: No limits specified in HTML
- **Decimal Support**: Yes (HTML5 number type)
- **Negative Numbers**: Allowed

---

## 4. Buttons Inventory

### 4.1 All Buttons

| Button Text | Component | Element Type | Click Handler | State | CSS Classes |
|------------|-----------|--------------|---------------|-------|-------------|
| Upload Excel | ExcelUpload | `<button>` | onClick={handleUpload} | Dynamic (disabled/enabled) | None |
| Save | TransactionForm | Submit Button | onSubmit={handleSubmit} | None | btn btn-primary w-100 |

### 4.2 Button State Management

**Upload Excel Button**:
```javascript
Disabled When:
  - No file selected (!file)
  - Currently uploading (loading === true)

Text Changes:
  - Loading: "Uploading..."
  - Idle: "Upload Excel"

Click Action:
  - Validates file exists
  - Sets loading state
  - Calls uploadStatement(file)
  - On success: onUploadComplete(res.data)
  - On error: alert('Upload failed')
  - Finally: sets loading to false
```

**Save Button**:
```javascript
Click Action:
  - Prevents default form submission
  - Validates description and amount not empty
  - Calls saveTransaction({ description, amount })
  - On success: 
    - Calls onSave(res.data)
    - Clears form fields
  - No client-side error handling
```

---

## 5. Modals & Dialogs Inventory

**Result**: No modals, dialogs, or overlay components detected in the application.

- No confirmation dialogs
- No error modals
- No warning dialogs
- Errors shown via `alert()` only
- All interactions on-page

---

## 6. Tables & List Components

### 6.1 TransactionList Table

**Table ID/Reference**: None  
**Located in**: `src/components/TransactionList.js`  

**Table Features**:

| Feature | Status | Details |
|---------|--------|---------|
| Sorting | ❌ Not implemented | No sort headers |
| Filtering | ❌ Not implemented | No search/filter |
| Pagination | ❌ Not implemented | Shows all at once |
| Row Selection | ❌ Not implemented | No checkboxes |
| Row Actions | ❌ Not implemented | No edit/delete |
| Responsive | ⚠️ Partial | Bootstrap classes used |

**Data Binding**:
```javascript
{transactions.map((t, idx) => (
  <tr key={idx}>
    <td>{t.description}</td>
    <td>{t.amount}</td>
    <td>{t.category?.category}</td>
    <td>{t.category?.subcategory}</td>
    <td>{t.category?.subsubcategory}</td>
  </tr>
))}
```

---

### 6.2 CategoryGroups List

**Component**: CategoryGroups  
**Located in**: `src/components/CategoryGroups.js`  

**List Features**:

| Feature | Status | Details |
|---------|--------|---------|
| Grouping | ✅ Yes | Grouped by category |
| Nesting | ✅ Yes | Category → Transactions |
| Sorting | ❌ No | Order as returned by API |
| Filtering | ❌ No | Shows all categories |
| Expansion/Collapse | ❌ No | Always expanded |
| Search | ❌ No | No search functionality |

**Data Structure**:
```javascript
Object.entries(grouped).map(([cat, txns], idx) => (
  <li className="list-group-item" key={i}>
    {t.description} - ₹{t.amount}
  </li>
))
```

---

## 7. Data Display Formats

### 7.1 Amount Display
- **Format**: `₹{Math.abs(amount)}`
- **Currency Symbol**: Indian Rupee (₹)
- **Decimal Places**: As returned from API
- **Negative Sign Handling**: Uses `Math.abs()` to always show positive

### 7.2 Description Display
- **Format**: Plain text
- **Truncation**: None
- **Special Character Handling**: Displayed as-is

### 7.3 Category Hierarchy Display
- **Category Header**: `<h3>` tags (main type)
- **Subcategory Header**: `<h4>` tags (indented)
- **Item Display**: `<li>` bullet points

---

## 8. Component File Structure

```
src/
├── App.js                              (Main app component)
├── ExcelUpload.js                      (Top-level component)
├── api.js                              (API calls - no UI)
├── index.js                            (React entry point)
└── components/
    ├── TransactionForm.js              (Manual entry form)
    ├── TransactionList.js              (Table display)
    └── CategoryGroups.js               (Grouped category view)
```

---

## 9. Screen Navigation Map

```
Entry Point: index.html
    ↓
App Component (Main Screen)
├─ ExcelUpload (File Upload)
├─ Grouped Results Display
└─ [Available but not integrated]:
   ├─ TransactionForm (needs to be added to page)
   ├─ TransactionList (needs to be added to page)
   └─ CategoryGroups (needs to be added to page)
```

**Note**: Only ExcelUpload is actively rendered in the main App.js. Other components exist but are not integrated into the main screen flow.

---

## 10. Accessibility Elements

### 10.1 Labels
- ExcelUpload: No label element
- TransactionForm: `<label>` elements present for Description and Amount
- List items: No aria-labels

### 10.2 ARIA Attributes
- No ARIA attributes currently implemented
- No aria-labels on buttons
- No aria-describedby on form fields
- No role attributes

### 10.3 Semantic HTML
- Uses heading hierarchy (h2, h3, h4, h5, h6)
- Uses form element in TransactionForm
- Uses table semantic markup in TransactionList
- Uses list markup in CategoryGroups

---

## 11. No-UI Components

### api.js
**Purpose**: API endpoint definitions and Axios configuration  
**No UI**: This is purely backend communication  

API Functions (no UI):
```javascript
- saveTransaction(transaction)
- fetchTransactions()
- fetchGrouped()
- uploadStatement(file)
```

---

## Summary Inventory Table

| Component | Type | File | Has State | Has Forms | Integration Status |
|-----------|------|------|-----------|-----------|-------------------|
| App | Screen | App.js | Yes | No | ✅ Active |
| ExcelUpload | Component | ExcelUpload.js | Yes | Yes | ✅ Integrated |
| TransactionForm | Component | components/TransactionForm.js | Yes | Yes | ❌ Not integrated |
| TransactionList | Component | components/TransactionList.js | No | No | ❌ Not integrated |
| CategoryGroups | Component | components/CategoryGroups.js | Yes | No | ❌ Not integrated |

