## 1. Service and API Client Updates

- [x] 1.1 Update `services/support-service.ts` to include the `notify()` method (POST `/rede-apoio/notificar`).
- [x] 1.2 Update `services/support-service.ts` to ensure full CRUD operations (`list`, `create`, `delete`) are correctly typed and implemented.
- [x] 1.3 Update `services/crises-service.ts` to include any necessary types for support contacts if shared.

## 2. Support Network UI (Rede de Apoio)

- [x] 2.1 Implement the contact list UI in `app/support.tsx` using the provided design as a reference.
- [x] 2.2 Add functionality to add a new contact (name and phone) via a modal or form in `app/support.tsx`.
- [x] 2.3 Add functionality to delete a contact with a confirmation dialog.
- [x] 2.4 Integrate `supportService` with the UI to fetch and persist contacts.

## 3. Crisis Form Enhancements

- [x] 3.1 Import `Toast` from `react-native-toast-message` in `app/crisis-form.tsx`.
- [x] 3.2 Update the `onSubmit` handler in `app/crisis-form.tsx` to show a success `Toast` upon successful registration.
- [x] 3.3 Implement the post-registration `Alert.alert` prompt: "Deseja notificar sua rede de apoio?".
- [x] 3.4 Call `supportService.notify()` if the user confirms the notification prompt.
- [x] 3.5 Ensure appropriate `Toast` feedback is shown for the notification action (success or error).

## 4. Verification

- [x] 4.1 Verify that a success toast appears when saving a crisis.
- [x] 4.2 Verify that the "Notify Support Network" prompt appears after saving.
- [x] 4.3 Verify that the Support Network screen correctly lists, adds, and removes contacts.
