## ADDED Requirements

### Requirement: Viewing Patient Data
The system SHALL fetch and display the authenticated patient's data from the `GET /pacientes/me` endpoint.

#### Scenario: Successful data retrieval
- **WHEN** the Profile screen is opened
- **THEN** the system SHALL display the patient's full name, email, birth date, gender, diagnosis date, and phone number.

### Requirement: Editing Profile Information
The system SHALL allow the user to toggle an "Edit" mode to update their name, email, and phone number.

#### Scenario: Saving updated information
- **WHEN** the user modifies their details and clicks "Salvar"
- **THEN** the system SHALL send a PATCH request to `/pacientes/{id}` with the updated fields and display a success message upon completion.

### Requirement: Phone Number Masking
The phone number input SHALL automatically format the user's input to follow the Brazilian standard `(XX) 9XXXX-XXXX` or `(XX) XXXX-XXXX`.

#### Scenario: User types a mobile number
- **WHEN** the user enters "11987654321"
- **THEN** the input field SHALL display "(11) 98765-4321".

### Requirement: Input Validation
The system SHALL validate the email format and the phone number length before allowing the user to save changes.

#### Scenario: Invalid email entered
- **WHEN** the user enters an invalid email format (e.g., "invalid-email") and tries to save
- **THEN** the system SHALL display a validation error and prevent the submission.

#### Scenario: Invalid phone number entered
- **WHEN** the user enters a phone number with fewer than 10 digits and tries to save
- **THEN** the system SHALL display a validation error and prevent the submission.
