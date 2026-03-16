# Site Map & Architecture Diagram - Transaction Categorizer

## Executive Summary
This document provides a comprehensive architectural overview of the Transaction Categorizer application, including module structure, component hierarchy, data flow diagrams, service interactions, and routing architecture—all visualized with Mermaid diagrams.

---

## 1. Module Structure Diagram

### 1.1 Application Module Hierarchy

```mermaid
graph TD
    A["Transaction Categorizer App"] --> B["Source Code: src/"]
    B --> C["Components Layer"]
    B --> D["Services Layer"]
    B --> E["UI Components"]
    B --> F["Entry Points"]
    
    C --> C1["App.js<br/>Main Container"]
    C --> C2["ExcelUpload.js<br/>File Upload"]
    C --> C3["TransactionForm.js<br/>Manual Entry"]
    C --> C4["TransactionList.js<br/>Table View"]
    C --> C5["CategoryGroups.js<br/>Grouped View"]
    
    D --> D1["api.js<br/>API Calls"]
    D --> D2["Axios Instance<br/>HTTP Client"]
    D --> D3["Interceptors<br/>Response Handler"]
    
    E --> E1["Bootstrap 5<br/>UI Framework"]
    E --> E2["MUI?<br/>Potential"]
    
    F --> F1["index.js<br/>React Root"]
    F --> F2["index.html<br/>HTML Entry"]
    F --> F3["main.tsx?<br/>Alternative"]
```

---

### 1.2 Directory Structure with Dependencies

```mermaid
graph LR
    subgraph "Frontend Structure"
        A["public/<br/>index.html"]
        B["src/"]
    end
    
    subgraph "src/ Subdirectories"
        B --> B1["index.js"]
        B --> B2["App.js"]
        B --> B3["ExcelUpload.js"]
        B --> B4["api.js"]
        B --> B5["components/"]
        B5 --> B5A["TransactionForm.js"]
        B5 --> B5B["TransactionList.js"]
        B5 --> B5C["CategoryGroups.js"]
    end
    
    subgraph "Public Assets"
        A --> A1["CSS Bootstrap"]
    end
    
    B1 --> B2
    B2 --> B3
    B2 --> B4
    B3 --> B4
```

---

## 2. Component Hierarchy Diagram

### 2.1 Component Tree Structure

```mermaid
graph TD
    Root["&lt;App /&gt;"]
    
    Root --> Upload["&lt;ExcelUpload /&gt;<br/>Props: onUploadComplete"]
    Root --> Display["Grouped Results Display<br/>Conditional Render"]
    
    Upload --> FileInput["File Input<br/>accept: .xlsx"]
    Upload --> UploadBtn["Upload Button<br/>disabled={!file || loading}"]
    
    Display --> MainLoop["Loop: mainType<br/>Object.entries"]
    MainLoop --> MainHeading["&lt;h3&gt;{mainType}&lt;/h3&gt;"]
    MainLoop --> SubLoop["Loop: subcategory<br/>Object.entries"]
    SubLoop --> SubHeading["&lt;h4&gt;{subcategory}&lt;/h4&gt;"]
    SubLoop --> TxList["&lt;ul&gt; Transactions"]
    TxList --> TxItems["&lt;li&gt;{description} - ₹{amount}"]
    
    subgraph "Not Integrated in Main Page"
        NotUsed["&lt;TransactionForm /&gt;<br/>&lt;TransactionList /&gt;<br/>&lt;CategoryGroups /&gt;"]
    end
```

---

### 2.2 Component Composition Details

```mermaid
graph LR
    subgraph "Integrated Components"
        A["App.js<br/>===<br/>▸ ExcelUpload<br/>▸ Results Display"]
    end
    
    subgraph "Available but Unused"
        B["TransactionForm.js<br/>Form with state:<br/>description, amount"]
        C["TransactionList.js<br/>Table display<br/>No state"]
        D["CategoryGroups.js<br/>Grouped display<br/>Separate API fetch"]
    end
    
    A -.->|Could integrate| B
    A -.->|Could integrate| C
    A -.->|Could integrate| D
```

---

## 3. Data Flow Diagram (Frontend to Backend)

### 3.1 Complete Data Flow for Excel Upload

