## 1. Service Layer Updates

- [x] 1.1 Add `getAll()` method to `DailyLogService` in `services/symptoms-service.ts` to fetch historical records.
- [x] 1.2 Define necessary interfaces for historical data if they differ from `DailyLogPayload`.

## 2. History Screen Implementation

- [x] 2.1 Refactor `app/history.tsx` to include a `FlatList` for displaying logs.
- [x] 2.2 Implement a loading state using `ActivityIndicator` while fetching data.
- [x] 2.3 Create a list item component for each log entry (date and summary).
- [x] 2.4 Implement the "No records found" empty state.
- [x] 2.5 Implement the detail view (navigation or modal) to show full log details (symptoms and body map regions).

## 3. Symptoms Registration Feedback

- [x] 3.1 Import and use `Toast` from `react-native-toast-message` in the `onSubmit` handler of `app/symptoms.tsx`.
- [x] 3.2 Update the `onSubmit` handler to show a `Toast.show` notification upon success.
- [x] 3.3 Ensure the `Alert.alert` success message is present and triggers navigation to `/home` on dismissal.
- [x] 3.4 Verify that `RootLayout` in `app/_layout.tsx` is correctly rendering the `<Toast />` component at the root level.

## 4. Final Verification

- [x] 4.1 Test the end-to-end flow: register symptoms -> see feedback -> navigate home -> check history.
- [x] 4.2 Verify visual consistency with the pink theme across the new History screen.
