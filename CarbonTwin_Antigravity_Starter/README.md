# CarbonTwin — Smart Campus Carbon Digital Twin

A software-only IoT simulation and digital-twin project for an approximate, illustrative VIT Pune-inspired campus. No physical hardware is required.

## What this starter contains

- Project specification and scope
- Architecture and implementation roadmap
- Simulation rules and formulas
- Data model and API contract
- UI/UX guidance
- Testing and demo checklist
- Antigravity build instructions
- A starter interactive 3D campus scene in React Three Fiber

## Important data-integrity rules

- The campus layout is illustrative, not a verified reconstruction of VIT Pune.
- Weather fetched from an external API must be labelled as external weather data.
- Occupancy, HVAC, room sensors and electricity consumption are synthetic unless actual measurements are explicitly connected.
- Clearly label forecast values, simulated values and user-configured assumptions.
- Do not claim measured campus carbon savings from simulated results.

## Suggested stack

- Frontend: React + TypeScript + Vite
- 3D: Three.js + `@react-three/fiber` + `@react-three/drei`
- UI: Tailwind CSS or existing component system
- Charts: Recharts
- Backend: Python + FastAPI
- Live updates: WebSockets first; MQTT/Mosquitto can be added later
- Database: PostgreSQL
- Simulation: Python, NumPy, Pandas
- Prediction: scikit-learn
- Optimization: SciPy or OR-Tools

## Getting started

1. Open this folder in Google Antigravity.
2. Read `ANTIGRAVITY_BUILD_PROMPT.md` first.
3. Ask the agent to inspect the repository and implement one phase at a time.
4. For the 3D starter, install frontend dependencies:
   ```bash
   npm install three @react-three/fiber @react-three/drei
   npm install -D @types/three
   ```
5. Place `CampusScene.tsx` in your React source tree, for example `src/components/CampusScene.tsx`, and import it into a page.
6. Add a page-level container with a defined height (for example `height: 70vh`) so the Canvas has room to render.

## Recommended implementation order

1. Frontend shell and design system
2. 3D campus scene and building selection
3. Deterministic simulated IoT data
4. Shared digital-twin state
5. Energy and carbon calculations
6. What-if scenarios and cost calculations
7. Weather API integration
8. Prediction, anomaly detection and optimization
9. Persistence, reports, testing and demo polish

Do not implement every advanced feature at once. Keep the project runnable after every phase.
