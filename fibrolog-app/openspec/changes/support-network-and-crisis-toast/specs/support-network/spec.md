## ADDED Requirements

### Requirement: Support Network Management
The system SHALL allow users to manage a list of trusted contacts in a "Rede de Apoio" (Support Network) screen.

#### Scenario: Add a contact
- **WHEN** the user provides a name and phone number/contact method and clicks "Save"
- **THEN** the system SHALL store the contact and display it in the list

#### Scenario: View contact list
- **WHEN** the user opens the Support Network screen
- **THEN** the system SHALL display all registered trusted contacts

#### Scenario: Delete a contact
- **WHEN** the user selects a contact and confirms deletion
- **THEN** the system SHALL remove the contact from the list

### Requirement: Crisis Notification Trigger
The system SHALL provide an option to notify the Support Network when a new crisis is registered.

#### Scenario: Prompt for notification after crisis registration
- **WHEN** a user successfully saves a new crisis
- **THEN** the system SHALL display a prompt asking: "Deseja notificar sua rede de apoio?"

#### Scenario: Send notification confirmed
- **WHEN** the user confirms the notification prompt
- **THEN** the system SHALL trigger the support network notification service and display a success toast

### Requirement: Crisis Registration Feedback
The system SHALL provide immediate visual feedback upon successful crisis registration.

#### Scenario: Show success toast
- **WHEN** the crisis form is submitted and the server responds with success
- **THEN** the system SHALL display a toast notification "Crise registrada com sucesso!"
