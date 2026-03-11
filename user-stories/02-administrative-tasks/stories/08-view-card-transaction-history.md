# User Story: View Card Transaction History

**Project:** Card Maintenance System  
**Epic:** Card Administrative Tasks  
**Story Points:** 5  
**Assignee:** Frontend Developer  
**Source Flow:** FLOW 7 - View Card Transaction History  

## Description
As a card administrator, I want to view transaction history for a card with sorting and filtering options, so that I can monitor card usage and identify unusual activity.

## Acceptance Criteria (Functional Requirements with Component Names)

### Transaction History Section

#### Section Display
- **Section Title:** "Transaction History"
- **Section Type:** Collapsible accordion (on card detail page)
- **Visibility:** Always displayed (shown by default or collapsed)
- **Loading State:** "Loading..." with spinner while data fetches

#### Transactions Table
- **Table Properties:**
  - Sortable columns: Click header to toggle ascending/descending
  - Initial sort: By Date (newest first)
  - Paginated: 10 rows per page (configurable)
  - Sticky header (not required, but helpful)
  - Scrollable horizontally on mobile

#### Table Columns
- **Date:** Transaction date (YYYY-MM-DD format)
  - Sortable: Sort ascending/descending by date
  - Example: "2026-03-09"
  
- **Merchant:** Merchant/vendor name
  - Example: "Shell Gas Station", "Amazon.com", "ATM Withdrawal"
  - Truncate long names (show tooltip on hover with full name)
  
- **Amount:** Transaction amount in currency
  - Format: "$45.00", "$1,234.50"
  - Right-aligned (numeric columns)
  - Sortable: Sort by amount
  
- **Transaction Type:** Type of transaction
  - Values: Purchase, Withdrawal, Load, Adjustment, Refund, etc.
  - Example: "Purchase", "ATM Withdrawal"
  - Sortable: Sort alphabetically
  
