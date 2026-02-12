## 1. Environment Setup

- [x] 1.1 Install dependencies: `expo-file-system`, `expo-sharing`, `react-native-pdf`, `react-native-blob-util`
- [x] 1.2 Verify API accessibility in `constants/api.ts`

## 2. API Service Layer

- [x] 2.1 Create `services/reports-service.ts` to handle PDF binary requests
- [x] 2.2 Implement `getReportPdf` function with authentication and date range parameters

## 3. UI Development - Reports Screen

- [x] 3.1 Implement date range selection using `DatePicker` and `react-hook-form` in `app/relatorio.tsx`
- [x] 3.2 Add validation for date range (end date >= start date)
- [x] 3.3 Add quick selection buttons (7, 15, 30, 60 days)
- [x] 3.4 Integrate `getReportPdf` and handle loading/error states

## 4. PDF Preview and Actions

- [x] 4.1 Integrate `react-native-pdf` for in-app preview
- [x] 4.2 Save API response blob to a temporary file via `expo-file-system`
- [x] 4.3 Implement native sharing using `expo-sharing`
- [x] 4.4 Implement "Save to Downloads" functionality

## 5. Navigation and Polishing

- [x] 5.1 Update `app/home.tsx` menu to point "Gerar PDF" to `/relatorio`
- [x] 5.2 Ensure consistent pink theme styling (#D21F8F)
- [x] 5.3 Verify accessibility labels for all interactive elements
