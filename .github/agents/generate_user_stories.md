---
name: generate_user_stories
description: "Generate structured user stories using multiple analysis documents (flows, API mapping, screens, business logic)"
---

# User Story Generation Agent (Multi-Document Input)

> **Purpose:** Autonomously generate rich, detailed user stories from multiple analysis documents for ANY project.
> 
> **Input:** 
> - User Flow Document (flows & user interactions)
> - API Mapping Document (endpoint details & data structures)
> - Screen Inventory (UI components & layouts)
> - Business Logic Document (field validation, rules, workflows)
> 
> **Output:** Individual user story files organized by epic in feature-based folders with metadata tracking
> 
> **Format:** Markdown files following the user story template + automatic `metadata.json` updates

## Agent Instructions

### Mission
Parse multiple analysis documents (User Flows, API Mapping, Screen Inventory, Business Logic) and cross-reference them to generate comprehensive, detailed user story files. Each story includes accurate API endpoints, UI components, validation rules, and acceptance criteria drawn from the actual analysis.

### Configuration Setup (REQUIRED BEFORE RUNNING)

Before running this agent, create/update **`user-stories/config.json`**:

```json
{
  "project": {
    "name": "Your Project Name",
    "description": "Project description"
  },
  "analysisDocuments": {
    "userFlows": "output/analysis/1_User_Flow_Document.md",
    "screenInventory": "output/analysis/2_Screen_Inventory.md",
    "businessLogic": "output/analysis/3_FE_Business_Logic_Document.md",
    "apiMapping": "output/analysis/5_Backend_API_Call_Mapping.md"
  },
  "epics": [
    {
      "name": "Epic Name 1",
      "key": "epic-1",
      "folder": "00-epic-name-1",
      "description": "Description of what this epic covers"
    },
    {
      "name": "Epic Name 2",
      "key": "epic-2",
      "folder": "01-epic-name-2",
      "description": "Description of what this epic covers"
    }
  ],
  "userRoles": [
    "Role 1",
    "Role 2",
    "Role 3"
  ],
  "apiBasePattern": "/api/v1",
  "storyPointOptions": [3, 5, 8, 13],
  "projectDomain": "Your domain/context",
  "uiFramework": "MUI"
}
```

### Output Specifications
- **Base Location:** `user-stories/` (root-level folder)
- **Feature-Based Organization:** Stories organized by epic (as defined in `config.json`)
  - Example: `user-stories/00-epic-name-1/stories/`
  - Example: `user-stories/01-epic-name-2/stories/`
- **File Naming:** `[number]-[story-title].md` (kebab-case, without epic prefix)
  - Example: `01-feature-name.md` (stored in appropriate epic folder)
- **Metadata Updates:** Update `metadata.json` in each epic folder with:
  - Story file path (relative to metadata.json)
  - Story title and description
  - Initial status: "pending"
  - Hash: null (will be calculated by publish agent)
  - synced_at: null (will be set after Jira publish)
- **File Structure:** One user story per file
- **Format:** Follow the template below exactly

### Processing Steps

1. **Read Configuration** 
   - Load `user-stories/config.json` to get project metadata and epic mappings
   - Get paths to all analysis documents

2. **Read All Analysis Documents**
   - User Flow Document → flows, user roles, interactions
   - Screen Inventory → UI components, screen structure
   - Business Logic Document → field validation rules, workflows
   - API Mapping Document → endpoints, request/response formats

3. **Extract Story Data**
   - From User Flows: Identify each discrete FLOW as a user story
   - From Screen Inventory: Get component names, layouts, element references
   - From Business Logic: Extract validation rules, error handling, workflows
   - From API Mapping: Find endpoint paths, data structures, error codes

4. **Enrich Story Details**
   - Link each flow to screens used (from Screen Inventory)
   - Link each screen interaction to API calls (from API Mapping)
   - Attach validation rules to input fields (from Business Logic)
   - Include field-level acceptance criteria

