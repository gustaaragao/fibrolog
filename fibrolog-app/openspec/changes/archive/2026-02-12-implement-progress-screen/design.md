## Context

The FibroLog application needs a way for patients to visualize their progress over time. The "Progress" tab currently exists as a static placeholder. This design outlines the implementation of a dynamic progress dashboard that fetches data from a new backend endpoint and visualizes it using charts and metric cards.

## Goals / Non-Goals

**Goals:**
- Implement the `ProgressoScreen` with real data from `GET /estatisticas/progresso`.
- Display high-level metrics (Average Pain, Registered Days, Monthly Crises) with trend indicators.
- Visualize weekly pain intensity using a bar chart.
- Show actionable insights based on data trends.
- Handle loading, error, and empty states gracefully.

**Non-Goals:**
- Implementing the backend endpoint (assumed to be already defined in the API contract).
- Adding complex multi-month comparison charts (limited to 7-day weekly view for now).
- PDF generation (handled by a separate `implement-pdf-reports` change).

## Decisions

### 1. Charting Library: `react-native-chart-kit`
- **Rationale:** It's lightweight, easy to integrate with Expo, and provides sufficient customization for bar charts.
- **Alternatives:** 
  - `victory-native`: More powerful but significantly heavier and more complex to style for simple use cases.
  - `react-native-svg-charts`: Abandoned/deprecated.

### 2. Service Layer: `statisticsService.getProgresso`
- **Rationale:** Extend the existing `statistics-service.ts` to include the new endpoint. This maintains consistency with how other features (e.g., dashboard, auth) are implemented.
- **Data Mapping:** The service will return the raw response from the API, and the UI component will handle formatting (decimals, percentages).

### 3. State Management: React Hooks (`useState`, `useEffect`, `useCallback`)
- **Rationale:** Given the simplicity of the screen (single data source), local state is sufficient. No need for global state (Redux/Zustand) for this specific screen.
- **Refresh Strategy:** A "Refresh" button in the header or at the bottom of the list will trigger a re-fetch.

### 4. Styling: NativeWind + Styled Components
- **Rationale:** The project already uses NativeWind (Tailwind CSS for React Native). We will use it for layout and consistent spacing, while keeping the specific gradient/brand colors defined in the styles.

## Risks / Trade-offs

- **[Risk] Chart Responsiveness** → **Mitigation**: Use `Dimensions.get('window').width` to calculate chart width dynamically and ensure it fits on all screen sizes.
- **[Risk] Missing Data (Nulls)** → **Mitigation**: Implement explicit "Empty" states for the chart and metrics if the user hasn't recorded enough data yet.
- **[Risk] Performance with SVG Charts** → **Mitigation**: `react-native-chart-kit` uses SVG via `react-native-svg`, which is efficient for simple datasets (7 points).
