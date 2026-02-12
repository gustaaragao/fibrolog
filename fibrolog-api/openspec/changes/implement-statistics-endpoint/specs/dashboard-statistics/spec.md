## ADDED Requirements

### Requirement: Dashboard Statistics Endpoint
The system SHALL provide a `GET /api/v1/estatisticas/dashboard` endpoint that returns aggregated health statistics for the authenticated patient.

#### Scenario: Successful statistics retrieval
- **WHEN** an authenticated patient requests their dashboard statistics
- **THEN** the system SHALL return a 200 OK response with the aggregated data including total records, total crises, active days, average pain, most frequent symptom, current streak, and adherence rate

#### Scenario: Unauthorized access
- **WHEN** an unauthenticated user attempts to access the statistics endpoint
- **THEN** the system SHALL return a 401 Unauthorized response

### Requirement: Statistics Aggregation Logic
The system SHALL calculate the following metrics based on the patient's history:
- `total_registros`: Count of all `RegistroDiario` entries.
- `total_crises`: Count of all `Crise` entries.
- `dias_ativos`: Count of unique dates with at least one `RegistroDiario`.
- `media_intensidade_dor`: Average intensity from `RegistroRegiaoDor` joined via `RegistroDiario`.
- `sintoma_mais_frequente`: The name of the symptom with the highest count in `RegistroSintoma`.
- `sequencia_dias_consecutivos`: The longest current streak of consecutive days with records.
- `taxa_adesao`: Percentage of days with records relative to the total days since account creation.

#### Scenario: Statistics for new patient
- **WHEN** a new patient with no records requests statistics
- **THEN** the system SHALL return 0 for counts/streaks and null for averages/symptoms/rates, ensuring the response matches the schema

#### Scenario: Accurate streak calculation
- **WHEN** a patient has records on Monday, Tuesday, and Thursday
- **THEN** the system SHALL identify a sequence of 2 days (Mon-Tue) or correctly reflect the current state based on the current date
