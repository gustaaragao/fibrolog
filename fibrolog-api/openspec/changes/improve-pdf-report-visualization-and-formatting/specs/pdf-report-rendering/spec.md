## ADDED Requirements

### Requirement: Render pain trend chart
The PDF report SHALL include a line chart showing the progression of pain intensity over the selected period.

#### Scenario: Pain chart rendering
- **WHEN** generating a report with multiple daily logs
- **THEN** a graphical line chart is embedded in the PDF, plotting intensity (0-10) against dates

### Requirement: Modernize visual styling
The PDF MUST use a consistent and modern color palette, improved font weight distribution for headers, and clear section separators.

#### Scenario: Visual layout check
- **WHEN** the PDF is generated
- **THEN** it uses distinct styles for primary and secondary information, ensuring high readability
