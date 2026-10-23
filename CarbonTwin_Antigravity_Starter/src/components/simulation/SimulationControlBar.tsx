import React from 'react';
import { useTwin } from '../../context/TwinContext';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Flame,
  CloudSun,
  Moon,
  Clock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { SimulationEventConfig } from '../../types/twin';

export const SimulationControlBar: React.FC = () => {
  const {
    state,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSpeed,
    setSimulatedHour,
    injectEvent,
  } = useTwin();

  const events: Array<{ type: SimulationEventConfig['type']; label: string; icon: string }> = [
    { type: 'none', label: 'Normal Schedule', icon: '🏛️' },
    { type: 'heatwave', label: 'Pune Heatwave (+6°C)', icon: '🔥' },
    { type: 'low_occupancy', label: 'Holiday / Low Occupancy', icon: '🏖️' },
    { type: 'after_hours_leak', label: 'After-Hours Leak (Midnight HVAC)', icon: '⚠️' },
    { type: 'solar_drop', label: 'Monsoon Overcast (-75% PV)', icon: '🌧️' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-md">
      {/* PLAY / PAUSE / RESET / SPEED */}
      <div className="flex items-center gap-2">
        <button
          onClick={state.isRunning ? pauseSimulation : startSimulation}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-md transition ${
            state.isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          {state.isRunning ? (
            <>
              <Pause className="h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Start Twin
            </>
          )}
        </button>

        <button
          onClick={() => resetSimulation(42)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          title="Reset simulation to initial baseline"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>

        {/* Speed Pills */}
        <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/60 p-1">
          {[1, 5, 15, 60].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium transition ${
                state.simulationSpeed === s
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* CLOCK & TIME SCRUBBER SLIDER */}
      <div className="flex flex-1 min-w-[240px] max-w-md items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 px-3 py-1.5">
        <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
        <span className="font-mono text-sm font-semibold text-white shrink-0 min-w-[46px]">
          {state.clockString}
        </span>
        <input
          type="range"
          min="0"
          max="23.9"
          step="0.1"
          value={state.simulatedHour}
          onChange={(e) => setSimulatedHour(parseFloat(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-cyan-400"
          title="Scrub time of day (00:00 to 23:59)"
        />
        <span className="text-[11px] text-slate-400 shrink-0">
          {state.isNight ? '🌙 Night' : '☀️ Day'}
        </span>
      </div>

      {/* EVENT INJECTOR */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400 hidden sm:inline">
          Scenario Injector:
        </span>
        <select
          value={state.activeEvent}
          onChange={(e) => injectEvent(e.target.value as SimulationEventConfig['type'])}
          className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow focus:border-cyan-400 focus:outline-none"
        >
          {events.map((ev) => (
            <option key={ev.type} value={ev.type}>
              {ev.icon} {ev.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
