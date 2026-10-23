import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import {
  TwinState,
  WhatIfIntervention,
  SimulationEventConfig,
  CampusBuilding,
  FloorState,
  RoomState,
} from '../types/twin';
import { generateInitialBuildings } from '../data/campusFixtures';
import {
  calculatePuneWeather,
  calculateSunPosition,
  stepSimulation,
} from '../services/simulationEngine';

const initialInterventions: WhatIfIntervention[] = [
  {
    id: 'hvac-tune',
    name: 'HVAC Eco-Setpoint Tuning (+2°C)',
    category: 'hvac',
    description: 'Raise cooling setpoint from 22°C to 24°C across all academic classrooms & lecture halls.',
    hvacSetpointOffset: 2.0,
    lightingSavingsPercent: 0,
    solarCapacityBoostKw: 0,
    scheduleDriftHours: 0,
    applied: false,
    estimatedKwhSaved: 145.2,
    estimatedCarbonSavedKg: 119.0,
    estimatedCostSavedInr: 1234,
    comfortImpact: 'Minimal',
  },
  {
    id: 'smart-led',
    name: 'Smart Daylight Harvesting & LED Schedules',
    category: 'lighting',
    description: 'Auto-dim peripheral lighting based on ambient window lux and enforce motion cutoffs after 20:00.',
    hvacSetpointOffset: 0,
    lightingSavingsPercent: 35,
    solarCapacityBoostKw: 0,
    scheduleDriftHours: 0,
    applied: false,
    estimatedKwhSaved: 88.6,
    estimatedCarbonSavedKg: 72.6,
    estimatedCostSavedInr: 753,
    comfortImpact: 'None',
  },
  {
    id: 'solar-boost',
    name: 'Phase-2 Rooftop Solar PV Expansion (+50 kWp)',
    category: 'solar',
    description: 'Expand high-efficiency bifacial solar modules over Central Library and Computing Labs.',
    hvacSetpointOffset: 0,
    lightingSavingsPercent: 0,
    solarCapacityBoostKw: 50,
    scheduleDriftHours: 0,
    applied: false,
    estimatedKwhSaved: 210.0,
    estimatedCarbonSavedKg: 172.2,
    estimatedCostSavedInr: 1785,
    comfortImpact: 'None',
  },
  {
    id: 'pre-cooling',
    name: 'Thermal Pre-Cooling in Off-Peak Hours',
    category: 'scheduling',
    description: 'Pre-cool heavy thermal mass of lecture halls between 05:00 and 07:00 when grid tariff is ₹6.50/kWh.',
    hvacSetpointOffset: 1.0,
    lightingSavingsPercent: 10,
    solarCapacityBoostKw: 0,
    scheduleDriftHours: 1.5,
    applied: false,
    estimatedKwhSaved: 62.4,
    estimatedCarbonSavedKg: 51.1,
    estimatedCostSavedInr: 1045,
    comfortImpact: 'Minimal',
  },
];

interface TwinContextType {
  state: TwinState;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: (seed?: number) => void;
  setSpeed: (speed: number) => void;
  setSimulatedHour: (hour: number) => void;
  injectEvent: (event: SimulationEventConfig['type']) => void;
  selectBuilding: (id: string | null) => void;
  selectFloor: (floor: number | null) => void;
  selectRoom: (roomId: string | null) => void;
  setVisualizationMode: (mode: TwinState['visualizationMode']) => void;
  toggleExplodedView: () => void;
  toggleXrayMode: () => void;
  toggleIntervention: (id: string) => void;
  resolveAlert: (alertId: string) => void;
  updateTariff: (rates: { offPeak: number; normal: number; peak: number }) => void;
  updateEmissionFactor: (factor: number) => void;
  activeBuilding: CampusBuilding | null;
  activeFloor: FloorState | null;
  activeRoom: RoomState | null;
}

const TwinContext = createContext<TwinContextType | null>(null);

function createInitialState(seed = 42): TwinState {
  const buildings = generateInitialBuildings();
  const initialHour = 10.5; // 10:30 AM default start
  const initialDay = 1; // Tuesday (weekday)
  const weather = calculatePuneWeather(initialHour, 'none', { range: (a: number, b: number) => (a + b) / 2 } as any);
  const sunPosition = calculateSunPosition(initialHour);

  return {
    simulatedHour: initialHour,
    simulatedDay: initialDay,
    clockString: '10:30',
    isRunning: true,
    simulationSpeed: 5,
    seed,
    activeEvent: 'none',
    buildings,
    weather,
    tariff: {
      currency: 'INR',
      offPeakRate: 6.5,
      normalRate: 8.5,
      peakRate: 11.2,
      demandChargePerKw: 350,
    },
    gridEmissionFactorKgPerKwh: 0.82,
    alerts: [
      {
        id: 'initial-alert-1',
        timestamp: new Date().toISOString(),
        buildingId: 'labs',
        buildingName: 'Computing & Innovation Labs',
        floorNumber: 1,
        roomId: 'labs-f1-r1',
        roomName: 'C 101 Campus Tier-2 Data Center',
        severity: 'high',
        rule: 'High Thermal Heat Dissipation',
        message: 'Continuous high compute rack density; cooling operating at 92% capacity.',
        metric: 'Data Center Load',
        triggerValue: 38.0,
        threshold: 35.0,
        unit: 'kW',
        suggestedAction: 'Verify CRAC cold aisle containment and secondary chiller loop.',
        resolved: false,
      },
      {
        id: 'initial-alert-2',
        timestamp: new Date().toISOString(),
        buildingId: 'academic-a',
        buildingName: 'Academic Block A',
        floorNumber: 2,
        roomId: 'academic-a-f2-r2',
        roomName: 'A 202 Embedded Systems Lab',
        severity: 'medium',
        rule: 'Lighting Efficiency Threshold',
        message: 'High ambient solar daylight detected (780 W/m²); peripheral luminaire dimming recommended.',
        metric: 'Natural Daylight Harvest',
        triggerValue: 780,
        threshold: 500,
        unit: 'W/m²',
        suggestedAction: 'Enable smart photosensor daylight harvesting.',
        resolved: false,
      },
    ],
    history: [],
    interventions: initialInterventions,
    selectedBuildingId: null,
    selectedFloor: null,
    selectedRoomId: null,
    visualizationMode: 'status',
    explodedView: false,
    xrayMode: false,
    sunPosition,
    isNight: false,
    todaySummary: {
      totalKwh: 1240.5,
      solarGeneratedKwh: 380.2,
      netGridKwh: 860.3,
      carbonEmittedKg: 705.4,
      costInr: 8120,
      peakDemandKw: 320.4,
      averageOccupancy: 420,
      avoidedCarbonKg: 311.8,
      avoidedCostInr: 3231,
    },
  };
}