5. **Map to Epics**
   - Map each story to an Epic from config.json
   - Use the `folder` value from epics array
   - Example: Epic "Epic Name 1" → folder `user-stories/00-epic-name-1/stories/`

6. **Generate Story Files**
   - Create markdown files with standardized naming: `[number]-[story-title].md`
   - Place in appropriate epic folder
   - Include sections: Description, Acceptance Criteria (with field-level details), UI Components (with screen references), API Requirements, Implementation Notes

7. **Update Metadata**
   - Create/update `metadata.json` in each epic folder
   - Set file path, status ("pending"), hash (null), synced_at (null)
   - Track data sources for each story

8. **Cross-Reference Sources**
   - Add citations to source documents in each story
   - Link to specific screens from Screen Inventory
   - Link to specific API endpoints from API Mapping

## User Story Template (Generic - Personalize with config.json values)

```markdown
# User Story: [Story Title]

**Project:** [PROJECT_NAME from config.json]  
**Epic:** [Epic Name from config.json]  
**Story Points:** [Select from config.json storyPointOptions]  
**Assignee:** [UX Designer / Frontend Developer]  
**Source Flow:** [Reference to flow document section]  

## Description
As a [USER_ROLE from config.json], I want to [ACTION], so that [BENEFIT]

## Acceptance Criteria (Functional Requirements with Component Names)

### Input Field / Component Name
- **Validation Rules:**
  - Rule 1
  - Rule 2
  - Rule 3

### Validation Indicators
- Visual feedback type (error/success/warning)
- Message display location
- Error message format

### UI Components Required
- Component 1 (specify component from config.uiFramework)
- Component 2
- Component 3

### API/Data Requirements
- Endpoint: `[config.apiBasePattern]/endpoint-path`
- Request/Response format
- Error handling

## Implementation Notes
[Additional technical notes for developers]
```

**Key Customization Rules:**
- Replace `[PROJECT_NAME]` with `config.project.name`
- Replace `[USER_ROLE]` with any role from `config.userRoles`
- Replace `[Epic Name]` with matched epic from `config.epics[].name`
- Use `config.apiBasePattern` for API endpoint prefixes
- Reference `config.uiFramework` for component recommendations
- Reference `config.storyPointOptions` for valid point values

---

## How Multi-Document Input Enriches Stories

### Document Contributions

| Document | Contributes To | Data Examples |
|----------|---|---|
| **User Flows** | Story description, user roles, interactions | "As a user, I search for cards..." |
| **Screen Inventory** | UI Components section, layouts | "TextField MUI, Button variant='contained'" |
| **Business Logic** | Validation rules, field constraints | "Min 2 characters, email format" |
| **API Mapping** | API Requirements, endpoints, formats | "POST /api/search, request/response structure" |

### Example: Single Flow → Enriched Story

**From User Flows Document:**
```
FLOW: Search and Filter Cards
- User enters search criteria
- System returns matching cards
```

**Enriched with Screen Inventory:**
```
- TextInput component (Material UI TextField)
- FilterDropdown component (Material UI Select)
- ResultsTable (Material UI Table)
```

**Enriched with Business Logic:**
```
Validation: Search field minimum 2 characters
Error: "Search criteria must be at least 2 characters"
Submit: Disabled until validation passes
```

**Enriched with API Mapping:**
```
Endpoint: POST /api/v1/search
Request: { searchCriteria, filters }
Response: { results[], totalCount, errors[] }
Error Codes: 400 (validation), 401 (auth), 500 (server)
```

**Final Story includes all above in organized sections with complete, actionable details.**

---

## Using This Agent for Your Project

### Quick Start Checklist

- [ ] Create or update `user-stories/config.json` with YOUR project details
- [ ] Verify flow document path is correct (from config.json)
- [ ] Define YOUR epics and user roles in config.json
- [ ] Ensure flow document exists and contains user flows to process
- [ ] Run: "Generate user stories from [project name] flow document"

### Configuration Examples for Different Projects

