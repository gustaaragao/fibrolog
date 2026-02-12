## Why

Patients need a visual way to track their fibromyalgia symptoms, pain levels, and crisis frequency over time. Currently, the application lacks a dedicated dashboard to show progress, making it difficult for users to identify patterns or improvements in their condition.

## What Changes

- **New Progress Screen**: A comprehensive dashboard featuring:
  - **Metric Cards**: Real-time display of average pain, registered days, and monthly crises.
  - **Interactive Bar Chart**: Visual representation of pain intensity over the last 7 days.
  - **AI-Driven Insights**: Contextual feedback based on clinical data trends.
- **API Integration**: Connection to the `GET /estatisticas/progresso` endpoint for data fetching.
- **Refresh Capability**: Pull-to-refresh or manual update button for real-time statistics.

## Capabilities

### New Capabilities
- `progress-tracking`: Implementation of the progress dashboard UI, chart visualization logic, and statistical trend analysis.

### Modified Capabilities
- `api-client`: Ensure the API client can handle statistics-related endpoints and proper error states.

## Impact

- **Frontend**: New `app/(tabs)/progresso.tsx` screen (or similar path).
- **Services**: New or updated `statistics-service.ts` to handle progress data.
- **Dependencies**: Potential addition of a charting library (e.g., `victory-native` or `react-native-chart-kit` given it's a mobile app).
- **Navigation**: Update the main navigation layout to include the Progress tab.
