import React, { useState } from 'react';
import { useTwin } from '../context/TwinContext';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';

export const AlertsView: React.FC<{ onNavigateTo3D: () => void }> = ({
  onNavigateTo3D,
}) => {
  const { state, resolveAlert, selectBuilding, selectFloor, selectRoom } = useTwin();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [showResolved, setShowResolved] = useState<boolean>(false);

  const filteredAlerts = state.alerts.filter((a) => {
    if (!showResolved && a.resolved) return false;
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    return true;
  });

  const handleInspectIn3D = (alert: (typeof state.alerts)[0]) => {
    selectBuilding(alert.buildingId);
    if (alert.floorNumber) selectFloor(alert.floorNumber);
    if (alert.roomId) selectRoom(alert.roomId);
    onNavigateTo3D();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER HERO */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-xs font-mono font-semibold text-rose-300">
                EXPLAINABLE RULE ENGINE
              </span>
              <span className="text-xs text-slate-400">Zero Black-Box Alerts</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-white">
              Anomaly Detection & Energy Wastage Center
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Deterministic threshold and causal correlation checks across HVAC, lighting, and occupancy streams
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Unresolved Issues</span>
              <div className="text-lg font-bold font-mono text-rose-400">
                {state.alerts.filter((a) => !a.resolved).length}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-800 pt-4 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-white focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
            />
            <span>Show resolved alerts</span>
          </label>
        </div>
      </div>

      {/* ALERT CARDS LIST */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-2" />
            <h4 className="text-base font-semibold text-white">No active anomalies detected</h4>
            <p className="text-xs text-slate-500 mt-1">
              All 5 buildings and 20 floors are operating within efficiency bounds.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border p-5 transition ${
                alert.resolved
                  ? 'border-slate-800/60 bg-slate-950/40 opacity-60'
                  : alert.severity === 'critical'
                  ? 'border-rose-500/50 bg-rose-950/20'
                  : 'border-amber-500/40 bg-amber-950/20'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      alert.resolved
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : alert.severity === 'critical'
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    {alert.resolved ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {alert.rule}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] uppercase font-mono ${
                          alert.severity === 'critical'
                            ? 'bg-rose-900 text-rose-200'
                            : 'bg-amber-900 text-amber-200'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      {alert.resolved && (
                        <span className="rounded-full bg-emerald-900 px-2 py-0.5 text-[10px] text-emerald-200">
                          Resolved
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-slate-200">{alert.message}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span>📍 <strong>{alert.buildingName}</strong></span>
                      {alert.floorNumber && <span>Floor: <strong>F{alert.floorNumber}</strong></span>}
                      {alert.roomName && <span>Room: <strong>{alert.roomName}</strong></span>}
                      <span>
                        Value: <strong className="text-white font-mono">{alert.triggerValue} {alert.unit}</strong> (Threshold: {alert.threshold})
                      </span>
                    </div>

                    {alert.suggestedAction && (
                      <div className="mt-2 text-xs text-cyan-300">
                        💡 <strong>Remedial Recommendation:</strong> {alert.suggestedAction}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                      Acknowledge
                    </button>
                  )}

                  <button
                    onClick={() => handleInspectIn3D(alert)}
                    className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow transition"
                  >
                    <span>Inspect in 3D</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
