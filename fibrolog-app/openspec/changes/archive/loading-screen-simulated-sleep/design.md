## Context

The application currently lacks a branded loading experience during startup. There is a basic `LoadingScreen` component, but it doesn't align with the new brand identity specified in `LOADING.png`. The goal is to provide a smooth, branded transition from the native splash screen to the application's main interface, including a simulated initialization delay for brand visibility.

## Goals / Non-Goals

**Goals:**
- Implement a branded `LoadingScreen` component using the 'Carattere' font and color `#B1278E`.
- Integrate the loading screen into `app/_layout.tsx` using a simulated delay.
- Ensure the native splash screen stays visible until the application (and the loading component) is ready.
- Maintain WCAG 2.1 AA compliance for colors.

**Non-Goals:**
- Replacing the native splash screen entirely (it will be used in conjunction with the JS loading screen).
- Implementing real background initialization tasks (only simulated for now).

## Decisions

- **Font Loading**: Use `@expo-google-fonts/carattere` for easy integration with Expo.
- **Simulated Delay**: Use a `setTimeout` wrapped in a Promise to simulate a 2-second delay in `app/_layout.tsx`.
- **State Management**: Use a local `isLoading` state in the `RootLayout` to control when to show the loading screen vs. the application stack.
- **Splash Screen Control**: Use `SplashScreen.preventAutoHideAsync()` and `SplashScreen.hideAsync()` from `expo-splash-screen` to manage the transition from native splash to JS loading.
- **Component Refactor**: Refactor `src/components/LoadingScreen.tsx` to match the brand design.

## Risks / Trade-offs

- **[Risk] Font Loading Failure** → **[Mitigation]** Use a fallback system font if 'Carattere' fails to load.
- **[Trade-off] Artificial Delay** → **[Mitigation]** Keep the delay reasonable (approx. 2s) to avoid user frustration while ensuring brand visibility.
