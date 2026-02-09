## ADDED Requirements

### Requirement: Post-Submission Feedback
The system SHALL provide immediate visual feedback to the user upon successful submission of a daily symptom log.

#### Scenario: Successful log submission feedback
- **WHEN** the user successfully submits the daily log
- **THEN** the system SHALL display a success message (e.g., in a Modal or Alert)
- **AND** the system SHALL show a toast notification confirming the save.

### Requirement: Automatic Post-Save Navigation
The system SHALL automatically redirect the user to the Home screen after a successful log submission.

#### Scenario: Redirect to Home after save
- **WHEN** the user acknowledges the success feedback (or after a brief delay)
- **THEN** the system SHALL navigate the user back to the Home screen.
