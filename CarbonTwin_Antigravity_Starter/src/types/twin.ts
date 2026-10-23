export type BuildingStatus = 'healthy' | 'warning' | 'critical';

export type RoomType =
  | 'classroom'
  | 'lab'
  | 'office'
  | 'library'
  | 'canteen'
  | 'auditorium'
  | 'server_room'
  | 'recreation';

export interface RoomState {
  id: string;
  name: string;
  floor: number; // 1, 2, 3, 4
  buildingId: string;
  roomType: RoomType;
  areaSqM: number;
  occupancy: number;
  designOccupancy: number;
  temperature: number; // °C
  targetTemperature: number; // °C
  hvacPowerKw: number;
  hvacStatus: 'on' | 'eco' | 'off';
  lightingPowerKw: number;
  lightingLux: number;
  lightingStatus: 'on' | 'dimmed' | 'off';
  plugLoadKw: number;
  totalPowerKw: number;
  co2Ppm: number;
  humidity: number; // %
  hasAnomaly?: boolean;
  anomalyMessage?: string;
}

export interface FloorState {
  floorNumber: number; // 1 to 4
  name: string;
  rooms: RoomState[];
  totalPowerKw: number;
  totalOccupancy: number;
  avgTemperature: number;
  status: BuildingStatus;
}

export interface CampusBuilding {
  id: string;
  name: string;
  type: string;
  position: [number, number, number];
  size: [number, number, number];
  floors: 4; // strictly 4 floors as required
  floorsData: FloorState[];
  energyKw: number;
  cumulativeKwh: number;
  carbonKg: number;
  costInr: number;
  occupancy: number;
  designOccupancy: number;
  solarKw: number;
  solarCapacityKw: number;
  status: BuildingStatus;
  alertsCount: number;
  efficiencyScore: number; // 0 - 100
  hvacEnergyKwh: number;
  lightingEnergyKwh: number;
  equipmentEnergyKwh: number;
}

export interface WeatherState {
  condition: 'Sunny' | 'Partly Cloudy' | 'Overcast' | 'Heatwave' | 'Rainy';
  outdoorTemp: number; // °C
  outdoorHumidity: number; // %
  solarIrradiance: number; // W/m² (0 - 1000)
  source: 'Open-Meteo' | 'Synthetic Model (Pune)';
  isExternal: boolean;
}

export interface TariffStructure {
  currency: string; // 'INR'
  offPeakRate: number; // ₹6.50 (22:00 - 06:00)
  normalRate: number;  // ₹8.50 (06:00 - 09:00, 12:00 - 18:00)
  peakRate: number;    // ₹11.20 (09:00 - 12:00, 18:00 - 22:00)
  demandChargePerKw: number; // ₹350 / kVA/month
}

export interface CampusAlert {
  id: string;
  timestamp: string;
  buildingId: string;
  buildingName: string;
  floorNumber?: number;
  roomId?: string;
  roomName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rule: string;
  message: string;
  metric: string;
  triggerValue: number;
  threshold: number;
  unit: string;
  suggestedAction: string;
  resolved: boolean;
}

export interface TimeSeriesPoint {
  time: string; // 'HH:MM'
  timestamp: number;
  totalPowerKw: number;
  solarKw: number;
  netGridKw: number;
  academicAKw: number;
  academicBKw: number;
  libraryKw: number;
  labsKw: number;
  studentCenterKw: number;
  outdoorTemp: number;
  carbonRateKgPerHour: number;
}

export interface SimulationEventConfig {
  type: 'none' | 'heatwave' | 'low_occupancy' | 'after_hours_leak' | 'sensor_fault' | 'solar_drop';
  name: string;
  description: string;
  multiplier?: number;
}

export interface WhatIfIntervention {
  id: string;
  name: string;
  category: 'hvac' | 'lighting' | 'solar' | 'scheduling' | 'combined';
  description: string;
  hvacSetpointOffset: number; // e.g. +2°C
  lightingSavingsPercent: number; // e.g. 35%
  solarCapacityBoostKw: number; // e.g. +50 kW
  scheduleDriftHours: number;
  applied: boolean;
  estimatedKwhSaved: number;
  estimatedCarbonSavedKg: number;
  estimatedCostSavedInr: number;
  comfortImpact: 'None' | 'Minimal' | 'Noticeable' | 'Significant';
}

export interface TwinState {
  simulatedHour: number; // 0 - 23.99
  simulatedDay: number; // 0 - 6 (Mon-Sun)
  clockString: string; // "14:30"
  isRunning: boolean;
  simulationSpeed: number; // 1x, 5x, 15x, 60x
  seed: number;
  activeEvent: SimulationEventConfig['type'];
  buildings: CampusBuilding[];
  weather: WeatherState;
  tariff: TariffStructure;
  gridEmissionFactorKgPerKwh: number; // default 0.82
  alerts: CampusAlert[];
  history: TimeSeriesPoint[];
  interventions: WhatIfIntervention[];
  selectedBuildingId: string | null;
  selectedFloor: number | null; // null = all floors, or 1, 2, 3, 4
  selectedRoomId: string | null;
  visualizationMode: 'status' | 'energy' | 'occupancy' | 'temperature' | 'carbon';
  explodedView: boolean;
  xrayMode: boolean;
  sunPosition: [number, number, number];
  isNight: boolean;
  todaySummary: {
    totalKwh: number;
    solarGeneratedKwh: number;
    netGridKwh: number;
    carbonEmittedKg: number;
    costInr: number;
    peakDemandKw: number;
    averageOccupancy: number;
    avoidedCarbonKg: number;
    avoidedCostInr: number;
  };
}
