import React from 'react';
import { useTwin } from '../context/TwinContext';
import {
  FileSpreadsheet,
  Download,
  History,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { state } = useTwin();

  const handleDownloadJSON = () => {
    const reportData = {
      title: 'CarbonTwin Smart Campus Digital Twin Report',
      campus: 'VIT Pune Illustrative Campus',
      timestamp: new Date().toISOString(),
      simulatedTime: state.clockString,
      seed: state.seed,
      summary: state.todaySummary,
      buildings: state.buildings.map((b) => ({
        id: b.id,
        name: b.name,
        type: b.type,
        floorsCount: 4,
        energyKw: b.energyKw,
        cumulativeKwh: b.cumulativeKwh,
        carbonKg: b.carbonKg,
        costInr: b.costInr,
        efficiencyScore: b.efficiencyScore,
        floors: b.floorsData.map((f) => ({
          floor: f.floorNumber,
          powerKw: f.totalPowerKw,
          roomsCount: f.rooms.length,
        })),
      })),
      activeInterventions: state.interventions.filter((i) => i.applied),
      unresolvedAlerts: state.alerts.filter((a) => !a.resolved),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CarbonTwin_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Building ID,Building Name,Floors,Power (kW),Solar (kW),Cumulative Energy (kWh),Carbon (kg CO2e),Cost (INR),Efficiency\n';

    state.buildings.forEach((b) => {
      csvContent += `"${b.id}","${b.name}",4,${b.energyKw},${b.solarKw},${b.cumulativeKwh},${b.carbonKg},${b.costInr},${b.efficiencyScore}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CarbonTwin_Building_Summary_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER HERO */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-xs font-mono font-semibold text-cyan-300">
                AUDIT & REPORTING
              </span>
              <span className="text-xs text-slate-400">Deterministic Export Engine</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-white">
              Reports & Virtual Audit Trail
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Download structured data exports and inspect simulation history across all 5 buildings and 20 floors
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition"
            >
              <Download className="h-4 w-4" />
              Download JSON Audit
            </button>
          </div>
        </div>
      </div>

      {/* AUDIT SUMMARY CARDS */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <History className="h-4 w-4 text-cyan-400" />
          Active Virtual Interventions History
        </h3>

        <div className="space-y-2">
          {state.interventions.filter((i) => i.applied).length === 0 ? (
            <div className="text-xs text-slate-400 py-3">
              No virtual interventions currently applied. Running in standard baseline mode.
            </div>
          ) : (
            state.interventions
              .filter((i) => i.applied)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-slate-950/60 p-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.description}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-cyan-300">
                    Saved: {item.estimatedKwhSaved} kWh/day
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};
