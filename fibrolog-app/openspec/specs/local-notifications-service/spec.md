# Local Notifications Service

## Purpose
Core service for managing and scheduling local notifications on the patient's device across different platforms.

## Requirements

### Requirement: Notification permission handling
The system SHALL request user permission to send notifications before scheduling any alerts.

#### Scenario: Requesting permissions on first use
- **WHEN** the user interacts with the reminder feature for the first time
- **THEN** the system SHALL check for notification permissions
- **AND** if not granted, it SHALL prompt the user to allow notifications

### Requirement: Cross-platform local notification scheduling
The system SHALL schedule local notifications that trigger at the exact time defined by the user, at specified intervals, or on specific calendar dates on both Android and Web.

#### Scenario: Notification trigger on Android
- **WHEN** the scheduled time is reached on an Android device
- **THEN** the system SHALL display a high-priority native notification with the reminder title

#### Scenario: Notification trigger on Web
- **WHEN** the scheduled time is reached on a Web browser
- **THEN** the system SHALL display a browser notification using the available Notification API

#### Scenario: Periodic medication trigger
- **WHEN** a medication reminder has an interval defined (e.g., every 8 hours)
- **THEN** the system SHALL schedule recurring notifications based on that interval
- **AND** the notification message SHALL include the medicine name and dosage

#### Scenario: One-time calendar trigger for exams
- **WHEN** an exam reminder has a specific date and time
- **THEN** the system SHALL schedule a non-recurring notification for that exact timestamp
