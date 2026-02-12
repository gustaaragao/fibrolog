# API Client

## Purpose
Core API communication layer for the FibroLog application, handling authentication and data exchange.

## Requirements

### Requirement: Statistics endpoint integration
The API client SHALL be extended to support fetching patient progress statistics.

#### Scenario: Registering the progress statistics endpoint
- **WHEN** the `statisticsService` is initialized
- **THEN** it SHALL have access to the `GET /estatisticas/progresso` endpoint definition

### Requirement: Standardized error handling
The API client SHALL handle common HTTP error codes and provide consistent response structures.

#### Scenario: Handling 401 Unauthorized
- **WHEN** any API call returns a 401 status
- **THEN** the API client SHALL trigger the authentication logout flow
