## ADDED Requirements

### Requirement: Root Layout Loading Management
The application's root layout SHALL manage the initial loading state to prevent premature navigation to protected or main screens.

#### Scenario: Application startup flow
- **WHEN** the application is launched
- **THEN** the system MUST show the loading screen FIRST, wait for the simulated delay to complete, and only THEN proceed to the initial route
