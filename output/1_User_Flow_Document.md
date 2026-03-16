# User Flow Document - Transaction Categorizer

## Executive Summary
This document maps all user flows in the Transaction Categorizer frontend application. The application is a React-based system designed to help users upload bank statements, categorize transactions, and view results organized by category hierarchy.

---

## 1. Primary User Flows

### 1.1 Excel File Upload Flow

**Entry Point**: Application Landing Page  
**File**: `src/ExcelUpload.js`  
**Component**: `ExcelUpload`

**Flow Sequence**:

```
START (Application Load in App.js)
  ↓
Display "Bank Statement Categorizer" Title
  ↓
Render ExcelUpload Component
  ↓
User clicks file input → Opens file selector
  ↓
User selects .xlsx file → File stored in state
  ↓
User clicks "Upload Excel" button
  ↓
Backend Upload API Call (POST /api/transactions/upload)
  ↓
[WHILE LOADING] Button shows "Uploading..." (disabled state)
  ↓
Success Response → Call handleUploadComplete()
  ↓
Fetch Grouped Data (GET /api/transactions/grouped)
  ↓
Display Grouped Results (hierarchical category structure)
  ↓
END

Error Handling:
  ├─ File validation: Only .xlsx files accepted (accept=".xlsx")
  └─ Error display: alert('Upload failed. Check logs.')
```

**Key Points**:
- Single file upload at a time
- Accept filter restricts to Excel files
- Upload button disabled until file selected
- Loading state prevents multiple submissions
- Auto-fetches grouped data on success

---

### 1.2 Manual Transaction Entry Flow

**Entry Point**: Transaction Form in Application  
**File**: `src/components/TransactionForm.js`  
**Component**: `TransactionForm`

**Flow Sequence**:

```
START
  ↓
Render Form with Description and Amount fields
  ↓
User enters description (text)
  ↓
User enters amount (number)
  ↓
User clicks "Save" button
  ↓
Form Validation Check:
  ├─ If description is empty → do nothing
  ├─ If amount is empty → do nothing
  └─ If both valid → continue
  ↓
POST /api/transactions/categorize
  Body: { description, amount }
  ↓
Success Response → Callback to parent (onSave)
  ↓
Clear Form Fields
  ├─ description = ''
  └─ amount = ''
  ↓
END
```

**Validation Rules**:
- Description: Required, non-empty string
- Amount: Required, numeric value
- Both fields must be populated before submission

**Success Scenario**:
- Transaction saved to backend
- Form fields cleared for next entry
- Parent component notified via `onSave(res.data)`

---

### 1.3 View Grouped Transactions Flow

**Entry Point**: After upload completion or on CategoryGroups component mount  
**File**: `src/components/CategoryGroups.js`  
**Component**: `CategoryGroups`

**Flow Sequence**:

```
START (Component Mount / useEffect triggers)
  ↓
Call API: GET /api/transactions/grouped
  ↓
Response Structure:
{
  "Main Category 1": {
    "Subcategory A": [transaction1, transaction2, ...],
    "Subcategory B": [transaction3, transaction4, ...],
    ...
  },
  "Main Category 2": {
    "Subcategory C": [...],
    ...
  }
}
  ↓
Store in component state: grouped = { ... }
  ↓
Render Grouped View:
  ├─ For each main category
  │   ├─ Display category heading (h6)
  │   └─ For each subcategory
  │       └─ Display transactions in list-group
  │
  └─ Each transaction shows:
      ├─ Description
      └─ Amount (₹ Indian Rupee format)
  ↓
END
```

---

### 1.4 Display Hierarchical Results Flow (Main App)

**Entry Point**: App.js after upload completion  
**File**: `src/App.js`  
**Component**: `App`

**Flow Sequence**:

```
START (Upload Completes)
  ↓
handleUploadComplete() triggered
  ↓
Call API: GET /api/transactions/grouped
  ↓
Store result in state: groupedData = { ... }
  ↓
Conditional Render: If groupedData exists
  ↓
For each Main Type in groupedData:
  ├─ Display h3 heading with main type
  │   ↓
  │   For each Subcategory in subGroups:
  │   ├─ Display h4 heading with subcategory (indented)
  │   │   ↓
  │   │   For each transaction in subcategory:
  │   │   └─ Display li with:
  │   │       ├─ <strong>description</strong> - ₹amount
  │   │       └─ Format: Math.abs(amount) to handle negative values
  │   └─
  └─
  ↓
END (Display Complete)
```

**Data Structure Rendered**:
```
Bank Statement Categorizer
├─ [Main Type]
│  └─ [Subcategory]
│     ├─ Description - ₹Amount
│     ├─ Description - ₹Amount
│     └─ ...
├─ [Main Type 2]
│  └─ ...
```

---

## 2. Navigation & Page Flow

### 2.1 Single Page Application (SPA) Structure

