---
name: end_to_end_workflow
description: "Orchestrate the complete user story generation and Jira publishing workflow"
---

# End-to-End Workflow Orchestrator

> **Purpose:** Coordinate automated generation of user stories and syncing to Jira.
> 
> **Responsibilities:** 
> - Orchestrate agent execution sequence
> - Validate inputs and outputs
> - Manage state transitions
> - Provide comprehensive reporting
> 
> **Agents:** Calls `generate_user_stories.md` → `publish_to_jira.md`

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│         END-TO-END USER STORY WORKFLOW ORCHESTRATOR          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │   PARSE CONFIGURATION    │
              │ (user-stories/config.json)
              │   Validate structure     │
              └────────────┬─────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │  CHECK FEATURE FOLDERS   │
              │ Verify all epics present │
              │  Check metadata.json     │
              └────────────┬─────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │  GENERATE USER STORIES   │
              │ (generate_user_stories.md)
              │ - Parse flow document    │
              │ - Create story files     │
              │ - Update metadata        │
              │ - Set status: pending    │
              └────────────┬─────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │   Check execution result            │
        │                                     │
        │ Success?  ─────────────────────────┐
        │                                    │
        │ No ──→ [Report Error & Exit]      │
        │                                    │
        │ Yes ──→ [Continue]                 │
        │                                    │
        └──────────────────┬──────────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │    VALIDATE METADATA     │
              │ All stories have:        │
              │ - file path ✓            │
              │ - title ✓                │
              │ - status: pending ✓      │
              │ - hash: null ✓           │
              └────────────┬─────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │   Validation result                 │
        │                                     │
        │ Missing fields? ──────────────┐    │
        │                              │    │
        │ Yes ──→ [Report Error & Exit]│    │
        │                              │    │
        │ No ──→ [Continue]            │    │
        │                              │    │
        └────────────────┬─────────────┘    │
                         │                   │
                         ▼
        ┌──────────────────────────────┐
        │  PUBLISH STORIES TO JIRA     │
        │ (publish_to_jira.md)         │
        │ - Create epics in Jira       │
        │ - Create/update stories      │
        │ - Calculate content hashes   │
        │ - Update metadata with keys  │
        │ - Set status: synced         │
        └────────────┬─────────────────┘
                     │
        ┌────────────┴────────────┐
        │   Check result          │
        │                         │
        │ Success?                │
        │                         │
        │ No ──→ [Report error]   │
        │ Yes ──→ [Continue]      │
        │                         │
        └────────────┬────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │  VALIDATE SYNC RESULTS   │
        │ - All stories published? │
        │ - Jira keys populated?   │
        │ - Sync status: synced?   │
        │ - Hashes calculated?     │
        └────────────┬─────────────┘
                     │
        ┌────────────┴────────────┐
        │   Validation result     │
        │                         │
        │ Issues found? ──────┐   │
        │                    │   │
        │ Yes ──→ [Warn]      │   │
        │         [Report]    │   │
        │                    │   │
        │ No ──→ [Success]    │   │
        │                     │   │
        └────────────┬────────┘   │
                     │             │
                     ▼             │
        ┌──────────────────────────────┐
        │  GENERATE WORKFLOW REPORT     │
        │ - Feature summary             │
        │ - Story status overview       │
        │ - Jira links (clickable)      │
        │ - Success/failure breakdown   │
        │ - Recommendations             │
        └────────────┬─────────────────┘
                     │
                     ▼
        ┌──────────────────────────────┐
        │    WORKFLOW COMPLETE         │
        │ Ready for next phase:        │
        │ - CI/CD integration          │
        │ - Build & deployment         │
        │ - Testing & QA               │
        └──────────────────────────────┘
```

## Invocation

### Manual Execution
```bash
# Run the complete workflow
agent orchestrators/end_to_end_workflow.md

# With environment variables
JIRA_URL=https://jira.example.com \
JIRA_USERNAME=user@company.com \
JIRA_API_TOKEN=your-token-here \
agent orchestrators/end_to_end_workflow.md
```

### CI/CD Integration
Add to `.github/workflows/user-stories.yml`:
```yaml
- name: Generate & Publish User Stories
  run: agent orchestrators/end_to_end_workflow.md
  env:
    JIRA_URL: ${{ secrets.JIRA_URL }}
    JIRA_USERNAME: ${{ secrets.JIRA_USERNAME }}
    JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