```mermaid
sequenceDiagram
    participant User
    participant ExcelUpload
    participant App
    participant api.js
    participant Backend
    
    User->>ExcelUpload: Select .xlsx file
    ExcelUpload->>ExcelUpload: setFile(file)
    
    Note over User,ExcelUpload: Button becomes enabled
    
    User->>ExcelUpload: Click Upload Button
    ExcelUpload->>ExcelUpload: setLoading(true)
    ExcelUpload->>api.js: uploadStatement(file)
    api.js->>Backend: POST /upload<br/>FormData{file}
    
    Note over Backend: Process Excel<br/>Extract transactions<br/>AutomaticAssign categories
    
    Backend-->>api.js: 200 OK
    api.js-->>ExcelUpload: Response
    ExcelUpload->>ExcelUpload: onUploadComplete()
    ExcelUpload->>App: Callback: handleUploadComplete()
    
    App->>api.js: fetchGrouped()
    api.js->>Backend: GET /grouped
    
    Backend-->>api.js: Grouped data object
    api.js-->>App: Response
    App->>App: setGroupedData(res.data)
    
    Note over App: Re-render triggered
    App->>User: Display grouped results
    
    ExcelUpload->>ExcelUpload: setLoading(false)
    Note over ExcelUpload: Button back to enabled
```

---

### 3.2 Data Flow for Transaction Submission

```mermaid
sequenceDiagram
    participant User
    participant Form as TransactionForm
    participant api.js
    participant Backend
    participant Parent as Parent Component
    
    User->>Form: Enter description
    Form->>Form: setDescription(value)
    
    User->>Form: Enter amount
    Form->>Form: setAmount(value)
    
    User->>Form: Click Save button
    Form->>Form: handleSubmit(e)<br/>e.preventDefault()
    
    alt Validation Success
        Form->>api.js: saveTransaction({description, amount})
        api.js->>Backend: POST /categorize<br/>JSON body
        
        Backend-->>api.js: Categorized transaction
        api.js-->>Form: Response
        
        Form->>Parent: onSave(res.data)
        Form->>Form: setDescription('')
        Form->>Form: setAmount('')
        Form->>User: Form cleared
    else Validation Failed
        Form->>Form: Return early
        Note over Form: No API call
    end
```

---

### 3.3 Data Structures Flow

```mermaid
graph LR
    subgraph "Frontend State"
        A["ExcelUpload<br/>─────<br/>file: File<br/>loading: bool"]
        B["App<br/>─────<br/>groupedData: Object"]
        C["TransactionForm<br/>─────<br/>description: str<br/>amount: str"]
    end
    
    subgraph "API Payloads"
        D["Upload Payload<br/>─────<br/>FormData{file}"]
        E["Transaction Payload<br/>─────<br/>{description, amount}"]
        F["Query: /grouped"]
    end
    
    subgraph "Backend Response"
        G["Grouped Object<br/>─────<br/>{MainCat: {SubCat: Txns}}"]
        H["Transaction Object<br/>─────<br/>{id, description,<br/>amount, category}"]
    end
    
    A --> D
    C --> E
    D --> G
    E --> H
    F --> G
    
    G --> B
    H -.->|Via onSave| C
```

---

## 4. Service Interaction Diagram

### 4.1 API Service Layer

```mermaid
graph TD
    A["api.js<br/>Service Layer"]
    
    B["Axios Instance<br/>baseURL: localhost:8080/api/transactions<br/>timeout: 5000000ms"]
    
    A --> B
    
    C["uploadStatement(file)"]
    D["saveTransaction(transaction)"]
    E["fetchTransactions()"]
    F["fetchGrouped()"]
    
    A --> C
    A --> D
    A --> E
    A --> F
    
    C -->|POST /upload| Backend1["Backend"]
    D -->|POST /categorize| Backend1
    E -->|GET /| Backend1
    F -->|GET /grouped| Backend1
    
    Backend1 -->|Response| Interceptor["Response Interceptor<br/>─────<br/>Success: pass through<br/>Error: log + re-throw"]
    
    Interceptor --> Caller["Caller Component<br/>handles success/error"]
```

---

### 4.2 Component to API Service Flow

