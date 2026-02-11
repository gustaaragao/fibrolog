# Report Generation

## Purpose
Consolidate and summarize patient monitoring data (daily logs and crisis records) into a structured format for clinical review and trend analysis.

## Requirements

### Requirement: Generate consolidated report data
The system SHALL provide an endpoint to generate consolidated report data for a specific patient within a date range. The data MUST include general summaries, pain location frequency, symptom timeline, and crisis logs.

#### Scenario: Successful report data retrieval
- **WHEN** a authenticated patient requests a report with a valid `data_inicio` and `data_fim`
- **THEN** the system returns a 200 OK status with a JSON body containing all required report sections

### Requirement: Calculate monitoring statistics
The system MUST calculate aggregated metrics from daily logs within the period:
- `media_dor`: Arithmetic mean of pain intensity levels.
- `pico_dor`: Maximum pain intensity level recorded.
- `dias_dor_intensa`: Count of days where pain intensity was greater than 7.
- `media_fadiga`: Arithmetic mean of fatigue levels.
- `media_sono`: Arithmetic mean of sleep quality levels.
- `frequencia_emocao`: A count of occurrences for each `EstadoEmocional`.

#### Scenario: Statistics aggregation
- **WHEN** there are multiple `RegistroDiario` entries in the requested period
- **THEN** the response includes the calculated averages, peaks, and frequency counts

### Requirement: Summarize pain regions
The system SHALL identify all pain regions reported in `RegistroDiario` entries during the period and count their total occurrences.

#### Scenario: Pain regions frequency
- **WHEN** the patient has recorded pain in various regions (e.g., 'Coluna lombar', 'Pescoço')
- **THEN** the report contains a list of these regions with the number of times each was reported

### Requirement: Provide daily symptom timeline
The system MUST include a chronological list of all `RegistroDiario` entries in the period, detailing for each day:
- Date
- Pain intensity
- Fatigue level
- Sleep quality
- Primary emotion
- Patient observations/notes

#### Scenario: Timeline chronological order
- **WHEN** logs for multiple days are retrieved
- **THEN** they are ordered by date in the response

### Requirement: Provide crisis record history
The system MUST include a chronological list of all `RegistroCrise` entries in the period, detailing:
- Date and time
- Pain intensity
- Duration
- Related symptoms
- Context/Observations

#### Scenario: Crisis history inclusion
- **WHEN** crisis records exist within the requested range
- **THEN** they are listed in the report data with all their respective details
