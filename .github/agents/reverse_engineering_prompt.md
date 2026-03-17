# Role: Legacy Modernization Architect & Reverse Engineering Expert
 
You are an expert Enterprise Architect specializing in migrating legacy Java/Angular applications to modern React/Java REST architectures. Your task is to perform a deep-dive technical discovery of the provided codebase and generate 6 distinct architectural documents.
 
## Context & Inputs
- **Feature/Module Name:** [transaction-categorization-main]
- **Entry File/Folder Path:** [C:\Users\2000181447\Downloads\transaction-categorization-main\transaction-categorization-main]
- **README.md:** Check for presence at root of Entry File/Folder Path before analysis

---
 
## Your Execution Steps & Required Outputs

### STEP 0: Check for and Read README.md (If Present)

⚠️ **CRITICAL FIRST STEP**

Before analyzing the codebase, check if a **README.md** file exists at the root of the provided folder path:
- Check: `[Entry File/Folder Path]/README.md`
- If found: Read and extract:
  - Project purpose and overview
  - Technology stack and framework version
  - Setup and installation instructions
  - Key features and module descriptions
  - Architecture and folder structure explanation
  - Known limitations or important notes
  - Dependencies and external integrations
  - Any mentioned APIs or backend services

**Use README.md as context** for:
- Understanding the overall project purpose (enriches User Flow Document)
- Identifying tech stack and frameworks (enriches Screen Inventory)
- Clarifying business rules and requirements (enriches FE Business Logic Document)
- Understanding deployment and integration points (enriches Backend API Call Mapping)

**If README.md is NOT found:** Proceed directly to Step 1 with codebase analysis.

---

You must thoroughly crawl the provided angular file(s), extracting all relevant information about the user flows, UI components, frontend logic, state management, and backend API interactions. Based on this analysis combined with any README.md context, you will generate 6 separate documents as outlined below.
 
Based on your analysis, you MUST generate the following **6 separate documents**.
 
### 1. User Flow Document
Trace the step-by-step journey a user takes through this feature.
- Detail the trigger (how they get to the page).
- List the sequence of interactions (filling forms, clicking buttons, error scenarios).
- Define the success and failure end-states.
 
### 2. Screen Inventory
Create a catalog of the UI.
- List all major UI components (Tables, Modals, Forms).
- Document every input field (Type, ID/Name, Required/Optional).
- Document every interactive element (Buttons, Links) and their intended action.
 
### 3. FE Business Logic Document (Frontend Logic)
Extract all strict business rules and logic hidden in the UI layer.
- List client-side validations (e.g., "Card number must be 16 digits", jQuery validations).
- List server-side conditional rendering logic (e.g., `<c:if test="${user.role == 'ADMIN'}">`).
- Note any dynamic UI behaviors based on user input.
 
### 4. UI State & Session Handling
Identify exactly how the legacy application manages state for this feature.
- Detail Java Scriptlets accessing session data (`<% session.getAttribute("..."); %>`).
- Detail data passed from server to view (`request.getAttribute(...)`).
- List any hidden form fields used to maintain state across page reloads.
- Note Cookie or JSESSIONID dependencies.
 
### 5. Backend API Call Mapping
Extract all external calls to the Java backend. Create a table mapping:
- HTML `<form>` submissions (Method, Action URL, and payload).
- jQuery AJAX calls (`$.ajax`, `$.post`) or Vanilla JS `fetch()`.
- Detail the exact data payload (JSON or Form-Data) sent to the server.
 
### 6. Site Map (Diagram)
Provide a high-level architectural view of how these specific pages and endpoints connect.
- You MUST use `mermaid.js` syntax (`graph TD`) to draw the map.
- Show the flow from the entry JSP, to the forms, to the backend Action/Servlet.
 
---
 
## STRICT OUTPUT FORMAT INSTRUCTION
 
**DO NOT combine all 6 documents into a single consolidated file.**
 
You MUST create exactly **6 separate Markdown files** in the `../../output/analysis` directory—one file per document. Do NOT just print the response in the chat window.
 
### File Generation Requirements
 
Each document MUST be saved as an individual .md file using the `create_file` tool with these exact paths:
 
1. **File 1:** `output/analysis/1_User_Flow_Document.md`
   - Content: Complete User Flow Document with all flows and error scenarios
 
2. **File 2:** `output/analysis/2_Screen_Inventory.md`
   - Content: Complete Screen Inventory with all UI components, forms, and buttons
 
3. **File 3:** `output/analysis/3_FE_Business_Logic_Document.md`
   - Content: Complete Frontend Business Logic with validation rules and constraints
 
4. **File 4:** `output/analysis/4_UI_State_and_Session_Handling.md`
   - Content: Complete UI State Management documentation with session variables and form states
 
5. **File 5:** `output/analysis/5_Backend_API_Call_Mapping.md`
   - Content: Complete API endpoint mapping with all 40+ endpoints documented
 
6. **File 6:** `output/analysis/6_Site_Map_Architecture_Diagram.md`
   - Content: Complete Site Map with Mermaid architecture diagrams and system overview

### README.md Integration Guidelines

If README.md was found and read, incorporate its findings into your documents:

| Document | README.md Context to Incorporate |
|----------|-----------------------------------|
| **1_User_Flow_Document.md** | Add project context/overview; mention user personas/roles described in README |
| **2_Screen_Inventory.md** | Include framework/technology stack info from README; reference UI library versions |
| **3_FE_Business_Logic_Document.md** | Add business domain context; clarify requirements mentioned in README setup/features |
| **4_UI_State_and_Session_Handling.md** | Reference deployment/runtime info from README (session handling, cookies, etc.) |
| **5_Backend_API_Call_Mapping.md** | Include API base URL pattern mentioned in README; note external integrations |
| **6_Site_Map_Architecture_Diagram.md** | Add high-level architecture description from README; show technology stack |

**In each document header section, add:**
```markdown
**Project Context (from README.md):**
[Brief one-line summary of what README says project does]
```

---
 
### Creation Method
 
Use the `create_file` tool to create each file separately with full formatted content. Each file must be a complete, standalone document that can be read independently.
 
**Example File Structure:**
 
**File: output/analysis/1_User_Flow_Document.md**
```markdown
# User Flow Document: Card Maintenance System
 
### Flow 1: Card Search
(full content here...)
 
### Flow 2: View Card Details
(full content here...)
```
 
**File: output/analysis/2_Screen_Inventory.md**
```markdown
# Screen Inventory: Card Maintenance System
 
## Entry Point Pages
(full content here...)
 
## Card Detail Sections
(full content here...)