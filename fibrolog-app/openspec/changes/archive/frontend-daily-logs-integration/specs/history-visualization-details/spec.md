## ADDED Requirements

### Requirement: Display Nested Symptom Details in History
The system SHALL display the list of symptoms and their associated intensities for each log entry in the history view, using the nested data from the updated API.

#### Scenario: Visualizing symptoms in history
- **WHEN** the user views the history list
- **THEN** each log entry SHALL show the name and icon for each symptom, alongside its intensity value (0-10)

### Requirement: Display Nested Pain Regions in History
The system SHALL visualize the pain regions and their intensities for each log entry in the history view, using the nested data from the updated API.

#### Scenario: Visualizing pain regions in history
- **WHEN** the user views the history list or log details
- **THEN** the system SHALL display the recorded pain regions with their respective intensities (0-10)

### Requirement: Map API IDs to Local Assets
The system MUST correctly map the string IDs for symptoms and pain regions received from the API to the corresponding local icons, labels, and BodyMap regions.

#### Scenario: Correct icon and label mapping
- **WHEN** the API returns a symptom with ID "1"
- **THEN** the system SHALL display the label "Dor de Cabeça" and the "head-alert" icon, matching the local SYMPTOMS configuration

### Requirement: Optimized Detail View Data Usage
The system SHALL use the nested data already fetched in the list view to populate the log details, avoiding redundant API calls for symptoms and pain regions.

#### Scenario: Viewing log details without extra fetch
- **WHEN** the user taps on a log entry in the history list
- **THEN** the system SHALL display the full details (symptoms, pain regions, notes) using the data already available in the list response
