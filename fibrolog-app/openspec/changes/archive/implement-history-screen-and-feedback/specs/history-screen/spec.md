## ADDED Requirements

### Requirement: History List Display
The system SHALL display a chronological list of all previously submitted symptom logs.

#### Scenario: Viewing the history list
- **WHEN** the user navigates to the History screen
- **THEN** the system SHALL fetch and display a list of daily logs sorted by date (newest first)
- **AND** each entry SHALL show the date and a summary of the symptoms recorded.

### Requirement: Log Detail View
The system SHALL allow the user to view the full details of a specific log entry from the history list.

#### Scenario: Selecting a log from the list
- **WHEN** the user taps on a log entry in the history list
- **THEN** the system SHALL display the full details of that entry, including all symptoms, their intensities, and the pain regions recorded on the body map.
