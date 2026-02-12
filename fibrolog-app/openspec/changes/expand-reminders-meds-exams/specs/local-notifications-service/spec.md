## MODIFIED Requirements

### Requirement: Cross-platform local notification scheduling
The system SHALL schedule local notifications that trigger at specified intervals or specific calendar dates on both Android and Web.

#### Scenario: Periodic medication trigger
- **WHEN** a medication reminder has an interval defined (e.g., every 8 hours)
- **THEN** the system SHALL schedule recurring notifications based on that interval
- **AND** the notification message SHALL include the medicine name and dosage

#### Scenario: One-time calendar trigger for exams
- **WHEN** an exam reminder has a specific date and time
- **THEN** the system SHALL schedule a non-recurring notification for that exact timestamp
