## 1. Documentation & Backend Setup

- [x] 1.1 Create `docs/backend-reminders-prompt.md` with FastAPI models and endpoints
- [x] 1.2 Define Pydantic schemas for categorized reminders in the prompt
- [x] 1.3 Add backend URL to `constants/api.ts` if not already present

## 2. Service Layer Refactoring

- [x] 2.1 Update `Reminder` interface in `services/reminder-service.ts` with `synced` and `backendId`
- [x] 2.2 Implement `getRemindersFromServer()` method
- [x] 2.3 Refactor `addReminder` to call backend POST API after local save
- [x] 2.4 Refactor `toggleReminder` to call backend PATCH API
- [x] 2.5 Refactor `deleteReminder` to call backend DELETE API
- [x] 2.6 Implement `syncLocalRemindersWithServer()` reconciliation logic on boot

## 3. UI Feedback

- [x] 3.1 Add a "synced" status icon to `ReminderItem` component
- [x] 3.2 Add error handling/retry logic if background sync fails
- [x] 3.3 Ensure the list refreshes correctly after a full server sync

## 4. Verification

- [x] 4.1 Verify local reminders still work without internet (offline support)
- [x] 4.2 Verify sync triggers correctly when connection is restored
- [x] 4.3 Test full data recovery after clearing local storage (sync from server)
