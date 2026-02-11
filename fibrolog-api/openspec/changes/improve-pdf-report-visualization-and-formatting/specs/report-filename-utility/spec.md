## ADDED Requirements

### Requirement: Slugify patient names
The system SHALL provide a utility to convert patient names into a slug format. This process MUST:
- Convert all characters to lowercase.
- Replace spaces with underscores (`_`).
- Remove or replace accented characters (e.g., 'ã' -> 'a').
- Remove any special characters that are not alphanumeric or underscores.

#### Scenario: Name slugification
- **WHEN** the name 'Gustavo Henrique Aragão Silva' is processed
- **THEN** the utility returns 'gustavo_henrique_aragao_silva'
