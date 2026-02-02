## ADDED Requirements

### Requirement: System integrates with FastAPI authentication endpoint
The system SHALL communicate with the FastAPI backend at localhost:8000/auth to authenticate users.

#### Scenario: Successful authentication request
- **WHEN** user submits valid credentials
- **THEN** system sends POST request to localhost:8000/auth with email and password
- **THEN** system receives Token response with access_token and token_type
- **THEN** authentication is considered successful

#### Scenario: Failed authentication request
- **WHEN** user submits invalid credentials
- **THEN** system sends POST request to localhost:8000/auth
- **THEN** system receives 401 or 422 error response
- **THEN** system displays appropriate error message to user

#### Scenario: Network error during authentication
- **WHEN** authentication request fails due to network issues
- **THEN** system displays connection error message
- **THEN** user can retry the authentication request

### Requirement: HTTP client automatically includes JWT token in authenticated requests
The system SHALL automatically attach JWT token to all API requests that require authentication.

#### Scenario: Authenticated request includes token
- **WHEN** system makes API request after successful authentication
- **THEN** request includes Authorization header with "Bearer <token>"
- **THEN** backend can validate the request as authenticated

#### Scenario: Unauthenticated request omits token
- **WHEN** system makes API request without valid token
- **THEN** request does not include Authorization header
- **THEN** backend treats request as unauthenticated

### Requirement: System handles API response errors gracefully
The system SHALL properly handle various error responses from the FastAPI backend.

#### Scenario: Token expiration error handling
- **WHEN** API request returns 401 Unauthorized due to expired token
- **THEN** system automatically clears stored token
- **THEN** system redirects user to login screen
- **THEN** system displays session expired message

#### Scenario: Server error handling
- **WHEN** API request returns 500 server error
- **THEN** system displays generic error message
- **THEN** system logs error details for debugging
- **THEN** user can retry the operation

#### Scenario: Validation error handling
- **WHEN** API request returns 422 validation error
- **THEN** system displays specific validation error messages
- **THEN** error messages match backend validation rules

### Requirement: API client provides request and response logging
The system SHALL log API requests and responses for debugging purposes in development.

#### Scenario: Request logging in development
- **WHEN** system makes API request in development mode
- **THEN** request URL, method, headers, and body are logged
- **THEN** logs exclude sensitive information like actual passwords

#### Scenario: Response logging in development
- **WHEN** system receives API response in development mode
- **THEN** response status, headers, and body are logged
- **THEN** logs exclude sensitive information like full JWT tokens

### Requirement: API client handles different environment configurations
The system SHALL support different API base URLs for development and production environments.

#### Scenario: Development environment configuration
- **WHEN** app runs in development mode
- **THEN** API requests are sent to localhost:8000
- **THEN** HTTPS certificate validation may be disabled for local development

#### Scenario: Production environment configuration
- **WHEN** app runs in production mode
- **THEN** API requests are sent to production API URL
- **THEN** full HTTPS certificate validation is enforced