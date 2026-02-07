## ADDED Requirements

### Requirement: Home Screen Logout Action
The system SHALL provide a distinct logout icon (exit gate) in the header of the home screen that, upon interaction, prompts the user to confirm logout.

#### Scenario: Logout confirmation displayed on home screen
- **WHEN** the user is on the home screen
- **AND** the user taps the logout icon in the header
- **THEN** a confirmation prompt for logging out SHALL be displayed.

#### Scenario: User confirms logout
- **WHEN** the logout confirmation prompt is displayed
- **AND** the user confirms the logout
- **THEN** the user SHALL be logged out and redirected to the login screen.
