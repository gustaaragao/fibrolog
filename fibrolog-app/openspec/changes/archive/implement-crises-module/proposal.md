## Why

Fibromyalgia patients experience acute episodes of pain (crises) that need to be tracked for clinical monitoring and personal history. Currently, the application lacks a dedicated module to record these events, limiting the effectiveness of the monitoring system. Additionally, patients in crisis need a quick way to notify their support network.

## What Changes

- Implementation of a new Crises module in the mobile application.
- Integration with the `/crises` backend API for full CRUD operations.
- New UI for recording crisis details (intensity, context, duration, symptoms, observations).
- History view for tracking past crises.
- Integration of a "Notify Support Network" feature that initiates phone calls to registered support contacts.

## Capabilities

### New Capabilities
- `crises-management`: Full CRUD lifecycle for crisis events, including data entry and history visualization.
- `support-network-integration`: Feature to retrieve support network contacts and initiate emergency communication (phone calls).

### Modified Capabilities
- (None)

## Impact

- **API**: Integration with the `/crises` endpoint.
- **Components**: New forms and list components.
- **Services**: New `CrisesService` for API communication.
- **Navigation**: Addition of Crises-related screens to the app navigation.
- **Native Features**: Usage of linking/telephony for support network calls.
