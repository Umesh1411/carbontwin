import React, { useState } from 'react';
import { useTwin } from '../context/TwinContext';
import {
  Cpu,
  Radio,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  RefreshCw,
} from 'lucide-react';

export const IoTSimulationView: React.FC = () => {
  const { state } = useTwin();
  const [filterBuilding, setFilterBuilding] = useState<string>('all');
  const [filterMetric, setFilterMetric] = useState<string>('all');

  // Generate real-time virtual MQTT packets based on current twin state
  const packets: Array<{
    topic: string;
    metric: string;
    value: number | string;
    unit: string;
    quality: 'valid' | 'suspect';
    timestamp: string;
  }> = [];

  state.buildings.forEach((b) => {
    if (filterBuilding !== 'all' && b.id !== filterBuilding) return;

    b.floorsData.forEach((f) => {
      f.rooms.forEach((r) => {
        // Temperature packet
        if (filterMetric === 'all' || filterMetric === 'temperature') {
          packets.push({
            topic: `carbontwin/campus/pune/${b.id}/f${f.floorNumber}/${r.id}/temperature`,
            metric: 'temperature',
            value: r.temperature,
            unit: '°C',
            quality: r.temperature > 30 ? 'suspect' : 'valid',
            timestamp: new Date().toLocaleTimeString(),
          });
        }
        // Power packet
        if (filterMetric === 'all' || filterMetric === 'power') {
          packets.push({
            topic: `carbontwin/campus/pune/${b.id}/f${f.floorNumber}/${r.id}/power`,
            metric: 'power',
            value: r.totalPowerKw,
            unit: 'kW',
            quality: 'valid',
            timestamp: new Date().toLocaleTimeString(),
          });
        }
        // Occupancy packet
        if (filterMetric === 'all' || filterMetric === 'occupancy') {
          packets.push({
            topic: `carbontwin/campus/pune/${b.id}/f${f.floorNumber}/${r.id}/pir_occupancy`,
            metric: 'occupancy',
            value: r.occupancy,
            unit: 'people',
            quality: 'valid',
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      });
    });
  });

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER & METRICS */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                Virtual MQTT Telemetry Pipeline
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-white">
              IoT Sensor Simulation Console
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Deterministic synthetic telemetry feed streaming 240+ virtual sensors across 5 buildings and 20 floors
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Stream Packet Rate</span>
              <div className="text-lg font-bold font-mono text-cyan-300">
                {(state.simulationSpeed * 24).toFixed(0)} msgs/sec
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Sensor Health</span>
              <div className="text-lg font-bold font-mono text-emerald-400">
                99.4%
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-800 pt-4 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400">Building Filter:</span>
            <select
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-white focus:outline-none"
            >
              <option value="all">All 5 Buildings</option>
              {state.buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Metric:</span>
            <select
              value={filterMetric}
              onChange={(e) => setFilterMetric(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-white focus:outline-none"
            >
              <option value="all">All Metrics</option>
              <option value="temperature">Temperature (°C)</option>
              <option value="power">Power (kW)</option>
              <option value="occupancy">Occupancy</option>
            </select>
          </div>

          <div className="ml-auto flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Active Quality Filter: ISO-8601 UTC</span>
          </div>
        </div>
      </div>

      {/* STREAM LOG TERMINAL */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span>Virtual MQTT Broker Topic Monitor</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Showing {packets.slice(0, 30).length} packets
          </span>
        </div>

        <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-900 p-2">
          {packets.slice(0, 40).map((pkt, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-center justify-between p-2 hover:bg-slate-900/50 rounded transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] text-slate-500">{pkt.timestamp}</span>
                <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-cyan-400 border border-slate-800">
                  PUBLISH
                </span>
                <span className="text-slate-200">{pkt.topic}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-cyan-300 font-bold">
                  {pkt.value} {pkt.unit}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-sans ${
                    pkt.quality === 'valid'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {pkt.quality}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
