## ADDED Requirements

### Requirement: Daily Symptom Log Submission
The system SHALL provide a `POST /registros-diarios` endpoint to accept daily symptom logs.
The payload SHALL include `symptoms` (list), `painRegions` (list), `notes` (optional string), and `timestamp` (ISO 8601 string or datetime).
Each item in `symptoms` and `painRegions` MUST have an `id` (string) and `intensity` (integer between 0 and 10).

#### Scenario: Successful symptom log submission
- **WHEN** a patient sends a valid JSON payload to `POST /registros-diarios` with a valid JWT token
- **THEN** the system SHALL return `201 Created` with the ID of the generated record and persist the data to the database.

#### Scenario: Invalid intensity value
- **WHEN** a patient sends a payload where `intensity` is less than 0 or greater than 10
- **THEN** the system SHALL return `422 Unprocessable Entity` (FastAPI default) or a relevant 400 error.

#### Scenario: Missing required fields
- **WHEN** a patient sends a payload missing `symptoms`, `painRegions`, or `timestamp`
- **THEN** the system SHALL return `422 Unprocessable Entity`.

### Requirement: Authentication and User Identification
The system SHALL extract the patient's ID from the JWT token present in the request's Authorization header.

#### Scenario: Submission with valid token
- **WHEN** a request is made with a valid JWT
- **THEN** the system SHALL associate the symptom log with the user ID contained in the token.

#### Scenario: Submission without token
- **WHEN** a request is made to the endpoint without an Authorization header or with an invalid token
- **THEN** the system SHALL return `401 Unauthorized`.

### Requirement: Atomic Data Persistence
The system SHALL ensure that the main registration record and its associated symptoms and pain regions are saved in a single database transaction.

#### Scenario: Transaction integrity
- **WHEN** an error occurs while saving individual symptom details
- **THEN** the system SHALL rollback the entire transaction, ensuring no partial or orphaned data remains in the database.
