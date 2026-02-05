## ADDED Requirements

### Requirement: Email field validates email format
The system SHALL validate email field input to ensure proper email format before allowing form submission.

#### Scenario: Valid email format is accepted
- **WHEN** user enters email in valid format (e.g., user@domain.com)
- **THEN** email field shows no validation errors
- **THEN** form submission is allowed to proceed

#### Scenario: Invalid email format shows error
- **WHEN** user enters invalid email format (e.g., "invalid-email")
- **THEN** system displays email format error message
- **THEN** form submission is prevented until valid email is entered

#### Scenario: Empty email field shows required error
- **WHEN** user attempts to submit form with empty email field
- **THEN** system displays "Email is required" error message
- **THEN** form submission is prevented

### Requirement: Password field validates strength requirements
The system SHALL validate password input against the same strength requirements as the backend PacienteSchema.

#### Scenario: Valid strong password is accepted
- **WHEN** user enters password with minimum 8 characters, uppercase, lowercase, number, and special character
- **THEN** password field shows no validation errors
- **THEN** form submission is allowed to proceed

#### Scenario: Password too short shows error
- **WHEN** user enters password with fewer than 8 characters
- **THEN** system displays "Password must be at least 8 characters" error message
- **THEN** form submission is prevented

#### Scenario: Password missing uppercase shows error
- **WHEN** user enters password without uppercase letter
- **THEN** system displays "Password must contain at least one uppercase letter" error message
- **THEN** form submission is prevented

#### Scenario: Password missing lowercase shows error
- **WHEN** user enters password without lowercase letter
- **THEN** system displays "Password must contain at least one lowercase letter" error message
- **THEN** form submission is prevented

#### Scenario: Password missing number shows error
- **WHEN** user enters password without number
- **THEN** system displays "Password must contain at least one number" error message
- **THEN** form submission is prevented

#### Scenario: Password missing special character shows error
- **WHEN** user enters password without special character
- **THEN** system displays "Password must contain at least one special character" error message
- **THEN** form submission is prevented

### Requirement: Form provides real-time validation feedback
The system SHALL provide immediate feedback as user types, not just on form submission.

#### Scenario: Real-time email validation during typing
- **WHEN** user types in email field
- **THEN** validation feedback updates in real-time as user types
- **THEN** error messages appear and disappear as input becomes valid/invalid

#### Scenario: Real-time password validation during typing
- **WHEN** user types in password field
- **THEN** validation feedback updates in real-time as user types
- **THEN** password strength indicators show current compliance status

### Requirement: Form handles validation errors gracefully
The system SHALL display validation errors in a user-friendly manner that guides users to correct input.

#### Scenario: Multiple validation errors display clearly
- **WHEN** form has multiple validation errors
- **THEN** all relevant error messages are visible simultaneously
- **THEN** errors are positioned near their corresponding input fields
- **THEN** submit button remains disabled until all errors are resolved

#### Scenario: Validation errors clear when input becomes valid
- **WHEN** user corrects invalid input to meet validation requirements
- **THEN** corresponding error message disappears immediately
- **THEN** submit button becomes enabled when all validations pass