import React, { useState } from 'react';
import { useTwin } from '../context/TwinContext';
import {
  Building2,
  Layers,
  Zap,
  Users,
  Sun,
  Flame,
  Leaf,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Fan,
  Lightbulb,
  Monitor,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const BuildingDetailsView: React.FC = () => {
  const { state, selectBuilding, selectFloor, selectRoom } = useTwin();
  const [selectedBId, setSelectedBId] = useState<string>(
    state.selectedBuildingId || state.buildings[0].id
  );
  const [expandedFloor, setExpandedFloor] = useState<number | null>(1);

  const building = state.buildings.find((b) => b.id === selectedBId) || state.buildings[0];

  const floorChartData = building.floorsData.map((f) => ({
    name: `Floor ${f.floorNumber}`,
    powerKw: f.totalPowerKw,
    occupancy: f.totalOccupancy,
    temp: f.avgTemperature,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* 5-BUILDING SELECTOR HEADER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {state.buildings.map((b) => {
          const isSelected = b.id === selectedBId;
          return (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBId(b.id);
                selectBuilding(b.id);
              }}
              className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold whitespace-nowrap transition ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-lg ring-1 ring-cyan-400/50'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Building2 className={`h-4 w-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
              <div>
                <div className="text-left font-bold text-white">{b.name}</div>
                <div className="text-[10px] text-slate-400">4 Floors · {b.energyKw.toFixed(1)} kW</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* BUILDING OVERVIEW HERO CARD */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-xs font-mono font-semibold text-cyan-300">
                4-TIER DIGITAL TWIN
              </span>
              <span className="text-xs text-slate-400">{building.type}</span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold text-white">{building.name}</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3.5 py-2 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Efficiency Rating</div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {building.efficiencyScore} / 100
              </div>
            </div>
            <div className="rounded-xl bg-slate-950/80 border border-slate-800 px-3.5 py-2 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Status</div>
              <div className="flex items-center gap-1.5 text-sm font-semibold capitalize text-white">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    building.status === 'healthy'
                      ? 'bg-emerald-400'
                      : building.status === 'warning'
                      ? 'bg-amber-400'
                      : 'bg-rose-500'
                  }`}
                />
                {building.status}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Metrics Row */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
            <span className="text-slate-400">Total Power</span>
            <div className="mt-1 text-lg font-bold font-mono text-cyan-300">
              {building.energyKw.toFixed(1)} kW
            </div>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
            <span className="text-slate-400">Cumulative Energy</span>
            <div className="mt-1 text-lg font-bold font-mono text-white">
              {building.cumulativeKwh.toFixed(1)} kWh
            </div>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
            <span className="text-slate-400">Solar Rooftop</span>
            <div className="mt-1 text-lg font-bold font-mono text-amber-300">
              +{building.solarKw.toFixed(1)} kW
            </div>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
            <span className="text-slate-400">Carbon Emitted</span>
            <div className="mt-1 text-lg font-bold font-mono text-emerald-400">
              {building.carbonKg.toFixed(0)} kg
            </div>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
            <span className="text-slate-400">Occupancy</span>
            <div className="mt-1 text-lg font-bold text-white">
              {building.occupancy} <span className="text-xs text-slate-400">/ {building.designOccupancy}</span>
            </div>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
            <span className="text-slate-400">Accumulated Cost</span>
            <div className="mt-1 text-lg font-bold font-mono text-white">
              ₹{building.costInr.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* 4-FLOOR BREAKDOWN & ROOM TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 4 Floors Accordion / Telemetry (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              All 4 Floors & Simulated Rooms (4 Rooms Per Floor)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total 16 Rooms in this Building
            </span>
          </div>

          <div className="space-y-3">
            {building.floorsData.map((floor) => {
              const isExpanded = expandedFloor === floor.floorNumber;
              return (
                <div
                  key={floor.floorNumber}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'border-cyan-500/50 bg-slate-900/90 shadow-xl'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  {/* Floor Header Bar */}
                  <div
                    onClick={() => setExpandedFloor(isExpanded ? null : floor.floorNumber)}
                    className="flex cursor-pointer items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 font-mono font-bold text-cyan-300 text-sm">
                        F{floor.floorNumber}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {floor.name}
                        </h4>
                        <div className="text-xs text-slate-400">
                          {floor.rooms.length} Rooms · Avg Temp: {floor.avgTemperature}°C
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right font-mono">
                        <div className="text-sm font-bold text-cyan-300">
                          {floor.totalPowerKw.toFixed(1)} kW
                        </div>
                        <div className="text-xs text-slate-400">
                          👥 {floor.totalOccupancy} people
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded 4 Rooms Grid */}
                  {isExpanded && (
                    <div className="border-t border-slate-800 p-4 space-y-3 bg-slate-950/40">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {floor.rooms.map((room) => (
                          <div
                            key={room.id}
                            className={`rounded-xl border p-3.5 transition ${
                              room.hasAnomaly
                                ? 'border-rose-500/60 bg-rose-950/20'
                                : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 uppercase">
                                  {room.roomType}
                                </span>
                                <h5 className="mt-1 text-xs font-semibold text-white">
                                  {room.name}
                                </h5>
                              </div>
                              <span className="font-mono text-xs font-bold text-cyan-300">
                                {room.totalPowerKw} kW
                              </span>
                            </div>

                            {/* Sub-device breakdown */}
                            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-slate-300 border-t border-slate-800/60 pt-2">
                              <div className="flex items-center gap-1">
                                <Fan className="h-3 w-3 text-cyan-400" />
                                <span>HVAC: <strong className="text-white font-mono">{room.hvacPowerKw} kW</strong></span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Lightbulb className="h-3 w-3 text-amber-400" />
                                <span>Light: <strong className="text-white font-mono">{room.lightingPowerKw} kW</strong></span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Monitor className="h-3 w-3 text-emerald-400" />
                                <span>Plug: <strong className="text-white font-mono">{room.plugLoadKw} kW</strong></span>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                              <span>Occupancy: <strong className="text-white">{room.occupancy}</strong> / {room.designOccupancy}</span>
                              <span>Temp: <strong className="text-cyan-300 font-mono">{room.temperature}°C</strong></span>
                              <span>CO₂: <strong className="text-slate-300 font-mono">{room.co2Ppm} ppm</strong></span>
                            </div>

                            {room.hasAnomaly && (
                              <div className="mt-2 rounded-lg bg-rose-900/40 border border-rose-500/30 p-2 text-[11px] text-rose-200 flex items-start gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                                <span>{room.anomalyMessage}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 4 Floors Power Comparison Chart & Diagnostics */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur">
            <h3 className="text-sm font-semibold text-white mb-2">
              Floor-by-Floor Load Comparison (4 Floors)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Instantaneous power consumption per floor tier
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={floorChartData}>
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
                  <Bar dataKey="powerKw" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Power (kW)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Energy Distribution by Equipment in this Building */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur">
            <h3 className="text-sm font-semibold text-white mb-3">
              Equipment Sub-metering Breakdown
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5"><Fan className="h-3.5 w-3.5 text-cyan-400" /> HVAC Cooling & Ventilation</span>
                  <span className="font-mono text-white">48%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '48%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5 text-emerald-400" /> Compute & Plug Loads</span>
                  <span className="font-mono text-white">34%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '34%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5 text-amber-400" /> Interior & Accent Lighting</span>
                  <span className="font-mono text-white">18%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
