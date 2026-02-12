## ADDED Requirements

### Requirement: Patient can add support contacts
The system SHALL allow an authenticated patient to add a new contact to their support network by providing a name, phone number, and optional relationship.

#### Scenario: Successful contact creation
- **WHEN** the patient provides a valid name, phone number, and relationship
- **THEN** the system SHALL save the contact and associate it with the patient's profile

#### Scenario: Creation fails with missing required fields
- **WHEN** the patient attempts to add a contact without a name or phone number
- **THEN** the system SHALL return a validation error

### Requirement: Patient can list their support contacts
The system SHALL allow an authenticated patient to list all contacts currently in their support network.

#### Scenario: List contacts
- **WHEN** the patient requests the list of support contacts
- **THEN** the system SHALL return only the contacts associated with that specific patient

### Requirement: Patient can delete a support contact
The system SHALL allow an authenticated patient to remove a contact from their support network.

#### Scenario: Successful contact deletion
- **WHEN** the patient deletes a specific contact by its ID
- **THEN** the system SHALL remove the contact from the database

### Requirement: Notify support network of crisis
The system SHALL provide an endpoint to trigger a notification to all support contacts of the authenticated patient.

#### Scenario: Trigger notification
- **WHEN** the patient triggers the notification endpoint
- **THEN** the system SHALL identify all support contacts for that patient and simulate a notification (e.g., via logging or an external service integration)
