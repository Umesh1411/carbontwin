import React from 'react';
import { useTwin } from '../context/TwinContext';
import {
  IndianRupee,
  Clock,
  Zap,
  TrendingDown,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const CostTariffView: React.FC = () => {
  const { state } = useTwin();

  const currentHour = Math.floor(state.simulatedHour);
  const isPeak =
    (currentHour >= 9 && currentHour < 12) || (currentHour >= 18 && currentHour < 22);
  const isOffPeak = currentHour < 6 || currentHour >= 22;

  const currentRate = isOffPeak
    ? state.tariff.offPeakRate
    : isPeak
    ? state.tariff.peakRate
    : state.tariff.normalRate;

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER HERO */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-mono font-semibold text-amber-300">
                MSEDCL TOD COMMERCIAL TARIFF
              </span>
              <span className="text-xs text-slate-400">Maharashtra Regional Grid Benchmark</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-white">
              Cost & Time-of-Day Tariff Analysis
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Real-time financial tracking matching dynamic slot pricing (Off-Peak ₹6.50, Normal ₹8.50, Peak ₹11.20)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Current Slot Rate</span>
              <div className="text-xl font-bold font-mono text-amber-300">
                ₹{currentRate.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ kWh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Active Slot Banner */}
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${
                isPeak
                  ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
                  : isOffPeak
                  ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                  : 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
              }`}
            />
            <span className="font-semibold text-white">
              Active Window:{' '}
              {isPeak
                ? 'High Demand Peak Tariff (₹11.20)'
                : isOffPeak
                ? 'Night Off-Peak Concession (₹6.50)'
                : 'Standard Daytime Normal Tariff (₹8.50)'}
            </span>
          </div>
          <span className="font-mono text-slate-400">Time: {state.clockString}</span>
        </div>
      </div>

      {/* TOD SLOTS BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Off-Peak Slot */}
        <div className={`rounded-2xl border p-5 transition ${isOffPeak ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-slate-800 bg-slate-900/60'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Off-Peak Night Slot</span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            ₹{state.tariff.offPeakRate.toFixed(2)}
            <span className="text-xs text-slate-400 font-normal font-sans"> / kWh</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <strong>Hours:</strong> 22:00 – 06:00
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Ideal for thermal pre-cooling and EV charging
          </div>
        </div>

        {/* Normal Slot */}
        <div className={`rounded-2xl border p-5 transition ${!isPeak && !isOffPeak ? 'border-cyan-500/50 bg-cyan-950/20' : 'border-slate-800 bg-slate-900/60'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Standard Normal Slot</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">
            ₹{state.tariff.normalRate.toFixed(2)}
            <span className="text-xs text-slate-400 font-normal font-sans"> / kWh</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <strong>Hours:</strong> 06:00 – 09:00, 12:00 – 18:00
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Solar generation offsets daytime grid imports
          </div>
        </div>

        {/* Peak Slot */}
        <div className={`rounded-2xl border p-5 transition ${isPeak ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-800 bg-slate-900/60'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Peak Demand Slot</span>
            <Clock className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-400">
            ₹{state.tariff.peakRate.toFixed(2)}
            <span className="text-xs text-slate-400 font-normal font-sans"> / kWh</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <strong>Hours:</strong> 09:00 – 12:00, 18:00 – 22:00
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            High penalty window; load shedding recommended
          </div>
        </div>
      </div>
    </div>
  );
};
