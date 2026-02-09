## MODIFIED Requirements

### Requirement: Submit Symptom Log
The system SHALL allow the user to submit the recorded symptoms, including pain locations from the body map, to the backend.

#### Scenario: Successful submission with pain regions
- **WHEN** the user taps the "Submit" button after selecting symptoms and pain regions, and the API call succeeds
- **THEN** the system SHALL include the `painRegions` list in the payload, show a success message, and navigate back to the home screen
