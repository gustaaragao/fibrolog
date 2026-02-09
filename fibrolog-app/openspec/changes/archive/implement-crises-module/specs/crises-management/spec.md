## ADDED Requirements

### Requirement: Record Crisis
The system SHALL allow the user to record a new crisis event with pain intensity, context, duration, symptoms, and observations.

#### Scenario: Successful crisis recording
- **WHEN** user submits the crisis form with valid data (intensity 0-10)
- **THEN** the system SHALL send a POST request to /crises and show a success message

#### Scenario: Invalid pain intensity
- **WHEN** user tries to submit a crisis with pain intensity outside the 0-10 range
- **THEN** the system SHALL prevent submission and display a validation error

### Requirement: List Crises History
The system SHALL display a list of all recorded crises, ordered by date and time (descending).

#### Scenario: View crises list
- **WHEN** user opens the Crises History screen
- **THEN** the system SHALL fetch crises from GET /crises and display them in a list

### Requirement: View Crisis Details
The system SHALL allow the user to view the full details of a specific crisis record.

#### Scenario: Select a crisis from history
- **WHEN** user selects a crisis item from the history list
- **THEN** the system SHALL fetch details from GET /crises/{id} and display them

### Requirement: Update Crisis Record
The system SHALL allow the user to modify an existing crisis record.

#### Scenario: Successful update
- **WHEN** user submits changes to an existing crisis
- **THEN** the system SHALL send a PATCH request to /crises/{id} and update the local state

### Requirement: Delete Crisis Record
The system SHALL allow the user to remove a crisis record.

#### Scenario: Confirm deletion
- **WHEN** user deletes a crisis and confirms the action
- **THEN** the system SHALL send a DELETE request to /crises/{id} and remove it from the list
