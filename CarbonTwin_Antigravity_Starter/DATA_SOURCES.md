# Data Sources and Provenance

## External weather
Potential source: Open-Meteo (https://open-meteo.com/).
- Review current API terms and attribution requirements before deployment.
- Record requested location, request time, returned timestamp and units.
- Handle missing data, rate limits and outages.
- Do not describe weather as an indoor sensor measurement.

## Solar
Potential source: NREL PVWatts API documentation (https://developer.nlr.gov/docs/solar/pvwatts/v8/).
- Verify service availability, geographical suitability and API access.
- Keep a local model fallback.
- Record model inputs and assumptions.

## Campus data
- The project does not assume access to actual VIT Pune meter readings, occupancy records, blueprints or IoT devices.
- Use illustrative building placements and explicitly synthetic campus readings.
- If verified campus maps or plans are later provided, record their source and permitted use.

## Electricity tariffs and emission factors
- Prefer current official or authoritative sources.
- Store the source URL/title, publication/effective date, units and retrieval date.
- If values are only for demonstration, label them `illustrative`.
- Do not hard-code values as universal constants.
