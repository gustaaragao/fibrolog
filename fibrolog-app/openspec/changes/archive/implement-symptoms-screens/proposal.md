## Why

The application needs a user-friendly and visually consistent way for patients to record and track their fibromyalgia symptoms. Implementing the screens based on the provided designs (Sintoma 1 and Sintoma 2) is essential for the core functionality of the FibroLog system.

## What Changes

- Implement the symptom tracking interface in `app/symptoms.tsx` following the provided designs.
- Implement data collection logic for symptoms (e.g., selection, intensity, notes).
- Prepare for API integration by defining the necessary backend routes.
- Create a specific prompt for API refactoring to ensure the backend supports the frontend tracking requirements.

## Capabilities

### New Capabilities
- `symptom-tracking`: Implementation of screens and logic to capture patient symptom data, including intensity and types of pain.

### Modified Capabilities
- None

## Impact

- `app/symptoms.tsx`: Primary screen implementation.
- `services/api.ts`: Integration with backend endpoints.
- API Backend: Prompt-driven refactoring of routes.
