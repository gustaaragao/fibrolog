## ADDED Requirements

### Requirement: Display static self-care tips
The system SHALL provide a collection of predefined self-care tips aimed at symptom management for fibromyalgia.

#### Scenario: Rendering tips list
- **WHEN** the self-care section is displayed
- **THEN** the system SHALL render a list of cards, each containing a title, a brief description, and a thematic icon (e.g., a water drop for hydration).

### Requirement: Self-care tip structure
Each self-care suggestion SHALL contain a unique identifier, a title, a detailed description, and an icon name.

#### Scenario: Validating tip content
- **WHEN** a tip card is rendered
- **THEN** the title SHALL be bold and prominent
- **AND** the description SHALL provide actionable advice
- **AND** the icon SHALL be visually associated with the tip's theme
