# System Architecture

## Logical data flow

```text
External weather API (optional) ─┐
                                  ├─> Simulation input/configuration
Virtual sensor generator ─────────┘
                                          |
                                          v
                                  Simulation engine
                                          |
                                          v
                                  Digital-twin state
                                          |
                    ┌─────────────────────┼─────────────────────┐
                    v                     v                     v
              3D campus UI          Analytics API         Event/alert engine
                    |                     |                     |
                    └─────────────────────┼─────────────────────┘
                                          v
                                What-if scenario engine
                                          |
                                          v
                              Optimization and comparison
                                          |
                                          v
                               Apply to virtual twin only
```

## Frontend

- React + TypeScript + Vite.
- React Three Fiber and Drei for the 3D world.
- Recharts for time series and scenario comparison.
- A typed API client and shared state store.
- Prefer a small, well-defined state model over duplicated component-local values.

## Backend

- FastAPI for REST endpoints.
- WebSockets for simulation updates.
- PostgreSQL for durable readings, scenario configurations and audit records.
- Python simulation module independent of HTTP handlers.
- Formula/optimization modules independently testable.

## Communication

Start with WebSockets between FastAPI and the frontend because it is straightforward for a software-only demo. Add MQTT/Mosquitto only if demonstrating an IoT-style pub/sub pipeline is useful. The virtual sensor simulator can publish to MQTT topics, but the application must still run without a broker in demo fallback mode.

Example MQTT topics if enabled:
- `carbontwin/campus/{campus_id}/building/{building_id}/room/{room_id}/temperature`
- `carbontwin/campus/{campus_id}/building/{building_id}/room/{room_id}/occupancy`
- `carbontwin/campus/{campus_id}/building/{building_id}/room/{room_id}/power`

## State consistency

The backend simulation state is authoritative when the backend is running. Frontend animation must be a visual representation of that state, not a separate invented data stream. Use timestamps and explicit simulation status.
