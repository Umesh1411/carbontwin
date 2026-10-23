# Data Model

Use stable string IDs and ISO-8601 timestamps. Store units explicitly or document them consistently.

## Entities

### Campus
- `id`
- `name`
- `timezone`
- `layout_is_illustrative`
- `created_at`

### Building
- `id`
- `campus_id`
- `name`
- `type` (academic, lab, library, hostel, canteen, other)
- `x`, `y`, `z` (3D world position)
- `width`, `height`, `depth`
- `floor_count`
- `design_occupancy`
- `status`
- `layout_is_illustrative`

### Room
- `id`
- `building_id`
- `name`
- `floor`
- `room_type`
- `design_occupancy`

### SensorReading
- `id`
- `sensor_id`
- `building_id`
- `room_id` (nullable)
- `metric`
- `value`
- `unit`
- `timestamp`
- `source_type` (`simulated`, `external`, `measured`, `forecast`)
- `quality_status` (`valid`, `missing`, `suspect`, `stale`)

### EquipmentState
- `id`
- `room_id`
- `equipment_type` (`hvac`, `lighting`, `lab_equipment`, `other`)
- `is_on`
- `power_kw`
- `control_mode` (`simulated`, `scheduled`)
- `timestamp`

### SimulationEvent
- `id`
- `event_type`
- `target_id`
- `parameters`
- `started_at`
- `ended_at`
- `seed`

### Scenario
- `id`
- `name`
- `baseline_id`
- `intervention_parameters`
- `constraints`
- `results`
- `created_at`
- `source_type` (`simulated`)

### TariffConfig
- `id`
- `name`
- `currency`
- `effective_from`
- `energy_rates`
- `fixed_charge`
- `demand_charge`
- `source_note`
- `is_illustrative`

## State conventions

- Power: kW.
- Energy: kWh.
- Temperature: °C.
- Relative humidity: percent.
- Occupancy: people (integer).
- Carbon: kg CO2e.
- Currency: INR for the Pune demo, with tariff values configurable.
- Timestamps: UTC in storage; display in campus local time.

Do not sum instantaneous power values as if they were energy. Energy is the integral of power over elapsed time:
`energy_kwh += power_kw * elapsed_hours`.

For changing power, use a suitable numerical integration method such as trapezoidal integration.
