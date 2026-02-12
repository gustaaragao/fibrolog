## Why

Patients with fibromyalgia often need quick access to practical self-care tips to manage symptoms and improve quality of life. Integrating these suggestions directly into the Progress screen provides immediate, actionable advice alongside their health trends.

## What Changes

- **Self-Care Section**: Add a new section called "Dicas de Autocuidado" (Self-Care Tips) at the bottom of the Progress screen.
- **Mocked Suggestions**: Implement a set of predefined self-care suggestions (e.g., light stretching, hydration, mindfulness) that are displayed to the user.
- **Interactive Suggestion Cards**: Create cards that display the suggestion title, a brief description, and a representative icon.

## Capabilities

### New Capabilities
- `self-care-suggestions`: Capability for managing and displaying educational self-care content within the app.

### Modified Capabilities
- `progress-tracking`: Update the progress screen requirements to include the new self-care section.

## Impact

- **Frontend**: Modification of `app/(tabs)/progresso.tsx` to include the new section.
- **Components**: Creation of a new `SelfCareCard` component or similar UI element.
- **UI/UX**: Expansion of the Progress screen layout.
