# Comdata iConnectData - Card Management System

## Project Overview

An AI-driven card management system demonstrating modern Software Development Lifecycle (SDLC) practices powered by autonomous code agents. This project showcases how GitHub Copilot, Replit Agent, and Cursor can be orchestrated to automate requirements generation, implementation, and Jira integration.

**Status:** Production-ready proof-of-concept  
**Tech Stack:** React 19, TypeScript, Redux Toolkit, MUI, Axios, Jest  
**Repository:** [ravi-p/react-foundational](https://github.com/ravi-p/react-foundational)

---

## 🤖 AI-Driven SDLC Architecture

This project implements an **end-to-end AI-driven workflow** where intelligent agents autonomously manage the software development lifecycle:

```
┌─────────────────────────────────────────────────────────────┐
│                    AI-DRIVEN SDLC PIPELINE                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  1. REVERSE ENGINEER │  ← Parse UX flows & requirements
│     (Analysis)       │
└──────────────┬───────┘
               │
               ▼
┌──────────────────────────┐
│  2. GENERATE USER        │  ← Create structured user stories
│     STORIES              │    from analysis
│     (generate_user_      │    Feature-based organization
│      stories.md)         │    Status: pending
└──────────────┬───────────┘
               │
               ▼
┌──────────────────────────┐
│  3. PUBLISH TO JIRA      │  ← Sync stories to Jira
│     (publish_to_jira.md) │    Hash-based change detection
│                          │    Status: synced
└──────────────┬───────────┘
               │
               ▼
┌──────────────────────────┐
│  4. ORCHESTRATE          │  ← Coordinate all agents
│     (end_to_end_         │    Validate outputs
│      workflow.md)        │    Generate reports
└──────────────────────────┘
```

---

## 📋 Agent Details

### Agent 1: Generate User Stories

**Purpose:** Parse flows and generate structured user stories

**Location:** `.github/agents/generate_user_stories.md`

**Input:**
- Source: `output/analysis/1_User_Flow_Document.md`
- Format: Markdown document with continuous flows
- Content: User interactions, decision points, business logic

**Output:**
- Location: `user-stories/[feature]/stories/`
- Format: Individual `.md` files per story
- Structure:
  ```
  user-stories/
  ├── 00-search-and-manage-cards/
  │   ├── stories/
  │   │   ├── 01-card-search-interface.md
  │   │   ├── 02-search-results-table.md
  │   │   └── ... (5 total)
  │   ├── metadata.json (status: pending)
  │   └── epic.md
  ├── 01-card-features/
  │   └── stories/06-direct-deposit-management.md
  └── 02-administrative-tasks/
      └── stories/07-08-*.md
  ```

**Processing Steps:**
1. Parse `1_User_Flow_Document.md`
2. Identify discrete flows
3. Map to epics (3 total: search-manage, card-features, admin-tasks)
4. Break into granular user stories (8 total)
5. Create `.md` files in appropriate feature `/stories/` folders
6. Update each feature's `metadata.json` with story entries
7. Set initial status: `pending` (waiting for Jira sync)

**Status Field:** `pending`

---

### Agent 2: Publish to Jira

**Purpose:** Sync user stories to Jira with change detection

**Location:** `.github/agents/publish_to_jira.md`

**Input:**
- Source: `user-stories/` folder (all features)
- Format: Feature-organized story files + metadata.json
- Metadata tracked: status, hash, jira_key, synced_at

**Output:**
- Destination: Jira projects (CARDS, FEAT, ADMIN)
- Updates: metadata.json with Jira keys and hashes
- Format:
  ```json
  {
    "epic": {
      "jira_key": "CARDS-100",
      "jira_url": "https://jira.example.com/browse/CARDS-100",
      "synced_at": "2026-03-16T10:30:00Z"
    },
    "stories": [
      {
        "jira_key": "CARDS-101",
        "status": "synced",
        "hash": "sha256:abc123...",
        "synced_at": "2026-03-16T10:30:00Z"
      }
    ]
  }
  ```

**Processing Steps:**

**Phase 1: Read Configuration**
- Load `user-stories/config.json`
- Identify 3 features and their Jira project keys
- Validate folder structure

**Phase 2: Discovery**
- Scan all feature folders (00, 01, 02)
- Read metadata.json files
- Check story status (pending/synced/needs_update)
- Identify which stories need processing

**Phase 3: Change Detection**
- Calculate SHA256 hash of current story file
- Compare with stored hash in metadata
- Determine required action based on status:
  - `pending` → Create new Jira issue
  - `synced` + hash match → Skip (no changes)
  - `synced` + hash mismatch → Update existing issue
  - `needs_update` → Update existing issue

**Phase 4: Epic Management**
- Create epic in Jira if not yet created
- Store epic Jira key in metadata
- Link all stories to their feature epic

**Phase 5: Story Publishing**
- For CREATE: POST `/rest/api/3/issues` with story content
- For UPDATE: PUT `/rest/api/3/issues/{issueKey}` with updates
- Capture Jira response: issue key (e.g., "CARDS-101")
- Create clickable Jira URL

**Phase 6: Metadata Persistence**
- Update metadata.json with:
  - `epic.jira_key` and `epic.jira_url`
  - `stories[*].jira_key` - Jira issue key
  - `stories[*].jira_url` - Full URL to Jira issue
  - `stories[*].hash` - Current file hash (SHA256)
  - `stories[*].status` - "synced"
  - `stories[*].synced_at` - ISO 8601 timestamp
  - `sync_status.last_sync` - Workflow completion time

**Status Workflow:**
```
┌──────────┐
│ pending  │  ← Initial state after generation
└────┬─────┘
     │ [Create in Jira succeeds]
     ▼
┌──────────┐
│ synced   │  ← Published to Jira, hash matches file
└────┬─────┘
     │
     ├─ [No file changes] → Stay synced
     │
     └─ [File updated] → needs_update
            │
            ▼
        ┌─────────────────┐
        │  needs_update   │  ← Story changed since last publish
        └────┬────────────┘
             │ [Update in Jira succeeds]
             ▼
          synced (with new hash)
```

**Requirements:**
```bash
Environment Variables (set before running agent):
- JIRA_URL           # Jira instance URL (e.g., https://jira.company.com)
- JIRA_USERNAME      # Service account username
- JIRA_API_TOKEN     # API authentication token
```

---

### Agent 3: End-to-End Orchestrator

**Purpose:** Coordinate all agents and manage workflow

**Location:** `.github/orchestrators/end_to_end_workflow.md`

**Input:**
- Config: `user-stories/config.json`
- Analysis: `output/analysis/` documents (esp. 1_User_Flow_Document.md)
- Agents: generate_user_stories.md + publish_to_jira.md

**Output:**
- Workflow Report: Summary of all operations
- Updated Metadata: All stories with Jira keys and hashes
- Exit Code: 0 (success) or 1 (failure)

**Sequential Execution Steps:**

```
STEP 1: PARSE CONFIGURATION
├─ Load user-stories/config.json
├─ Validate structure (features array, keys)
├─ Verify Jira project keys non-empty
└─ Report: "✓ Configuration valid, found 3 features"

STEP 2: CHECK DEPENDENCIES
├─ Verify folder structure:
│  └─ user-stories/00-search-and-manage-cards/
│  ├─ user-stories/01-card-features/
│  └─ user-stories/02-administrative-tasks/
├─ Check metadata.json in each folder
├─ Check epic.md in each folder
├─ Verify Jira credentials available
└─ Report: "✓ All dependencies present"

STEP 3: INVOKE GENERATE USER STORIES AGENT
├─ Execute: generate_user_stories.md
├─ Input: output/analysis/1_User_Flow_Document.md
├─ Timeout: 5 minutes
├─ Monitor output:
│  ├─ "Parsing flow document..."
│  ├─ "Generating stories..."
│  └─ "Updating metadata.json..."
├─ On Success:
│  ├─ Count generated stories
│  ├─ Verify metadata.json updated
│  └─ Check all stories have status: "pending"
├─ On Failure:
│  ├─ Capture error message
│  ├─ Report: "✗ Story generation failed: [error]"
│  └─ EXIT with code 1
└─ Report: "✓ Generated 8 stories, metadata updated"

STEP 4: VALIDATE METADATA STATE
├─ For each feature folder:
│  └─ For each story in metadata.json:
│     ├─ Assert file path exists
│     ├─ Assert title not null
│     ├─ Assert status == "pending"
│     ├─ Assert hash == null
│     └─ Assert jira_key == null
├─ On validation failure:
│  ├─ List specific failures
│  └─ EXIT with code 1
└─ Report: "✓ Metadata validation passed"

STEP 5: CHECK JIRA CREDENTIALS
├─ Read environment variables:
│  ├─ JIRA_URL
│  ├─ JIRA_USERNAME
│  └─ JIRA_API_TOKEN
├─ Test connection to Jira
├─ On connection failure:
│  ├─ Report credentials missing/invalid
│  └─ Prompt user to set env vars
└─ Report: "✓ Jira credentials validated"

STEP 6: INVOKE PUBLISH TO JIRA AGENT
├─ Execute: publish_to_jira.md
├─ Input: user-stories/ (all features/stories)
├─ Timeout: 10 minutes
├─ Monitor output:
│  ├─ "Connecting to Jira..."
│  ├─ "Creating epics..."
│  ├─ "Publishing stories..."
│  └─ "Updating metadata..."
├─ On Success:
│  ├─ Parse story count (created/updated/failed)
│  ├─ Verify metadata.json files updated:
│  │  ├─ stories[*].jira_key populated
│  │  ├─ stories[*].hash populated
│  │  ├─ stories[*].status = "synced"
│  │  └─ stories[*].synced_at populated
│  └─ Report: "✓ Published 8 stories to Jira"
├─ On Partial Failure:
│  ├─ Report: "⚠ Published X/8 stories (Y failed)"
│  ├─ Note: Some stories partially published
│  └─ Recommend: Re-run orchestrator to sync remaining
└─ On Complete Failure:
   ├─ Capture error
   └─ EXIT with code 1

STEP 7: VALIDATE SYNC RESULTS
├─ For each feature folder:
│  └─ For each story in metadata.json:
│     ├─ Assert status == "synced"
│     ├─ Assert jira_key populated
│     ├─ Assert hash calculated (SHA256)
│     ├─ Assert synced_at recorded (ISO 8601)
│     └─ Assert epic.jira_key populated
├─ On validation failure:
│  ├─ List incomplete stories
│  └─ Exit with warning
└─ Report: "✓ All stories synced to Jira"

STEP 8: GENERATE WORKFLOW REPORT
├─ Create detailed report:
│  ├─ Workflow status (success/partial/failure)
│  ├─ Feature summary with Jira links
│  ├─ Story breakdown (CARDS-101, CARDS-102, etc.)
│  ├─ Statistics (created/updated/skipped/failed)
│  ├─ Timestamp information
│  └─ Next steps recommendations
├─ Display to:
│  ├─ Console output
│  ├─ File: workflow-report.md (optional)
│  └─ CI/CD logs
└─ Report: Complete report with actionable next steps

FINAL: WORKFLOW COMPLETE
├─ All metadata files persisted to disk
├─ All Jira issues created/updated
├─ Metadata ready for next phases
└─ EXIT with code 0 (success)
```

**Invocation:**
```bash
# Manual execution
agent orchestrators/end_to_end_workflow.md

# With Jira credentials (set before running)
export JIRA_URL=https://jira.company.com
export JIRA_USERNAME=service-account@company.com
export JIRA_API_TOKEN=your-secure-token

agent orchestrators/end_to_end_workflow.md

# In CI/CD pipeline
- name: Generate & Publish User Stories
  env:
    JIRA_URL: ${{ secrets.JIRA_URL }}
    JIRA_USERNAME: ${{ secrets.JIRA_USERNAME }}
    JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
  run: agent orchestrators/end_to_end_workflow.md
```

---

## 📂 Project Structure

```
react-foundational/
├── src/                          # React application source
│   ├── components/               # Reusable UI components
│   │   ├── common/               # Shared: DetailSection, FieldInput, etc.
│   │   └── error-boundary/       # Error handling
│   ├── pages/                    # Page components
│   │   ├── dashboard.tsx         # Home page with statistics
│   │   ├── card-maintenance.tsx  # Search & manage cards
│   │   └── card-details.tsx      # Detail view & inline editing
│   ├── services/api/             # HTTP client & API services
│   ├── store/                    # Redux state management
│   ├── theme/                    # MUI theme configuration
│   └── types/                    # TypeScript types
│
├── user-stories/                 # Feature-based user stories ⭐
│   ├── 00-search-and-manage-cards/
│   │   ├── stories/              # 5 user stories
│   │   ├── epic.md               # Epic definition
│   │   └── metadata.json         # Jira sync status
│   ├── 01-card-features/
│   │   ├── stories/              # 1 user story
│   │   ├── epic.md
│   │   └── metadata.json
│   ├── 02-administrative-tasks/
│   │   ├── stories/              # 2 user stories
│   │   ├── epic.md
│   │   └── metadata.json
│   ├── config.json               # Feature mapping & Jira keys
│   ├── metadata.template.json    # Template for new metadata
│   └── README.md                 # User story documentation
│
├── output/                       # Generated analysis & reports
│   ├── analysis/                 # Analysis documents (10 files) 📊
│   │   ├── 1_User_Flow_Document.md
│   │   ├── 2_Screen_Inventory.md
│   │   ├── 3_FE_Business_Logic_Document.md
│   │   ├── 4_UI_State_and_Session_Handling.md
│   │   ├── 5_Backend_API_Call_Mapping.md
│   │   └── ... (5 more)
│   ├── audits/                   # Audit reports (7 files) 🔍
│   │   ├── ACCESSIBILITY_AUDIT.md
│   │   ├── CODE_REVIEW_REPORT.md
│   │   └── ... (5 more)
│   └── README.md
│
├── .github/
│   ├── agents/                   # AI agent definitions 🤖
│   │   ├── generate_user_stories.md
│   │   └── publish_to_jira.md
│   ├── orchestrators/            # Workflow orchestrators
│   │   └── end_to_end_workflow.md
│   ├── copilot-instructions.md   # GitHub Copilot rules
│   └── skills/                   # Replit Agent skills
│
├── .cursor/rules/                # Cursor rules (auto-inject)
├── docs/                         # Standards & guidelines
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
npm 9+
Git configured
GitHub Copilot, Replit Agent, or Cursor (for agent execution)
```

### Setup

```bash
# Clone repository
git clone https://github.com/ravi-p/react-foundational.git
cd react-foundational

# Install dependencies
npm install

# Start development server
npm run dev
```

Application opens at `http://localhost:3002`

### Available Commands

```bash
npm run dev              # Start dev server (Vite)
npm run build            # Production build
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix lint issues
npm run format           # Format with Prettier
npm run test             # Run Jest tests
npm run test:coverage    # Coverage report
```

---

## 🔄 Workflow: How to Use the Agents

### Scenario: Generate New User Stories and Sync to Jira

**Step 1: Prepare Requirements**
```bash
# Ensure analysis documents exist in output/analysis/
# Key input: output/analysis/1_User_Flow_Document.md
ls output/analysis/
```

**Step 2: Set Jira Credentials**
```bash
# Export environment variables (do NOT commit credentials!)
export JIRA_URL=https://jira.yourdomain.com
export JIRA_USERNAME=your-service-account@company.com
export JIRA_API_TOKEN=your-api-token
```

**Step 3: Run Orchestrator**
```bash
# Invoke the orchestrator agent
agent orchestrators/end_to_end_workflow.md
```

**Step 4: Monitor Agent Execution**

Agent 1 (Generate) outputs:
```
✓ Parsing flow document...
✓ Identifying flows...
✓ Generating 8 user stories...
✓ Updating metadata (status: pending)...
✓ Generation complete
```

Agent 2 (Publish) outputs:
```
✓ Validating user-stories/ structure...
✓ Connecting to Jira...
✓ Creating epics...
  ✓ Epic: CARDS-100 - Search & Manage Cards
  ✓ Epic: FEAT-50 - Card Features
  ✓ Epic: ADMIN-75 - Administrative Tasks
✓ Publishing stories...
  ✓ Story: CARDS-101 - Card Search Interface
  ✓ Story: CARDS-102 - Search Results Table
  ✓ Story: CARDS-103 - View Card Details
  ... (5 more)
✓ Updating metadata with Jira keys...
✓ Publishing complete
```

**Step 5: Verify Results**
```bash
# Check generated stories
ls user-stories/00-search-and-manage-cards/stories/

# Verify metadata updated with Jira keys
cat user-stories/00-search-and-manage-cards/metadata.json
# Should show: jira_key: "CARDS-101", status: "synced", hash: "sha256:..."

# Visit Jira to see created issues
# https://jira.yourdomain.com/browse/CARDS-100
```

---

## 📊 Example Workflow Report

```
═══════════════════════════════════════════════════════════════
         USER STORY GENERATION & JIRA SYNC REPORT
═══════════════════════════════════════════════════════════════

Workflow Status: ✅ SUCCESS

Generated: 8 stories from 1_User_Flow_Document.md
Published: 3 epics + 8 stories to Jira
Total Jira Issues Created: 11

═══════════════════════════════════════════════════════════════
FEATURE SUMMARY
═══════════════════════════════════════════════════════════════

Feature 00: Search & Manage Cards (CARDS)
└─ Epic: CARDS-100 ✓ https://jira.example.com/browse/CARDS-100
   ├─ 01-card-search-interface          → CARDS-101 ✓
   ├─ 02-search-results-table           → CARDS-102 ✓
   ├─ 03-view-card-details              → CARDS-103 ✓
   ├─ 04-edit-card-information          → CARDS-104 ✓
   └─ 05-bulk-operations                → CARDS-105 ✓

Feature 01: Card Features (FEAT)
└─ Epic: FEAT-50 ✓ https://jira.example.com/browse/FEAT-50
   └─ 06-direct-deposit-management      → FEAT-51 ✓

Feature 02: Administrative Tasks (ADMIN)
└─ Epic: ADMIN-75 ✓ https://jira.example.com/browse/ADMIN-75
   ├─ 07-reset-card-pin                 → ADMIN-76 ✓
   └─ 08-view-card-transaction-history  → ADMIN-77 ✓

═══════════════════════════════════════════════════════════════
STATISTICS
═══════════════════════════════════════════════════════════════

Total Stories:        8
Created:              8
Updated:              0
Skipped:              0
Failed:               0
Success Rate:         100%

Metadata Updates:
✓ All stories have Jira keys
✓ Content hashes calculated (SHA256)
✓ Sync timestamps recorded (ISO 8601)
✓ All statuses: synced

═══════════════════════════════════════════════════════════════
NEXT STEPS
═══════════════════════════════════════════════════════════════

1. Review stories in Jira
   https://jira.example.com/browse/CARDS-100

2. Assign stories to development team

3. Estimate story points in Jira

4. Create sprints and schedule work

5. Begin development with React components

═══════════════════════════════════════════════════════════════
```

---

## ✨ Key Features

### 1. **Feature-Based Organization**
- User stories organized by epic (3 features)
- Clean, scalable folder structure
- Easy to add new features without clutter

### 2. **Jira Integration**
- Automated story publishing to Jira
- Hash-based change detection (SHA256)
- Sync status tracking (pending → synced → needs_update)
- Prevent duplicate publications
- Clickable Jira links in reports

### 3. **Modular Agent Architecture**
- Clear separation of concerns
- Well-defined input/output contracts
- Orchestrator for workflow coordination
- Error recovery mechanisms
- Idempotent operations (safe to re-run)

### 4. **AI-Driven Workflow**
- GitHub Copilot for code generation
- Replit Agent for automation scripting
- Cursor for code quality & refactoring
- Autonomous agents with decision boundaries
- Consistent coding standards enforced by agents

### 5. **Requirements Traceability**
- Complete chain: Flows → User Stories → Jira → Code
- Metadata tracking for each transformation
- Change detection with hashes
- Audit trail of all operations

### 6. **Production-Ready Application**
- React 19 with TypeScript (strict)
- Redux Toolkit state management
- Material UI components
- Axios with auth interceptors
- Jest testing setup
- ESLint + Prettier code quality
- WCAG AA accessibility standards

---

## 🔐 Security & Best Practices

### Environment Variables (Never commit!)
```bash
# Set in .env or CI/CD secrets, never in code
JIRA_URL=https://jira.company.com
JIRA_USERNAME=service-account@company.com
JIRA_API_TOKEN=your-secure-token-here
```

### Agent Decision Boundaries
Agents are configured to **ASK before**:
- Adding new dependencies
- Creating files outside defined structure
- Refactoring existing code
- Making architectural decisions
- Security-related changes
- Modifying environment configuration

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint (Airbnb rules) enforced
- Prettier formatting applied
- Jest testing framework
- WCAG AA accessibility compliance
- React best practices
- Redux patterns

---

## 📚 Documentation

- **[User Stories](user-stories/README.md)** - Feature organization & Jira integration
- **[Analysis Documents](output/analysis/README.md)** - Requirements, flows, specifications
- **[Audit Reports](output/audits/README.md)** - Quality, accessibility, code review
- **[Coding Standards](docs/coding-standards.md)** - Development rules & conventions
- **[Component Patterns](docs/component-patterns.md)** - React component guidelines
- **[API Patterns](docs/api-patterns.md)** - HTTP & service integration
- **[State Management](docs/state-management.md)** - Redux & Context API usage
- **[Testing Standards](docs/testing-standards.md)** - Jest & React Testing Library
- **[Accessibility](docs/accessibility-standards.md)** - WCAG AA compliance
- **[Security Guidelines](docs/security-guidelines.md)** - Security best practices

---

## 🎯 Project Accomplishments

✅ **3 Feature Epics** - Well-defined, organized user stories  
✅ **8 User Stories** - Complete, actionable, Jira-ready  
✅ **3 AI Agents** - Autonomous generation, publishing, orchestration  
✅ **Jira Integration** - Hash-based change detection, status tracking  
✅ **Production UI** - React 19, MUI, accessibility-compliant  
✅ **AI-Driven SDLC** - Copilot, Replit, Cursor configuration  
✅ **Complete Documentation** - Requirements to code traceability  
✅ **GitHub Ready** - Structured, documented, ready for collaboration

---

## 📄 License

MIT

---

**Last Updated:** March 16, 2026  
**Repository:** https://github.com/ravi-p/react-foundational  
**Demo:** http://localhost:3002 (after `npm run dev`)
