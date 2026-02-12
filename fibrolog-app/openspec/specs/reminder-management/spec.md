# Reminder Management

## Purpose
Allow patients to manage their daily reminders for health tasks, medications, and exams.

## Requirements

### Requirement: CRUD operations for reminders
The system SHALL allow users to create, read, and delete reminders using a local-first synchronization strategy, categorized by type (Medication, Exam, or General).

#### Scenario: Creating a new reminder with async sync
- **WHEN** the user provides a title, type, and relevant details
- **THEN** the system SHALL save the reminder in local storage immediately
- **AND** the system SHALL attempt to synchronize the new reminder with the backend in the background
- **AND** the reminder SHALL appear in the list with a "synced" or "pending" status indicator

#### Scenario: Deleting a reminder with async sync
- **WHEN** the user selects the delete option
- **THEN** the system SHALL remove the reminder from local storage and cancel local notifications immediately
- **AND** the system SHALL send a deletion request to the backend

### Requirement: Toggle reminder state
The system SHALL allow users to enable or disable a reminder without deleting it.

#### Scenario: Toggling a reminder ON
- **WHEN** the user switches a disabled reminder to ON
- **THEN** the system SHALL schedule a recurring daily notification for that reminder

#### Scenario: Toggling a reminder OFF
- **WHEN** the user switches an enabled reminder to OFF
- **THEN** the system SHALL cancel the scheduled notification while keeping the reminder in the list
