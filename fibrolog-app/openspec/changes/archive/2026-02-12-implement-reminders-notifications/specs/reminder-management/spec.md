## ADDED Requirements

### Requirement: CRUD operations for reminders
The system SHALL allow users to create, read, and delete reminders stored locally on the device.

#### Scenario: Creating a new reminder
- **WHEN** the user provides a title and selecting a time
- **THEN** the system SHALL save the reminder in local storage
- **AND** the reminder SHALL appear in the reminders list

#### Scenario: Deleting a reminder
- **WHEN** the user selects the delete option for an existing reminder
- **THEN** the system SHALL remove the reminder from local storage
- **AND** the system SHALL cancel any scheduled notifications for that reminder

### Requirement: Toggle reminder state
The system SHALL allow users to enable or disable a reminder without deleting it.

#### Scenario: Toggling a reminder ON
- **WHEN** the user switches a disabled reminder to ON
- **THEN** the system SHALL schedule a recurring daily notification for that reminder

#### Scenario: Toggling a reminder OFF
- **WHEN** the user switches an enabled reminder to OFF
- **THEN** the system SHALL cancel the scheduled notification while keeping the reminder in the list
