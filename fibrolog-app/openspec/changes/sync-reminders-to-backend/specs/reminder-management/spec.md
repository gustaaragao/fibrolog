## MODIFIED Requirements

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
