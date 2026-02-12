## ADDED Requirements

### Requirement: Render professional PDF layout
The system SHALL use a template engine to render the PDF report with a professional layout, including a logo placeholder, custom fonts if necessary, and consistent spacing as per the prototype.

#### Scenario: Layout rendering
- **WHEN** the PDF generator is invoked with aggregated report data
- **THEN** it produces a document with a clear "Resumo Geral" section, followed by "Dores Mais Frequentes", "Linha do Tempo de Sintomas", and "Registros de Crise"

### Requirement: Format summary data
The PDF summary section MUST present metrics (average pain, fatigue, sleep) with one decimal place and include an emotion frequency list.

#### Scenario: Summary formatting
- **WHEN** the average pain is 6.54
- **THEN** the PDF displays "Média de dor diária: 6.5/10"
