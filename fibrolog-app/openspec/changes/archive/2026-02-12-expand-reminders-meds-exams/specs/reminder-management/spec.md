## MODIFIED Requirements

### Requirement: CRUD operations for reminders
The system SHALL allow users to create, read, and delete reminders stored locally on the device, categorized by type (Medication, Exam, or General).

#### Scenario: Creating a new reminder
- **WHEN** the user provides a title, type, and relevant details (dosage/time/date)
- **THEN** the system SHALL save the reminder in local storage with its type and metadata
- **AND** the reminder SHALL appear in the reminders list with appropriate visual categorization

#### Scenario: Deleting a reminder
- **WHEN** the user selects the delete option for an existing reminder
- **THEN** the system SHALL remove the reminder from local storage
- **AND** the system SHALL cancel all scheduled notifications associated with that reminder