```
Entry Point: index.html
    ↓
Load index.js (React root)
    ↓
Render App.js (main component)
    ↓
App Component Contains:
├─ Page Title: "Bank Statement Categorizer"
├─ ExcelUpload Component
├─ Group Display Section (conditional)
└─ Margin spacing (marginTop: '20px')
```

**No Routing**: This is a single-page application with no React Router implementation. All content is displayed on one page with conditional rendering.

---

## 3. Form Submission Flows

### 3.1 Excel Upload Form Submission

**Component**: ExcelUpload.js  
**Type**: File Upload Form

**Submission Logic**:
```javascript
Steps:
1. User selects file (handleFileChange)
   - Store in state: file
   
2. User clicks Upload button (handleUpload)
   - Check: if (!file) return
   - Set loading state: setLoading(true)
   - Call: uploadStatement(file)
   
3. Callback:
   - Success: onUploadComplete(res.data)
   - Error: alert with error message
   - Finally: setLoading(false)
```

---

### 3.2 Transaction Form Submission

**Component**: TransactionForm.js  
**Type**: Regular Form Submission

**Submission Logic**:
```javascript
Steps:
1. Form submit (e.preventDefault())
2. Validation:
   - if (!description || !amount) return
3. API Call: saveTransaction({ description, amount })
4. Success:
   - onSave(res.data)
   - Clear fields: setDescription(''), setAmount('')
5. No explicit error handling
```

---

## 4. Data Loading & Refresh Flows

### 4.1 Initial Data Load Flow

```
App Mount
  ↓
No data loaded initially
  ↓
User must upload Excel file OR
  ↓
CategoryGroups component mounts → fetches grouped data
```

### 4.2 Refresh Flow

**Triggers**:
1. **ExcelUpload completion** → `App.js` calls `fetchGrouped()`
2. **CategoryGroups mount** → useEffect calls `fetchGrouped()`

**Refresh Pattern**:
```javascript
// In App.js
handleUploadComplete = async () => {
  const res = await fetchGrouped()
  setGroupedData(res.data)
}

// In CategoryGroups.js
useEffect(() => {
  fetchGrouped().then((res) => setGrouped(res.data))
}, [])  // Runs only on mount
```

---

## 5. Error Handling Flows

### 5.1 Upload Error Flow

```
File Upload Error Detected
  ↓
API Returns Error (caught in catch block)
  ↓
Log to console: console.error('Upload failed:', err)
  ↓
Display Alert: "Upload failed. Check logs."
  ↓
Set loading to false
  ↓
User can retry upload
```

### 5.2 Data Fetch Error Flow

```
fetchGrouped() fails
  ↓
API Returns Error
  ↓
In App.js:
  - Catch block: console.error('Failed to fetch grouped data:', err)
  - groupedData remains null
  - Conditional renders nothing
  ↓
In CategoryGroups.js:
  - Error silently swallowed
  - Component displays empty grouped object
```

---

## 6. Role-Based Access

**Current Implementation**: No role-based access control detected in the frontend.

- All users have same access to all features
- No authentication/authorization checks
- No conditional UI based on user roles

---

## 7. Complete User Journey

### From First Time User to Results

```
Scenario: New user uploads bank statement

Step 1: User opens application
        ↓ Sees: "Bank Statement Categorizer"
        ↓ File input field visible
        ↓ Upload button present

Step 2: User selects Excel file (bank_statement.xlsx)
        ↓ Button becomes enabled
        ↓ User clicks "Upload Excel"
        ↓ Button shows "Uploading..." (disabled)

Step 3: File uploaded to backend
        ↓ Server processes Excel file
        ↓ Extracts transactions
        ↓ Categories each transaction

Step 4: Frontend receives success
        ↓ App calls fetchGrouped()
        ↓ Gets hierarchical transaction structure

Step 5: Results displayed to user
        ├─ Main Categories (h3)
        ├─ Subcategories (h4)
        └─ Transactions in bullet list (li)

Step 6: User can add more transactions manually
        ├─ Use TransactionForm component
        ├─ Enter description and amount
        └─ Click Save (if implemented in UI)

Step 7: View all transactions grouped
        └─ Use CategoryGroups component
            └─ Shows all transactions grouped by category
```

---

## 8. Component Composition Flow

```
App.js (Root Component)
├─ ExcelUpload.js (File Upload)
├─ Grouped Results Display (Map and render)
└─ [Not visible but available]:
   ├─ TransactionForm.js (Manual entry)
   ├─ TransactionList.js (Table view)
   └─ CategoryGroups.js (Grouped category view)
```

---

## Summary Table

| Flow | Entry Point | Component | Trigger | Success Action |
|------|-------------|-----------|---------|-----------------|
| Excel Upload | App | ExcelUpload | File Drag/Select | Fetch & Display Grouped Data |
| Manual Transaction | Form | TransactionForm | Form Submit | Clear Fields, Notify Parent |
| View Grouped | Mount/Upload | CategoryGroups | API Call | Display Hierarchical Results |
| Display Results | Upload Complete | App | handleUploadComplete | Show Grouped Transactions |

