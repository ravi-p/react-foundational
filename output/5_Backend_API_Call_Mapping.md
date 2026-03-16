# Backend API Call Mapping - Transaction Categorizer

## Executive Summary
This document provides a comprehensive mapping of all HTTP endpoints called from the frontend, including request/response structures, error handling, and integration patterns.

---

## 1. API Configuration

### 1.1 Base Configuration

**File**: `src/api.js`

**Base URL**:
```javascript
const API_BASE = 'http://localhost:8080/api/transactions';
```

**Axios Instance**:
```javascript
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 5000000,  // 5 million milliseconds (!) = ~5555 seconds
});
```

**Note on Timeout**: The 5,000,000ms timeout is extremely long (and likely unintentional). Standard timeouts are 5,000ms-30,000ms.

---

### 1.2 Interceptor Configuration

**Response Interceptor**:
```javascript
axiosInstance.interceptors.response.use(
  (response) => response,              // Success: pass through unchanged
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);      // Error: log then re-throw
  }
);
```

**Interceptor Behavior**:
| Type | Action |
|------|--------|
| Success Response | Returned as-is to caller |
| Error Response | Logged to console, re-thrown to caller |
| Network Error | Logged to console, re-thrown to caller |

**Missing Interceptor Features**:
- ❌ No request logging
- ❌ No authentication token injection
- ❌ No request deduplication
- ❌ No retry logic
- ❌ No response normalization
- ❌ No global error handling

---

## 2. API Endpoints

### 2.1 File Upload Endpoint

**Endpoint Name**: Upload Excel Statement  
**HTTP Method**: POST  
**URL Path**: `/upload`  
**Full URL**: `POST http://localhost:8080/api/transactions/upload`

**Frontend Function**:
```javascript
export const uploadStatement = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return axiosInstance.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
```

**Request Details**:

| Property | Value |
|----------|-------|
| Method | POST |
| Content-Type | multipart/form-data |
| Body Format | FormData |
| File Parameter Name | `file` |
| File Type Expected | .xlsx (Excel) |

**Request Structure**:
```
FormData {
  file: File {
    name: "statement.xlsx",
    size: 12345,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  }
}
```

**Request Example** (multipart):
```
POST /api/transactions/upload HTTP/1.1
Host: localhost:8080
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="statement.xlsx"
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

[Binary file content]
------WebKitFormBoundary--
```

**Response Expected**:
```javascript
{
  status: 200,
  data: {
    // Unknown structure - not documented
    // Likely success indicator or error details
  }
}
```

**Error Handling**:
```javascript
try {
  const res = await uploadStatement(file);
  onUploadComplete(res.data);
} catch (err) {
  console.error('Upload failed:', err);
  alert('Upload failed. Check logs.');
}
```

**Error Response** (assumed):
```javascript
{
  status: 400 | 500,
  data: {
    error: "File format invalid" | "Server error"
  }
}
```

**Frontend Usage**:
```javascript
// Called from ExcelUpload component
const handleUpload = async () => {
  if (!file) return;
  setLoading(true);
  try {
    const res = await uploadStatement(file);
    onUploadComplete(res.data);  // Callback to parent
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Upload failed. Check logs.');
  } finally {
    setLoading(false);
  }
};
```

**Integration Points**:
- File input in ExcelUpload.js
- Trigger: User clicks "Upload Excel" button
- Success Callback: `onUploadComplete()`
- Success Effect: `App.handleUploadComplete()` fetches grouped data

---

### 2.2 Save Transaction Endpoint

**Endpoint Name**: Categorize & Save Transaction  
**HTTP Method**: POST  
**URL Path**: `/categorize`  
**Full URL**: `POST http://localhost:8080/api/transactions/categorize`

**Frontend Function**:
```javascript
export const saveTransaction = (transaction) =>
  axiosInstance.post('/categorize', transaction);
```

**Request Details**:

| Property | Value |
|----------|-------|
| Method | POST |
| Content-Type | application/json (default Axios) |
| Body Format | JSON |
| Request Timeout | 5,000,000ms |

**Request Structure**:
```javascript
{
  description: string,  // e.g., "Rent Payment"
  amount: string        // e.g., "50000"
}
```

**Request Example**:
```json
POST /api/transactions/categorize HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "description": "Rent Payment",
  "amount": "50000"
}
```

