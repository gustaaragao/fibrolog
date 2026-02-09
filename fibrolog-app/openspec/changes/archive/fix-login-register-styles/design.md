## Context

The previous implementation of the login and registration screens established the functional structure but requires visual refinement to perfectly align with the `HOME.png` design. This includes adjusting component spacing, color consistency, and typography to ensure a premium branded feel.

## Goals / Non-Goals

**Goals:**
- Achieve 100% visual alignment with the brand identity defined in `HOME.png`.
- Standardize the use of the `pink-500` (#D330AA) color for all primary actions and focus states.
- Refine the shared `Input` and `Button` components to support the new design requirements.
- Improve vertical spacing and layout balance in the entry screens.

**Non-Goals:**
- Changing existing form validation logic.
- Adding new functional features to the screens.

## Decisions

- **Color Standardization**: Use `Colors.pink[500]` (#D330AA) for primary buttons and input focus states. The current `pink-600` will be reserved for hover/pressed states or specific text accents for better contrast.
- **Input Component Updates**:
  - Update focus border color to `pink-500`.
  - Ensure label text uses `pink-800` for high legibility.
  - Refine placeholder color for better subtle contrast.
- **Button Component Updates**:
  - The `text` variant will use `text-pink-600` to ensure WCAG 2.1 AA compliance on light backgrounds.
  - Standardize `primary` variant to use `bg-pink-500`.
- **Layout Adjustments**:
  - Increase vertical padding between form elements to match the "airy" feel of the design.
  - Center the brand logo more prominently.
- **Typography**: Strictly use `Carattere_400Regular` for the main title "FibroLog".

## Risks / Trade-offs

- **[Risk] Contrast Ratios** → **[Mitigation]** All chosen pink shades are verified against WCAG 2.1 AA standards as documented in `src/constants/theme.ts`.
- **[Trade-off] Component Generality** → **[Mitigation]** Component updates will be implemented using prop-driven styling to avoid breaking other parts of the application that might use them.
