## Context

The current reminder system only supports simple daily alerts. Patients need to manage medications with specific dosages and intervals (e.g., every 8 hours) and one-time events like medical exams on specific future dates. This design outlines how to extend the data model and notification logic to support these specialized types.

## Goals / Non-Goals

**Goals:**
- Extend the `Reminder` data structure to support `medicamento` and `exame` types.
- Implement periodic notification scheduling for medications based on hour intervals.
- Implement one-time notification scheduling for specific exam dates.
- Update the UI to conditionally show fields (dosage, interval, date) based on the selected reminder type.

**Non-Goals:**
- Complex medication tapering schedules.
- Multi-day intervals (initial focus is sub-24h intervals for medications).
- Integration with external calendars (Google/iCal).

## Decisions

### 1. Updated Data Model
The `Reminder` interface will be extended:
```typescript
type ReminderType = "geral" | "medicamento" | "exame";

interface Reminder {
  id: string;
  titulo: string;
  tipo: ReminderType;
  hora: number;
  minuto: number;
  ativo: boolean;
  // Campos condicionais
  dosagem?: string;      // Para medicamentos
  intervalo?: number;    // Para medicamentos (em horas)
  dataExame?: string;    // Para exames (ISO string)
  notificationIds: string[]; // Suporte a múltiplas notificações para intervalos
}
```

### 2. Notification Trigger Strategy
- **Medications**: For an interval of `X` hours, the system will schedule `24/X` daily recurring notifications starting from the initial time.
- **Exams**: Use `Notifications.CalendarNotificationTrigger` with specific year, month, day, hour, minute.
- **General**: Keep using `DailyNotificationTrigger`.

### 3. UI Refinement
- The "New Reminder" modal will feature a `SegmentedControl` or `Picker` at the top to select the type.
- **Medicamento View**: Adds "Dosagem" (Input) and "Repetir a cada (horas)" (Select/Input).
- **Exame View**: Replaces daily time picker with a full Date & Time picker.

### 4. Notification Service Abstraction
Update `notification-service.ts` to accept a `Reminder` object and determine the best triggering strategy internally, hiding the complexity of calculating multiple notification IDs for interval-based meds.

## Risks / Trade-offs

- **[Risk] Notification Limit** → **Mitigation**: iOS/Android have limits on the number of scheduled notifications per app (usually ~64). Interval-based meds consume more "slots". We will warn the user if they exceed a reasonable number of active reminders.
- **[Risk] Timezone Changes** → **Mitigation**: Local notifications usually use device time. For exams on specific dates, we will store them in UTC and convert to local time during scheduling.
- **[Risk] Web Compatibility** → **Mitigation**: Web support for complex triggers is limited. We will focus on Android reliability and provide basic "alert" fallback for Web when the tab is open.
