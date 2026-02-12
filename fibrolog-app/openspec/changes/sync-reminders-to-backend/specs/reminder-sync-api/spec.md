## ADDED Requirements

### Requirement: Fetch reminders from backend
The system SHALL fetch the user's stored reminders from the backend on application startup or when the reminders screen is opened.

#### Scenario: Successful sync from server
- **WHEN** the user opens the Lembretes screen
- **THEN** the system sends a GET request to `/pacientes/lembretes/`
- **AND** the system updates local storage with the retrieved reminders
- **AND** the UI displays the synced list

### Requirement: Save new reminders to backend
The system SHALL persist newly created reminders to the backend database.

#### Scenario: Creating a reminder with sync
- **WHEN** the user creates a new reminder (General, medication, or exam)
- **THEN** the system sends a POST request to `/pacientes/lembretes/` with the reminder details
- **AND** if successful, the reminder is marked as "synced" locally

### Requirement: Sync reminder toggle state
The system SHALL update the backend when a reminder is enabled or disabled.

#### Scenario: Toggling a reminder
- **WHEN** the user toggles a reminder's active state
- **THEN** the system sends a PATCH request to `/pacientes/lembretes/{id}` with the new `ativo` value
- **AND** the system updates local notification schedules accordingly

### Requirement: Delete reminders from backend
The system SHALL remove reminders from the backend when they are deleted in the app.

#### Scenario: Deleting a reminder
- **WHEN** the user deletes a reminder
- **THEN** the system sends a DELETE request to `/pacientes/lembretes/{id}`
- **AND** the system removes it from local storage and cancels notifications
