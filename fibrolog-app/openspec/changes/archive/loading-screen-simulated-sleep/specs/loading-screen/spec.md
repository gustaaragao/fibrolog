## ADDED Requirements

### Requirement: Display Brand Identity
The system SHALL display a loading screen that includes the brand "F" and the text "fibrolog".

#### Scenario: Visual presentation
- **WHEN** the loading screen is active
- **THEN** the brand "F" and "fibrolog" MUST be displayed using the 'Carattere' font and color `#B1278E`

### Requirement: Simulated Delay
The system SHALL maintain the loading screen for a minimum simulated duration (sleep) to ensure brand visibility.

#### Scenario: Simulated initialization
- **WHEN** the application starts
- **THEN** the loading screen MUST remain visible for at least 2 seconds (or a configurable duration) before transitioning to the home screen
