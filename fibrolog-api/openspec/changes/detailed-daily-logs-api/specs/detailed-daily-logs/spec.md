## ADDED Requirements

### Requirement: Detailed Daily Log Retrieval
The system SHALL return the complete details of a daily log, including all associated symptoms and pain regions, when requested via the GET endpoints.

#### Scenario: List daily logs with details
- **WHEN** an authenticated patient requests `GET /registros-diarios/`
- **THEN** the system SHALL return a list of logs, where each log includes nested `symptoms` and `painRegions` lists with their respective IDs and intensities.

#### Scenario: Get single daily log with details
- **WHEN** an authenticated patient requests `GET /registros-diarios/{id}`
- **THEN** the system SHALL return the log object including nested `symptoms` and `painRegions` lists.