```mermaid
graph TB
    subgraph "Components"
        A["ExcelUpload"]
        B["TransactionForm"]
        C["App"]
        D["CategoryGroups"]
    end
    
    subgraph "API Service"
        API["api.js<br/>────────<br/>uploadStatement()<br/>saveTransaction()<br/>fetchTransactions()<br/>fetchGrouped()"]
    end
    
    subgraph "Backend Endpoints"
        E1["POST /upload"]
        E2["POST /categorize"]
        E3["GET /"]
        E4["GET /grouped"]
    end
    
    A -->|uploadStatement()| API
    B -->|saveTransaction()| API
    C -->|fetchGrouped()| API
    D -->|fetchGrouped()| API
    
    API --> E1
    API --> E2
    API --> E3
    API --> E4
    
    E1 -->|Response| A
    E2 -->|Response| B
    E3 --> API
    E4 -->|Response| C
    E4 -->|Response| D
    
    Note over C,D: Duplicate API calls!<br/>Same endpoint called twice
```

---

## 5. State Management Architecture

### 5.1 State Flow Architecture

```mermaid
graph TD
    A["Component State<br/>(No Redux/Context)"]
    
    A --> B["App Component<br/>─────<br/>groupedData"]
    A --> C["ExcelUpload Component<br/>─────<br/>file<br/>loading"]
    A --> D["TransactionForm Component<br/>─────<br/>description<br/>amount"]
    A --> E["CategoryGroups Component<br/>─────<br/>grouped"]
    
    B -->|Callback| C
    C -->|onUploadComplete| B
    
    D -->|onSave| Parent["Parent Component<br/>(not shown)"]
    E -->|Isolated| E
    
    Note over A: Props drilling via callbacks<br/>No global state
```

---

### 5.2 State Persistence Chart

```mermaid
graph LR
    A["Browser Memory<br/>(React State)"]
    
    B["Component State<br/>Variables"]
    
    C["User Actions"]
    
    D["Page Refresh"]
    
    A -->|Stores| B
    C -->|Updates| B
    B -->|Lost on| D
    
    E["localStorage<br/>(Not used)"]
    F["sessionStorage<br/>(Not used)"]
    G["IndexedDB<br/>(Not used)"]
    
    E -.->|Could backup| B
    F -.->|Could backup| B
    G -.->|Could backup| B
    
    D -->|Data Lost| H["Empty State<br/>User must reload"]
```

---

## 6. Routing Architecture Diagram

### 6.1 Routing Structure

```mermaid
graph TD
    A["index.html<br/>public/index.html"]
    
    B["App.js<br/>(No React Router)"]
    
    C["Single Page<br/>─────<br/>▸ ExcelUpload<br/>▸ Grouped Results"]
    
    A -->|Loads| B
    B -->|Renders| C
    
    D["Potential Routes<br/>(Not Implemented)"]
    D1["/ - Dashboard"]
    D2["/upload - Upload Page"]
    D3["/transactions - Transactions List"]
    D4["/categories - Category View"]
    
    D --> D1
    D --> D2
    D --> D3
    D --> D4
    
    Note over B,D: SPA with no routing<br/>All on single page
```

---

### 6.2 Navigation Flow

```mermaid
graph LR
    A["Application Start"]
    
    A --> B["Load index.html"]
    B --> C["Execute index.js"]
    C --> D["Render App.js"]
    D --> E["Display Main Page"]
    
    E --> F["Single Page<br/>No navigation<br/>All content visible"]
    
    F --> G["User Interaction"]
    
    G -->|Upload File| H["Show Upload Progress"]
    H --> I["Display Results"]
    
    G -->|Manual Entry| J["Show Form<br/>(Not integrated)"]
    
    I -->|Page Refresh| A
```

---

## 7. Component Communication Diagram

### 7.1 Props & Callbacks Flow

```mermaid
graph TD
    A["App Component<br/>Parent"]
    
    B["handleUploadComplete()<br/>function prop"]
    
    C["ExcelUpload Component<br/>Child<br/>Props: onUploadComplete"]
    
    D["onUploadComplete()<br/>callback trigger"]
    
    A -->|Passes function| B
    B -->|Passed as prop| C
    
    C -->|User uploads| D
    D -->|Calls| B
    B -->|Updates parent state| A
    
    A -->|Parent state changes| A
    A -->|Re-render with new data| E["Display Results"]
```

---

### 7.2 Data Sharing Pattern

