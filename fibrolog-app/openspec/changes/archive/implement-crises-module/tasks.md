## 1. Types and Services

- [x] 1.1 Define TypeScript interfaces for Crises and Support Contacts
- [x] 1.2 Implement `services/crises-service.ts` with GET, POST, PATCH, DELETE methods
- [x] 1.3 Implement `services/support-service.ts` to fetch support network contacts

## 2. Crises History Screen

- [x] 2.1 Update `app/crisis.tsx` to fetch and display the list of crises
- [x] 2.2 Implement a list item component for crises showing intensity and date
- [x] 2.3 Add "Add Crisis" button to navigate to the form

## 3. Crisis Entry Form

- [x] 3.1 Create a form component for recording a new crisis
- [x] 3.2 Implement the 0-10 intensity selector (Visual scale)
- [x] 3.3 Add validation for the pain intensity field (0-10)
- [x] 3.4 Integrate form submission with `CrisesService.post`

## 4. Support Network Integration

- [x] 4.1 Add "Notify Support Network" button to the Crisis screen
- [x] 4.2 Implement contact selection modal/list when button is pressed
- [x] 4.3 Integrate `Linking.openURL` to initiate phone calls to selected contacts

## 5. Details, Updates, and Deletion

- [x] 5.1 Implement viewing crisis details
- [x] 5.2 Implement updating an existing crisis record
- [x] 5.3 Implement deletion of a crisis record with confirmation dialog

## 6. Polishing and Error Handling

- [x] 6.1 Add loading states to screens and buttons
- [x] 6.2 Implement user-friendly error messages for API failures (e.g., 422 errors)
- [x] 6.3 Ensure list refreshes after create/update/delete actions
