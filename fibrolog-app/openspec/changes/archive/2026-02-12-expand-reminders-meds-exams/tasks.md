## 1. Service Layer Refactoring

- [x] 1.1 Update `Reminder` interface in `services/reminder-service.ts` with new types and metadata
- [x] 1.2 Update `notificationService` in `services/notification-service.ts` to support periodic and calendar triggers
- [x] 1.3 Refactor `reminderService.addReminder` to handle type-specific scheduling logic
- [x] 1.4 Implement data migration logic for existing reminders in storage (adding default types)

## 2. UI Updates (Components)

- [x] 2.1 Enhance `ReminderItem` component to display type icons and additional info (dosage/date)
- [x] 2.2 Create `TypeSelector` component for the "New Reminder" form
- [x] 2.3 Add conditional input fields for Dosage and Interval in the medication view
- [x] 2.4 Add a Full Date/Time picker for the exam view

## 3. Screen Integration

- [x] 3.1 Update `app/reminder.tsx` state to handle new form fields
- [x] 3.2 Implement logic to toggle visibility of fields based on selected reminder type
- [x] 3.3 Update form submission logic to pass new metadata to the service
- [x] 3.4 Verify validation for new fields (e.g., dosage must not be empty for meds)

## 4. Verification

- [x] 4.1 Test daily recurring general reminders
- [x] 4.2 Test interval-based medication notifications (e.g., every 4 hours)
- [x] 4.3 Test one-time exam notifications on a specific future date

- [x] 4.4 Verify cross-platform behavior (Android vs Web)