**Response Expected**:
```javascript
{
  status: 200,
  data: {
    id: "12345",
    description: "Rent Payment",
    amount: 50000,
    category: {
      category: "Housing",
      subcategory: "Rent",
      subsubcategory: null
    },
    createdAt: "2024-03-16T10:30:00Z"
  }
}
```

**Response Usage**:
```javascript
const res = await saveTransaction({ description, amount });
onSave(res.data);  // Pass response to parent callback
```

**Error Handling**:
```javascript
// NO ERROR HANDLING IMPLEMENTED
// If API returns error:
//   - Unhandled promise rejection
//   - Component breaks
//   - No user feedback

// Should be:
try {
  const res = await saveTransaction({ description, amount });
  onSave(res.data);
} catch (err) {
  // Handle error - but not implemented
}
```

**Frontend Usage**:
```javascript
// Called from TransactionForm component
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!description || !amount) return;
  
  const res = await saveTransaction({ description, amount });
  onSave(res.data);
  setDescription('');  // Clear form
  setAmount('');       // Clear form
};
```

**Integration Points**:
- TransactionForm component (currently not integrated in main page)
- Trigger: Form submission (Save button click)
- Success Action: Clear form fields

---

### 2.3 Fetch All Transactions Endpoint

**Endpoint Name**: Get All Transactions  
**HTTP Method**: GET  
**URL Path**: `/` (empty path)  
**Full URL**: `GET http://localhost:8080/api/transactions/`

**Frontend Function**:
```javascript
export const fetchTransactions = () => axiosInstance.get('');
```

**Request Details**:

| Property | Value |
|----------|-------|
| Method | GET |
| Body | None |
| Query Parameters | None |
| Request Timeout | 5,000,000ms |

**Request Example**:
```
GET /api/transactions/ HTTP/1.1
Host: localhost:8080
```

**Response Expected**:
```javascript
{
  status: 200,
  data: [
    {
      id: "1",
      description: "Café",
      amount: -500,
      category: {
        category: "Expenses",
        subcategory: "Food",
        subsubcategory: null
      }
    },
    {
      id: "2",
      description: "Salary",
      amount: 50000,
      category: {
        category: "Income",
        subcategory: "Salary",
        subsubcategory: null
      }
    }
    // ... more transactions
  ]
}
```

**Current Usage**: ❌ Not called anywhere in frontend

**Potential Use Cases**:
- Display all transactions in flat list
- TransactionList component (exists but not integrated)

---

### 2.4 Get Grouped Transactions Endpoint

**Endpoint Name**: Get Transactions Grouped by Category  
**HTTP Method**: GET  
**URL Path**: `/grouped`  
**Full URL**: `GET http://localhost:8080/api/transactions/grouped`

**Frontend Function**:
```javascript
export const fetchGrouped = () => axiosInstance.get('/grouped');
```

**Request Details**:

| Property | Value |
|----------|-------|
| Method | GET |
| Body | None |
| Query Parameters | None |
| Request Timeout | 5,000,000ms |

**Request Example**:
```
GET /api/transactions/grouped HTTP/1.1
Host: localhost:8080
```

**Response Expected**:
```javascript
{
  status: 200,
  data: {
    "Expenses": {
      "Food": [
        {
          description: "Café",
          amount: -500
        },
        {
          description: "Restaurant",
          amount: -1200
        }
      ],
      "Transport": [
        {
          description: "Uber",
          amount: -300
        }
      ]
    },
    "Income": {
      "Salary": [
        {
          description: "Monthly Salary",
          amount: 50000
        }
      ]
    }
  }
}
```

**Response Structure Analysis**:
```
{
  [Main Category]: {
    [Subcategory]: [
      { description, amount },
      ...
    ],
    ...
  },
  ...
}
```

**Frontend Usage**:
```javascript
// In App.js
const handleUploadComplete = async () => {
  try {
    const res = await fetchGrouped();
    setGroupedData(res.data);  // Store in state
  } catch (err) {
    console.error('Failed to fetch grouped data:', err);
  }
};

// In CategoryGroups.js
useEffect(() => {
  fetchGrouped().then((res) => setGrouped(res.data));
}, []);
```

**Integration Points**:
- App.js: After upload completion
- CategoryGroups.js: On component mount
- Potential Issue: Duplicate API calls for same endpoint

---

## 3. API Call Frequency & Optimization

### 3.1 Call Frequency Analysis

