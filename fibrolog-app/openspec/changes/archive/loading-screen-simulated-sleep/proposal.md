## Why

Introduce a professional loading experience when the application starts, providing visual feedback to the user while the system initializes. This enhances the perceived performance and aligns with the brand identity defined in the provided design assets.

## What Changes

- Create a new loading screen component that mimics the design in `LOADING.png`.
- Implement a simulated initialization delay (sleep) during the application's startup phase.
- Use the 'Carattere' font for the "F" and "fibrolog" text.
- Apply the color `#B1278E` to the brand elements as specified.
- Integrate the loading screen into the main application flow (Expo Router / root layout).

## Capabilities

### New Capabilities
- `loading-screen`: A dedicated component that displays the brand identity with a simulated delay during app startup.

### Modified Capabilities
- `app-initialization`: Update the root layout to display the loading screen before navigating to the initial route.

## Impact

- **Root Layout (`app/_layout.tsx`)**: Will be modified to manage the loading state.
- **Components**: A new `LoadingScreen` component (or similar) will be added.
- **Assets**: Ensure the 'Carattere' font is available and properly loaded.
- **UX**: Users will see a branded loading screen for a short duration upon opening the app.
