# API Contract (Initial Proposal)

Use Pydantic request/response models and document endpoints through FastAPI OpenAPI.

## REST endpoints

### `GET /api/health`
Returns service health and version.

### `GET /api/campus`
Returns campus metadata and buildings.

### `GET /api/buildings/{building_id}`
Returns building details, rooms and current twin state.

### `GET /api/buildings/{building_id}/history?from=...&to=...&metric=...`
Returns timestamped historical readings with source and unit.

### `GET /api/simulation/state`
Returns simulation status, simulated time, speed and current state version.

### `POST /api/simulation/start`
Starts the simulator.

### `POST /api/simulation/pause`
Pauses the simulator.

### `POST /api/simulation/reset`
Resets the state to a known baseline; support an optional seed.

### `POST /api/simulation/speed`
Body: `{ "speed": 1 }` where allowed speeds are documented, for example 1x, 5x and 15x.

### `POST /api/simulation/events`
Creates a validated event such as heatwave, low occupancy, after-hours or sensor fault.

### `GET /api/analytics/summary`
Returns energy, carbon, cost and occupancy aggregates with units and source labels.

### `POST /api/scenarios/compare`
Accepts a baseline window and one or more intervention configurations. Returns scenario outputs and assumptions.

### `POST /api/scenarios/{scenario_id}/apply`
Applies the selected scenario to the virtual twin only.

### `GET /api/scenarios`
Lists saved scenario runs.

### `GET /api/weather`
Returns the most recent weather data, source, timestamp, units and freshness status.

### `GET /api/solar/estimate`
Returns solar estimate and model assumptions.

## WebSocket

`/ws/simulation`

Send typed messages for:
- connection status
- simulation status
- twin-state updates
- sensor readings
- alerts
- scenario results

Every update should include a timestamp, source type and state/version identifier.

## API conventions

- Return consistent errors.
- Validate IDs and ranges.
- Include units.
- Never return secrets.
- Make scenario execution reproducible.
- Add pagination for history endpoints.
