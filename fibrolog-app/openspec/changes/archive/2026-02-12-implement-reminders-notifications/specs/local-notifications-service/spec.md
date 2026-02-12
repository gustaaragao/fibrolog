## ADDED Requirements

### Requirement: Notification permission handling
The system SHALL request user permission to send notifications before scheduling any alerts.

#### Scenario: Requesting permissions on first use
- **WHEN** the user interacts with the reminder feature for the first time
- **THEN** the system SHALL check for notification permissions
- **AND** if not granted, it SHALL prompt the user to allow notifications

### Requirement: Cross-platform local notification scheduling
The system SHALL schedule local notifications that trigger at the exact time defined by the user on both Android and Web.

#### Scenario: Notification trigger on Android
- **WHEN** the scheduled time is reached on an Android device
- **THEN** the system SHALL display a high-priority native notification with the reminder title

#### Scenario: Notification trigger on Web
- **WHEN** the scheduled time is reached on a Web browser
- **THEN** the system SHALL display a browser notification using the available Notification API