```mermaid
graph TB
    subgraph "Data Shared"
        A["App.js<br/>groupedData state"]
    end
    
    subgraph "Consumers"
        B["Inline rendering<br/>in App.js"]
        C["TransactionList<br/>(prop: transactions)"]
        D["CategoryGroups<br/>(independent fetch)"]
    end
    
    A -->|Direct inline render| B
    A -.->|Could pass| C
    D -->|Fetches separately<br/>DUPLICATE CALL| A
    
    Note over D: Inefficient<br/>Should use App's state
```

---

## 8. Error Handling Flow

### 8.1 Error Handling Architecture

```mermaid
graph TD
    A["API Call<br/>axios.post/get"]
    
    B{Response?}
    
    C["Success<br/>200-299"]
    D["Error<br/>4xx, 5xx"]
    E["Network<br/>Error"]
    
    B -->|Yes| C
    B -->|No| D
    B -->|Network| E
    
    C --> C1["Response Interceptor<br/>Pass through"]
    C1 --> C2["Component Success<br/>Handler"]
    
    D --> D1["Response Interceptor<br/>console.error"]
    E --> E1["Response Interceptor<br/>console.error"]
    
    D1 --> D2["Promise.reject"]
    E1 --> E2["Promise.reject"]
    
    D2 --> D3{Component handles?}
    E2 --> E3{Component handles?}
    
    D3 -->|Yes| D4["catch block"]
    D3 -->|No| D5["Unhandled<br/>Error breaks"]
    
    E3 -->|Yes| E4["catch block"]
    E3 -->|No| E5["Unhandled<br/>Error breaks"]
    
    D4 --> D6["Show alert"]
    E4 --> E6["Show alert"]
    
    D5 -->|ExcelUpload| X["✓ Handled"]
    D5 -->|TransactionForm| Y["✗ Not handled"]
    D5 -->|CategoryGroups| Z["✗ Not handled"]
```

---

## 9. Complete System Architecture

### 9.1 High-Level System Diagram

```mermaid
graph TB
    subgraph "Frontend - Browser"
        HTML["index.html"]
        JS["React App<br/>src/main entry"]
        STATE["Component State"]
        
        HTML -->|Loads| JS
        JS -->|Manages| STATE
    end
    
    subgraph "UI Layer"
        UPLOAD["File Upload"]
        FORM["Transaction Form"]
        TABLE["Transaction Table"]
        GROUP["Category Groups"]
        
        JS -->|Renders| UPLOAD
        JS -->|Renders| FORM
        JS -->|Renders| TABLE
        JS -->|Renders| GROUP
    end
    
    subgraph "API Service Layer"
        API["api.js"]
        AXIOS["Axios Instance"]
        INTERCEPTOR["Response Interceptor"]
        
        UPLOAD -->|uploadStatement| API
        FORM -->|saveTransaction| API
        TABLE -.->|fetchTransactions| API
        GROUP -->|fetchGrouped| API
        
        API -->|HTTP| AXIOS
        AXIOS -->|Response| INTERCEPTOR
    end
    
    subgraph "Backend - Server"
        SERVER["Express.js<br/>localhost:8080"]
        ROUTES["/upload<br/>/categorize<br/>/grouped<br/>/"]
        DB["Database<br/>Transactions<br/>Categories"]
        
        AXIOS -->|HTTP Request| SERVER
        SERVER -->|Handle| ROUTES
        ROUTES -->|CRUD| DB
        DB -->|Response| SERVER
        SERVER -->|HTTP Response| AXIOS
    end
    
    INTERCEPTOR -->|Success/Error| JS
```

---

### 9.2 Technology Stack Pyramid

```mermaid
graph TD
    A["Frontend Stack"]
    
    B["Application Layer<br/>React Components<br/>App, ExcelUpload, TransactionForm, etc."]
    C["State Management<br/>React useState/useEffect<br/>No Redux/Context/MobX"]
    D["UI Framework<br/>Bootstrap 5<br/>CSS Classes"]
    E["HTTP Client<br/>Axios<br/>Request/Response Interceptors"]
    F["Runtime<br/>Node.js<br/>development/production"]
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    
    G["Backend Stack"]
    H["Server<br/>Express.js<br/>localhost:8080"]
    I["API Routes<br/>/upload, /categorize, /grouped, /"]
    J["Business Logic<br/>File parsing<br/>Transaction categorization"]
    K["Database<br/>Transactions & Categories"]
    
    G --> H
    H --> I
    I --> J
    J --> K
```

