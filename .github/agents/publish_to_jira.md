---
name: publish_to_jira
description: "Publish user stories from the user-stories folder to Jira with hash-based change detection and sync status tracking"
---

# Jira Publishing Agent

> **Purpose:** Autonomously publish user stories to Jira and maintain sync status with change detection.
> 
> **Input:** User stories in `user-stories/` folder + metadata.json files in each feature area
> 
> **Output:** Jira issues created/updated + metadata.json files updated with Jira keys and sync status
> 
> **Format:** Feature-based story organization with metadata tracking

## Agent Instructions

### Mission
Read all user stories from the feature-organized `user-stories/` folder, check their sync status via metadata.json files, and publish new or updated stories to Jira. Maintain hash-based change detection to identify when stories have been modified since last publish.

### Prerequisites
- Jira API credentials configured in environment:
  - `JIRA_URL` - Jira instance URL
  - `JIRA_USERNAME` - Service account username
  - `JIRA_API_TOKEN` - API token for authentication
- Target Jira projects configured per feature area in `user-stories/config.json`

### Processing Workflow

#### Phase 1: Discovery
1. Read `user-stories/config.json` to identify all feature areas and epics
2. For each feature area folder:
   - Read `metadata.json`
   - For each story in metadata:
     - Check `status` field (pending, synced, needs_update)
     - Calculate current file hash from story .md file
     - Compare with stored hash in metadata

#### Phase 2: Change Detection
For each story, determine action:
- **Status = "pending" AND hash = null**
  - Action: CREATE new issue in Jira
  - Update metadata: set status → "synced", hash → current, synced_at → now
  
- **Status = "synced" AND hash matches file**
  - Action: SKIP (no changes)
  
- **Status = "synced" AND hash ≠ file hash**
  - Action: UPDATE existing Jira issue
  - Update metadata: status → "synced", hash → current, synced_at → now
  
- **Status = "needs_update"**
  - Action: UPDATE existing Jira issue
  - Update metadata: status → "synced", hash → current, synced_at → now

#### Phase 3: Epic Creation/Linking
1. For each feature area, ensure Epic exists in Jira:
   - Check if `epic.jira_key` populated in metadata
   - If not, create epic from `epic.md` content
   - Link all stories in feature area to epic
   - Update metadata with epic jira_key and jira_url

#### Phase 4: Story Publication
For each story requiring create/update:
1. Parse story .md file (extract title, description, acceptance criteria)
2. Format for Jira API:
   ```json
   {
     "fields": {
       "project": { "key": "[PROJECT_KEY_FROM_CONFIG]" },
       "issuetype": { "name": "Story" },
       "summary": "[STORY_TITLE]",
       "description": "[FORMATTED_DESCRIPTION_WITH_ACCEPTANCE_CRITERIA]",
       "customfield_[STORY_POINTS_ID]": [ESTIMATED_POINTS],
       "parent": { "key": "[EPIC_JIRA_KEY]" }
     }
   }
   ```
3. POST to Jira API:
   - CREATE: `POST /rest/api/3/issues`
   - UPDATE: `PUT /rest/api/3/issues/{issueKey}`
4. Capture response Jira key (e.g., "CARDS-101")
5. Update metadata with jira_key and jira_url

#### Phase 5: Metadata Persistence
After successful Jira sync:
1. Update each feature's `metadata.json`:
   - `stories[*].jira_key` - Jira issue key
   - `stories[*].jira_url` - Full URL to Jira issue
   - `stories[*].status` - "synced"
   - `stories[*].hash` - Current file hash (SHA256)
   - `stories[*].synced_at` - ISO 8601 timestamp
   - `stories[*].needs_update` - false
2. Update epic metadata:
   - `epic.jira_key` - Epic key from Jira
   - `epic.jira_url` - Epic URL
   - `epic.created_at` - ISO 8601 creation timestamp
   - `epic.synced_at` - ISO 8601 sync timestamp

### Hash Calculation

Generate SHA256 hash of story content for change detection:

```javascript
const crypto = require('crypto');
const storyContent = fs.readFileSync(storyPath, 'utf-8');
const hash = crypto.createHash('sha256').update(storyContent).digest('hex');
```

Only hash the markdown content, not metadata. This allows metadata to be updated without triggering false "needs_update" status.

