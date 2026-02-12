## 1. Setup and Dependencies

- [x] 1.1 Install `expo-notifications` and `expo-device`
- [x] 1.2 Configure `app.json` for notifications (icon, color, etc.)

## 2. Notification Service

- [x] 2.1 Create `services/notification-service.ts`
- [x] 2.2 Implement permission request and check logic
- [x] 2.3 Implement notification scheduling logic (daily recurring)
- [x] 2.4 Implement notification cancellation logic

## 3. Reminder Logic & Storage

- [x] 3.1 Define `Reminder` interface
- [x] 3.2 Implement CRUD operations using `AsyncStorage` (via `utils/storage.ts`)
- [x] 3.3 Implement logic to sync local reminders with `expo-notifications` (schedule/cancel on toggle)

## 4. UI Implementation

- [x] 4.1 Create `ReminderItem` component with toggle and delete actions
- [x] 4.2 Integrate `@react-native-community/datetimepicker` for time selection
- [x] 4.3 Update `app/reminder.tsx` with list of reminders and "Add Reminder" modal/form
- [x] 4.4 Add visual feedback for permission status and scheduling success

## 5. Verification & Testing

- [x] 5.1 Verify notification triggers on Android (simulated or real device)
- [x] 5.2 Verify notification triggers on Web
- [x] 5.3 Verify persistence after app restart
- [x] 5.4 Verify notification cancellation when reminder is toggled off or deleted
