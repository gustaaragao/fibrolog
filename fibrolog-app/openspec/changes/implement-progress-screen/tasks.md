## 1. Setup and Dependencies

- [x] 1.1 Install `react-native-chart-kit` and `react-native-svg`
- [x] 1.2 Verify `react-native-svg` is properly linked (if necessary for the Expo version)

## 2. Service Layer Updates

- [x] 2.1 Add `ProgressStatistics` interface to `services/statistics-service.ts` matching the API response
- [x] 2.2 Implement `getProgresso()` method in `statisticsService` to fetch from `GET /estatisticas/progresso`
- [x] 2.3 Ensure API client handles 401 errors by triggering logout (verify existing logic in `services/api.ts`)

## 3. UI Components Implementation

- [x] 3.1 Create `MetricCard` component to display value, label, and trend indicators
- [x] 3.2 Create `WeeklyPainChart` component using `react-native-chart-kit`
- [x] 3.3 Create `InsightCard` component to display feedback with conditional styling (success, warning, etc.)
- [x] 3.4 Implement `LoadingSkeleton` or spinner for the progress screen

## 4. Screen Integration

- [x] 4.1 Update `app/(tabs)/progresso.tsx` to use the new service and components
- [x] 4.2 Implement `useEffect` to fetch data on mount
- [x] 4.3 Implement manual refresh logic (Refresh button in header)
- [x] 4.4 Add error handling UI with "Retry" capability
- [x] 4.5 Ensure responsive layout for different screen sizes using `Dimensions` or Flexbox

## 5. Verification

- [x] 5.1 Verify data fetching with a mock or real API response
- [x] 5.2 Verify chart rendering with empty or null data points
- [x] 5.3 Verify trend icons and colors match the specifications (positive vs negative trends)
