# Multi-Document Input Guide for User Story Generation

## Overview

The `generate_user_stories` agent leverages **four analysis documents** to create enriched, complete user stories. Instead of relying on a single flow document, the agent cross-references multiple sources to produce stories with:

- ✅ Clear user intents and flows
- ✅ Associated UI components and screens
- ✅ Field validation rules and business logic
- ✅ Backend API endpoints and request/response formats

## Four Analysis Documents

### 1. User Flow Document (`1_User_Flow_Document.md`)
**Primary source for story definition**

Contains:
- User journeys and flows
- Actor roles and personas
- Interaction sequences
- Decision points and branches
- Success/failure paths

**Contributes to Stories:**
- Story title and description
- Acceptance criteria (user actions)
- Actor/role assignment

Example source:
```
Flow: Search and Filter Cards
Actor: Card Holder
Steps:
1. User enters search keywords
2. User applies filters (status, amount)
3. System displays matching cards
4. User selects a card to view details
```

### 2. Screen Inventory (`2_Screen_Inventory.md`)
**Source for UI component references**

Contains:
- Screen/page names and purposes
- Component listings (inputs, buttons, tables, etc.)
- Screen layouts and structure
- Navigation elements
- Component properties and states

**Contributes to Stories:**
- UI components section in stories
- Form field references
- Display format specifications
- Component interaction points

Example source:
```
Screen: Card Search
Components:
- SearchBar (TextField with autocomplete)
- FilterPanel (FormGroup with checkboxes)
- CardTable (DataGrid with columns: ID, Status, Amount)
- ActionButtons (View, Export)
```

### 3. Business Logic Document (`3_FE_Business_Logic_Document.md`)
**Source for validation rules and workflows**

Contains:
- Input validation rules
- Conditional logic and branching
- Business rule constraints
- Workflow states and transitions
- Error handling and edge cases

**Contributes to Stories:**
- Validation acceptance criteria
- Edge case scenarios
- Error handling requirements
- Conditional acceptance criteria

Example source:
```
Search Card Logic:
- Search input: Required, min 2 characters, max 50 characters
- Filter: Optional multiple selection
- Results: Must handle empty state
- Error case: API timeout → show retry button
```

### 4. API Mapping (`5_Backend_API_Call_Mapping.md`)
**Source for backend endpoint details**

Contains:
- Endpoint paths and methods
- Request payload structure
- Response payload structure
- Status codes and error responses
- Query parameters and headers

**Contributes to Stories:**
- API requirements section
- Integration details
- Success/error response handling
- Data contract specifications

Example source:
```
Endpoint: POST /api/v1/cards/search
Request: { keywords: string, filters: object }
Response: { cards: Card[], total: number }
Errors: 400 (validation), 401 (auth), 500 (server)
```

## Story Enrichment Process

Here's how a simple user flow becomes a complete, production-ready story:

### INPUT: Raw User Flow
```
Flow: Search and Filter Cards
Actor: Card Holder
Steps:
1. Enter search keywords
2. Apply filters
3. View matching cards
```

### ENRICHMENT STEPS

**Step 1: Add UI Component Details** (from Screen Inventory)
The story now includes which components are used:
- Use `SearchBar` (TextField) for keywords
- Use `FilterPanel` (FormGroup) for filters
- Display results in `CardTable` (DataGrid)

**Step 2: Add Validation Rules** (from Business Logic)
The story now includes constraints:
- Keyword input: Min 2 characters, max 50
- Filter selection: Optional, multiple allowed
- Results: Handle empty state with message
- Errors: Show retry button on API timeout

**Step 3: Add API Details** (from API Mapping)
The story now includes backend integration:
- Endpoint: `POST /api/v1/cards/search`
- Send: `{ keywords, filters }`
- Receive: `{ cards, total }`
- Handle: 400 (validation), 401 (auth), 500 (retry)

### OUTPUT: Complete User Story

