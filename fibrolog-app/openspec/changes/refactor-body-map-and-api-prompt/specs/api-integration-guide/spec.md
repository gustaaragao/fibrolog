## ADDED Requirements

### Requirement: Comprehensive Backend Development Prompt
A specialized prompt SHALL be created to guide the implementation of the `/registros-diarios` endpoint using FastAPI and Pydantic.

#### Scenario: Prompt includes all necessary fields
- **WHEN** a developer views the generated prompt
- **THEN** it SHALL include schemas for `symptoms`, `painRegions` (with IDs and intensity), `notes`, and `timestamp`.

### Requirement: API-Frontend Data Alignment
The generated prompt SHALL ensure that the backend data structures match the `SymptomsLogPayload` interface used in the React Native application.

#### Scenario: Backend schema matches frontend payload
- **WHEN** the backend is implemented using the prompt
- **THEN** it SHALL be able to receive and validate the JSON payload sent by `symptomsService.logSymptoms`.
