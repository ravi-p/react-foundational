# User Story: Reset Card PIN with Confirmation

**Project:** Card Maintenance System  
**Epic:** Card Administrative Tasks  
**Story Points:** 3  
**Assignee:** Frontend Developer  
**Source Flow:** FLOW 6 - Reset Card PIN  

## Description
As a card administrator, I want to reset a card\'s PIN with a confirmation dialog, so that the cardholder receives a new secure PIN via their registered contact method.

## Acceptance Criteria (Functional Requirements with Component Names)

### Reset PIN Button
- **Button Location:** Card detail page, Administrative section or action menu
- **Button Properties:**
  - MUI Button, variant="outlined"
  - Label: "Reset PIN"
  - Icon: Sync icon (Refresh from @mui/icons-material)
  - onClick → opens confirmation dialog

### Confirmation Dialog
- **Dialog Content:**
  - Title: "Reset Card PIN"
  - Message: "Reset PIN for card ending in 1234?"
  - Display card ending (last 4 digits masked from card number)
  - Informational text: "The cardholder will receive a new PIN via their registered phone number"
  
- **Dialog Buttons:**
  - "Cancel" button - closes dialog without action
  - "Reset PIN" button - confirms and initiates reset

### PIN Reset Process

#### User Clicks "Reset PIN" Button
- Confirmation dialog displays with card identifier

#### User Confirms Reset
- Button text changes to "Resetting..." with spinner
- Dialog buttons disabled during processing
- API POST request sent to `/Blam/resetPin`

#### Success State
- Dialog shows success message: "PIN has been reset and sent to registered phone"
- Button text: "Resetting..." spinner removed
- Auto-close dialog after 2 seconds
- Toast notification displays: "PIN reset successfully"
- Return to card detail view

#### Error State
- Dialog shows error message: "Failed to reset PIN. [Error message]"
- Display retry button in dialog
- Reset PIN button in dialog re-enabled
- User can click "Retry" or "Cancel"

### UI Components Required

#### Reset PIN Button
- **Button (MUI):**
  - variant="outlined"
  - color="primary"
  - onClick handler
  - startIcon={RefreshIcon}
  - disabled state if no permission or during processing

#### Confirmation Dialog
- **Dialog (MUI):**
  - open state controlled by component
  - onClose handler
  - maxWidth="xs"
  - DialogTitle: "Reset Card PIN"
  - DialogContent: Message + info text
  - DialogActions: Cancel and Confirm buttons
  
- **DialogContent (MUI):**
  - Typography for message
  - Card identifier displayed prominently
  - Highlighted text: "Card ending in 1234"
  
- **Button (MUI)** × 2:
  - Cancel button: variant="text"
  - Reset PIN button: variant="contained", color="primary"
  - Reset PIN button loading state: disabled + spinner
  - Props: onClick, disabled, startIcon={CircularProgress}

#### Toast/Snackbar Notification
- **Snackbar (MUI):**
  - Success message: "PIN reset successfully"
  - Error message: "[Error message from server]"
  - AutoHideDuration: 5000ms
  - Severity: "success" or "error"

### API/Data Requirements

#### Reset PIN Endpoint
- **Endpoint:** `POST /Blam/resetPin`
- **Request Format:**
  ```json
  {
    "cardToken": "token_value"
  }
  ```
- **Response Format (Success - HTTP 200):**
  ```json
  {
    "status": "SUCCESS",
    "message": "PIN has been reset and sent to registered phone",
    "data": {
      "cardToken": "token",
      "pinResetAt": "2026-03-09T14:30:00Z",
      "deliveryMethod": "SMS"
    }
  }
  ```
- **Response Format (Error - HTTP 400/422):**
  ```json
  {
    "status": "ERROR",
    "message": "Cannot reset PIN for inactive card",
    "code": "INVALID_CARD_STATUS"
  }
  ```
- **Response Format (Error - HTTP 500):**
  ```json
  {
    "status": "ERROR",
    "message": "An error occurred while resetting PIN. Please try again.",
    "code": "INTERNAL_SERVER_ERROR"
  }
  ```

### Error Handling

#### API Call Fails
- Dialog shows error message from server
- Button returns to normal state
- User can click "Retry" to attempt reset again
- Or click "Cancel" to close dialog

#### Card Status Invalid (410 Status)
- Error message: "Cannot reset PIN for [inactive/blocked/expired] card"
- Disable Reset PIN button
- Show tooltip: "PIN reset not available for this card status"

#### Permission Denied (403)
- Error message: "You don't have permission to reset this card's PIN"
- Disable Reset PIN button

#### Success States
- After successful reset:
  - Dialog auto-closes after 2 seconds
  - Toast displays success message
  - Card detail page remains loaded
  - If audit trail section visible, refresh to show new update

### State Management
- Store modal open state: `isResetPinDialogOpen: boolean`
- Store loading state: `isResettingPin: boolean`
- Store error message: `resetPinError: string | null`

## Implementation Notes
- Card token should be available from card detail page context
- Last 4 digits extracted from card number display state
- Show spinner icon while processing (do not disable button immediately)
- Default delivery method: SMS to registered phone (from server response)
- Toast notifications appear independently from dialog
- Consider adding confirmation email in addition to SMS
- Audit trail should automatically refresh after successful reset to show new event
- Display timestamp in audit trail: "PIN Reset by [Admin Name] on [Timestamp]"
- Log PIN reset action to backend audit system
- Test error scenarios:
  - Invalid card token
  - Card in blocked/deleted/expired state
  - Cardholder contact info missing
  - API timeout
  - Server error
- Accessibility:
  - ARIA live region for status messages
  - Dialog accessible (tab through buttons, Escape to close)
  - Button: aria-label="Reset PIN for card ending in 1234"
  - Card identifier: aria-describedby for context
