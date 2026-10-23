# Master Prompt for Google Antigravity

Act as a senior full-stack engineer, 3D visualization engineer, IoT simulation engineer, data scientist and UI/UX designer.

Build **CarbonTwin**, a complete software-only Smart Campus Carbon Digital Twin. Read all project Markdown documents before coding and treat them as the source of truth. Inspect the existing repository before changing files. Preserve working code and conventions.

## Core product

Create a realistic, interactive 3D campus inspired by the approximate layout of VIT Pune. The campus is illustrative and must not be represented as a verified architectural reconstruction. There is no physical hardware. Use a virtual IoT simulator to generate sensor data and maintain a synchronized digital twin.

The main demonstration flow must be:
1. Open and navigate the 3D campus.
2. Select a building and inspect simulated room/device state.
3. Start the sensor simulation.
4. Trigger a hot-weather or low-occupancy event.
5. Show energy use and carbon emissions changing.
6. Detect an abnormal energy-use condition.
7. Compare HVAC-only, lighting-only and combined interventions.
8. Show energy, CO2e, cost and comfort trade-offs.
9. Apply a selected intervention virtually.
10. Show the updated 3D campus, charts, alerts and scenario history.

## Engineering rules

- Implement real working interactions, not decorative controls.
- Never use a static image as a substitute for the interactive 3D campus.
- Keep a single consistent state model behind the 3D scene, charts, alerts and calculations.
- Label synthetic sensor data, external weather data, forecasts and user assumptions separately.
- Handle loading, empty, offline, stale-data and error states.
- Use environment variables for secrets and API configuration.
- Do not invent real VIT Pune energy readings, sensor access, exact building dimensions or tariffs.
- Do not claim prediction accuracy or actual carbon savings without evidence.
- Write tests for formulas and important state transitions.
- Keep the application runnable after each implementation phase.

## Stack

Frontend: React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Recharts.
Backend: Python, FastAPI, Pydantic.
Simulation: Python, NumPy, Pandas.
Live updates: WebSockets initially; MQTT/Mosquitto optional.
Database: PostgreSQL.
ML: scikit-learn.
Optimization: SciPy or OR-Tools.

## Required pages

- Overview
- 3D Campus
- Building/Room Details
- IoT Simulation Console
- Energy & Carbon Analytics
- Alerts & Anomalies
- Forecasts
- What-if Optimization Lab
- Cost & Tariff Analysis
- Solar Simulation
- Reports & Audit History
- Settings

## Work method

First inspect the repository and provide a concise implementation plan. Then implement Phase 1 only and verify it builds. Continue phase by phase:
1. UI foundation
2. Interactive 3D campus
3. Simulator and shared twin state
4. Carbon and cost engine
5. Weather and solar model
6. Anomaly detection, prediction and optimization
7. persistence, reports, testing and demo polish

After each phase, report files changed, commands run, test/build results, known limitations and the next phase. Do not claim a test passed unless it was actually run.
