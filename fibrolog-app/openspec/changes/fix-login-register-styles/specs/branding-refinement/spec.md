## ADDED Requirements

### Requirement: Consistent Visual Identity
The system SHALL ensure that all entry points (Login and Register screens) adhere to the brand's purple theme and modern layout.

#### Scenario: Branding alignment
- **WHEN** the user is on the Login or Register screen
- **THEN** the layout MUST use the primary brand color `#B1278E` and the `Carattere_400Regular` font for all brand-related text and titles

### Requirement: Refined Input Styling
The system's shared Input component SHALL use the brand's color palette for all states, including focus and error.

#### Scenario: Input visual states
- **WHEN** an Input component is focused
- **THEN** its border color MUST change to the primary brand color `#D330AA`

### Requirement: Standardized Button Presentation
The system's shared Button component SHALL provide consistent primary and text variants that align with the brand's visual weight.

#### Scenario: Button variants
- **WHEN** a primary Button is displayed
- **THEN** it MUST use the brand's primary pink color and have centered, bold typography
