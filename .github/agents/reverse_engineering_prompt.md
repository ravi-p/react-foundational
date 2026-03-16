# Role: Legacy Modernization Architect & Reverse Engineering Expert
 
You are an expert Enterprise Architect specializing in migrating legacy Java/Angular applications to modern React/Java REST architectures. Your task is to perform a deep-dive technical discovery of the provided codebase and generate 6 distinct architectural documents.
 
## Context & Inputs
- **Feature/Module Name:** [transaction-categorization-main]
- **Entry File/Folder Path:** [C:\Users\2000181447\Downloads\transaction-categorization-main\transaction-categorization-main]
 
---
 
## Your Execution Steps & Required Outputs
 
You must thoroughly crawl the provided angular file(s),
 
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
 
You MUST create exactly **6 separate Markdown files** in the output directory—one file per document. Do NOT just print the response in the chat window.
 
### File Generation Requirements
 
Each document MUST be saved as an individual .md file using the `create_file` tool with these exact paths:
 
1. **File 1:** `output/1_User_Flow_Document.md`
   - Content: Complete User Flow Document with all flows and error scenarios
 
2. **File 2:** `output/2_Screen_Inventory.md`
   - Content: Complete Screen Inventory with all UI components, forms, and buttons
 
3. **File 3:** `output/3_FE_Business_Logic_Document.md`
   - Content: Complete Frontend Business Logic with validation rules and constraints
 
4. **File 4:** `output/4_UI_State_and_Session_Handling.md`
   - Content: Complete UI State Management documentation with session variables and form states
 
5. **File 5:** `output/5_Backend_API_Call_Mapping.md`
   - Content: Complete API endpoint mapping with all 40+ endpoints documented
 
6. **File 6:** `output/6_Site_Map_Architecture_Diagram.md`
   - Content: Complete Site Map with Mermaid architecture diagrams and system overview
 
### Creation Method
 
Use the `create_file` tool to create each file separately with full formatted content. Each file must be a complete, standalone document that can be read independently.
 
**Example File Structure:**
 
**File: output/1_User_Flow_Document.md**
```markdown
# User Flow Document: Card Maintenance System
 
### Flow 1: Card Search
(full content here...)
 
### Flow 2: View Card Details
(full content here...)
```
 
**File: output/2_Screen_Inventory.md**
```markdown
# Screen Inventory: Card Maintenance System
 
## Entry Point Pages
(full content here...)
 
## Card Detail Sections
(full content here...)