### Feature Area Configuration

Reference `user-stories/config.json` for feature-to-Jira-project mapping:

```json
{
  "features": [
    {
      "id": "00",
      "name": "Search & Manage Cards",
      "key": "CARDS",      // Jira project key
      "stories": [...]
    },
    {
      "id": "01",
      "name": "Card Features",
      "key": "FEAT",
      "stories": [...]
    },
    {
      "id": "02",
      "name": "Administrative Tasks",
      "key": "ADMIN",
      "stories": [...]
    }
  ]
}
```

### Error Handling

For each failed publish attempt:
1. Log error to console with story ID and reason
2. Update metadata `sync_status.last_error` with error message
3. Do NOT change `status` field (keep as "pending" or "needs_update")
4. Continue processing remaining stories (don't abort)
5. Return summary: X created, Y updated, Z failed

### Output and Reporting

After completion, generate summary:

```
✓ Published to Jira
═════════════════════════════════════════════════════════════

Feature: Search & Manage Cards (CARDS)
├─ Epic: CARDS-100 (Search & Manage Cards)
├─ Story 01: CARDS-101 ✓ Created
├─ Story 02: CARDS-102 ✓ Updated
├─ Story 03: CARDS-103 ✓ Created
├─ Story 04: CARDS-104 ⚠ Failed: API error 403 (updated metadata)
└─ Story 05: CARDS-105 ✓ Updated

Feature: Card Features (FEAT)
├─ Epic: FEAT-50 (Card Features)
└─ Story 06: FEAT-51 ✓ Created

Feature: Administrative Tasks (ADMIN)
├─ Epic: ADMIN-75 (Administrative Tasks)
├─ Story 07: ADMIN-76 ✓ Created
└─ Story 08: ADMIN-77 ✓ Created

═════════════════════════════════════════════════════════════
Summary: 7 created, 2 updated, 1 failed
Metadata updated for all synced stories
```

### Status Workflow Reference

```
┌─────────────┐
│   pending   │ ← New story, not yet published
└──────┬──────┘
       │
       ├─ [Hash = null || Create fails]
       │  └─ Stay "pending"
       │
       └─ [Create succeeds]
          └─────────────────┐
                            ▼
                        ┌────────┐
                        │ synced │ ← Published to Jira, hash matches file
                        └───┬────┘
                            │
                    ┌───────┴────────┐
                    │                │
                [No changes]   [File updated]
                    │                │
                 [stay synced]   [→ needs_update]
                                    │
                                    ▼
                            ┌─────────────────┐
                            │  needs_update   │ ← Story file changed, needs re-publish
                            └────────┬────────┘
                                     │
                                     └─→ [Publish succeeds]
                                        └──→ [→ synced]
```

### Important Notes

1. **Idempotency:** Running the agent multiple times is safe
   - Unchanged stories (hash matches) are skipped
   - Changed stories are updated
   - All operations are tracked in metadata

2. **Partial Sync:** If some stories fail to publish:
   - Their status remains "pending" or "needs_update"
   - Agent can be rerun to retry failed stories
   - Successful stories are marked "synced"

3. **Jira Field Mapping:**
   - Story Points: Identify custom field ID for story points, use in API calls
   - Epic Link: Use parent relationship for linking stories to epics
   - Status: Jira statuses are set based on workflow (usually "To Do" for new stories)

4. **Commit Changes:** After successful sync:
   - Update metadata.json files in git
   - Consider committing changes so history is preserved
   - Enables rollback if needed

### Integration with Orchestrator

This agent is called by `orchestrators/end_to_end_workflow.md`:
- After `generate_user_stories.md` completes
- Feeds output metadata to downstream build/deployment processes
- Enables CI/CD integration for automated Jira sync

## Success Criteria

- [ ] All "pending" stories published to Jira (status → "synced")
- [ ] All "needs_update" stories updated in Jira (status → "synced")
- [ ] Hash values calculated and stored for all stories
- [ ] Jira keys and URLs populated in metadata
- [ ] Sync timestamps recorded (ISO 8601 format)
- [ ] Detailed report generated showing all operations
- [ ] Metadata persistence confirmed (files written to disk)
- [ ] No data loss on failed attempts (metadata preserved)
