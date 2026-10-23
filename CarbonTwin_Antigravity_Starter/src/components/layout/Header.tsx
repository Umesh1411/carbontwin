import React from 'react';
import { useTwin } from '../../context/TwinContext';
import {
  Activity,
  Layers,
  Zap,
  Leaf,
  IndianRupee,
  AlertCircle,
  Building2,
  Cpu,
  BarChart3,
  FlaskConical,
  Sun,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | '3d-campus'
  | 'buildings'
  | 'iot-console'
  | 'analytics'
  | 'alerts'
  | 'what-if'
  | 'tariffs'
  | 'solar'
  | 'reports'
  | 'settings';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab }) => {
  const { state } = useTwin();

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: <Activity className="h-4 w-4" /> },
    { id: '3d-campus', label: '3D Campus', icon: <Layers className="h-4 w-4" /> },
    { id: 'buildings', label: '5 Buildings (4F)', icon: <Building2 className="h-4 w-4" /> },
    { id: 'iot-console', label: 'IoT Stream', icon: <Cpu className="h-4 w-4" /> },
    { id: 'analytics', label: 'Energy & Carbon', icon: <BarChart3 className="h-4 w-4" /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <AlertCircle className="h-4 w-4" />,
      badge: state.alerts.filter((a) => !a.resolved).length,
    },
    { id: 'what-if', label: 'What-If Lab', icon: <FlaskConical className="h-4 w-4" /> },
    { id: 'tariffs', label: 'Tariffs & Cost', icon: <IndianRupee className="h-4 w-4" /> },
    { id: 'solar', label: 'Solar PV', icon: <Sun className="h-4 w-4" /> },
    { id: 'reports', label: 'Audit & Reports', icon: <FileSpreadsheet className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      {/* Top Banner with Brand and Live Pulse */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Layers className="h-5 w-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">
                CarbonTwin
              </span>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-950/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-cyan-300">
                DIGITAL TWIN
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Smart Campus Energy & Carbon Simulation · VIT Pune Illustrative Twin
            </div>
          </div>
        </div>

        {/* Live System Badges */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Sim Time:</span>
            <span className="font-mono font-semibold text-white">{state.clockString}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
            <span className="text-slate-400">Outdoor:</span>
            <span className="font-mono font-semibold text-cyan-300">{state.weather.outdoorTemp}°C</span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-amber-300">{state.weather.solarIrradiance} W/m²</span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5">
            <Leaf className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-400">Grid Factor:</span>
            <span className="font-mono font-semibold text-emerald-400">
              {state.gridEmissionFactorKgPerKwh} kg/kWh
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1 overflow-x-auto px-4 py-1.5 no-scrollbar">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive
                      ? 'bg-slate-950 text-cyan-300'
                      : 'bg-rose-500 text-white animate-pulse'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
