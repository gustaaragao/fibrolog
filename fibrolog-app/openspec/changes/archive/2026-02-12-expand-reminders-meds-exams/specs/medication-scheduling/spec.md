## ADDED Requirements

### Requirement: Medication schedule configuration
The system SHALL allow users to define a medication reminder with dosage and periodic intervals.

#### Scenario: Setting up an interval-based medication
- **WHEN** the user selects type "Medication"
- **THEN** the system SHALL provide fields for "Medicine Name", "Dosage", and "Interval (hours)"
- **AND** the system SHALL calculate recurring daily notification times based on the start time and interval

### Requirement: Dosage tracking
The system SHALL store and display the dosage information associated with a medication reminder.

#### Scenario: Viewing medication details
- **WHEN** the user views the reminders list
- **THEN** medication entries SHALL display the medicine name and dosage (e.g., "Dipirona - 500mg")
