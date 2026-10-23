import React from 'react';
import { useTwin } from '../context/TwinContext';
import { CampusCanvas } from '../components/3d/CampusCanvas';
import { SimulationControlBar } from '../components/simulation/SimulationControlBar';
import {
  Zap,
  Sun,
  Leaf,
  IndianRupee,
  Users,
  AlertTriangle,
  TrendingDown,
  Building2,
  ShieldCheck,
  ArrowUpRight,
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

export const OverviewView: React.FC<{ onNavigateToBuildings: () => void }> = ({
  onNavigateToBuildings,
}) => {
  const { state, selectBuilding } = useTwin();

  const totalPowerKw = state.buildings.reduce((acc, b) => acc + b.energyKw, 0);
  const totalSolarKw = state.buildings.reduce((acc, b) => acc + b.solarKw, 0);
  const netGridKw = Math.max(0, totalPowerKw - totalSolarKw);
  const totalOccupancy = state.buildings.reduce((acc, b) => acc + b.occupancy, 0);
  const activeAlerts = state.alerts.filter((a) => !a.resolved);

  return (
    <div className="space-y-6 pb-12">
      {/* Simulation Controls Bar */}
      <SimulationControlBar />

      {/* KPI METRICS CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Campus Active Power */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Campus Load</span>
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">
              {totalPowerKw.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono">kW</span>
          </div>
          <div className="mt-1 text-[11px] text-cyan-300">
            Grid Import: {netGridKw.toFixed(1)} kW
          </div>
        </div>

        {/* Metric 2: Solar Generation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Solar Rooftop</span>
            <Sun className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-amber-300">
              +{totalSolarKw.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono">kW</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-400/90">
            {totalPowerKw > 0 ? ((totalSolarKw / totalPowerKw) * 100).toFixed(0) : 0}% offset
          </div>
        </div>

        {/* Metric 3: Carbon Emissions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Carbon Today</span>
            <Leaf className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {state.todaySummary.carbonEmittedKg.toFixed(0)}
            </span>
            <span className="text-xs text-slate-400 font-mono">kg CO₂</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-300">
            Avoided: {state.todaySummary.avoidedCarbonKg.toFixed(0)} kg
          </div>
        </div>

        {/* Metric 4: Cost */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Estimated Cost</span>
            <IndianRupee className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">
              ₹{state.todaySummary.costInr.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            TOD Tariff Average
          </div>
        </div>

        {/* Metric 5: Occupancy */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Occupancy</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">
              {totalOccupancy}
            </span>
            <span className="text-xs text-slate-400">people</span>
          </div>
          <div className="mt-1 text-[11px] text-blue-300">
            5 Buildings · 20 Floors
          </div>
        </div>

        {/* Metric 6: Active Alerts */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Alerts</span>
            <AlertTriangle className={`h-4 w-4 ${activeAlerts.length > 0 ? 'text-rose-400' : 'text-slate-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-2xl font-bold font-mono ${activeAlerts.length > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
              {activeAlerts.length}
            </span>
            <span className="text-xs text-slate-400">issues</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {activeAlerts.length > 0 ? 'Action required' : 'All systems optimal'}
          </div>
        </div>
      </div>

      {/* MAIN 3D VISUALIZATION VIEWPORT */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 shadow-2xl backdrop-blur">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-cyan-400" />
              Interactive 3D Smart Campus Simulation
            </h2>
            <p className="text-xs text-slate-400">
              5 interconnected buildings with 4 floors each · Click a building to inspect floors, rooms, and devices
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-lg bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 font-mono text-cyan-300">
              WebGL 3D Active
            </span>
          </div>
        </div>

        {/* 3D Scene Container */}
        <div className="h-[68vh] min-h-[500px] w-full">
          <CampusCanvas />
        </div>
      </div>

      {/* LOWER SECTION: REAL-TIME CHART & 5-BUILDING EFFICIENCY RANKINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Load & Solar Time-Series Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Diurnal Power & Solar Generation Profile
              </h3>
              <p className="text-xs text-slate-400">
                Trapezoidal energy integration over simulated time
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Total Load (kW)
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Solar PV (kW)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.history}>
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalPowerKw"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#loadGrad)"
                  name="Total Load (kW)"
                />
                <Area
                  type="monotone"
                  dataKey="solarKw"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#solarGrad)"
                  name="Solar PV (kW)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5-Building Efficiency Breakdown (Each 4 Floors) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">
                5 Campus Buildings (4 Floors Each)
              </h3>
              <p className="text-xs text-slate-400">
                Efficiency score & instantaneous power
              </p>
            </div>
            <button
              onClick={onNavigateToBuildings}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              All Floors <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {state.buildings.map((b) => (
              <div
                key={b.id}
                onClick={() => selectBuilding(b.id)}
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-950/50 p-3 hover:border-cyan-500/40 hover:bg-slate-900 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        b.status === 'healthy'
                          ? 'bg-emerald-400'
                          : b.status === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-rose-500 animate-pulse'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">{b.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {b.type} · 4 Floors
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-cyan-300">
                      {b.energyKw.toFixed(1)} kW
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      Score: {b.efficiencyScore}/100
                    </div>
                  </div>
                </div>

                {/* Mini progress bar of load */}
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      b.status === 'critical'
                        ? 'bg-rose-500'
                        : b.status === 'warning'
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, (b.energyKw / 140) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DATA INTEGRITY & AUDIT DISCLAIMER BANNER */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">
            Antigravity Digital Twin Integrity Protocol:
          </span>{' '}
          All 5 buildings and 20 floor sensor streams are synthetically simulated with deterministic physics and thermal inertia models.
          Tariff calculations use MSEDCL Time-of-Day schedules (Pune regional baseline). No physical campus equipment is altered.
        </div>
      </div>
    </div>
  );
};
