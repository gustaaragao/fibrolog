## Why

Patients need a more specialized reminder system that distinguishes between general health events (like medical exams on a specific date) and daily medication schedules (which require periodicity like "every 8 hours"). The current generic system is too simple for effective clinical management.

## What Changes

- **Enhanced Reminder Interface**: Update `Reminder` interface to support types (`medication`, `exam`, `general`).
- **Periodic Scheduling**: Support for medication intervals (e.g., every 4, 6, 8, or 12 hours).
- **Date-Specific Events**: Support for one-time reminders on specific dates (for exams).
- **UI Refinement**: A new "Add" form with conditional fields based on the selected type (Dosage for meds, Date for exams).
- **Notification Logic Update**: Update `notificationService` to handle recurring intervals and specific calendar triggers.

## Capabilities

### New Capabilities
- `medication-scheduling`: Support for periodic medication reminders with dosage and frequency.
- `exam-reminders`: Support for date-specific medical event notifications.

### Modified Capabilities
- `reminder-management`: Update existing CRUD to support different types and new metadata.
- `local-notifications-service`: Update to support complex trigger types (Calendar and TimeInterval).

## Impact

- **Storage**: Existing reminders in `AsyncStorage` will need a migration or handling for the new fields.
- **UI**: Significant update to the "New Reminder" modal in `app/reminder.tsx`.
- **Services**: Updates to `reminder-service.ts` and `notification-service.ts`.
