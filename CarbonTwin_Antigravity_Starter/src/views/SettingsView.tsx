import React, { useState } from 'react';
import { useTwin } from '../context/TwinContext';
import { Settings, Save, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { state, updateEmissionFactor, updateTariff, resetSimulation } = useTwin();

  const [factor, setFactor] = useState(state.gridEmissionFactorKgPerKwh.toString());
  const [offPeak, setOffPeak] = useState(state.tariff.offPeakRate.toString());
  const [normal, setNormal] = useState(state.tariff.normalRate.toString());
  const [peak, setPeak] = useState(state.tariff.peakRate.toString());
  const [seed, setSeed] = useState(state.seed.toString());
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    updateEmissionFactor(parseFloat(factor) || 0.82);
    updateTariff({
      offPeak: parseFloat(offPeak) || 6.5,
      normal: parseFloat(normal) || 8.5,
      peak: parseFloat(peak) || 11.2,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* HEADER HERO */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">System Parameters & Emission Config</h2>
            <p className="text-xs text-slate-400">
              Configure grid carbon intensity factors, electricity tariff structures, and simulation seeds
            </p>
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg backdrop-blur space-y-6">
        {/* Emission Factor */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Grid Carbon Emission Factor (kg CO₂e / kWh)
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Central Electricity Authority (CEA) India regional baseline. Typically 0.75 - 0.85 kg CO₂e / kWh.
          </p>
          <input
            type="number"
            step="0.01"
            value={factor}
            onChange={(e) => setFactor(e.target.value)}
            className="w-full max-w-xs rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm font-mono text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Tariffs */}
        <div className="border-t border-slate-800 pt-5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            MSEDCL Time-of-Day Electricity Tariffs (₹ INR / kWh)
          </label>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-slate-400">Off-Peak (22:00 - 06:00)</span>
              <input
                type="number"
                step="0.1"
                value={offPeak}
                onChange={(e) => setOffPeak(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-mono text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400">Normal (06:00-09:00, 12:00-18:00)</span>
              <input
                type="number"
                step="0.1"
                value={normal}
                onChange={(e) => setNormal(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-mono text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400">Peak Demand (09:00-12:00, 18:00-22:00)</span>
              <input
                type="number"
                step="0.1"
                value={peak}
                onChange={(e) => setPeak(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-mono text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Simulation Seed */}
        <div className="border-t border-slate-800 pt-5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Simulation Deterministic Random Seed
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Ensures 100% reproducible demo trajectories and telemetry patterns across restarts.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              className="w-36 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
            <button
              onClick={() => resetSimulation(parseInt(seed) || 42)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Re-seed Simulation
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-800 pt-5 flex items-center justify-between">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition"
          >
            <Save className="h-4 w-4" />
            Save Parameters
          </button>

          {savedMessage && (
            <span className="text-xs text-emerald-400 font-semibold">
              ✓ Parameters updated successfully in digital twin state!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
