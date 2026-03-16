# UI State and Session Handling - Transaction Categorizer

## Executive Summary
This document details state management patterns, session handling, local storage usage, service-based state sharing, and state persistence in the Transaction Categorizer frontend application.

---

## 1. State Management Architecture

### 1.1 Overall State Management Pattern

**Architecture Type**: Component-Level State Only

**Technology Stack Used**:
- ✅ React `useState()` Hook
- ✅ React `useEffect()` Hook
- ❌ Redux/Redux Toolkit (not used)
- ❌ Context API (not used)
- ❌ MobX (not used)
- ❌ Zustand (not used)

**State Management Philosophy**:
```
Each component manages its own state
    ↓
State passed to children via props
    ↓
Callbacks passed down to trigger parent updates
    ↓
No centralized store
    ↓
No global state management
```

---

### 1.2 Component State Hierarchy

```
App Component (Root)
├─ State: groupedData
├─ Owns callbacks: handleUploadComplete
├─ Passes to:
├─ Child: ExcelUpload
│  ├─ State: file, loading
│  └─ Triggers parent callback on success
└─ Display: Grouped Results
   └─ Rendered from state: groupedData

ExcelUpload Component
├─ State: file, loading
├─ Isolated state (not shared)
└─ Communicates via callback

TransactionForm Component
├─ State: description, amount
├─ Isolated (not currently integrated)
└─ Communicates via onSave callback

CategoryGroups Component
├─ State: grouped
├─ Fetches own data from API
└─ useEffect on mount (no dependencies)

TransactionList Component
├─ State: None
├─ Purely presentational
└─ Receives transactions via props
```

---

## 2. Component-Level State Details

### 2.1 App.js State Management

**State Variables**:
```javascript
const [groupedData, setGroupedData] = useState(null);
```

**State Lifecycle**:

| Phase | Value | Trigger | Display |
|-------|-------|---------|---------|
| Initial Load | null | Component mounts | No grouped data shown |
| After Upload | Object | handleUploadComplete() called | Grouped transactions display |
| Manual Refresh | Object | setState called | Updated view |

**State Shape**:
```javascript
null  // Initial state
OR
{
  "Main Category 1": {
    "Subcategory A": [
      { description: "Tx 1", amount: -100 },
      { description: "Tx 2", amount: -200 }
    ],
    "Subcategory B": [...]
  },
  "Main Category 2": {...}
}
```

**State Usage**:
```javascript
const [groupedData, setGroupedData] = useState(null);

// Updated when upload completes
const handleUploadComplete = async () => {
  try {
    const res = await fetchGrouped();
    setGroupedData(res.data);  // Update state
  } catch (err) {
    console.error('Failed to fetch grouped data:', err);
    // groupedData stays null on error
  }
};

// Conditional rendering uses state
{groupedData && 
  Object.entries(groupedData).map(...)
}
```

---

### 2.2 ExcelUpload.js State Management

**State Variables**:
```javascript
const [file, setFile] = useState(null);        // Selected file
const [loading, setLoading] = useState(false); // Upload progress flag
```

**State Lifecycle**:

| State Variable | Initial | When Changed | Usage |
|---|---|---|---|
| file | null | File selected | Enable/disable button, API call |
| loading | false | Upload starts/ends | Show loading state, disable button |

**Detailed State Flow**:

```
Initial State:
  file: null
  loading: false
  Button: disabled, text = "Upload Excel"
  
User selects file:
  file: File { ... }
  loading: false
  Button: enabled, text = "Upload Excel"
  
User clicks upload:
  file: File { ... }
  loading: true (immediately)
  Button: disabled, text = "Uploading..."
  
API response (success or error):
  file: File { ... } (unchanged)
  loading: false
  Button: enabled, text = "Upload Excel"
  
File remains in state for potential re-upload
```

**State Mutation Code**:
```javascript
// File selection
const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

// Upload handler
const handleUpload = async () => {
  if (!file) return;
  setLoading(true);  // Start loading
  try {
    const res = await uploadStatement(file);
    onUploadComplete(res.data);
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Upload failed. Check logs.');
  } finally {
    setLoading(false);  // Always clear loading
  }
};
```

