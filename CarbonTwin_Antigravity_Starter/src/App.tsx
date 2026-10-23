import React, { useState } from 'react';
import { TwinProvider } from './context/TwinContext';
import { Header, NavTab } from './components/layout/Header';
import { OverviewView } from './views/OverviewView';
import { CampusView } from './views/CampusView';
import { BuildingDetailsView } from './views/BuildingDetailsView';
import { IoTSimulationView } from './views/IoTSimulationView';
import { AnalyticsView } from './views/AnalyticsView';
import { AlertsView } from './views/AlertsView';
import { WhatIfLabView } from './views/WhatIfLabView';
import { CostTariffView } from './views/CostTariffView';
import { SolarView } from './views/SolarView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header currentTab={currentTab} onSelectTab={setCurrentTab} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5">
        {currentTab === 'overview' && (
          <OverviewView onNavigateToBuildings={() => setCurrentTab('buildings')} />
        )}
        {currentTab === '3d-campus' && <CampusView />}
        {currentTab === 'buildings' && <BuildingDetailsView />}
        {currentTab === 'iot-console' && <IoTSimulationView />}
        {currentTab === 'analytics' && <AnalyticsView />}
        {currentTab === 'alerts' && (
          <AlertsView onNavigateTo3D={() => setCurrentTab('3d-campus')} />
        )}
        {currentTab === 'what-if' && (
          <WhatIfLabView onNavigateTo3D={() => setCurrentTab('3d-campus')} />
        )}
        {currentTab === 'tariffs' && <CostTariffView />}
        {currentTab === 'solar' && <SolarView />}
        {currentTab === 'reports' && <ReportsView />}
        {currentTab === 'settings' && <SettingsView />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
        CarbonTwin © 2026 — Software-only Smart Campus Digital Twin · 5 Buildings · 4 Floors Each · VIT Pune Illustrative Layout
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TwinProvider>
      <AppContent />
    </TwinProvider>
  );
}
