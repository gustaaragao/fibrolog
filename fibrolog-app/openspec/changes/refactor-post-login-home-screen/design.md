## Context

The existing post-login experience requires a refactor to align with a new visual design and navigation pattern, as depicted in the provided image. The current implementation lacks consistency and specific navigational elements, such as a prominent logout option on the home screen and a standardized back navigation for sub-screens. This change aims to improve user experience and bring the application's core navigation in line with the intended design.

## Goals / Non-Goals

**Goals:**
- Implement a visually consistent post-login home screen layout according to the image.
- Establish a clear navigation structure with mock screens for future feature development.
- Provide intuitive logout functionality from the home screen header.
- Ensure consistent "back to home" navigation for all sub-screens.

**Non-Goals:**
- Implementing the full functionality of the mocked navigation pages beyond placeholder text.
- Comprehensive design system implementation beyond the scope of this home screen and its direct sub-screens.
- Backend API changes related to user authentication beyond triggering a logout function.

## Decisions

- **Navigation Framework**: Will continue to use `react-navigation` (or existing navigation solution) for routing.
    - *Rationale*: Avoids introducing new dependencies and leverages existing project knowledge.
- **Header Customization**: The navigation header will be conditionally rendered based on the current route. The home screen header will display a logout icon, while sub-screens will display a back-to-home icon.
    - *Rationale*: Provides clear context-sensitive navigation, enhancing usability and matching design requirements.
- **Mock Screen Implementation**: Simple React Native components will be created for each mocked page, containing only the "Bem vindo a página [Nome da Página]" text.
    - *Rationale*: Allows for rapid prototyping of the navigation flow without premature complex implementations.
- **Logout Mechanism**: The logout icon will trigger a confirmation modal before initiating the logout process via the existing authentication context/service.
    - *Rationale*: Prevents accidental logouts, improving user experience.

## Risks / Trade-offs

- **Risk**: Potential for inconsistencies between the design image and actual implementation, especially if the image lacks detailed specifications.
    - *Mitigation*: Close collaboration with design or product team to clarify ambiguities. Initial implementation will prioritize layout structure and navigation flow, with styling refinements in subsequent tasks.
- **Trade-off**: Mocked pages will provide limited functionality, requiring further development later.
    - *Mitigation*: Clearly label mocked pages and communicate their temporary nature in documentation.

## Open Questions

- What are the exact routes and names for each of the navigation items depicted in the provided image? (e.g., "Configurações", "Perfil", "Relatórios")
- Are there specific icons required for the logout and back-to-home actions, or can standard library icons be used?
- What are the expected UI/UX interactions for the logout confirmation modal?