**State Dependency**: No dependencies on external state; file input changes trigger state update.

---

### 2.3 TransactionForm.js State Management

**State Variables**:
```javascript
const [description, setDescription] = useState('');
const [amount, setAmount] = useState('');
```

**State Lifecycle**:

| State Variable | Initial | On Input | On Submit |
|---|---|---|---|
| description | '' | Updated on change | Cleared after success |
| amount | '' | Updated on change | Cleared after success |

**State Flow**:

```
Load Component:
  description: ''
  amount: ''
  Form controls show empty
  
User types in description field:
  description: 'Rent Payment'  // real-time update
  
User types in amount field:
  amount: '50000'              // real-time update
  
User clicks submit:
  Validation: if (!description || !amount) return
  If valid:
    API call: saveTransaction({ description, amount })
    On success:
      description: ''          // Clear
      amount: ''               // Clear
    On failure:
      (no error handling)
      fields retain values

Form ready for next entry
```

**State Binding**:
```javascript
// Two-way binding
<input 
  className="form-control" 
  value={description}
  onChange={(e) => setDescription(e.target.value)} 
/>

<input 
  className="form-control" 
  type="number" 
  value={amount}
  onChange={(e) => setAmount(e.target.value)} 
/>
```

---

### 2.4 CategoryGroups.js State Management

**State Variables**:
```javascript
const [grouped, setGrouped] = useState({});
```

**Hooks Used**:
```javascript
useEffect(() => {
  fetchGrouped().then((res) => setGrouped(res.data));
}, []);  // Dependency array is empty - runs only on mount
```

**State Lifecycle**:

| Phase | Value | Trigger |
|-------|-------|---------|
| Component Mount | {} (empty object) | Initial state |
| After API Call | Grouped transactions object | useEffect runs |
| On Error | {} (empty object) | Error silently ignored |

**Data Structure**:
```javascript
{
  "Category Name": [
    { description: "...", amount: ... },
    { description: "...", amount: ... }
  ]
}
```

**Issue**: Different structure than App.js groupedData
- App.js: nested with subcategories
- CategoryGroups: flat category structure?

---

### 2.5 TransactionList.js State Management

**No State**: Purely presentational component

```javascript
// Props only
export default function TransactionList({ transactions }) {
  // No useState
  // No useEffect
  // Just renders prop data
}
```

---

## 3. Session Data Handling

### 3.1 Session Storage Detection

**Current Implementation**: No explicit session handling detected

**What's NOT Implemented**:
- ❌ Session tokens storage
- ❌ User authentication state
- ❌ Session timeout detection
- ❌ Session validation
- ❌ Session refresh logic

**Default React Behavior**:
- All state lost on page refresh
- No automatic session persistence
- No session cookies visible in code

---

### 3.2 File State Persistence

**Current Behavior**:
```
User uploads file
  ↓
file stored in ExcelUpload state
  ↓
Page refresh
  ↓
State lost - file reset to null
  ↓
User must select file again
```

**No Persistence**:
- Browser file input cleared
- Upload state lost
- No recovery mechanism

---

## 4. Local Storage Usage

### 4.1 Local Storage Implementation

**Current Status**: ❌ Not used

**Code Search Results**: No `localStorage` calls found
- No `localStorage.setItem()`
- No `localStorage.getItem()`
- No `sessionStorage` usage

**Data Not Persisted to LocalStorage**:
- ❌ Uploaded transactions
- ❌ Grouped data
- ❌ User preferences
- ❌ Form data
- ❌ File upload history

---

### 4.2 Data Loss Scenarios

**Scenario 1: Page Refresh**
```
User uploads file
  ↓
Sees grouped results
  ↓
Refreshes page (F5)
  ↓
All state lost
  ↓
Back to empty state
  ↓
Must upload again
```

**Scenario 2: Browser Close**
```
User uploads and views data
  ↓
Browser closes
  ↓
All state cleared (RAM)
  ↓
No backup in storage
  ↓
Data permanently lost (frontend side)
```

**Scenario 3: Tab Switch**
```
User in Tab 1: Upload data, see results
  ↓
Switch to Tab 2
  ↓
Switch back to Tab 1
  ↓
State still exists (same browser window)
  ↓
Data visible
```

