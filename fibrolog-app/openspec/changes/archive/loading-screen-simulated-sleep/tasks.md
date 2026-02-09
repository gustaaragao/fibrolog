## 1. Setup and Dependencies

- [x] 1.1 Install `@expo-google-fonts/carattere` package
- [x] 1.2 Verify `expo-font` and `expo-splash-screen` are correctly installed and configured

## 2. Component Refactoring

- [x] 2.1 Refactor `src/components/LoadingScreen.tsx` to include brand "F" and "fibrolog" text
- [x] 2.2 Apply `Carattere` font and color `#B1278E` to brand elements in `LoadingScreen`
- [x] 2.3 Ensure `LoadingScreen` is visually consistent with `LOADING.png` (using Tailwind or StyleSheet)

## 3. Application Integration

- [x] 3.1 Update `app/_layout.tsx` to import `SplashScreen` and `useFonts`
- [x] 3.2 Implement font loading logic for 'Carattere' in `RootLayout`
- [x] 3.3 Implement simulated delay (2 seconds) using a `useEffect` hook in `RootLayout`
- [x] 3.4 Manage `isLoading` state to display `LoadingScreen` before the main `Stack`
- [x] 3.5 Coordinate `SplashScreen.hideAsync()` to transition smoothly from native splash to branded loading

## 4. Verification

- [x] 4.1 Verify loading screen brand identity (font and color)
- [x] 4.2 Verify simulated delay duration
- [x] 4.3 Verify smooth transition from native splash to application stack
