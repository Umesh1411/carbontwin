import React from 'react';
import { useTwin } from '../context/TwinContext';
import {
  BarChart3,
  Leaf,
  Zap,
  TrendingDown,
  PieChart as PieIcon,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { state } = useTwin();

  // Building power distribution data
  const buildingComparisonData = state.buildings.map((b) => ({
    name: b.name.replace('Academic Block ', 'Acad ').replace('Computing & Innovation ', ''),
    loadKw: b.energyKw,
    solarKw: b.solarKw,
    carbonKg: b.carbonKg,
    kwhToday: b.cumulativeKwh,
  }));

  // Equipment power totals across campus
  let totalHvacKw = 0;
  let totalLightingKw = 0;
  let totalPlugKw = 0;

  state.buildings.forEach((b) => {
    b.floorsData.forEach((f) => {
      f.rooms.forEach((r) => {
        totalHvacKw += r.hvacPowerKw;
        totalLightingKw += r.lightingPowerKw;
        totalPlugKw += r.plugLoadKw;
      });
    });
  });

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER HERO */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-mono font-semibold text-emerald-400">
                SCOPE 2 GHG AUDIT
              </span>
              <span className="text-xs text-slate-400">Trapezoidal Energy Integration Engine</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-white">
              Energy & Carbon Emission Analytics
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Verified energy integration using equation: <code className="text-cyan-300 font-mono">energy_kwh += ((p_prev + p_curr)/2) * dt</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Avoided Emissions Today</span>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {state.todaySummary.avoidedCarbonKg.toFixed(1)} kg CO₂e
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TIME-SERIES LOAD & CARBON CURVES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Load by 5 Buildings */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur">
          <h3 className="text-sm font-semibold text-white mb-2">
            Diurnal Load Profile by 5 Buildings (kW)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Dynamic load shifting across academic, lab, and dining hours
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="academicAKw" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} name="Acad A (kW)" />
                <Area type="monotone" dataKey="academicBKw" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Acad B (kW)" />
                <Area type="monotone" dataKey="libraryKw" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Library (kW)" />
                <Area type="monotone" dataKey="labsKw" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Labs & DC (kW)" />
                <Area type="monotone" dataKey="studentCenterKw" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Student Hub (kW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5 Buildings Energy & Carbon Comparison */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur">
          <h3 className="text-sm font-semibold text-white mb-2">
            Cumulative Carbon Emitted per Building (kg CO₂e)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Converted with CEA Indian Grid factor (0.82 kg/kWh)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="carbonKg" fill="#10b981" radius={[6, 6, 0, 0]} name="Carbon Emitted (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* EQUIPMENT SUB-LOADS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Campus HVAC Load</span>
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">
            {totalHvacKw.toFixed(1)} kW
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Active chillers and room split AC units across 20 floors
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Campus Compute & Plug Load</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            {totalPlugKw.toFixed(1)} kW
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Computing servers, lab rigs, and kitchen appliances
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Campus Lighting Load</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-300">
            {totalLightingKw.toFixed(1)} kW
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Daylight-harvested LED fixtures and outdoor streetlights
          </div>
        </div>
      </div>
    </div>
  );
};
