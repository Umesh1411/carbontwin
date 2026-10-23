import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useTwin } from '../../context/TwinContext';
import { CampusGround } from './CampusGround';
import { Building3D } from './Building3D';
import {
  Layers,
  Eye,
  Sun,
  Flame,
  Users,
  Zap,
  Activity,
  Maximize2,
  RefreshCw,
  Sliders,
  ChevronRight,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export const CampusCanvas: React.FC = () => {
  const {
    state,
    selectBuilding,
    selectFloor,
    selectRoom,
    setVisualizationMode,
    toggleExplodedView,
    toggleXrayMode,
    activeBuilding,
    activeFloor,
    activeRoom,
  } = useTwin();

  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // Preset camera angle views
  const setCameraView = (type: 'overview' | 'academic' | 'library' | 'labs' | 'canteen') => {
    if (!controlsRef.current) return;
    switch (type) {
      case 'overview':
        controlsRef.current.object.position.set(24, 25, 30);
        controlsRef.current.target.set(0, 2, 0);
        selectBuilding(null);
        break;
      case 'academic':
        controlsRef.current.object.position.set(-20, 14, 0);
        controlsRef.current.target.set(-13, 3, 1);
        selectBuilding('academic-a');
        break;
      case 'library':
        controlsRef.current.object.position.set(0, 16, -2);
        controlsRef.current.target.set(0, 3, -14);
        selectBuilding('library');
        break;
      case 'labs':
        controlsRef.current.object.position.set(22, 14, -6);
        controlsRef.current.target.set(13, 3, -6);
        selectBuilding('labs');
        break;
      case 'canteen':
        controlsRef.current.object.position.set(22, 14, 12);
        controlsRef.current.target.set(13, 3, 8);
        selectBuilding('student-center');
        break;
    }
    controlsRef.current.update();
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Three.js 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [26, 26, 30], fov: 42, near: 0.1, far: 300 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerMissed={() => {
          selectBuilding(null);
        }}
      >
        {/* Dynamic Sky and Ambient Tone */}
        <color attach="background" args={[state.isNight ? '#050c18' : '#7cb0d4']} />
        <fog
          attach="fog"
          args={[state.isNight ? '#050c18' : '#7cb0d4', 40, 140]}
        />

        {/* Ambient & Directional Sun Lighting */}
        <ambientLight intensity={state.isNight ? 0.35 : 1.1} />
        <directionalLight
          position={state.sunPosition}
          intensity={state.isNight ? 0.3 : 2.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={120}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <directionalLight
          position={[-state.sunPosition[0], 10, -state.sunPosition[2]]}
          intensity={0.25}
          color="#94a3b8"
        />

        {/* Realistic Sky / Night Stars */}
        {state.isNight ? (
          <Stars radius={90} depth={40} count={1400} factor={4} fade speed={1} />
        ) : (
          <Sky
            sunPosition={state.sunPosition}
            turbidity={7}
            rayleigh={1.2}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
          />
        )}

        {/* Campus Terrain, Plaza, Walkways and Trees */}
        <CampusGround isNight={state.isNight} />

        {/* Render the 5 Buildings, each with strictly 4 floors */}
        {state.buildings.map((building) => (
          <Building3D
            key={building.id}
            building={building}
            isSelected={state.selectedBuildingId === building.id}
            selectedFloor={state.selectedBuildingId === building.id ? state.selectedFloor : null}
            selectedRoomId={state.selectedRoomId}
            visualizationMode={state.visualizationMode}
            explodedView={state.explodedView}
            xrayMode={state.xrayMode}
            isNight={state.isNight}
            onSelectBuilding={(b) => selectBuilding(b.id)}
            onSelectFloor={(f) => selectFloor(f)}
            onSelectRoom={(r) => selectRoom(r)}
          />
        ))}

        {/* Camera Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={10}
          maxDistance={75}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 2, 0]}
        />
      </Canvas>

      {/* TOP LEFT: Digital Twin Header & Simulation State Indicator */}
      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
        <div className="pointer-events-auto rounded-xl border border-cyan-500/20 bg-slate-950/85 p-3.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${state.isRunning ? 'bg-cyan-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${state.isRunning ? 'bg-cyan-500' : 'bg-amber-500'}`} />
            </span>
            <span className="text-xs font-bold tracking-wider text-cyan-400">
              CARBONTWIN 3D ENGINE
            </span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">
              v1.0
            </span>
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            VIT Pune Campus Virtual Twin
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-300">
            <span>🕒 {state.clockString}</span>
            <span>🌡️ {state.weather.outdoorTemp}°C</span>
            <span>☀️ {state.weather.solarIrradiance} W/m²</span>
          </div>
        </div>

        {/* Camera Preset Pills */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 p-1 backdrop-blur">
          <button
            onClick={() => setCameraView('overview')}
            className="rounded px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Overview
          </button>
          <button
            onClick={() => setCameraView('academic')}
            className="rounded px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Acad A/B
          </button>
          <button
            onClick={() => setCameraView('library')}
            className="rounded px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Library
          </button>
          <button
            onClick={() => setCameraView('labs')}
            className="rounded px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Labs
          </button>
          <button
            onClick={() => setCameraView('canteen')}
            className="rounded px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Student Hub
          </button>
        </div>
      </div>

      {/* TOP RIGHT: 3D Visualization Modes & Slicing Controls */}
      <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
        {/* Heatmap Mode Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/85 p-1.5 shadow-xl backdrop-blur-md">
          <button
            onClick={() => setVisualizationMode('status')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              state.visualizationMode === 'status'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Status
          </button>
          <button
            onClick={() => setVisualizationMode('energy')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              state.visualizationMode === 'energy'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            Energy kW
          </button>
          <button
            onClick={() => setVisualizationMode('occupancy')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              state.visualizationMode === 'occupancy'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Occupancy
          </button>
          <button
            onClick={() => setVisualizationMode('temperature')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              state.visualizationMode === 'temperature'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            Thermal
          </button>
          <button
            onClick={() => setVisualizationMode('carbon')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              state.visualizationMode === 'carbon'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            CO₂e
          </button>
        </div>

        {/* 3D Floor Slicing / Explode / X-Ray Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleExplodedView}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium shadow backdrop-blur transition ${
              state.explodedView
                ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 ring-1 ring-cyan-400'
                : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Explode 4 floor tiers vertically for inspection"
          >
            <Layers className="h-3.5 w-3.5" />
            {state.explodedView ? 'Collapse Floors' : 'Explode 4 Floors'}
          </button>

          <button
            onClick={toggleXrayMode}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium shadow backdrop-blur transition ${
              state.xrayMode
                ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 ring-1 ring-cyan-400'
                : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Make outer walls transparent to see interior rooms"
          >
            <Eye className="h-3.5 w-3.5" />
            X-Ray Shell
          </button>
        </div>

        {/* Floor Selection Pills when a building is active */}
        {activeBuilding && (
          <div className="flex items-center gap-1 rounded-xl border border-cyan-500/30 bg-slate-950/90 p-1.5 shadow-xl backdrop-blur-md">
            <span className="px-2 text-[11px] font-semibold text-cyan-400">
              Floors:
            </span>
            <button
              onClick={() => selectFloor(null)}
              className={`rounded px-2 py-1 text-xs font-medium transition ${
                state.selectedFloor === null
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              All 4
            </button>
            {[1, 2, 3, 4].map((fNum) => (
              <button
                key={`fl-${fNum}`}
                onClick={() => selectFloor(fNum)}
                className={`rounded px-2.5 py-1 text-xs font-mono font-medium transition ${
                  state.selectedFloor === fNum
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                F{fNum}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM LEFT: Heatmap Legend & Disclaimer */}
      <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-1.5 text-xs">
        <div className="pointer-events-auto flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/85 px-3 py-2 text-slate-300 shadow backdrop-blur">
          <span className="font-semibold text-white">Mode: {state.visualizationMode.toUpperCase()}</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Peak / Alert</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          Illustrative campus layout with 5 buildings, each with 4 floors · Synthetic twin telemetry
        </div>
      </div>

      {/* SELECTED BUILDING / FLOOR / ROOM INSPECTION DRAWER */}
      {activeBuilding && (
        <div className="absolute bottom-4 right-4 max-h-[80vh] w-88 overflow-y-auto rounded-2xl border border-cyan-500/30 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-lg">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                {activeBuilding.type} · 4 Floors
              </div>
              <h3 className="text-lg font-bold text-white">{activeBuilding.name}</h3>
            </div>
            <button
              onClick={() => selectBuilding(null)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
              <div className="text-slate-400">Active Power</div>
              <div className="mt-1 text-base font-bold font-mono text-cyan-300">
                {activeBuilding.energyKw.toFixed(1)} kW
              </div>
            </div>
            <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
              <div className="text-slate-400">Occupancy</div>
              <div className="mt-1 text-base font-bold text-white">
                {activeBuilding.occupancy} <span className="text-xs text-slate-400 font-normal">/ {activeBuilding.designOccupancy}</span>
              </div>
            </div>
            <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
              <div className="text-slate-400">Solar Output</div>
              <div className="mt-1 text-base font-bold font-mono text-amber-300">
                {activeBuilding.solarKw.toFixed(1)} kW
              </div>
            </div>
            <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
              <div className="text-slate-400">Carbon Rate</div>
              <div className="mt-1 text-base font-bold font-mono text-emerald-400">
                {activeBuilding.carbonKg.toFixed(0)} kg CO₂
              </div>
            </div>
          </div>

          {/* Floor breakdown list (All 4 Floors) */}
          <div className="mt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Building Floors (4 Tiers)
            </div>
            <div className="space-y-2">
              {activeBuilding.floorsData.map((floor) => {
                const isSelected = state.selectedFloor === floor.floorNumber;
                return (
                  <div
                    key={floor.floorNumber}
                    onClick={() => selectFloor(isSelected ? null : floor.floorNumber)}
                    className={`cursor-pointer rounded-xl border p-2.5 transition ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40'
                        : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300">
                          Floor {floor.floorNumber}
                        </span>
                        <span className="truncate max-w-[170px] text-slate-200">
                          {floor.name}
                        </span>
                      </span>
                      <span className="font-mono text-cyan-400">
                        {floor.totalPowerKw.toFixed(1)} kW
                      </span>
                    </div>

                    {/* Room list inside floor when expanded/selected */}
                    {isSelected && (
                      <div className="mt-2.5 space-y-1.5 border-t border-slate-800 pt-2">
                        {floor.rooms.map((room) => {
                          const isRoomActive = state.selectedRoomId === room.id;
                          return (
                            <div
                              key={room.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectRoom(isRoomActive ? null : room.id);
                              }}
                              className={`flex items-center justify-between rounded-lg p-1.5 text-[11px] transition ${
                                isRoomActive
                                  ? 'bg-cyan-500/20 border border-cyan-400/50 text-white'
                                  : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300'
                              }`}
                            >
                              <span className="truncate max-w-[150px]">
                                {room.name}
                              </span>
                              <div className="flex items-center gap-2 font-mono">
                                <span className="text-slate-400">{room.temperature}°C</span>
                                <span className="text-cyan-300">{room.totalPowerKw} kW</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Room Deep Dive if one is chosen */}
          {activeRoom && (
            <div className="mt-4 rounded-xl border border-cyan-400/50 bg-slate-900/90 p-3">
              <div className="text-[10px] font-mono uppercase text-cyan-300">
                Selected Room Telemetry
              </div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {activeRoom.name}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">HVAC Load:</span>{' '}
                  <span className="font-mono font-medium text-white">{activeRoom.hvacPowerKw} kW</span>
                </div>
                <div>
                  <span className="text-slate-400">Lighting:</span>{' '}
                  <span className="font-mono font-medium text-white">{activeRoom.lightingPowerKw} kW</span>
                </div>
                <div>
                  <span className="text-slate-400">Plug Load:</span>{' '}
                  <span className="font-mono font-medium text-white">{activeRoom.plugLoadKw} kW</span>
                </div>
                <div>
                  <span className="text-slate-400">CO₂:</span>{' '}
                  <span className="font-mono font-medium text-white">{activeRoom.co2Ppm} ppm</span>
                </div>
              </div>
              {activeRoom.hasAnomaly && (
                <div className="mt-2 rounded bg-rose-950/80 border border-rose-500/40 p-1.5 text-[11px] text-rose-200">
                  ⚠️ {activeRoom.anomalyMessage}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
