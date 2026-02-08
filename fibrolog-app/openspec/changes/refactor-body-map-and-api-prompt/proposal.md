## Why

The `BodyMap` component currently has scaling issues where the SVG content does not occupy the full designated area (the white square) in the daily symptoms registration screen. This leads to a suboptimal user experience and wasted screen space. Additionally, a structured prompt is needed to guide the development/refactoring of the FastAPI backend to ensure it correctly handles daily symptoms, pain regions, and intensities, adapting to any existing implementations.

## What Changes

- **BodyMap Component Refactoring**:
  - Adjust the SVG `viewBox`, `transform`, and styles in `components/ui/BodyMap.tsx` to ensure the body map fills the container properly.
  - Optimize the layout of `BodyMap` within the `app/symptoms.tsx` screen.
- **API Prompt Creation**:
  - Develop a detailed prompt for a Gemini model to assist in creating/refactoring FastAPI endpoints and Pydantic schemas for `/registros-diarios`.
  - The prompt will include data structures, validation rules (matching existing frontend types), and database schema suggestions.

## Capabilities

### New Capabilities
- `body-map-ui-fix`: Corrects the visual scaling and alignment of the interactive body map.
- `api-integration-guide`: Provides a specialized prompt for backend development to ensure frontend-backend alignment.

## Impact

- `components/ui/BodyMap.tsx`: Major styling and SVG attribute changes.
- `app/symptoms.tsx`: Potential layout adjustments to accommodate the fixed BodyMap.
- `docs/api-refactoring-prompt.md`: This file will be updated or a new one will be created to host the refined prompt.