```

## Step-by-Step Operation

### 1. Parse Configuration
- Load `user-stories/config.json`
- Validate structure (features array, feature objects with id/name/key/stories)
- Verify Jira project keys are non-empty
- Report: "✓ Configuration valid, found 3 features"

### 2. Check Dependencies
- Verify folder structure:
  - `user-stories/00-search-and-manage-cards/` exists
  - `user-stories/01-card-features/` exists
  - `user-stories/02-administrative-tasks/` exists
- Check metadata.json exists in each folder
- Check epic.md exists in each folder
- Common paths library available
- Jira credentials configured (for publish phase)
- Report: "✓ All dependencies present"

### 3. Invoke generate_user_stories Agent
```
INVOKE: generate_user_stories.md
  Input:  output/analysis/1_User_Flow_Document.md
  Output: user-stories/[feature]/stories/*.md + metadata.json updates
  Timeout: 5 minutes
```

Monitor output:
- "Parsing flow document..."
- "Generating stories..."
- "Updating metadata.json..."

On completion:
- Parse generated story count from agent output
- Validate metadata.json updated (check file timestamps)
- Verify all stories have status: "pending"
- Report: "✓ Generated X stories, metadata updated"

On failure:
- Capture agent error message
- Report: "✗ Story generation failed: [error]"
- Exit with non-zero code
- Do NOT proceed to publish phase

### 4. Validate Metadata State
Before publishing, verify metadata integrity:

```javascript
for each feature in config.features {
  for each story in feature.stories {
    metadata = load(feature_folder/metadata.json)
    story_entry = metadata.stories[story_id]
    
    // Check required fields
    assert(story_entry.file != null, "file path missing")
    assert(story_entry.title != null, "title missing")
    assert(story_entry.status == "pending", "status should be pending after generation")
    assert(story_entry.hash == null, "hash should be null before publish")
    assert(story_entry.jira_key == null, "jira_key should be null before publish")
  }
}
```

Report validation results:
- "✓ Metadata validation passed"
- Or list specific validation failures and exit

### 5. Invoke publish_to_jira Agent
```
INVOKE: publish_to_jira.md
  Input:  user-stories/ (all features, stories, metadata)
  Output: Jira issues created + metadata.json updated with jira_keys, hashes, sync timestamps
  Timeout: 10 minutes (depends on story count)
  
  Environment Variables Required:
  - JIRA_URL
  - JIRA_USERNAME
  - JIRA_API_TOKEN
```

Monitor output:
- "Connecting to Jira..."
- "Creating epics..."
- "Publishing stories..."
- "Updating metadata..."

On completion:
- Parse story count from output (created/updated/failed)
- Verify metadata.json files updated:
  - stories[*].jira_key populated
  - stories[*].hash populated (SHA256)
  - stories[*].status = "synced"
  - stories[*].synced_at populated (ISO 8601)
- Report: "✓ Published X stories to Jira"

On failure:
- Capture agent output/errors
- Check JIRA_URL, credentials, permissions
- Report: "✗ Jira publishing failed: [error]"
- Note: Some stories may be partially published
- Recommend: Re-run orchestrator to sync remaining

### 6. Validate Sync Results
After successful publish, verify final state:

```javascript
for each feature in config.features {
  for each story in feature.stories {
    metadata = load(feature_folder/metadata.json)
    story_entry = metadata.stories[story_id]
    
    // Check synced state
    assert(story_entry.status == "synced", "status should be synced after publish")
    assert(story_entry.jira_key != null, "jira_key should be populated")
    assert(story_entry.hash != null, "hash should be calculated")
    assert(story_entry.synced_at != null, "synced_at should be recorded")
    
    // Verify metadata consistency
    assert(metadata.epic.jira_key != null, "epic should be linked")
  }
}
```

Report validation results:
- "✓ All stories synced to Jira"
- Or list any stories with incomplete metadata

### 7. Generate Workflow Report

Create comprehensive summary report:

```markdown
# User Stories Workflow Report
Generated: 2026-03-11T14:30:00Z

## Workflow Status
- Generation: ✓ Success (8 stories)
- Publishing: ✓ Success (8 synced)
- Validation: ✓ Success

## Feature Summary

### 00 - Search & Manage Cards (CARDS)
- Epic: CARDS-100 (https://jira.example.com/browse/CARDS-100)
- Stories:
  - 01 Card Search Interface: CARDS-101
  - 02 Search Results Table: CARDS-102
  - 03 View Card Details: CARDS-103
  - 04 Edit Card Information: CARDS-104
  - 05 Bulk Operations: CARDS-105

### 01 - Card Features (FEAT)
- Epic: FEAT-50 (https://jira.example.com/browse/FEAT-50)
- Stories:
  - 06 Direct Deposit Management: FEAT-51

### 02 - Administrative Tasks (ADMIN)
- Epic: ADMIN-75 (https://jira.example.com/browse/ADMIN-75)
- Stories:
  - 07 Reset Card PIN: ADMIN-76
  - 08 View Card Transaction History: ADMIN-77

## Statistics
- Total Stories: 8
- Created: 8
- Updated: 0
- Skipped: 0
- Failed: 0

## Next Steps
1. Review stories in Jira
2. Prioritize and assign stories to team
3. Update story points based on team estimation
4. Schedule stories into sprints
5. Begin development

## Notes
- All metadata updated with Jira keys
- Ready for CI/CD integration
- Story hashes calculated for change detection
```

## Error Handling & Recovery

### Configuration Errors
```
Error: Missing required config.json
  → Copy metadata.template.json to config.json
  → Fill in Jira project keys per feature
  
Error: Invalid JSON in config.json
  → Validate JSON syntax
  → Check feature object structure
```

### Generation Errors
```
Error: Flow document not found
  → Verify output/analysis/1_User_Flow_Document.md exists
  → Check file path is correct
  
Error: Metadata.json not found in feature folder
  → Copy metadata.template.json to feature folder
  → Rename to metadata.json
  → Run generation again
```

### Publishing Errors
```
Error: Cannot connect to Jira
  → Verify JIRA_URL is correct
  → Check internet connectivity
  → Confirm Jira instance is running
  
Error: Authentication failed
  → Verify JIRA_USERNAME and JIRA_API_TOKEN
  → Check credentials are not expired
  → Confirm service account has necessary permissions
  
Error: Partial failure (some stories published, some failed)
  → Check metadata.json - partial updates preserved
  → Fix remaining issues
  → Re-run orchestrator (idempotent operation)
```

## Recovery Procedures

### Retry Failed Generation
```bash
# 1. Check generate_user_stories.md agent logs
# 2. Fix any issues (missing files, invalid format, etc.)
# 3. Re-run orchestrator
agent orchestrators/end_to_end_workflow.md
```

### Retry Failed Publishing
```bash
# 1. Check publish_to_jira.md agent logs
# 2. Verify Jira credentials and project keys
# 3. Some stories may be already published (check metadata)
# 4. Re-run orchestrator (idempotent - won't duplicate)
agent orchestrators/end_to_end_workflow.md
```

### Rollback Published Stories
```bash
# If stories were published incorrectly:
# 1. Manually delete issues in Jira
# 2. Reset metadata: set jira_key=null, status="needs_update"
# 3. Fix story files as needed
# 4. Re-run orchestrator to re-publish
```

## Integration Points

### Inputs
- `user-stories/config.json` - Feature configuration
- `output/analysis/1_User_Flow_Document.md` - Source flows
- `user-stories/[feature]/epic.md` - Epic definitions
- `user-stories/[feature]/metadata.json` - Sync status

### Outputs
- `user-stories/[feature]/stories/*.md` - Generated story files
- `user-stories/[feature]/metadata.json` - Updated with Jira keys & hashes
- Jira issues - Created/updated stories and epics
- Workflow report - Summary of actions

### Downstream Integration
- CI/CD pipelines can trigger this workflow on demand
- Generated Jira stories feed into sprint planning
- Build pipelines can verify story completion
- Change detection (hashes) enables incremental updates

## Success Metrics

- [ ] All stories generated from flow document
- [ ] All stories published to correct Jira project
- [ ] All stories linked to correct epic
- [ ] All metadata synchronized and persisted
- [ ] No duplicate stories created
- [ ] Change detection working (hashes accurate)
- [ ] Workflow report generated and accessible
- [ ] Zero manual intervention needed for happy path
- [ ] Clear error messages for any failures
- [ ] Repeatable: Running again is safe and idempotent
