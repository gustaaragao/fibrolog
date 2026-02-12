## Context

The `ProgressoScreen` currently displays metrics, pain charts, and data-driven insights. To provide more comprehensive value, we are adding a section for static self-care suggestions that help patients manage their fibromyalgia symptoms daily.

## Goals / Non-Goals

**Goals:**
- Implement a visually consistent section for self-care tips on the Progress screen.
- Use a dedicated data structure for these suggestions.
- Ensure the suggestions are easy to read and relevant (light stretching, hydration, mindfulness).

**Non-Goals:**
- Dynamically personalizing suggestions based on pain data (this may be a future enhancement).
- Integrating with external health APIs at this stage.

## Decisions

### 1. Data Organization: `constants/self-care.ts`
- **Decision**: Store mocked suggestions in a dedicated constants file.
- **Rationale**: Decouples content from the UI component, making it easier to maintain or migrate to a service/API later.
- **Structure**: Each suggestion will have an `id`, `titulo`, `descricao`, and `icone`.

### 2. UI Component: `SelfCareCard`
- **Decision**: Create a new reusable component `components/ui/SelfCareCard.tsx`.
- **Rationale**: Promotes modularity. It will be similar to `InsightCard` but styled specifically for tips (using the project's primary pink/purple palette).

### 3. Screen Integration
- **Decision**: Append the section after "Seus Insights" in `app/(tabs)/progresso.tsx`.
- **Rationale**: Keeps the screen's logic flow: first the hard metrics, then the generated insights, and finally the general self-care advice.

## Risks / Trade-offs

- **[Risk] Screen Overcrowding** → **Mitigation**: Use a concise card design and ensure the overall Progress screen remains clean. Since we are using a `ScrollView`, vertical space is manageable.
- **[Risk] Content Stagnation** → **Mitigation**: Choose high-value, evergreen tips that remain useful even if not frequently updated.