---

## 5. Service-Based State Sharing

### 5.1 API Service Structure

**File**: `src/api.js`

**Service Pattern**: Procedural API calls without state

```javascript
// No class-based service
// No instantiated service object
// Direct export of functions

export const saveTransaction = (transaction) =>
  axiosInstance.post('/categorize', transaction);

export const fetchTransactions = () => 
  axiosInstance.get('');

export const fetchGrouped = () => 
  axiosInstance.get('/grouped');

export const uploadStatement = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
```

**Characteristics**:
- No state managed in service
- Pure API call functions
- No caching
- No request deduplication
- No error state storage

---

### 5.2 Axios Instance Configuration

**File**: `src/api.js`

**Instance Setup**:
```javascript
const API_BASE = 'http://localhost:8080/api/transactions';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 5000000,  // 5 million ms (!) - very long
});
```

**Interceptors**:
```javascript
axiosInstance.interceptors.response.use(
  (response) => response,        // Pass through success
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);  // Re-throw error
  }
);
```

**Error Handling**:
- Logs error to console
- Re-throws error to caller
- Caller responsible for handling

---

### 5.3 Data Sharing Between Components

**Current Pattern**:
```
App (Root State)
├─ groupedData (state)
├─ handleUploadComplete (function)
│  
└─ ExcelUpload (Child)
   └─ onUploadComplete (callback prop)
      └─ Calls parent function
```

**Issue**: Only unidirectional
- Parent → Child: via props
- Child → Parent: via callbacks
- No sibling communication
- No global data sharing

**Example: Sharing groupedData**
```javascript
// App.js
const [groupedData, setGroupedData] = useState(null);

// App tries to share with TransactionList
// NOT DONE IN CODE - would need:
<TransactionList transactions={??} />
// No way to get transactions from groupedData easily

// CategoryGroups fetches separately
const [grouped, setGrouped] = useState({});
useEffect(() => {
  fetchGrouped().then((res) => setGrouped(res.data));
}, []);
// Duplicate API calls for same data
```

---

## 6. State Persistence Patterns

### 6.1 Current Persistence Approach

**Persistence Method**: None

**Data Lifetime**:
```
Data created in browser memory
    ↓ (on page refresh)
    ↓ Data cleared from RAM
    ↓ Nothing in localStorage
    ↓ Nothing in sessionStorage
    ↓ Data permanently lost
```

---

### 6.2 What Could Be Persisted

**If LocalStorage Implemented**:

```javascript
// Save to localStorage on mount
useEffect(() => {
  const savedGrouped = localStorage.getItem('groupedData');
  if (savedGrouped) {
    setGroupedData(JSON.parse(savedGrouped));
  }
}, []);

// Save when state changes
useEffect(() => {
  if (groupedData) {
    localStorage.setItem('groupedData', JSON.stringify(groupedData));
  }
}, [groupedData]);
```

**Persistence Candidates**:
1. Grouped transaction data
2. Form field values
3. Upload history
4. User preferences
5. Category customizations

---

## 7. State Optimization Issues

### 7.1 Duplicate API Calls

**Issue**: Multiple components fetch same data

```
App.js:
  └─ fetchGrouped() on upload complete
     ↓ GET /api/transactions/grouped

CategoryGroups.js:
  └─ fetchGrouped() on mount
     ↓ GET /api/transactions/grouped

Result: Same endpoint called twice for potentially same data
```

**Without Shared State**:
- No data sharing mechanism
- Each component independently fetches
- No request deduplication
- Network overhead

**If Shared State Existed**:
```javascript
// Single fetch in App
const [groupedData, setGroupedData] = useState(null);

// CategoryGroups receives via props
<CategoryGroups data={groupedData} />

// Eliminates duplicate API call
```

---

### 7.2 Missing Caching

**Current State**: No caching layer

```javascript
// Every component calls API independently
const CategoryGroups = () => {
  const [grouped, setGrouped] = useState({});
  
  useEffect(() => {
    // Always fetch, no cache check
    fetchGrouped().then((res) => setGrouped(res.data));
  }, []);
};
```

