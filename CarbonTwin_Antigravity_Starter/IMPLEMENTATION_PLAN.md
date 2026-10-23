# Implementation Plan

## Phase 1 — Foundation
- Set up React + TypeScript + Vite.
- Establish routes, layout, typography, colors and responsive shell.
- Add typed building and room fixtures.
- Ensure lint/build checks pass.

Deliverable: navigable app shell with a polished overview.

## Phase 2 — 3D campus
- Add interactive Three.js/React Three Fiber scene.
- Create illustrative campus ground, paths, landscaping and 5–8 distinct buildings.
- Add building selection, hover details, orbit/zoom/pan and camera reset.
- Add status color based on data props.
- Add fallback UI if WebGL is unavailable.

Deliverable: real interactive 3D scene, not a screenshot.

## Phase 3 — Simulator
- Implement deterministic, seeded virtual sensor streams.
- Add simulation clock and start/pause/reset/speed.
- Model weekday/weekend and time-of-day occupancy.
- Model HVAC, lighting and equipment power.
- Add heatwave, low-occupancy and after-hours events.

Deliverable: repeatable sensor data stream and live campus state.

## Phase 4 — Energy and carbon
- Integrate power over simulated time.
- Convert kW and hours into kWh correctly.
- Apply configurable grid emission factor.
- Build building-level and campus-level totals.
- Add formula unit tests.

Deliverable: consistent, validated metrics.

## Phase 5 — Cost and solar
- Add configurable tariff schedule.
- Calculate energy charge and any configured additional charges.
- Add solar generation estimate based on capacity, radiation, orientation and losses.
- Keep grid imports and solar generation accounting explicit.

Deliverable: cost and solar scenario comparisons.

## Phase 6 — Alerts and forecasting
- Add rule-based alerts first.
- Add a baseline forecast, then a scikit-learn model if enough synthetic history exists.
- Evaluate predictions using a chronological split.
- Display metrics and clearly label forecast data.

Deliverable: explainable alerts and evaluated forecasts.

## Phase 7 — Optimization
- Define candidate interventions and hard constraints.
- Compare baseline and intervention outcomes.
- Add configurable weights or a Pareto-style comparison.
- Applying a scenario updates the virtual twin only.
- Record scenario inputs, outputs and timestamp.

Deliverable: repeatable what-if optimization.

## Phase 8 — Integration and demo
- Add persistence, report exports, error handling and security as needed.
- Test full demo from start to finish.
- Verify all buttons, forms and navigation.
- Document setup, assumptions and limitations.
