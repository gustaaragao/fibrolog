# registro-diario-management

## Purpose
CRUD operations for daily patient symptoms and records.

## Requirements

### Requirement: Update daily record
The system SHALL allow patients to update their own daily records.

#### Scenario: Successful update
- **WHEN** a patient sends a PUT request to `/registros-diarios/{id}` with valid data
- **THEN** the system updates the record and returns HTTP 200

#### Scenario: Unauthorized update
- **WHEN** a patient attempts to update a daily record belonging to another patient
- **THEN** the system returns HTTP 404 (Not Found) or 403 (Forbidden)

### Requirement: Delete daily record
The system SHALL allow patients to delete their own daily records.

#### Scenario: Successful deletion
- **WHEN** a patient sends a DELETE request to `/registros-diarios/{id}`
- **THEN** the system removes the record and its associated symptoms/regions and returns HTTP 204

#### Scenario: Unauthorized deletion
- **WHEN** a patient attempts to delete a daily record belonging to another patient
- **THEN** the system returns HTTP 404 (Not Found) or 403 (Forbidden)