| Endpoint | Called From | Frequency | Optimization |
|----------|---|---|---|
| `/upload` | ExcelUpload | Manual (user-triggered) | ✅ Once per upload |
| `/categorize` | TransactionForm | Manual (user-triggered) | ✅ Once per submit |
| `/` (all transactions) | None | - | ❌ Not used |
| `/grouped` | App, CategoryGroups | 2 places | ⚠️ Duplicate calls |

### 3.2 Duplicate API Calls

**Issue**: `/grouped` endpoint called twice for same data

```
Scenario: User uploads file
  1. ExcelUpload → onUploadComplete()
     └─ triggers App.handleUploadComplete()
        └─ calls fetchGrouped()
           └─ GET /api/transactions/grouped

  2. CategoryGroups component mounts
     └─ useEffect
        └─ calls fetchGrouped()
           └─ GET /api/transactions/grouped (DUPLICATE)

Result: Same endpoint hit twice
```

**Impact**:
- Network overhead
- Server load increase
- Potential race conditions
- Data inconsistency if data changes between calls

**Solution**: Use shared state (App provides via props or Context)

---

## 4. Error Handling Patterns

### 4.1 Current Error Handling

**Interceptor Level**:
```javascript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);
```

**Component Level - ExcelUpload**:
```javascript
try {
  const res = await uploadStatement(file);
  onUploadComplete(res.data);
} catch (err) {
  console.error('Upload failed:', err);
  alert('Upload failed. Check logs.');
} finally {
  setLoading(false);
}
```

**Component Level - App**:
```javascript
try {
  const res = await fetchGrouped();
  setGroupedData(res.data);
} catch (err) {
  console.error('Failed to fetch grouped data:', err);
  // No error state, no user feedback
}
```

**Component Level - CategoryGroups**:
```javascript
useEffect(() => {
  fetchGrouped().then((res) => setGrouped(res.data));
  // NO ERROR HANDLING - unhandled rejection possible
}, []);
```

**Component Level - TransactionForm**:
```javascript
const res = await saveTransaction({ description, amount });
onSave(res.data);
// NO TRY/CATCH - error propagates, breaks component
```

---

### 4.2 Error Scenarios & Responses

| Scenario | Error Type | HTTP Status | User Feedback |
|----------|-----------|-------------|-----|
| File invalid (.txt instead of .xlsx) | Client-side | N/A | ✅ File picker prevents selection |
| File too large | Server | 413 | ❌ Generic alert shown |
| Network timeout | Network | -1 | ❌ Generic alert or silent |
| Server error | Server | 500 | ❌ Generic alert only |
| Invalid request body | Server | 400 | ❌ Silent failure |
| Missing required field | Server | 400 | ❌ Silent failure |

---

## 5. Request/Response Data Structures

### 5.1 Data Type Mapping

| Field | Frontend Type | Expected Backend Type |
|-------|---|---|
| description | string | String |
| amount | string (HTML5) | Number |
| file | File object | Binary |
| category | undefined (from user) | Object (auto-generated) |
| subcategory | undefined | String (auto-generated) |
| subsubcategory | undefined | String (auto-generated) |

### 5.2 Amount Value Handling

**Frontend Sends**:
```
User enters: 50000 (positive)
Sent to API: "50000" (string from HTML input)
```

**Backend Returns**:
```
For debit: -500 (negative)
For credit: 50000 (positive)
```

**Frontend Display**:
```
Displayed as: ₹{Math.abs(amount)}
Always positive in UI
```

**Inconsistency**: Amount sent as string, returned as number

---

## 6. API Response Handling

### 6.1 Success Response Flow

```
axiosInstance.post/get()
  ↓ Server OK (200, 201)
  ↓ Response interceptor: pass through
  ↓ Caller receives res object
  ↓ Caller uses res.data

Example:
const res = await fetchGrouped()
// res.data contains: { category: { ... } }
```

### 6.2 Error Response Flow

```
axiosInstance.post/get()
  ↓ Server error (4xx, 5xx) OR network error
  ↓ Error interceptor catches
  ↓ console.error('API error:', error)
  ↓ return Promise.reject(error)
  ↓ Promise rejects to caller
  ↓ Caller's catch block (if exists) handles

Example:
try {
  const res = await uploadStatement(file)
} catch (err) {
  // err contains error details
  alert('Upload failed')
}
```

---

## 7. API Integration in Component Lifecycle