---

## 10. Dependency Graph

### 10.1 File Dependencies

```mermaid
graph LR
    A["index.js<br/>Entry Point"]
    B["App.js<br/>Main Component"]
    C["ExcelUpload.js"]
    D["api.js<br/>API Service"]
    E["axios"]
    F["React"]
    
    A -->|Imports| F
    A -->|Imports| B
    B -->|Imports| C
    B -->|Imports| D
    C -->|Imports| D
    D -->|Imports| E
    B -->|Imports| F
    C -->|Imports| F
    
    G["TransactionForm.js"]
    H["TransactionList.js"]
    I["CategoryGroups.js"]
    
    G -->|Imports| D
    G -->|Imports| F
    H -->|Imports| F
    I -->|Imports| D
    I -->|Imports| F
    
    J["index.html"]
    J -->|Loads| A
```

---

## 11. Data Volume & Scaling

### 11.1 Data Growth Pattern

```mermaid
graph LR
    A["1-100 Transactions"]
    B["101-1,000 Transactions"]
    C["1,001-10,000 Transactions"]
    D["10,000+ Transactions"]
    
    A -->|Performance| B
    B -->|Memory Usage ↑| C
    C -->|Rendering Speed ↓| D
    D -->|UI Becomes Slow| X["Requires<br/>Pagination/Virtualization"]
    
    E["Frontend Impact"]
    F["Backend Impact"]
    G["Network Impact"]
    
    A --- E
    B --- E
    C --> E
    C --> F
    D --> F
    D --> G
    
    H["Current Limitation:<br/>No pagination<br/>No virtual scrolling<br/>All data at once"]
```

---

## 12. Proposed Architecture Improvements

### 12.1 Recommended Enhancements

```mermaid
graph TD
    A["Current Architecture"]
    
    B["Recommendations"]
    
    B1["Add Context API<br/>for shared state"]
    B2["Implement React Router<br/>for navigation"]
    B3["Add Redux Toolkit<br/>for complex state"]
    B4["Pagination for<br/>large datasets"]
    B5["Error Boundary<br/>component"]
    B6["localStorage<br/>persistence"]
    
    A --> B
    B --> B1
    B --> B2
    B --> B3
    B --> B4
    B --> B5
    B --> B6
    
    C["Benefits"]
    C1["Reduced code duplication"]
    C2["Better navigation"]
    C3["Scalable state"]
    C4["Performance"]
    C5["Better error handling"]
    C6["Data persistence"]
    
    B1 --> C1
    B2 --> C2
    B3 --> C3
    B4 --> C4
    B5 --> C5
    B6 --> C6
```

---

## Summary

### Architecture Quality Metrics

| Aspect | Current | Target | Gap |
|--------|---------|--------|-----|
| Component Organization | ✅ Good | ✅ Good | 0 |
| State Management | ⚠️ Basic | ✅ Intermediate | Medium |
| Routing | ❌ None | ✅ Present | High |
| Error Handling | ⚠️ Inconsistent | ✅ Complete | Medium |
| Performance Optimization | ❌ None | ✅ Implemented | High |
| Code Reusability | ⚠️ Limited | ✅ High | Medium |
| Scalability | ❌ Limited | ✅ Scalable | High |
| Type Safety | ❌ None | ✅ TypeScript | High |

---

## Key Architectural Insights

1. **Simple Single-Page Application**: No routing, all content on one page
2. **Component-Only State**: No global state management (Redux, Context)
3. **Props & Callbacks Pattern**: Basic React pattern for component communication
4. **Duplicate API Calls**: Two components fetch same `/grouped` endpoint
5. **Limited Error Handling**: Inconsistent across components
6. **No Data Persistence**: All state lost on page refresh
7. **Bootstrap 5 UI**: Simple CSS framework, no component library
8. **Axios HTTP Client**: Standard setup with basic interceptors

---

## Files & Modules Reference

```javascript
// Entry Points
public/index.html
src/index.js

// Components (Integrated)
src/App.js
src/ExcelUpload.js

// Components (Available but not integrated)
src/components/TransactionForm.js
src/components/TransactionList.js
src/components/CategoryGroups.js

// Services
src/api.js

// Styling
public/index.html (Bootstrap 5 via CDN)
src/index.css (custom styles)
```

