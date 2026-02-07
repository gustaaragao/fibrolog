## Context

The current login and registration screens (`app/login.tsx` and `app/register.tsx`) use basic `StyleSheet` styling and do not fully leverage the project's shared UI components or the intended modern purple aesthetic. The goal is to refactor these screens to match the design language proposed in `HOME.png`, utilizing NativeWind for styling and existing components for consistency.

## Goals / Non-Goals

**Goals:**
- Refactor `app/login.tsx` and `app/register.tsx` with a modern, purple-themed UI.
- Use NativeWind (Tailwind CSS) for consistent and maintainable styling.
- Utilize shared UI components (`Button`, `Input`) from `components/ui/`.
- Ensure brand consistency by using the `Carattere` font for titles/logos.
- Maintain existing authentication logic and form validation.

**Non-Goals:**
- Changing the underlying authentication service or API.
- Altering the application's navigation structure.
- Refactoring the entire component library (only using/extending what's necessary).

## Decisions

- **Styling Framework**: Use **NativeWind** as the primary styling method, aligning with the project's established patterns (e.g., `Button.tsx`).
- **Component Usage**: Replace custom `TextInput` and `TouchableOpacity` instances with the shared `Input` and `Button` components from `components/ui/`.
- **Typography**: Apply `font-family: 'Carattere_400Regular'` to the main app title ("FibroLog") to match the brand identity established in the loading screen.
- **Layout**: Implement a centered, keyboard-aware layout for both screens to ensure a professional feel.
- **Color Palette**: Strictly adhere to the `pink-500` (#D330AA) for primary actions and `pink-800` (#7d1e60) for primary text, with a clean white or `pink-50` background.

## Risks / Trade-offs

- **[Risk] Component Limitations** → **[Mitigation]** If existing UI components (like `Input`) lack specific props needed for the new design (e.g., icons or specific padding), they will be extended or localized styling will be applied.
- **[Trade-off] Visual Identity vs. Native Feel** → **[Mitigation]** Prioritize the custom visual identity while ensuring standard mobile interactions (e.g., proper keyboard behaviors).