### 7.1 App Component Lifecycle

```
Component Mount
  ↓ State initialized: groupedData = null
  ↓ ExcelUpload rendered
  ↓ Waiting for user upload
  ↓
User uploads file
  ↓ ExcelUpload.handleUpload() triggers
  ↓ POST /api/transactions/upload
  ↓ Response success
  ↓ onUploadComplete() callback fires
  ↓ App.handleUploadComplete() executes
  ├─ GET /api/transactions/grouped
  ├─ setGroupedData(res.data)
  └─ Component re-renders
      └─ Grouped results display
```

### 7.2 CategoryGroups Component Lifecycle

```
Component Mount
  ↓ State initialized: grouped = {}
  ↓ useEffect hook runs (empty dependency)
  ├─ GET /api/transactions/grouped
  └─ No cleanup on unmount
      ↓ Component render happens before data arrives
      └─ Empty state displays temporarily
      ↓
Data arrives
  ↓ setGrouped(res.data)
  ↓ Component re-renders with data

Component Unmount (while API call pending)
  ↓ setGrouped() still called (potential warning)
  └─ No isMounted check
```

---

## 8. Network Configuration

### 8.1 Timeout Settings

```javascript
timeout: 5000000  // 5 million milliseconds

Conversion:
5,000,000 ms ÷ 1,000 = 5,000 seconds
5,000 seconds ÷ 60 = 83.33 minutes
= ~1 hour 23 minutes

This is EXTREMELY long and likely a bug.
Standard timeout: 5,000-30,000ms
```

**Impact**:
- User sees loading state for up to 83 minutes
- Unresponsive UI for very long time
- Should be reduced to 30,000ms (30 seconds)

### 8.2 CORS Considerations

**Frontend Origin**: Likely `http://localhost:3000` (React dev server)  
**Backend Origin**: `http://localhost:8080`  
**Same Domain**: ❌ No (different ports)  
**CORS Required**: ✅ Yes

**CORS Headers Expected from Backend**:
```
Access-Control-Allow-Origin: http://localhost:3000 (or *)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Axios CORS**: Automatically handled by browser

---

## 9. Complete API Reference Table

| Function Name | Method | Endpoint | Input | Output | Called From |
|---|---|---|---|---|---|
| uploadStatement | POST | /upload | File | Response | ExcelUpload |
| saveTransaction | POST | /categorize | {description, amount} | Response | TransactionForm |
| fetchTransactions | GET | / | None | Array | Unused |
| fetchGrouped | GET | /grouped | None | Object | App, CategoryGroups |

---

## 10. API Performance Metrics

### 10.1 Expected Latency

| Endpoint | Operation | Typical Latency |
|---|---|---|
| /upload | Parse Excel, insert transactions | 500ms - 5s |
| /categorize | Validate, categorize, insert | 100-500ms |
| / | Fetch all (no pagination) | 50-200ms |
| /grouped | Fetch all grouped | 50-200ms |

### 10.2 Data Volume Estimates

| Endpoint | Data Size | Growth Factor |
|---|---|---|
| /upload | 0 bytes (no return body) | Single file |
| /grouped | Small-Large | O(n) with transaction count |
| / | Small-Large | O(n) with transaction count |

---

## 11. Security Considerations

### 11.1 Current Security Measures

| Aspect | Implemented | Status |
|---|---|---|
| HTTPS | ❌ HTTP only | Insecure |
| Authentication | ❌ None | Vulnerable |
| Authorization | ❌ None | Vulnerable |
| Input Validation | ⚠️ Minimal | Weak |
| CORS | ⚠️ Assumed | Unverified |
| Rate Limiting | ❌ No | Vulnerable |

### 11.2 Recommendations

**High Priority**:
1. Use HTTPS in production
2. Add authentication/authorization
3. Implement proper input validation
4. Add rate limiting

---

## 12. API Summary

| Aspect | Status | Quality Rating |
|---|---|---|
| Documentation | ❌ Minimal | 2/10 |
| Error Handling | ⚠️ Inconsistent | 4/10 |
| Error Messages | ❌ Generic | 2/10 |
| Timeout Configuration | ❌ Incorrect | 1/10 |
| Code Organization | ✅ Clean | 8/10 |
| API Efficiency | ⚠️ Duplicate calls | 5/10 |
| Security | ❌ Minimal | 2/10 |
| Type Safety | ❌ None | 1/10 |

