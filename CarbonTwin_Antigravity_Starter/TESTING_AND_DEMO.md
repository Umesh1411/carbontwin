# Testing and Faculty Demo

## Required automated tests

### Formula tests
- kW × hours yields kWh.
- Integration handles variable power.
- Emissions equal grid import × configured emission factor.
- Tariff schedule applies the correct rate to each interval.
- Solar output never exceeds installed capacity.
- Savings are baseline minus scenario result.
- ROI/payback are not presented when required inputs are absent.

### Simulation tests
- Same seed and configuration produce the same sequence.
- Occupancy stays within configured bounds.
- Pause stops simulated-time advancement.
- Reset returns to a known state.
- Heatwave affects temperature/HVAC according to the model.
- Low occupancy can trigger configured energy-wastage rules.
- Invalid sensor data is flagged rather than silently accepted.

### Integration tests
- Selecting a building shows the matching twin state.
- WebSocket updates change the UI and 3D status.
- Applying a scenario updates the virtual state and audit record.
- Weather API failure falls back safely.
- No UI action is silently inert.

## Five-minute demo
1. Show the 3D campus and select a building.
2. Start the simulator and show sensor updates.
3. Trigger a heatwave.
4. Show HVAC demand, energy and emissions rise.
5. Trigger a low-occupancy event and show an alert.
6. Open What-if Lab and compare three strategies.
7. Show cost, carbon and comfort results.
8. Apply the selected strategy virtually.
9. Show the building status and charts update.
10. Explain the difference between simulated estimates and measured data.

## Evidence for faculty
- Architecture diagram.
- Formula sheet and assumptions.
- API docs.
- Screenshots of key screens.
- Test results.
- Example scenario input/output.
- Limitations and future work.
