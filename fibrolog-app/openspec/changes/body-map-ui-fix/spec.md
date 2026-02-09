# Body Map UI Fix

## Purpose
Ensure the interactive body map is correctly scaled, centered, and visually functional within the application UI.

## Requirements

### Requirement: Full-Width Body Map
The `BodyMap` component SHALL occupy the maximum available width of its container white card, maintaining a centered position.

#### Scenario: Body Map is centered and scaled correctly
- **WHEN** the `BodyMap` is rendered in `app/symptoms.tsx`
- **THEN** it SHALL fill the white background area without excessive or uneven margins.

### Requirement: Interactive Pain Regions
All 50 regions defined in `BodyMap.tsx` SHALL remain selectable and visually distinct when toggled.

#### Scenario: Toggling a region
- **WHEN** a user taps on a body part in the map
- **THEN** that region SHALL change its fill and stroke color to indicate selection
- **AND** the `onRegionToggle` callback SHALL be invoked with the correct region ID.
