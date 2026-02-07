## Why

The current post-login home page does not align with the desired visual and navigational pattern shown in the provided image. This refactoring is needed to improve user experience, consistency, and to introduce key navigation elements for the application's core functionalities.

## What Changes

- Refactor the post-login home page layout and navigation to match the visual design and routes presented in the provided image.
- Create mock pages for each new navigation route accessible from the home page. These pages will initially contain placeholder text, e.g., "Bem vindo a página [Nome da Página]".
- Implement a distinct logout icon (exit gate) in the header of the home screen that, upon interaction, prompts the user to confirm logout.
- Implement a "back to home" button in the header of all sub-screens accessible from the home page.

## Capabilities

### New Capabilities
- `post-login-home-layout`: Defines the new visual layout and structure of the post-login home screen, incorporating elements from the provided image.
- `mocked-navigation-screens`: Provides placeholder screens for each new navigation route emanating from the home screen, ensuring basic navigational flow.
- `home-screen-logout-action`: Implements the logout functionality, including the visual indicator (exit gate icon) and the confirmation prompt, accessible from the home screen header.
- `sub-screen-back-navigation`: Implements a universal back-to-home navigation mechanism for all new sub-screens, accessible via a header button.

### Modified Capabilities
- `main-app-navigation`: Modifies the main application navigation flow to integrate the new home screen structure and its associated routes, as well as the conditional header actions (logout vs. back).

## Impact

- **Affected Files**:
    - `app/home.tsx` or `src/screens/HomeScreen.tsx` (primary home screen refactor)
    - `src/navigation/AppNavigator.tsx` (navigation logic and header customization)
    - New files for mocked screens (e.g., `app/mocked-page-1.tsx`, `app/mocked-page-2.tsx`, etc.)
    - `contexts/auth-context.tsx` or `services/auth-service.ts` (for logout integration)
- **User Interface**: Significant changes to the post-login user interface and navigation experience.
- **Routing**: Introduction of new routes and modification of existing navigation paths.
- **User Experience**: Enhanced navigation clarity and consistency.