- **Status:** Transaction status
  - Values: Completed, Pending, Declined, Cancelled
  - Color-coded badges:
    - "Completed" = Green badge (#4caf50)
    - "Pending" = Yellow/Orange badge (#ff9800)
    - "Declined" = Red badge (#f44336)
    - "Cancelled" = Gray badge (#757575)
  - Sortable: Sort alphabetically

#### Optional Features
- **Date Range Filter:**
  - Start Date input field
  - End Date input field
  - "Apply Filter" button
  - Shows transactions between selected dates (inclusive)
  - Field validation: Start date <= End date
  
- **Merchant Search:**
  - Text input field (global search across table)
  - Real-time filter (client-side or debounced API)
  - Highlights matching text in merchant column

- **Export Button:**
  - Download transactions as CSV
  - Includes all columns + additional metadata
  - File name: "transactions_[cardToken]_[date].csv"

### Empty State
- **Display When:** No transactions exist or all filtered out
- **Message:** "No transactions found"
- **Suggestion:** "Try adjusting your filters or date range"

### Loading State
- **Display When:** Data is fetching from API
- **Content:**
  - CircularProgress spinner (MUI)
  - Text: "Loading transactions..."
  - Centered in section

### UI Components Required

#### Table Components
- **Table (MUI):**
  - Props: size="small", stickyHeader={false}
  - Sortable columns: onClick handler on header cells
  - Pagination: Use TablePagination component
  
- **TableHead, TableBody, TableRow, TableCell (MUI):**
  - Standard table structure
  - Header cells are clickable (cursor pointer)
  - Sorting indicator: Up/down arrow icon on sorted column
  
- **TableSortLabel (MUI):**
  - Wraps column headers
  - Shows up/down arrow for sort direction
  - Props: active, direction, onClick

#### Pagination Components
- **TablePagination (MUI):**
  - Props: rowsPerPage, page, onPageChange, onRowsPerPageChange
  - Options: 10, 25, 50 rows per page
  - Display: "Showing X to Y of Z transactions"

#### Filter Components (Optional)
- **TextField (MUI)** × 2:
  - Start Date field
  - End Date field
  - type="date"
  - format: YYYY-MM-DD
  
- **TextField (MUI):**
  - Merchant search field
  - Placeholder: "Search merchants..."
  - onChange handler with debounce (300ms)
  
- **Button (MUI):**
  - "Apply Filter" button
  - onClick handler
  - variant="contained"

#### Status Badge
- **Chip (MUI):**
  - label: Status text ("Completed", "Pending", etc.)
  - color prop:
    - Completed: success
    - Pending: warning
    - Declined: error
    - Cancelled: default

#### Export Button (Optional)
- **Button (MUI):**
  - Icon: Download icon
  - Label: "Export CSV"
  - onClick handler
  - variant="outlined"

### API/Data Requirements

#### Get Card Transaction History
- **Endpoint:** `GET /Blam/getCardTransactionHistory`
- **Request Format:**
  ```json
  {
    "cardToken": "token_value",
    "pageNumber": 1,
    "pageSize": 10,
    "sortBy": "date",
    "sortDirection": "DESC",
    "startDate": "2026-01-01",
    "endDate": "2026-03-09"
  }
  ```
- **Request Parameters (Optional):**
  - pageNumber: 1-based page index (default: 1)
  - pageSize: Rows per page (default: 10)
  - sortBy: Column to sort by - date, merchant, amount, type, status (default: date)
  - sortDirection: ASC or DESC (default: DESC - newest first)
  - startDate: Filter start date (YYYY-MM-DD, optional)
  - endDate: Filter end date (YYYY-MM-DD, optional)
  - merchantSearch: Keyword search for merchant (optional)

#### Response Format (Success - HTTP 200)
```json
{
  "status": "SUCCESS",
  "data": {
    "transactions": [
      {
        "transactionId": "txn_001",
        "cardToken": "token",
        "date": "2026-03-09",
        "merchant": "Shell Gas Station",
        "amount": "45.00",
        "transactionType": "Purchase",
        "status": "Completed",
        "mcc": "5541",
        "merchantCategory": "Gas Stations"
      },
      {
        "transactionId": "txn_002",
        "cardToken": "token",
        "date": "2026-03-08",
        "merchant": "Amazon.com",
        "amount": "125.50",
        "transactionType": "Purchase",
        "status": "Completed",
        "mcc": "5961",
        "merchantCategory": "Direct Marketing"
      },
      {
        "transactionId": "txn_003",
        "cardToken": "token",
        "date": "2026-03-07",
        "merchant": "ATM Withdrawal - Chase Bank",
        "amount": "200.00",
        "transactionType": "Withdrawal",
        "status": "Completed",
        "mcc": "6211",
        "merchantCategory": "Securities Brokers"
      }
    ],
    "pagination": {
      "pageNumber": 1,
      "pageSize": 10,
      "totalRecords": 150,
      "totalPages": 15
    }
  }
}
```

#### Response Format (Error - HTTP 400/500)
```json
{
  "status": "ERROR",
  "message": "Failed to load transaction history",
  "code": "TRANSACTION_LOAD_ERROR"
}
```

#### Response Format (Empty Results)
```json
{
  "status": "SUCCESS",
  "data": {
    "transactions": [],
    "pagination": {
      "pageNumber": 1,
      "pageSize": 10,
      "totalRecords": 0,
      "totalPages": 0
    }
  }
}
```

### Sorting Behavior

#### Default Sort
- **Column:** Date
- **Direction:** Descending (newest first)
- **Display:** Down arrow icon on Date header

#### User Clicks Column Header
- **First Click:** Sort ascending (if not currently sorted) or toggle to descending
- **Second Click:** Toggle sort direction
- **Third Click:** Remove sort, return to default
- **Visual Indicator:**
  - Active column: Shows up/down arrow
  - Inactive columns: No arrow
  - Only one column sorted at a time

#### Internally Store Sort State
- `sortBy: "date" | "amount" | "merchant" | "type" | "status"`
- `sortDirection: "ASC" | "DESC"`

### Pagination Behavior

#### Page Navigation
- **TablePagination Component:**
  - Shows current page: "Showing X to Y of Z transactions"
  - Previous/Next buttons: Navigate between pages
  - Page number input: Jump to specific page
  - Rows per page dropdown: 10, 25, 50 options

#### OnPageChange
- Fetch new transactions for selected page
- Reset to top of page
- Show loading spinner while fetching

### Filter Behavior (Optional But Recommended)

#### Date Range Filter
- **Start Date & End Date fields:**
  - Both optional (show all if not specified)
  - Format: YYYY-MM-DD (HTML5 date input)
  - Validation: Start date <= End date
  - Error: "Start date must be before end date"
  
#### Merchant Search
- **Search Field:**
  - Real-time filtering (debounce 300ms)
  - OR: Click "Apply Filter" button
  - Case-insensitive matching
  - Filter applied client-side OR via API (server-side more scalable)
  
#### Apply Filters
- Reset pagination to page 1
- Fetch filtered transactions
- Show result count: "Found X transactions"
- Clear filter button to reset all filters

### Error Handling

#### API Call Fails
- Hide loading state
- Display error message: "Failed to load transaction history. Please try again."
- Show retry button
- Log error to console

#### Empty Results
- Display: "No transactions found"
- Suggest filtering or date range adjustment
- Clear filter button visible

#### Loading Timeout
- After 10 seconds: Show error message
- Allow user to retry

### Export CSV Feature (Optional)
- **File Format:**
  - Header row: Date, Merchant, Amount, Type, Status, MCC, Merchant Category
  - Data rows: Transaction data (same as table)
  - Encoding: UTF-8
  - Line breaks: CRLF (Windows standard)
  
- **File Name:** `transactions_[CARDTOKEN]_[YYYY-MM-DD].csv`
- **Example Content:**
  ```
  Date,Merchant,Amount,Type,Status,MCC,Merchant Category
  2026-03-09,Shell Gas Station,45.00,Purchase,Completed,5541,Gas Stations
  2026-03-08,Amazon.com,125.50,Purchase,Completed,5961,Direct Marketing
  ```

### State Management
- Store transactions list: `transactions: Transaction[]`
- Store pagination state: `page: number`, `pageSize: number`, `totalRecords: number`
- Store sorting state: `sortBy: string`, `sortDirection: string`
- Store loading state: `isLoading: boolean`
- Store error state: `error: string | null`
- Store filters: `filterState: { startDate?, endDate?, merchantSearch? }`

## Implementation Notes
- Load transaction history asynchronously when section mounts or becomes visible
- Display tooltip on merchant column for long names
- Use react-table library optional for advanced sorting/pagination (if needed)
- Cache transaction data in Redux or Context (consider memory for large datasets)
- PreFetch next page of transactions when user nears end of current page (UX optimization)
- Show last refresh timestamp: "Updated: 3 minutes ago" with refresh button
- Auto-refresh transactions every 5-10 minutes if section is visible
- Amount values are right-aligned (numeric alignment)
- Currency format consistent across app
- Date format consistent: YYYY-MM-DD or MM/DD/YYYY (confirm with design)
- Status colors:
  - Completed/Success: Green (#4caf50)
  - Pending: Orange (#ff9800)
  - Declined/Error: Red (#f44336)
  - Cancelled: Gray (#757575)
- Accessibility:
  - Table has proper headers (aria-label on sortable columns)
  - Pagination buttons: aria-label="Next page", "Previous page"
  - Status badge: aria-label="Status: Completed"
  - Search field: placeholder text + aria-label
  - Sortable headers: aria-label="Sort by Date, currently sorted ascending"
- Test scenarios:
  - Large transaction list (1000+ rows) - test pagination
  - No transactions (empty state)
  - Filter results to zero transactions
  - Very long merchant names
  - Rapid pagination (performance test)
  - Sort by each column
  - CSV export with special characters in merchant names
