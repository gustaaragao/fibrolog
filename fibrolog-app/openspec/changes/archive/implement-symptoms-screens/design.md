## Context

The application needs a symptom tracking feature. This involves two main screens or sections: one for selecting symptoms and another for recording the intensity of the selected symptoms, along with additional notes.

## Goals / Non-Goals

**Goals:**
- Implement the UI based on "Sintoma 1" (Selection) and "Sintoma 2" (Details).
- Use the project's pink theme for consistent styling.
- Ensure accessibility by following WCAG standards already established in the theme.
- Provide a clear API refactoring prompt for the backend.

**Non-Goals:**
- Implement historical data visualization (out of scope for this change).
- Implement offline sync (to be handled in a separate change if needed).

## Decisions

- **Screen Structure**: Use a multi-step form or a scrollable list that expands to show details. Given the design, a two-step approach seems most appropriate.
- **UI Components**:
    - `FlatList` for the symptom selection grid.
    - Custom intensity selector (0-10) using styled buttons for better cross-platform consistency and accessibility compared to a default slider.
    - `TextInput` for notes with pink theme borders.
- **Styling**: Use `nativewind` classes combined with `ThemeColors` from `src/constants/theme.ts`.
- **State Management**: Use `react-hook-form` if complex validation is needed, or simple `useState` for the symptom selection and details. Given other forms in the project (e.g., `UserRegistrationForm.tsx`), `react-hook-form` is the preferred pattern.

## Risks / Trade-offs

- [Risk] → API endpoint might not exist yet. [Mitigation] → Create a detailed prompt for the backend refactoring/creation and use a placeholder service.
- [Risk] → Screen complexity with many symptoms. [Mitigation] → Use `FlatList` with `numColumns={2}` for a grid layout to improve scannability.
