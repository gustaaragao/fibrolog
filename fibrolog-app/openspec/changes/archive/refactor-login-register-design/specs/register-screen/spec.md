## ADDED Requirements

### Requirement: Register Visual Identity
The Registration screen SHALL feature a modern design with a primary purple color palette consistent with `#B1278E`.

#### Scenario: Visual presentation
- **WHEN** the Registration screen is rendered
- **THEN** it MUST display a cohesive purple theme, with modern styling for containers, typography, and buttons as per `HOME.png`

### Requirement: Registration Form
The Registration screen SHALL provide input fields for the user's name, email, and password, and a primary action button to create an account.

#### Scenario: Successful form rendering
- **WHEN** the user navigates to the Registration screen
- **THEN** the system MUST display name, email, and password inputs and a "Criar conta" (Create account) button

### Requirement: Navigation to Login
The Registration screen SHALL provide a path for existing users to navigate back to the Login screen.

#### Scenario: Navigation link
- **WHEN** the user is on the Registration screen and clicks the login link
- **THEN** the system MUST navigate the user to the Login screen
