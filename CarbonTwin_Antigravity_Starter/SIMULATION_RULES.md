# Simulation Rules and Formulae

## 1. Design principle

Use causal, time-dependent simulation rather than independent random values. Every simulation should be reproducible with a configurable seed.

## 2. Occupancy
- Use configurable schedules for classes, labs, library, hostel and canteen.
- Weekdays and weekends should differ.
- Apply event modifiers such as holidays, exams or a campus event.
- Clamp occupancy to `[0, design_occupancy]`.
- PIR-like virtual motion is not the same as an exact people counter; label occupancy as simulated.

## 3. Temperature and weather
- Use external weather as an input when available.
- Otherwise use a clearly labelled deterministic fallback profile.
- Model indoor temperature with lag/smoothing rather than instantaneously copying outdoor temperature.
- Add bounded noise, but keep values plausible.

## 4. Equipment power
- Lighting power depends on installed capacity, schedule, occupancy and daylight.
- HVAC power depends on setpoint, indoor/outdoor temperature difference, occupancy, schedule and efficiency assumptions.
- Equipment power depends on room type and operating schedule.
- Every assumption should be configurable.

## 5. Energy
For a constant power interval:
`energy_kwh = power_kw * elapsed_hours`

For a varying power interval, trapezoidal integration is suitable:
`energy_kwh += ((previous_power_kw + current_power_kw) / 2) * elapsed_hours`

Use simulated elapsed time, not wall-clock elapsed time, if the simulation runs faster than real time.

## 6. Carbon
`grid_emissions_kg_co2e = grid_import_kwh * emission_factor_kg_co2e_per_kwh`

Keep the emission factor configurable and document its source and effective date. Do not count solar electricity as grid import. Avoid double-counting emissions or exports.

## 7. Cost
`energy_charge = sum(interval_kwh * applicable_rate_per_kwh)`

Add fixed and demand charges only when configured. Demand charge calculations require a defined demand measurement interval and tariff rules.

## 8. Solar
A first-order model may use:
`solar_output_kw ≈ installed_capacity_kw * normalized_solar_irradiance * performance_ratio`

Clamp output to `[0, installed_capacity_kw]`. For more detailed modelling, use a documented PV model or a supported external service. State assumptions about orientation, shading, temperature and losses.

## 9. Anomalies
Start with explainable rules:
- HVAC power is high while occupancy is near zero.
- Lighting remains active outside the configured schedule.
- Power is above a configurable baseline threshold.
- Sensor reading is missing, stale or outside plausible bounds.

Show the rule and readings that triggered each alert.

## 10. Interventions
Each intervention should specify:
- Target building/room/equipment.
- Start and end time or schedule.
- Control change (for example, lighting schedule or HVAC setpoint).
- Constraints.
- Assumptions and expected effects.

Do not assume every intervention has a fixed percentage saving. Recalculate equipment power using the model, then compare against the same baseline conditions.

## 11. Validation
Test equations with known inputs and units. Clearly label all generated results as simulated estimates, not measured campus outcomes.
