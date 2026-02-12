# Exam Reminders

## Purpose
Allow patients to schedule and receive notifications for medical exams and appointments.

## Requirements

### Requirement: Date-specific exam reminders
The system SHALL allow users to schedule reminders for specific medical exams or appointments on a future date.

#### Scenario: Scheduling an exam
- **WHEN** the user selects type "Exam"
- **THEN** the system SHALL provide fields for "Exam Name" and "Date and Time"
- **AND** the system SHALL schedule a one-time notification for that specific timestamp