```markdown
## US-001: Search and Filter Cards

**Actor:** Card Holder

**Acceptance Criteria:**
1. When I enter at least 2 characters in the SearchBar, 
   the system calls POST /api/v1/cards/search
2. When I select filter options in FilterPanel, 
   they're included in the API request
3. When the API returns results, they display in CardTable 
   with columns: ID, Status, Amount
4. When results are empty, show "No cards found" message
5. When API times out, show retry button

**UI Components:**
- SearchBar (TextField with autocomplete)
- FilterPanel (FormGroup with checkboxes)
- CardTable (DataGrid, sortable, paginated)
- ErrorMessage (displays API errors)

**Validation Rules:**
- Keyword: Required, min 2 characters, max 50 characters
- Filters: Optional, multiple selection allowed
- Empty state: Show default message
- API errors: 400 (validation error), 401 (auth required), 500 (retry)

**API Integration:**
- Endpoint: POST /api/v1/cards/search
- Request: { keywords: string, filters: { [key]: boolean } }
- Response: { cards: Card[], total: number }
- Error responses: 400, 401, 500
- Retry logic: Show retry button on 500 errors

**Story Points:** 5
**Sources:** 
- User Flow: 1_User_Flow_Document.md#L45
- Screen: 2_Screen_Inventory.md#L3 (Card Search)
- Logic: 3_FE_Business_Logic_Document.md#L120
- API: 5_Backend_API_Call_Mapping.md#L88
```

## Document Location Configuration

Update `config.json` to point to your analysis documents:

```json
{
  "analysisDocuments": {
    "userFlows": "output/analysis/1_User_Flow_Document.md",
    "screenInventory": "output/analysis/2_Screen_Inventory.md",
    "businessLogic": "output/analysis/3_FE_Business_Logic_Document.md",
    "apiMapping": "output/analysis/5_Backend_API_Call_Mapping.md"
  }
}
```

**Path Rules:**
- Paths are relative to the project root
- All four documents must exist before running the agent
- Paths are case-sensitive on Linux/Mac
- Use forward slashes (/) even on Windows

## Typical Document Generation Workflow

1. **reverse_engineering agent** runs first and generates all 4 analysis documents in `output/analysis/`:
   - 1_User_Flow_Document.md
   - 2_Screen_Inventory.md
   - 3_FE_Business_Logic_Document.md
   - 5_Backend_API_Call_Mapping.md

2. You update `config.json` with:
   - Your project name and description
   - Epic definitions (what work do you want to organize)
   - User roles (who are your actors)
   - API base pattern (your API convention)
   - UI framework (what components you're using)
   - Document paths (where the analysis docs are)

3. **generate_user_stories agent** runs and:
   - Reads all 4 documents
   - Extracts flows, screens, rules, and APIs
   - Cross-references them together
   - Generates enriched user stories organized by epic
   - Creates metadata for tracking

4. Output: Complete user stories with citations back to source documents

## Document Quality Impact

**The richer your analysis documents, the richer your user stories.**

| Document Quality | Story Impact |
|---|---|
| Bare minimum user flows | Stories with only acceptance criteria |
| + Screen component details | Stories include UI component references |
| + Business logic & validation | Stories include validation rules & edge cases |
| + Complete API specifications | Stories include full integration details |

**Recommendation:** Run reverse_engineering agent with `thoroughness: detailed` to maximize story quality.

## Common Issues & Troubleshooting

### Issue: "Document not found" error
**Solution:** Check that paths in `config.json` exactly match the actual file locations. Paths are case-sensitive.

### Issue: Stories are missing API details
**Solution:** Verify that `apiMapping` document path is correct and the API document contains endpoint specifications.

### Issue: Stories don't mention UI components
**Solution:** Verify that `screenInventory` document path is correct and contains screen/component definitions.

### Issue: Validation rules not appearing in stories
**Solution:** Verify that `businessLogic` document path is correct and contains field validation rules and constraints.

## Benefits of Multi-Document Input

✅ **Completeness:** Stories include flows, UI, validation, and APIs  
✅ **Consistency:** Single API mapping used across all related stories  
✅ **Traceability:** Each story cites source documents and line numbers  
✅ **Maintainability:** Update source docs, regenerate stories to refresh  
✅ **IDE Integration:** Developers can click story links to view source  
✅ **Quality:** Richer input documents = richer, more precise stories  

## How This Differs from Single-Document Approach

| Aspect | Single Document | Multi-Document |
|---|---|---|
| User flow source | Only flows | Flows + intent + actors |
| UI references | None (developer guesses) | Explicit components from inventory |
| Validation rules | None (developer interprets) | Complete rules from business logic |
| API details | None (separate documentation) | Full endpoints from API mapping |
| Story completeness | ~60% | ~95% |
| Developer handoff | Requires follow-up questions | Clear, complete requirements |

