import React from 'react';
import { useTwin } from '../context/TwinContext';
import {
  FlaskConical,
  Zap,
  Leaf,
  IndianRupee,
  Check,
  Plus,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const WhatIfLabView: React.FC<{ onNavigateTo3D: () => void }> = ({
  onNavigateTo3D,
}) => {
  const { state, toggleIntervention } = useTwin();

  const activeInterventions = state.interventions.filter((i) => i.applied);

  const totalKwhSaved = activeInterventions.reduce((acc, i) => acc + i.estimatedKwhSaved, 0);
  const totalCarbonSaved = activeInterventions.reduce((acc, i) => acc + i.estimatedCarbonSavedKg, 0);
  const totalCostSaved = activeInterventions.reduce((acc, i) => acc + i.estimatedCostSavedInr, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER HERO */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-xs font-mono font-semibold text-cyan-300">
                SCENARIO SIMULATION STUDIO
              </span>
              <span className="text-xs text-slate-400">Virtual Twin Interventions</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-white">
              What-If Optimization Lab
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Model HVAC setpoints, LED scheduling, and solar capacity enhancements virtually before physical campus deployment
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateTo3D}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition"
            >
              <span>View Impact in 3D</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Aggregate Projected Savings Ribbon */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800 pt-5">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Projected Daily Energy Saved</span>
              <Zap className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">
              {totalKwhSaved > 0 ? `-${totalKwhSaved.toFixed(1)}` : '0'} <span className="text-sm font-normal text-slate-400">kWh/day</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Projected Carbon Avoided</span>
              <Leaf className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
              {totalCarbonSaved > 0 ? `-${totalCarbonSaved.toFixed(1)}` : '0'} <span className="text-sm font-normal text-slate-400">kg CO₂e</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Estimated Cost Reduction</span>
              <IndianRupee className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-amber-300">
              ₹{totalCostSaved.toLocaleString('en-IN')} <span className="text-sm font-normal text-slate-400">/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* CANDIDATE INTERVENTIONS LIST */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-cyan-400" />
          Configurable Candidate Interventions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.interventions.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition ${
                item.applied
                  ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400/40 shadow-xl'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono uppercase text-cyan-300">
                    {item.category}
                  </span>
                  <h4 className="mt-1 text-base font-bold text-white">{item.name}</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => toggleIntervention(item.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0 ${
                    item.applied
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.applied ? (
                    <>
                      <Check className="h-4 w-4" /> Active on Twin
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Apply Virtually
                    </>
                  )}
                </button>
              </div>

              {/* Trade-off Metrics Pill Row */}
              <div className="mt-4 grid grid-cols-4 gap-2 border-t border-slate-800/80 pt-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Energy Cut</div>
                  <div className="font-mono font-bold text-cyan-300">
                    -{item.estimatedKwhSaved} kWh
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Carbon</div>
                  <div className="font-mono font-bold text-emerald-400">
                    -{item.estimatedCarbonSavedKg} kg
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Cost Save</div>
                  <div className="font-mono font-bold text-amber-300">
                    ₹{item.estimatedCostSavedInr}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Comfort Impact</div>
                  <div className="font-medium text-slate-200">
                    {item.comfortImpact}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Virtual Twin Sandbox Safety Notice:</span>{' '}
          Interventions are computed dynamically through internal thermodynamic equations and applied only to the simulated digital twin state.
          No physical equipment, campus BMS relays, or hardware controllers are ever connected or triggered.
        </div>
      </div>
    </div>
  );
};
