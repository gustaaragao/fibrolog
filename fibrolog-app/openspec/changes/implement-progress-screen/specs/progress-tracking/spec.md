## ADDED Requirements

### Requirement: Progress data fetching
The system SHALL fetch progress statistics for the authenticated patient from the `GET /estatisticas/progresso` endpoint.

#### Scenario: Successful data retrieval
- **WHEN** the Progress screen is mounted
- **THEN** the system sends a GET request to `/estatisticas/progresso` with the user's auth token
- **AND** the system displays the retrieved metrics, charts, and insights

#### Scenario: Unauthorized access
- **WHEN** the API returns a 401 Unauthorized error
- **THEN** the system SHALL redirect the user to the login screen

### Requirement: Summary Metric Cards
The system SHALL display three summary cards for "Average Pain", "Registered Days", and "Monthly Crises".

#### Scenario: Displaying metrics with trends
- **WHEN** data is successfully fetched
- **THEN** the "Average Pain" card displays the value with one decimal place and its percentage variation
- **AND** the "Registered Days" card displays the count of days for the current month
- **AND** the "Monthly Crises" card displays the count of crises and its percentage variation
- **AND** each card shows a trend icon (🔺, 🔻, ➡️) based on the `tendencia` field

### Requirement: Weekly Pain Chart
The system SHALL display a bar chart representing the intensity of pain over the last 7 days.

#### Scenario: Visualizing weekly pain
- **WHEN** the `grafico_dor_semanal` data is available
- **THEN** the system renders a bar chart with 7 bars
- **AND** the X-axis displays the day of the week (e.g., Seg, Ter)
- **AND** the Y-axis represents intensity from 0 to 10
- **AND** days without records (null `intensidade_dor`) are visually distinct (e.g., transparent or dashed)

### Requirement: Patient Insights
The system SHALL display a list of insights generated based on the patient's data trends.

#### Scenario: Displaying success insights
- **WHEN** an insight has `tipo: "success"`
- **THEN** the system displays the insight card with a green theme and its corresponding icon

#### Scenario: Displaying warning insights
- **WHEN** an insight has `tipo: "warning"`
- **THEN** the system displays the insight card with a yellow theme and its corresponding icon

### Requirement: State Management and Refresh
The system SHALL provide feedback for loading and error states and allow manual data refresh.

#### Scenario: Loading feedback
- **WHEN** data is being fetched from the API
- **THEN** the system SHALL display a loading indicator (spinner or skeleton)

#### Scenario: Manual refresh
- **WHEN** the user clicks the "Refresh" button
- **THEN** the system SHALL re-fetch the data from the API and update the UI
