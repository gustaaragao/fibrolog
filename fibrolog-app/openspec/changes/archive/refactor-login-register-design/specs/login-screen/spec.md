## ADDED Requirements

### Requirement: Login Visual Identity
The Login screen SHALL feature a modern design with a primary purple color palette consistent with `#B1278E`.

#### Scenario: Visual presentation
- **WHEN** the Login screen is rendered
- **THEN** it MUST display a cohesive purple theme, with modern styling for containers, typography, and buttons as per `HOME.png`

### Requirement: Authentication Form
The Login screen SHALL provide input fields for the user's email and password, and a primary action button for authentication.

#### Scenario: Successful form rendering
- **WHEN** the user navigates to the Login screen
- **THEN** the system MUST display email and password inputs and a "Entrar" (Login) button

### Requirement: Navigation to Registration
The Login screen SHALL provide a clear path for new users to navigate to the Registration screen.

#### Scenario: Navigation link
- **WHEN** the user is on the Login screen and clicks the registration link
- **THEN** the system MUST navigate the user to the Registration screen