export const TwinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TwinState>(() => createInitialState(42));
  const [, startTransition] = useTransition();

  // Simulation timer loop
  useEffect(() => {
    if (!state.isRunning) return;

    // Tick every 1000ms
    // If speed is 1x => 1 minute per tick
    // If speed is 5x => 5 minutes per tick
    // If speed is 15x => 15 minutes per tick
    // If speed is 60x => 60 minutes per tick
    const intervalMs = 1000;
    const deltaMinutes = state.simulationSpeed * 1.5;

    const interval = setInterval(() => {
      startTransition(() => {
        setState((prev) => stepSimulation(prev, deltaMinutes));
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [state.isRunning, state.simulationSpeed]);

  const startSimulation = () => setState((s) => ({ ...s, isRunning: true }));
  const pauseSimulation = () => setState((s) => ({ ...s, isRunning: false }));
  
  const resetSimulation = (seed = 42) => {
    setState(createInitialState(seed));
  };

  const setSpeed = (speed: number) => {
    setState((s) => ({ ...s, simulationSpeed: speed }));
  };

  const setSimulatedHour = (hour: number) => {
    setState((prev) => {
      const nextHour = Math.max(0, Math.min(23.99, hour));
      const step = nextHour - prev.simulatedHour;
      return stepSimulation(prev, step * 60);
    });
  };

  const injectEvent = (event: SimulationEventConfig['type']) => {
    setState((s) => ({
      ...s,
      activeEvent: event,
    }));
  };

  const selectBuilding = (id: string | null) => {
    setState((s) => ({
      ...s,
      selectedBuildingId: id,
      selectedFloor: null,
      selectedRoomId: null,
    }));
  };

  const selectFloor = (floor: number | null) => {
    setState((s) => ({
      ...s,
      selectedFloor: floor,
      selectedRoomId: null,
    }));
  };

  const selectRoom = (roomId: string | null) => {
    setState((s) => ({
      ...s,
      selectedRoomId: roomId,
    }));
  };

  const setVisualizationMode = (mode: TwinState['visualizationMode']) => {
    setState((s) => ({
      ...s,
      visualizationMode: mode,
    }));
  };

  const toggleExplodedView = () => {
    setState((s) => ({
      ...s,
      explodedView: !s.explodedView,
    }));
  };

  const toggleXrayMode = () => {
    setState((s) => ({
      ...s,
      xrayMode: !s.xrayMode,
    }));
  };

  const toggleIntervention = (id: string) => {
    setState((s) => {
      const updated = s.interventions.map((item) =>
        item.id === id ? { ...item, applied: !item.applied } : item
      );
      return {
        ...s,
        interventions: updated,
      };
    });
  };

  const resolveAlert = (alertId: string) => {
    setState((s) => ({
      ...s,
      alerts: s.alerts.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)),
    }));
  };

  const updateTariff = (rates: { offPeak: number; normal: number; peak: number }) => {
    setState((s) => ({
      ...s,
      tariff: {
        ...s.tariff,
        offPeakRate: rates.offPeak,
        normalRate: rates.normal,
        peakRate: rates.peak,
      },
    }));
  };

  const updateEmissionFactor = (factor: number) => {
    setState((s) => ({
      ...s,
      gridEmissionFactorKgPerKwh: factor,
    }));
  };

  const activeBuilding = state.buildings.find((b) => b.id === state.selectedBuildingId) ?? null;
  const activeFloor =
    activeBuilding && state.selectedFloor !== null
      ? activeBuilding.floorsData.find((f) => f.floorNumber === state.selectedFloor) ?? null
      : null;
  const activeRoom =
    activeFloor && state.selectedRoomId !== null
      ? activeFloor.rooms.find((r) => r.id === state.selectedRoomId) ?? null
      : null;

  return (
    <TwinContext.Provider
      value={{
        state,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        setSpeed,
        setSimulatedHour,
        injectEvent,
        selectBuilding,
        selectFloor,
        selectRoom,
        setVisualizationMode,
        toggleExplodedView,
        toggleXrayMode,
        toggleIntervention,
        resolveAlert,
        updateTariff,
        updateEmissionFactor,
        activeBuilding,
        activeFloor,
        activeRoom,
      }}
    >
      {children}
    </TwinContext.Provider>
  );
};

export function useTwin() {
  const context = useContext(TwinContext);
  if (!context) {
    throw new Error('useTwin must be used within a TwinProvider');
  }
  return context;
}
