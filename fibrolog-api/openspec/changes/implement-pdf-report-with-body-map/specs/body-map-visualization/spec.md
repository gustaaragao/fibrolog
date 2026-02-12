## ADDED Requirements

### Requirement: Dynamic body map highlighting
The system SHALL identify the most frequent pain regions and apply a visual highlight (e.g., a red circular overlay or path coloring) to the corresponding areas on the body map in the PDF.

#### Scenario: Highlighting frequent regions
- **WHEN** the "Coluna lombar" (ID 10) is the most frequent pain region
- **THEN** the rendered PDF displays a highlight over the lumbar area of the body map

### Requirement: Mapping IDs to SVG coordinates
The system MUST maintain a mapping between pain region IDs (1-50) and their corresponding spatial locations or path elements in `Body-Map.svg`.

#### Scenario: Correct region mapping
- **WHEN** processing region ID '1'
- **THEN** the highlight is applied to the correct anatomical location corresponding to ID '1'