**Potential Caching**:
```javascript
// Could implement in api.js
const cache = {};

export const fetchGroupedWithCache = () => {
  if (cache.grouped) {
    return Promise.resolve({ data: cache.grouped });
  }
  return fetchGrouped().then(res => {
    cache.grouped = res.data;
    return res;
  });
};
```

---

## 8. State Flow Diagrams

### 8.1 Upload & Data Flow

```
User Action
    ↓
ExcelUpload.handleUpload()
    ├─ setLoading(true)
    ├─ uploadStatement(file) [ASYNC]
    │  └─ POST /api/transactions/upload
    │     ↓ Server processes
    │     ↓ Returns success
    ├─ onUploadComplete(res.data) [CALLBACK]
    │  └─ Triggers App.handleUploadComplete()
    │     ├─ fetchGrouped() [ASYNC]
    │     │  └─ GET /api/transactions/grouped
    │     │     ↓ Server returns grouped data
    │     └─ setGroupedData(res.data)
    │        └─ STATE UPDATED
    └─ setLoading(false)
       └─ Button re-enabled

COMPONENT RE-RENDER
    ↓
{groupedData && ...render}
    ↓
Grouped results display
```

### 8.2 ComponentState Dependencies

```
App
├─ [groupedData]
├─ Calls ExcelUpload.onUploadComplete
└─
ExcelUpload
├─ [file] (input state)
├─ [loading] (UI indicator)
└─
CategoryGroups (Independent)
├─ [grouped] (fetches independently)
└─
TransactionForm (Independent)
├─ [description, amount]
└─
TransactionList (No state)
└─ Receives props: transactions
```

---

## 9. Memory Leaks & Performance

### 9.1 useEffect Cleanup

**App.js**:
```javascript
useEffect not used
// No cleanup needed
```

**CategoryGroups.js**:
```javascript
useEffect(() => {
  fetchGrouped().then((res) => setGrouped(res.data));
}, []);  // Empty dependency - runs once on mount

// ISSUE: No cleanup
// If component unmounts during API call:
//   - Component removed from DOM
//   - setGrouped() still called
//   - "Can't perform a React state update on an unmounted component"
//   - Warning in console
```

**Better Pattern**:
```javascript
useEffect(() => {
  let isMounted = true;  // Track mount status
  
  fetchGrouped().then((res) => {
    if (isMounted) {     // Only set if still mounted
      setGrouped(res.data);
    }
  });
  
  return () => {
    isMounted = false;   // Cleanup on unmount
  };
}, []);
```

### 9.2 Memory Management

**Current State Sizes**:
- `groupedData`: Object size depends on transaction count
- `file`: File object reference (not full copy)
- `grouped`: Same as above
- `description`, `amount`: Strings (minimal)

**Memory Growth**:
- Large transaction files could consume significant memory
- No automatic cleanup on unmount
- File object kept in state indefinitely
- No pagination for large datasets

---

## 10. Summary Table

| Aspect | Implementation | Quality | Notes |
|--------|---|---|---|
| State Management | Component-level only | ⚠️ Limited | No global state |
| Session Handling | None | ❌ Missing | No auth state |
| Local Storage | Not used | ❌ Not Implemented | Data lost on refresh |
| Service-Based State | No state in services | ✅ Clean | But causes duplication |
| State Persistence | No persistence | ❌ None | Everything in RAM |
| Data Sharing | Props & callbacks | ⚠️ Limited | No sibling sharing |
| Error State | Not tracked | ❌ Missing | Silent failures |
| Cache Implementation | No cache | ❌ Missing | Duplicate API calls |
| Memory Cleanup | Incomplete | ⚠️ Issues | Potential memory leaks |
| Async Handling | Promise-based | ⚠️ Incomplete | No cleanup in effects |

---

## 11. Recommendations for Improvement

**High Priority**:
1. Implement Context API for shared state (groupedData)
2. Add proper error state management
3. Implement useEffect cleanup
4. Add localStorage persistence for key data

**Medium Priority**:
1. Implement caching in API service
2. Deduplicate API calls
3. Add loading and error states

**Low Priority**:
1. Consider Redux for larger scale
2. Add session timeout handling
3. Implement data pagination

