# User Stories

This folder contains all user stories organized by feature area. Each feature area has an associated epic, acceptance criteria, and metadata for Jira integration.

## Quick Start: Understanding Multi-Document Input

📖 **New to this workflow?** Read [MULTI_DOCUMENT_INPUT_GUIDE.md](MULTI_DOCUMENT_INPUT_GUIDE.md) to understand how user stories are generated from four analysis documents (User Flows, Screen Inventory, Business Logic, and API Mapping).

**Key Points:**
- ✅ Stories are generated from multiple analysis documents, not manual creation
- ✅ Stories include UI components, validation rules, and API endpoints
- ✅ Update `config.json` to point to your project's analysis documents
- ✅ Run `generate_user_stories` agent to create/update all stories

## Folder Structure

```
user-stories/
├── 00-search-and-manage-cards/       # Epic: Card Search & Management
│   ├── stories/                      # Story files for this epic
│   │   ├── 01-card-search-interface.md
│   │   ├── 02-search-results-table.md
│   │   ├── 03-view-card-details.md
│   │   ├── 04-edit-card-information.md
│   │   └── 05-bulk-operations.md
│   ├── epic.md                       # Epic definition
│   └── metadata.json                 # Jira sync status & story metadata
├── 01-card-features/                 # Epic: Card Features
│   ├── stories/
│   │   └── 06-direct-deposit-management.md
│   ├── epic.md
│   └── metadata.json
├── 02-administrative-tasks/          # Epic: Administrative Tasks
│   ├── stories/
│   │   ├── 07-reset-card-pin.md
│   │   └── 08-view-card-transaction-history.md
│   ├── epic.md
│   └── metadata.json
├── config.json                       # Master feature configuration
├── metadata.template.json            # Template for creating new metadata files
└── README.md                         # This file
```

## Features

### 00 - Search & Manage Cards
Core functionality for searching, viewing, and managing card information.

**Stories:**
- Card Search Interface - allows users to search for cards with filters
- Search Results Table - displays search results in tabular format
- View Card Details - shows detailed information for a selected card
- Edit Card Information - allows editing of card details
- Bulk Operations - enables bulk actions on multiple cards

### 01 - Card Features
Feature-specific functionality and requirements.

**Stories:**
- Direct Deposit Management - manage direct deposit settings for cards

### 02 - Administrative Tasks
Administrative operations and card management tasks.

**Stories:**
- Reset Card PIN - allows administrators to reset card PINs
- View Card Transaction History - displays historical transactions for a card

## Metadata

Each feature area has a `metadata.json` file that tracks:
- **Epic Information**: Jira key, creation date, sync status
- **Story List**: Individual story status, Jira keys, and sync hashes
- **Sync Status**: Last sync date, errors, version tracking
- **Change Detection**: Hash-based tracking to identify when stories need re-publishing

## Jira Integration Workflow

1. **Generate User Stories**: `generate_user_stories.md` agent creates/updates story files and metadata
2. **Publish to Jira**: `publish_to_jira.md` agent syncs stories to Jira and updates metadata
3. **Orchestrate**: `orchestrators/end_to_end_workflow.md` coordinates the entire process

### Status Workflow

```
pending → synced → (unchanged)
                 → (changed) → needs_update → synced
```

## Story File Format

Each story file contains:
- Story ID and Title
- User Story Format (As a [role], I want [action], so that [benefit])
- Acceptance Criteria (numbered list)
- UI/UX Specifications
- API Endpoints
- Error Handling
- Accessibility Requirements

## Adding New Stories

1. Create new `.md` file in appropriate feature area's `stories/` folder
2. Add entry to that feature area's `metadata.json`
3. Run `end_to_end_workflow.md` orchestrator to sync to Jira

## Configuration

**See `config.json` for all configuration options:**

```json
{
  "project": { "name", "description" },
  "analysisDocuments": {
    "userFlows": "path/to/1_User_Flow_Document.md",
    "screenInventory": "path/to/2_Screen_Inventory.md",
    "businessLogic": "path/to/3_FE_Business_Logic_Document.md",
    "apiMapping": "path/to/5_Backend_API_Call_Mapping.md"
  },
  "epics": [ { "name", "key", "folder", "description" } ],
  "userRoles": ["Role1", "Role2"],
  "apiBasePattern": "/api/v1",
  "storyPointOptions": [3, 5, 8, 13],
  "projectDomain": "domain-name",
  "uiFramework": "Framework"
}
```

**Important:** Update the `analysisDocuments` paths to match where your reverse_engineering outputs are located.

## Configuration
- Feature area mappings
- Story file associations
- Jira project keys per feature

See `metadata.template.json` for the structure to use when creating new `metadata.json` files.
