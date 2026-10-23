import React from 'react';
import { useTwin } from '../context/TwinContext';
import {
  Sun,
  Zap,
  Leaf,
  Compass,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const SolarView: React.FC = () => {
  const { state } = useTwin();

  const totalSolarCapacity = state.buildings.reduce((acc, b) => acc + b.solarCapacityKw, 0);
  const currentTotalSolarKw = state.buildings.reduce((acc, b) => acc + b.solarKw, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER HERO */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-mono font-semibold text-amber-300">
                PHOTOVOLTAIC DIGITAL TWIN
              </span>
              <span className="text-xs text-slate-400">215 kWp Campus Rooftop Array</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-white">
              Solar PV Generation & Irradiance Model
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Photovoltaic simulation based on solar elevation, tilt angle (18° South), and Pune solar radiation profile
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Current Generation</span>
              <div className="text-xl font-bold font-mono text-amber-300">
                +{currentTotalSolarKw.toFixed(1)} kW
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-slate-400">Solar Irradiance</span>
            <div className="mt-1 text-lg font-bold font-mono text-amber-300">
              {state.weather.solarIrradiance} W/m²
            </div>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-slate-400">Total Installed PV</span>
            <div className="mt-1 text-lg font-bold font-mono text-white">
              {totalSolarCapacity} kWp
            </div>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-slate-400">Solar Energy Today</span>
            <div className="mt-1 text-lg font-bold font-mono text-emerald-400">
              {state.todaySummary.solarGeneratedKwh.toFixed(1)} kWh
            </div>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-slate-400">CO₂ Avoided</span>
            <div className="mt-1 text-lg font-bold font-mono text-emerald-400">
              {state.todaySummary.avoidedCarbonKg.toFixed(1)} kg
            </div>
          </div>
        </div>
      </div>

      {/* 5-BUILDING ROOFTOP SOLAR BREAKDOWN */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur">
        <h3 className="text-sm font-semibold text-white mb-3">
          Rooftop Solar Arrays across all 5 Buildings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {state.buildings.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5"
            >
              <div className="text-xs font-semibold text-white truncate">{b.name}</div>
              <div className="text-[10px] text-slate-400">Roof Area: ~350 m²</div>
              <div className="mt-2 flex items-baseline justify-between font-mono">
                <span className="text-xs text-slate-400">Capacity:</span>
                <span className="text-xs text-white font-bold">{b.solarCapacityKw} kWp</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between font-mono">
                <span className="text-xs text-slate-400">Active PV:</span>
                <span className="text-sm text-amber-300 font-bold">+{b.solarKw.toFixed(1)} kW</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
