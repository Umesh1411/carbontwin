import {
  CampusBuilding,
  CampusAlert,
  TimeSeriesPoint,
  WeatherState,
  TwinState,
  WhatIfIntervention,
  SimulationEventConfig,
  BuildingStatus,
  FloorState,
} from '../types/twin';

// Seeded pseudorandom number generator for reproducibility
class SeededRandom {
  private seed: number;

  constructor(seed = 42) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

// Diurnal outdoor temperature model for Pune, India
export function calculatePuneWeather(
  hour: number,
  event: SimulationEventConfig['type'],
  rng: SeededRandom
): WeatherState {
  // Sinusoidal day-night temperature variation: low at 05:00 (~21°C), peak at 14:30 (~34.5°C)
  const angle = ((hour - 5.5) / 24) * 2 * Math.PI;
  let temp = 27.5 + 6.8 * Math.sin(angle) + rng.range(-0.4, 0.4);

  // Solar irradiance (W/m²): 0 at night, max ~950 at 12:30
  let irradiance = 0;
  if (hour >= 6 && hour <= 18.5) {
    const sunAngle = ((hour - 6) / 12.5) * Math.PI;
    irradiance = Math.max(0, Math.sin(sunAngle) * 960) + rng.range(-20, 20);
  }

  let humidity = 65 - (temp - 21) * 2.2 + rng.range(-3, 3);
  humidity = Math.max(25, Math.min(95, humidity));

  let condition: WeatherState['condition'] = 'Sunny';

  if (event === 'heatwave') {
    temp += 5.8; // severe Pune heatwave spike
    condition = 'Heatwave';
  } else if (event === 'solar_drop') {
    irradiance *= 0.25; // thick cloud cover
    condition = 'Overcast';
  } else if (irradiance < 200 && hour >= 6 && hour <= 18.5) {
    condition = 'Partly Cloudy';
  }

  return {
    condition,
    outdoorTemp: parseFloat(temp.toFixed(1)),
    outdoorHumidity: Math.round(humidity),
    solarIrradiance: Math.round(irradiance),
    source: 'Synthetic Model (Pune)',
    isExternal: false,
  };
}

// Calculate Sun 3D Coordinates from time of day for realistic visual lighting
export function calculateSunPosition(hour: number): [number, number, number] {
  // hour from 6 to 18 maps to sun arc across sky
  const normalizedHour = (hour - 6) / 12; // 0 at dawn, 0.5 at noon, 1 at dusk
  const angle = normalizedHour * Math.PI;

  const radius = 65;
  const x = -Math.cos(angle) * radius;
  const y = Math.max(1, Math.sin(angle) * 45);
  const z = 20 * Math.sin(angle * 0.8);

  return [x, y, z];
}

// Tariff calculation by hour (MSEDCL TOD)
export function getTariffRate(hour: number, tariff = { offPeakRate: 6.5, normalRate: 8.5, peakRate: 11.2 }): number {
  if (hour < 6 || hour >= 22) {
    return tariff.offPeakRate;
  }
  if ((hour >= 9 && hour < 12) || (hour >= 18 && hour < 22)) {
    return tariff.peakRate;
  }
  return tariff.normalRate;
}

// Occupancy factor based on building type and time
function getDiurnalOccupancyFactor(
  bType: string,
  hour: number,
  isWeekend: boolean,
  event: SimulationEventConfig['type'],
  rng: SeededRandom
): number {
  if (event === 'low_occupancy') {
    return rng.range(0.05, 0.15); // campus exam break or holiday
  }

  if (isWeekend) {
    if (bType.includes('Library')) {
      return hour >= 10 && hour <= 19 ? rng.range(0.35, 0.55) : 0.05;
    }
    return rng.range(0.02, 0.1);
  }

  // Weekday profiles
  if (bType.includes('Academic')) {
    // Classes 08:30 to 17:00, lunch at 13:00
    if (hour < 8 || hour >= 19) return rng.range(0.02, 0.06);
    if (hour >= 8 && hour < 9) return rng.range(0.35, 0.6);
    if (hour >= 9 && hour < 13) return rng.range(0.75, 0.95);
    if (hour >= 13 && hour < 14) return rng.range(0.35, 0.5); // lunch dip
    if (hour >= 14 && hour < 17.5) return rng.range(0.7, 0.9);
    return rng.range(0.15, 0.35); // evening labs
  }

  if (bType.includes('Library')) {
    // Library stays open till 22:00, evening peak
    if (hour < 8 || hour >= 23) return 0.03;
    if (hour >= 8 && hour < 12) return rng.range(0.4, 0.65);
    if (hour >= 12 && hour < 16) return rng.range(0.65, 0.85);
    if (hour >= 16 && hour < 21) return rng.range(0.8, 0.96); // peak study hours
    return rng.range(0.25, 0.45);
  }

  if (bType.includes('Labs') || bType.includes('Data Center')) {
    // Data center servers run 24/7, students 09:00 - 18:30
    if (hour < 8 || hour >= 21) return rng.range(0.08, 0.15);
    return rng.range(0.65, 0.92);
  }

  if (bType.includes('Amenities') || bType.includes('Canteen')) {
    // Canteen breakfast 08:30-10, lunch 12-14:30, snacks 16:30-18:30
    if (hour < 7.5 || hour >= 22) return 0.02;
    if (hour >= 8 && hour < 10.5) return rng.range(0.5, 0.75);
    if (hour >= 12 && hour < 14.5) return rng.range(0.85, 0.98); // lunch rush
    if (hour >= 16.5 && hour < 18.5) return rng.range(0.6, 0.8);
    return rng.range(0.2, 0.4);
  }

  return rng.range(0.2, 0.5);
}

export function stepSimulation(
  currentState: TwinState,
  deltaMinutes: number
): TwinState {
  const rng = new SeededRandom(currentState.seed + Math.floor(currentState.simulatedHour * 60));

  let newHour = currentState.simulatedHour + deltaMinutes / 60;
  let newDay = currentState.simulatedDay;
  if (newHour >= 24) {
    newHour -= 24;
    newDay = (newDay + 1) % 7;
  }

  const isWeekend = newDay === 5 || newDay === 6; // Sat, Sun
  const weather = calculatePuneWeather(newHour, currentState.activeEvent, rng);
  const sunPos = calculateSunPosition(newHour);
  const isNight = newHour < 6 || newHour > 18.5;

  const dtHours = deltaMinutes / 60;
  const currentTariffRate = getTariffRate(newHour, currentState.tariff);

  // Active interventions
  const hvacIntervention = currentState.interventions.find((i) => i.id === 'hvac-tune' && i.applied);
  const lightingIntervention = currentState.interventions.find((i) => i.id === 'smart-led' && i.applied);
  const solarIntervention = currentState.interventions.find((i) => i.id === 'solar-boost' && i.applied);

  const hvacSetpointOffset = hvacIntervention ? hvacIntervention.hvacSetpointOffset : 0;
  const lightingSavingFactor = lightingIntervention ? (1 - lightingIntervention.lightingSavingsPercent / 100) : 1;
  const solarBoostCapacity = solarIntervention ? solarIntervention.solarCapacityBoostKw : 0;

  const generatedAlerts: CampusAlert[] = [];
  const updatedBuildings: CampusBuilding[] = [];

  let campusTotalPowerKw = 0;
  let campusTotalSolarKw = 0;
  let campusTotalOccupancy = 0;

  for (const building of currentState.buildings) {
    const occFactor = getDiurnalOccupancyFactor(building.type, newHour, isWeekend, currentState.activeEvent, rng);
    const solarCapacity = building.solarCapacityKw + solarBoostCapacity / 5;

    // Solar generation (kW)
    const normalizedIrradiance = Math.min(1.0, weather.solarIrradiance / 1000);
    const solarKw = parseFloat((solarCapacity * normalizedIrradiance * 0.8).toFixed(1));
    campusTotalSolarKw += solarKw;

    let buildingPower = 0;
    let buildingOccupancy = 0;
    let bHvacEnergy = 0;
    let bLightingEnergy = 0;
    let bEquipEnergy = 0;
    let buildingAlerts = 0;

    const updatedFloors: FloorState[] = building.floorsData.map((floor) => {
      let floorPower = 0;
      let floorOccupancy = 0;
      let floorTempSum = 0;
      let floorCritical = false;
      let floorWarning = false;

      const updatedRooms = floor.rooms.map((room) => {
        // Occupancy calculation
        const roomOcc = Math.min(
          room.designOccupancy,
          Math.max(0, Math.round(room.designOccupancy * occFactor * rng.range(0.85, 1.15)))
        );
        floorOccupancy += roomOcc;

        // HVAC and indoor thermal simulation
        const targetTemp = 23.0 + hvacSetpointOffset;
        const heatLoadFromPeople = (roomOcc * 0.095); // kW
        const outdoorTempDiff = Math.max(0, weather.outdoorTemp - targetTemp);
        
        let hvacPower = 0;
        let roomTemp = targetTemp;
        let hvacStatus: 'on' | 'eco' | 'off' = 'on';

        if (room.roomType === 'server_room') {
          // Continuous cooling
          hvacPower = room.areaSqM * 0.12 + rng.range(-0.5, 0.5);
          roomTemp = 20.0 + rng.range(-0.3, 0.3);
        } else if (roomOcc === 0 && (newHour < 7 || newHour > 21)) {
          // Night off/eco
          if (currentState.activeEvent === 'after_hours_leak' && building.id === 'academic-a' && floor.floorNumber === 2) {
            // Fault: HVAC left running full blast at night in empty room!
            hvacPower = room.areaSqM * 0.08;
            roomTemp = 21.0;
            hvacStatus = 'on';
          } else {
            hvacPower = 0.2; // standby
            roomTemp = Math.min(weather.outdoorTemp - 2, 27);
            hvacStatus = 'off';
          }
        } else {
          // Normal occupied cooling
          const coolingDemand = (outdoorTempDiff * 0.28 + heatLoadFromPeople * 0.6);
          hvacPower = Math.max(0.5, coolingDemand * (room.areaSqM / 90)) * (hvacIntervention ? 0.86 : 1.0);
          roomTemp = targetTemp + (weather.outdoorTemp > 35 ? 1.2 : rng.range(-0.4, 0.4));
          hvacStatus = hvacIntervention ? 'eco' : 'on';
        }

        // Lighting simulation
        let lightingPower = 0;
        let lux = 450;
        let lightingStatus: 'on' | 'dimmed' | 'off' = 'on';

        if (roomOcc === 0 && (newHour < 7 || newHour > 20)) {
          if (currentState.activeEvent === 'after_hours_leak' && building.id === 'academic-b' && floor.floorNumber === 3) {
            // Fault: Lighting left on all night
            lightingPower = room.areaSqM * 0.016;
            lux = 500;
          } else {
            lightingPower = 0.05;
            lux = 0;
            lightingStatus = 'off';
          }
        } else {
          // Daylight harvesting factor
          const daylightBonus = weather.solarIrradiance > 400 ? 0.35 : 0;
          lightingPower = room.areaSqM * 0.016 * (1 - daylightBonus) * lightingSavingFactor;
          lux = Math.round(450 + (weather.solarIrradiance / 1000) * 150);
          lightingStatus = daylightBonus > 0 ? 'dimmed' : 'on';
        }

        // Plug / equipment load
        let plugLoad = room.areaSqM * 0.02;
        if (room.roomType === 'server_room') {
          plugLoad = 22.0 + rng.range(-1, 1); // Server racks
        } else if (room.roomType === 'lab') {
          plugLoad = (roomOcc > 5 ? 8.5 : 1.5) + rng.range(-0.5, 0.5);
        } else if (room.roomType === 'canteen') {
          plugLoad = (newHour >= 11 && newHour <= 15 ? 14.0 : 4.0);
        }

        const roomTotalPower = parseFloat((hvacPower + lightingPower + plugLoad).toFixed(2));
        floorPower += roomTotalPower;
        floorTempSum += roomTemp;

        // Check for anomalies & rule violations
        let hasAnomaly = false;
        let anomalyMessage = '';

        // Rule 1: HVAC running in unoccupied room
        if (roomOcc === 0 && hvacPower > 4.5 && (newHour < 7 || newHour > 21)) {
          hasAnomaly = true;
          anomalyMessage = `After-hours HVAC overconsumption (${hvacPower.toFixed(1)} kW) while room is empty.`;
          floorCritical = true;
          buildingAlerts++;
          generatedAlerts.push({
            id: `alert-${Date.now()}-${room.id}`,
            timestamp: new Date().toISOString(),
            buildingId: building.id,
            buildingName: building.name,
            floorNumber: floor.floorNumber,
            roomId: room.id,
            roomName: room.name,
            severity: 'critical',
            rule: 'After-Hours HVAC Overconsumption',
            message: anomalyMessage,
            metric: 'HVAC Power',
            triggerValue: hvacPower,
            threshold: 1.0,
            unit: 'kW',
            suggestedAction: 'Switch to Eco-Setback mode or shut off chiller valve.',
            resolved: false,
          });
        }

        // Rule 2: High indoor temperature breach
        if (roomOcc > 10 && roomTemp > 28.0) {
          hasAnomaly = true;
          anomalyMessage = `Thermal discomfort alert: ${roomTemp.toFixed(1)}°C exceeds threshold of 26°C.`;
          floorWarning = true;
          buildingAlerts++;
          generatedAlerts.push({
            id: `alert-${Date.now()}-${room.id}`,
            timestamp: new Date().toISOString(),
            buildingId: building.id,
            buildingName: building.name,
            floorNumber: floor.floorNumber,
            roomId: room.id,
            roomName: room.name,
            severity: 'high',
            rule: 'Thermal Comfort Violation',
            message: anomalyMessage,
            metric: 'Indoor Temperature',
            triggerValue: roomTemp,
            threshold: 26.0,
            unit: '°C',
            suggestedAction: 'Increase chilled water flow rate or check air handler filter.',
            resolved: false,
          });
        }

        return {
          ...room,
          occupancy: roomOcc,
          temperature: parseFloat(roomTemp.toFixed(1)),
          targetTemperature: targetTemp,
          hvacPowerKw: parseFloat(hvacPower.toFixed(2)),
          hvacStatus,
          lightingPowerKw: parseFloat(lightingPower.toFixed(2)),
          lightingLux: lux,
          lightingStatus,
          plugLoadKw: parseFloat(plugLoad.toFixed(2)),
          totalPowerKw: roomTotalPower,
          co2Ppm: Math.round(420 + (roomOcc / room.designOccupancy) * 600),
          hasAnomaly,
          anomalyMessage,
        };
      });

      const avgFloorTemp = parseFloat((floorTempSum / updatedRooms.length).toFixed(1));
      const floorStatus: BuildingStatus = floorCritical ? 'critical' : floorWarning ? 'warning' : 'healthy';

      bHvacEnergy += updatedRooms.reduce((acc, r) => acc + r.hvacPowerKw, 0);
      bLightingEnergy += updatedRooms.reduce((acc, r) => acc + r.lightingPowerKw, 0);
      bEquipEnergy += updatedRooms.reduce((acc, r) => acc + r.plugLoadKw, 0);

      return {
        ...floor,
        rooms: updatedRooms,
        totalPowerKw: parseFloat(floorPower.toFixed(2)),
        totalOccupancy: floorOccupancy,
        avgTemperature: avgFloorTemp,
        status: floorStatus,
      };
    });

    buildingPower = parseFloat(updatedFloors.reduce((acc, f) => acc + f.totalPowerKw, 0).toFixed(1));
    buildingOccupancy = updatedFloors.reduce((acc, f) => acc + f.totalOccupancy, 0);

    campusTotalPowerKw += buildingPower;
    campusTotalOccupancy += buildingOccupancy;

    // Trapezoidal energy integration
    const intervalKwh = ((building.energyKw + buildingPower) / 2) * dtHours;
    const newCumulativeKwh = building.cumulativeKwh + intervalKwh;
    const newCarbonKg = newCumulativeKwh * currentState.gridEmissionFactorKgPerKwh;
    const newCostInr = building.costInr + intervalKwh * currentTariffRate;

    // Building status
    let bStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (updatedFloors.some((f) => f.status === 'critical') || buildingPower > 130) {
      bStatus = 'critical';
    } else if (updatedFloors.some((f) => f.status === 'warning') || buildingPower > 95) {
      bStatus = 'warning';
    }

    // Efficiency Score (0-100)
    const baseExpected = building.designOccupancy > 0 ? (buildingOccupancy / building.designOccupancy) * 110 + 20 : 50;
    const efficiency = Math.max(40, Math.min(99, Math.round(100 - (buildingPower / Math.max(1, baseExpected)) * 25 + (bStatus === 'healthy' ? 10 : -15))));

    updatedBuildings.push({
      ...building,
      floorsData: updatedFloors,
      energyKw: buildingPower,
      cumulativeKwh: parseFloat(newCumulativeKwh.toFixed(2)),
      carbonKg: parseFloat(newCarbonKg.toFixed(1)),
      costInr: Math.round(newCostInr),
      occupancy: buildingOccupancy,
      solarKw,
      status: bStatus,
      alertsCount: buildingAlerts,
      efficiencyScore: efficiency,
      hvacEnergyKwh: building.hvacEnergyKwh + (bHvacEnergy * dtHours),
      lightingEnergyKwh: building.lightingEnergyKwh + (bLightingEnergy * dtHours),
      equipmentEnergyKwh: building.equipmentEnergyKwh + (bEquipEnergy * dtHours),
    });
  }

  // Campus aggregates
  const netGridKw = Math.max(0, campusTotalPowerKw - campusTotalSolarKw);
  const campusIntervalKwh = netGridKw * dtHours;
  const solarIntervalKwh = campusTotalSolarKw * dtHours;
  const totalKwhToday = currentState.todaySummary.totalKwh + (campusTotalPowerKw * dtHours);
  const solarKwhToday = currentState.todaySummary.solarGeneratedKwh + solarIntervalKwh;
  const netGridKwhToday = currentState.todaySummary.netGridKwh + campusIntervalKwh;
  const carbonToday = netGridKwhToday * currentState.gridEmissionFactorKgPerKwh;
  const costToday = currentState.todaySummary.costInr + (campusIntervalKwh * currentTariffRate);
  const avoidedCarbon = solarKwhToday * currentState.gridEmissionFactorKgPerKwh;
  const avoidedCost = solarKwhToday * currentTariffRate;

  // Time string
  const hourInt = Math.floor(newHour);
  const minInt = Math.floor((newHour % 1) * 60);
  const clockString = `${hourInt.toString().padStart(2, '0')}:${minInt.toString().padStart(2, '0')}`;

  // Time-series history point
  const newHistoryPoint: TimeSeriesPoint = {
    time: clockString,
    timestamp: Date.now(),
    totalPowerKw: parseFloat(campusTotalPowerKw.toFixed(1)),
    solarKw: parseFloat(campusTotalSolarKw.toFixed(1)),
    netGridKw: parseFloat(netGridKw.toFixed(1)),
    academicAKw: updatedBuildings.find((b) => b.id === 'academic-a')?.energyKw ?? 0,
    academicBKw: updatedBuildings.find((b) => b.id === 'academic-b')?.energyKw ?? 0,
    libraryKw: updatedBuildings.find((b) => b.id === 'library')?.energyKw ?? 0,
    labsKw: updatedBuildings.find((b) => b.id === 'labs')?.energyKw ?? 0,
    studentCenterKw: updatedBuildings.find((b) => b.id === 'student-center')?.energyKw ?? 0,
    outdoorTemp: weather.outdoorTemp,
    carbonRateKgPerHour: parseFloat((netGridKw * currentState.gridEmissionFactorKgPerKwh).toFixed(1)),
  };

  const updatedHistory = [...currentState.history.slice(-48), newHistoryPoint];

  // Merge alerts, keeping up to 30 recent alerts
  const mergedAlerts = [...generatedAlerts, ...currentState.alerts].slice(0, 30);

  return {
    ...currentState,
    simulatedHour: newHour,
    simulatedDay: newDay,
    clockString,
    buildings: updatedBuildings,
    weather,
    sunPosition: sunPos,
    isNight,
    alerts: mergedAlerts,
    history: updatedHistory,
    todaySummary: {
      totalKwh: parseFloat(totalKwhToday.toFixed(2)),
      solarGeneratedKwh: parseFloat(solarKwhToday.toFixed(2)),
      netGridKwh: parseFloat(netGridKwhToday.toFixed(2)),
      carbonEmittedKg: parseFloat(carbonToday.toFixed(1)),
      costInr: Math.round(costToday),
      peakDemandKw: Math.max(currentState.todaySummary.peakDemandKw, campusTotalPowerKw),
      averageOccupancy: Math.round((currentState.todaySummary.averageOccupancy + campusTotalOccupancy) / 2),
      avoidedCarbonKg: parseFloat(avoidedCarbon.toFixed(1)),
      avoidedCostInr: Math.round(avoidedCost),
    },
  };
}
