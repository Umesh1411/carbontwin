import React from 'react';
import { useTwin } from '../context/TwinContext';
import { CampusCanvas } from '../components/3d/CampusCanvas';
import { SimulationControlBar } from '../components/simulation/SimulationControlBar';
import { Building2, Layers, Zap, Sun, Users, Flame, Eye } from 'lucide-react';

export const CampusView: React.FC = () => {
  const {
    state,
    selectBuilding,
    selectFloor,
    toggleExplodedView,
    toggleXrayMode,
  } = useTwin();

  return (
    <div className="space-y-4 pb-8">
      {/* Simulation Controls Bar */}
      <SimulationControlBar />

      {/* Building Quick Switch Bar for the 5 Buildings */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => selectBuilding(null)}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition ${
            state.selectedBuildingId === null
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Full Campus (5 Buildings)
        </button>

        {state.buildings.map((b) => {
          const isSelected = state.selectedBuildingId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => selectBuilding(b.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  b.status === 'healthy'
                    ? 'bg-emerald-400'
                    : b.status === 'warning'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
              />
              <span>{b.name}</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] font-mono text-cyan-300">
                4F · {b.energyKw.toFixed(0)} kW
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Full-Height 3D Interactive Viewport */}
      <div className="relative h-[78vh] min-h-[580px] w-full rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
        <CampusCanvas />
      </div>

      {/* Quick Summary Cards of all 5 buildings with 4 floors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {state.buildings.map((b) => (
          <div
            key={b.id}
            onClick={() => selectBuilding(b.id)}
            className={`cursor-pointer rounded-2xl border p-3.5 transition ${
              state.selectedBuildingId === b.id
                ? 'border-cyan-400 bg-cyan-950/30'
                : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white truncate max-w-[140px]">{b.name}</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300">
                4 Floors
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400 truncate">{b.type}</div>
            <div className="mt-3 flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold">{b.energyKw.toFixed(1)} kW</span>
              <span className="text-amber-300">+{b.solarKw.toFixed(1)} kW PV</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
