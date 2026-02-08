## ADDED Requirements

### Requirement: Interactive Anatomical Map
The system SHALL provide a visual representation of the human body with selectable anatomical regions.

#### Scenario: User views the body map
- **WHEN** the user navigates to the pain location reporting step
- **THEN** the system SHALL display the interactive body map with all defined regions

### Requirement: Pain Region Selection
The system SHALL allow the user to select one or more anatomical regions to indicate where they are feeling pain.

#### Scenario: User selects a region
- **WHEN** the user taps on a specific region on the body map
- **THEN** the system SHALL toggle the selection state of that region

### Requirement: Visual Feedback for Selection
The system SHALL provide immediate visual feedback when a region is selected or deselected.

#### Scenario: Selected region highlight
- **WHEN** a region is selected
- **THEN** the system SHALL change the color or highlight the region on the map
