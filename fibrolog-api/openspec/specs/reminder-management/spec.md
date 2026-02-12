## ADDED Requirements

### Requirement: Reminder creation
The system SHALL allow authenticated patients to create new reminders. If the reminder type is "medicamento", the "dosagem" and "intervalo" fields MUST be provided and valid. If the type is "exame", the "data_exame" field MUST be provided. The system SHALL accept a client-generated UUID for the reminder ID if provided.

#### Scenario: Create a medication reminder
- **WHEN** an authenticated patient POSTs a reminder with type "medicamento", providing "dosagem" and "intervalo"
- **THEN** the system persists the reminder linked to the patient and returns 201 Created

#### Scenario: Create an exam reminder
- **WHEN** an authenticated patient POSTs a reminder with type "exame", providing "data_exame"
- **THEN** the system persists the reminder linked to the patient and returns 201 Created

#### Scenario: Validation error for missing type-specific fields
- **WHEN** an authenticated patient POSTs a reminder with type "medicamento" but omits "dosagem"
- **THEN** the system returns a 422 Unprocessable Entity error

### Requirement: Reminder listing
The system SHALL allow authenticated patients to retrieve a list of all reminders they have created.

#### Scenario: List own reminders
- **WHEN** an authenticated patient performs a GET request for reminders
- **THEN** the system returns a list of reminders where the "paciente_id" matches the requester's ID

### Requirement: Reminder update
The system SHALL allow authenticated patients to perform partial updates (PATCH) on their reminders, such as toggling the "ativo" status or changing the time.

#### Scenario: Toggle reminder status
- **WHEN** an authenticated patient PATCHes an existing reminder they own with "ativo: false"
- **THEN** the system updates the record and returns the modified reminder

### Requirement: Reminder deletion
The system SHALL allow authenticated patients to permanently delete their own reminders.

#### Scenario: Successful deletion
- **WHEN** an authenticated patient sends a DELETE request for a reminder ID they own
- **THEN** the system removes the record and returns 204 No Content

### Requirement: Ownership enforcement
The system MUST ensure that patients can only access, update, or delete reminders that belong to them.

#### Scenario: Unauthorized access to another patient's reminder
- **WHEN** an authenticated patient attempts to GET, PATCH, or DELETE a reminder ID belonging to a different patient
- **THEN** the system returns a 403 Forbidden or 404 Not Found error
