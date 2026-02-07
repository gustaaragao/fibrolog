## ADDED Requirements

### Requirement: Main Application Navigation Flow Modification
The system SHALL integrate the new home screen structure and its associated routes, as well as conditionally render header actions (logout icon for home, back-to-home button for sub-screens) within the main application navigation flow.

#### Scenario: Home screen navigation header is correctly configured
- **WHEN** the user is on the home screen
- **THEN** the navigation header SHALL display a logout icon
- **AND** the navigation header SHALL NOT display a back-to-home button.

#### Scenario: Sub-screen navigation header is correctly configured
- **WHEN** the user is on a sub-screen navigable from the home page
- **THEN** the navigation header SHALL display a back-to-home button
- **AND** the navigation header SHALL NOT display a logout icon.
