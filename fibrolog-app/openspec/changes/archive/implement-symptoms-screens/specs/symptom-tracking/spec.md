## ADDED Requirements

### Requirement: Symptom Selection
The system SHALL allow the user to select one or more symptoms from a predefined list.

#### Scenario: User selects a symptom
- **WHEN** the user taps on a symptom item in the list
- **THEN** the item SHALL be marked as selected and added to the current tracking session

### Requirement: Symptom Intensity
The system SHALL allow the user to record the intensity of each selected symptom on a scale (e.g., 0 to 10).

#### Scenario: User sets intensity
- **WHEN** the user adjusts the intensity slider or picker for a selected symptom
- **THEN** the system SHALL update the recorded value for that symptom

### Requirement: Additional Notes
The system SHALL provide a text input for the user to add optional notes about their symptoms.

#### Scenario: User adds notes
- **WHEN** the user types text into the notes field
- **THEN** the system SHALL store this text as part of the symptom record

### Requirement: Submit Symptom Log
The system SHALL allow the user to submit the recorded symptoms to the backend.

#### Scenario: Successful submission
- **WHEN** the user taps the "Submit" button and the API call succeeds
- **THEN** the system SHALL show a success message and navigate back to the home screen
