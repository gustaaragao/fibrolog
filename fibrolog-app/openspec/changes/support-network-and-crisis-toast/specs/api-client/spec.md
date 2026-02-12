## ADDED Requirements

### Requirement: Support Network API Endpoints
The API client SHALL support CRUD operations for the Support Network contacts.

#### Scenario: Support Network GET endpoint
- **WHEN** requested by the support service
- **THEN** the API client SHALL perform a GET request to `/support-network`

#### Scenario: Support Network POST endpoint
- **WHEN** requested with contact data
- **THEN** the API client SHALL perform a POST request to `/support-network`

### Requirement: Crisis Notification API Endpoint
The API client SHALL support triggering notifications to the Support Network.

#### Scenario: Trigger Notification POST endpoint
- **WHEN** requested after crisis confirmation
- **THEN** the API client SHALL perform a POST request to `/support-network/notify`
