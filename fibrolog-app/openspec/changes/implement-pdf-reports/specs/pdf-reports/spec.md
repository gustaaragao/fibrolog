## ADDED Requirements

### Requirement: Period Selection
The system SHALL provide a user interface to select a start date and an end date for the report. The interface MUST include validation to prevent selecting an end date that is before the start date.

#### Scenario: Valid period selection
- **WHEN** the user selects a start date and an end date where end date >= start date
- **THEN** the "Generate Report" button SHALL be enabled

#### Scenario: Invalid period selection
- **WHEN** the user selects an end date that is before the start date
- **THEN** the system SHALL display a validation error and the "Generate Report" button SHALL be disabled

### Requirement: Quick Period Selection
The system SHALL provide shortcut buttons for selecting the last 7, 15, 30, and 60 days relative to the current date.

#### Scenario: Quick select 7 days
- **WHEN** the user clicks the "7d" button
- **THEN** the start date SHALL be set to 7 days ago and the end date SHALL be set to today

### Requirement: Report Generation
The system SHALL request a PDF report from the API using the selected date range and the user's authentication token.

#### Scenario: Successful report generation
- **WHEN** the user triggers the report generation and the API returns a 200 OK with a PDF binary
- **THEN** the system SHALL save the PDF to a temporary local path and display it in the preview component

#### Scenario: API Error handling
- **WHEN** the API returns an error (e.g., 500 Server Error) during report generation
- **THEN** the system SHALL display a friendly error message in Portuguese to the user

### Requirement: PDF Preview
The system SHALL render the generated PDF file within the application, allowing the user to view its contents before sharing or saving.

#### Scenario: Rendering the PDF
- **WHEN** a local PDF path is available after generation
- **THEN** the PDF viewer component SHALL display the file, supporting multi-page navigation and zoom

### Requirement: Native Sharing
The system SHALL allow the user to share the generated PDF file using the device's native sharing capabilities.

#### Scenario: Sharing the PDF
- **WHEN** the user clicks the "Share" button
- **THEN** the system SHALL invoke the native sharing dialog with the PDF file as an attachment

### Requirement: Save to Device
The system SHALL allow the user to save the generated PDF file to the device's persistent storage (Downloads folder).

#### Scenario: Saving the PDF
- **WHEN** the user clicks the "Download" button
- **THEN** the system SHALL copy the PDF from the temporary location to the device's Downloads folder and provide success feedback
