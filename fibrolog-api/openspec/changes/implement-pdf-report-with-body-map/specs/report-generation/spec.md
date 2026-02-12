## ADDED Requirements

### Requirement: Generate PDF report
The system SHALL provide an endpoint to generate a PDF version of the consolidated report. The PDF MUST include a visual header, patient identification, general summary, body map visualization, symptom timeline, and crisis history, following the layout defined in the prototype.

#### Scenario: Successful PDF generation
- **WHEN** an authenticated patient requests the PDF report for a valid period
- **THEN** the system returns a 200 OK status with a binary stream containing the generated PDF file