**Example 1: E-Commerce Platform**
```json
{
  "project": {
    "name": "E-Commerce Platform",
    "description": "Online shopping platform"
  },
  "analysisDocuments": {
    "userFlows": "output/analysis/1_User_Flow_Document.md",
    "screenInventory": "output/analysis/2_Screen_Inventory.md",
    "businessLogic": "output/analysis/3_FE_Business_Logic_Document.md",
    "apiMapping": "output/analysis/5_Backend_API_Call_Mapping.md"
  },
  "epics": [
    { "name": "Product Browse", "key": "browse", "folder": "00-product-browse" },
    { "name": "Shopping Cart", "key": "cart", "folder": "01-shopping-cart" },
    { "name": "Checkout", "key": "checkout", "folder": "02-checkout" }
  ],
  "userRoles": ["Customer", "Seller", "Admin"],
  "apiBasePattern": "/api/v1",
  "storyPointOptions": [3, 5, 8, 13],
  "projectDomain": "e-commerce",
  "uiFramework": "React/MUI"
}
```

**Example 2: Document Management System**
```json
{
  "project": {
    "name": "Document Management System",
    "description": "Enterprise document repository"
  },
  "analysisDocuments": {
    "userFlows": "output/analysis/1_User_Flow_Document.md",
    "screenInventory": "output/analysis/2_Screen_Inventory.md",
    "businessLogic": "output/analysis/3_FE_Business_Logic_Document.md",
    "apiMapping": "output/analysis/5_Backend_API_Call_Mapping.md"
  },
  "epics": [
    { "name": "Document Upload", "key": "upload", "folder": "00-document-upload" },
    { "name": "Document Search", "key": "search", "folder": "01-document-search" },
    { "name": "Access Control", "key": "access", "folder": "02-access-control" }
  ],
  "userRoles": ["Document Creator", "Reviewer", "Administrator"],
  "apiBasePattern": "/rest/api/1.0",
  "storyPointOptions": [3, 5, 8, 13],
  "projectDomain": "document-management",
  "uiFramework": "Vue/Vuetify"
}
```

---

## How This Agent Works (For Different Codebases)

1. **Setup Phase (One-time):**
   - Create `user-stories/config.json` with YOUR project details
   - Update epic names, user roles, and API patterns for your domain
   - Provide path to YOUR flow document

2. **Generation Phase (Automated):**
   - Agent reads the flow document you specified
   - Parses flows and maps to YOUR epics
   - Generates stories using YOUR project context (from config.json)
   - Creates folders and files matching YOUR structure

3. **Result:**
   - User stories tailored to YOUR project
   - Consistent with YOUR API patterns
   - Organized by YOUR epics
   - Using YOUR framework components

---

## FAQ

**Q: Can I use this for non-web projects?**  
A: Yes! The agent works for any project with flows and user stories. Adjust `config.uiFramework` and `projectDomain` accordingly.

**Q: What if my flow document is in a different format?**  
A: The agent reads markdown. If your flows are in another format, convert to markdown first, or specify the path to your flow document in config.json.

**Q: Can I have more than 3 epics?**  
A: Yes! Add as many epics as needed to the `config.json` epics array. The agent will create folders for each.

**Q: Do I need to update config.json every time?**  
A: No—once you set it up, it stays the same. The agent reads it for each run.

**Q: What if my project doesn't have a structured flow document yet?**  
A: The agent needs some definition of flows. You can:
1. Create a simple flow document in markdown
2. List key user journeys
3. Provide role and interaction details
4. Run the agent

**Q: Can I integrate this with Jira?**  
A: Yes! The generated user stories have metadata ready for the `publish_to_jira` agent.

---

## Summary

This agent is now a **generic, reusable template** that works with:
- ✅ Any project type (web, mobile, API, etc.)
- ✅ Any tech stack (React, Vue, .NET, Python, etc.)
- ✅ Any UI framework (MUI, Bootstrap, Tailwind, etc.)
- ✅ Any API pattern (/api/v1, /rest/, custom patterns, etc.)
- ✅ Any number of epics and user roles

**To use it:** Create `config.json`, define your epics and project context, and run the agent with your flow document. The rest is automated.
