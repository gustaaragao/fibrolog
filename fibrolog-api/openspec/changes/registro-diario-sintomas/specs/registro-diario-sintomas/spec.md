## ADDED Requirements

### Requirement: Daily Log Entry Creation
The system SHALL provide an endpoint `POST /registros-diarios` that allows authenticated patients to submit a daily log containing symptoms, pain regions, notes, and a timestamp.

#### Scenario: Successful log submission
- **WHEN** a patient sends a valid JSON payload with symptoms, pain regions, and optional notes to `POST /registros-diarios`
- **THEN** the system SHALL return a `201 Created` status and the ID of the newly created log entry

#### Scenario: Log submission with missing required fields
- **WHEN** a patient sends a JSON payload missing required fields like `symptoms` or `painRegions`
- **THEN** the system SHALL return a `422 Unprocessable Entity` status with details about the missing fields

### Requirement: Validation of Symptoms and Intensities
The system SHALL validate that each symptom and pain region in the submission has an intensity value between 0 and 10 (inclusive).

#### Scenario: Intensity value out of range
- **WHEN** a patient sends a log with a symptom intensity of 11
- **THEN** the system SHALL return a `422 Unprocessable Entity` status indicating the intensity is out of range

### Requirement: Association with Authenticated Patient
The system SHALL automatically associate the created daily log with the patient ID extracted from the bearer token.

#### Scenario: Submission without authentication
- **WHEN** a request is made to `POST /registros-diarios` without a valid JWT
- **THEN** the system SHALL return a `401 Unauthorized` status

### Requirement: Data Persistence and Atomicity
The system SHALL ensure that the main log entry, its symptoms, and its pain regions are saved in the database in a single atomic transaction.

#### Scenario: Database failure during partial save
- **WHEN** a database error occurs after saving the main log but before saving symptoms
- **THEN** the system SHALL roll back the transaction and return a `500 Internal Server Error` status, ensuring no partial data is stored
