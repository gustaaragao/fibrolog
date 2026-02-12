## ADDED Requirements

### Requirement: Retrieve own profile data
The system SHALL provide an endpoint `GET /pacientes/me` that returns the authenticated patient's profile data, including their full name, email, birth date, gender, diagnosis date, and phone number.

#### Scenario: Successful profile retrieval
- **WHEN** an authenticated patient requests `GET /pacientes/me`
- **THEN** the system SHALL return a 200 OK response with the patient's data
- **AND** the `nome` field MUST contain the patient's full name

#### Scenario: Unauthorized profile retrieval
- **WHEN** an unauthenticated user requests `GET /pacientes/me`
- **THEN** the system SHALL return a 401 Unauthorized response

### Requirement: Patient phone number field
The `Paciente` entity SHALL include a `celular` field for storing the patient's contact number.

#### Scenario: Valid phone number
- **WHEN** a patient is created or updated with a phone number in the format `(XX) 9XXXX-XXXX` or only digits
- **THEN** the system SHALL accept and store the value

#### Scenario: Invalid phone number
- **WHEN** a patient is created or updated with an invalid phone number format
- **THEN** the system SHALL return a validation error

### Requirement: Frontend profile screen prompt
The change SHALL include a specialized prompt for the Gemini CLI to assist in the implementation of the profile screen in the frontend.

#### Scenario: Prompt availability
- **WHEN** the implementation of this change is complete
- **THEN** a prompt document SHALL be available for use with the Gemini CLI for the frontend
