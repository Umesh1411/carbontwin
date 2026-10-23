# Product Requirements — CarbonTwin

## 1. Purpose

CarbonTwin is a software-only digital twin that simulates campus operations, estimates energy use and carbon emissions, tests energy-saving interventions in a virtual environment and compares the expected impacts before recommending a strategy.

## 2. Users

- Campus administrator: manages configuration and users.
- Facility manager: investigates alerts and compares interventions.
- Viewer/faculty: explores the campus and reads reports.
- Demo operator: runs repeatable simulation scenarios.

Authentication can be deferred in the first MVP if the app is only a local classroom demo, but access control should be designed before deployment.

## 3. Main features

### MVP — required
- Interactive 3D campus with selectable buildings.
- Virtual sensors and time-dependent data generation.
- Start, pause, reset and simulation-speed controls.
- Building-level and campus-level energy metrics.
- Configurable CO2e emission factor.
- Rule-based energy-wastage alerts.
- What-if scenario comparison.
- Configurable tariff and estimated cost savings.
- Clearly labelled synthetic data.
- Deterministic demo scenario.

### Advanced
- External weather integration.
- Rooftop solar generation estimate.
- Energy prediction with evaluation metrics.
- Anomaly detection.
- Multi-objective optimization.
- Scenario history and audit trail.
- CSV/PDF reports.
- Optional MQTT transport.
- Authentication and roles.

## 4. Non-goals

- No hardware deployment.
- No claim of access to real campus IoT devices.
- No automatic control of real building systems.
- No guarantee that simulated savings will occur in the physical campus.
- No verified architectural reconstruction unless accurate source plans are obtained.

## 5. Acceptance criteria

- A user can select each building and inspect its state.
- Sensor readings change according to simulated time and events.
- The 3D building status and dashboard metrics use the same state.
- Energy and carbon calculations are testable and documented.
- Scenario outputs can be reproduced from a saved configuration/seed.
- Applying a scenario updates the virtual state, not a physical device.
- External API failure does not prevent the core demo.
- Every visible control works or is explicitly marked as unavailable.
