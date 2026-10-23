import React, { useMemo, useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CampusBuilding, FloorState, RoomState, TwinState } from '../../types/twin';

interface Building3DProps {
  building: CampusBuilding;
  isSelected: boolean;
  selectedFloor: number | null;
  selectedRoomId: string | null;
  visualizationMode: TwinState['visualizationMode'];
  explodedView: boolean;
  xrayMode: boolean;
  isNight: boolean;
  onSelectBuilding: (building: CampusBuilding) => void;
  onSelectFloor: (floor: number) => void;
  onSelectRoom: (roomId: string) => void;
}

// Map metric values to intuitive digital twin heat colors
export function getHeatColor(
  mode: TwinState['visualizationMode'],
  room: RoomState,
  buildingStatus: CampusBuilding['status']
): string {
  if (room.hasAnomaly) {
    return '#ef4444'; // Bright Red for active anomaly
  }

  switch (mode) {
    case 'energy': {
      // kW scale from 0 to 25+ kW
      const kw = room.totalPowerKw;
      if (kw < 5) return '#06b6d4'; // Cool Cyan
      if (kw < 10) return '#10b981'; // Emerald
      if (kw < 16) return '#eab308'; // Amber
      if (kw < 24) return '#f97316'; // Orange
      return '#ef4444'; // Crimson
    }
    case 'occupancy': {
      // Occupancy ratio
      const ratio = room.designOccupancy > 0 ? room.occupancy / room.designOccupancy : 0;
      if (ratio === 0) return '#475569'; // Idle Slate
      if (ratio < 0.35) return '#38bdf8'; // Light Sky
      if (ratio < 0.7) return '#3b82f6'; // Blue
      if (ratio < 0.9) return '#8b5cf6'; // Purple
      return '#ec4899'; // Magenta / Packed
    }
    case 'temperature': {
      // °C comfort scale: <21 cool, 22-24 ideal, 25-27 warm, >27 hot
      const t = room.temperature;
      if (t < 21) return '#0284c7'; // Chilly Blue
      if (t <= 24) return '#10b981'; // Perfect Green
      if (t <= 26.5) return '#f59e0b'; // Warm Amber
      return '#ef4444'; // Hot Red
    }
    case 'carbon': {
      // Carbon rate
      const kw = room.totalPowerKw;
      if (kw < 6) return '#22c55e'; // Low carbon green
      if (kw < 14) return '#eab308'; // Moderate
      return '#f43f5e'; // High carbon intensity
    }
    case 'status':
    default: {
      if (room.hasAnomaly || buildingStatus === 'critical') return '#ef4444';
      if (buildingStatus === 'warning') return '#f59e0b';
      return '#22c55e';
    }
  }
}

export const Building3D: React.FC<Building3DProps> = ({
  building,
  isSelected,
  selectedFloor,
  selectedRoomId,
  visualizationMode,
  explodedView,
  xrayMode,
  isNight,
  onSelectBuilding,
  onSelectFloor,
  onSelectRoom,
}) => {
  const [hovered, setHovered] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState<RoomState | null>(null);

  const [width, height, depth] = building.size;
  const floorCount = 4; // strictly 4 floors
  const floorHeight = height / floorCount; // ~1.6 units per floor

  // Exploded spacing offset
  const explodeFactor = isSelected && explodedView ? 0.95 : 0;

  return (
    <group position={building.position}>
      {/* Ground Concrete Foundation Slab */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width + 1.2, 0.12, depth + 1.2]} />
        <meshStandardMaterial color={isNight ? '#1e293b' : '#94a3b8'} roughness={0.8} />
      </mesh>

      {/* Building Entrance Canopy */}
      <group position={[0, 0, depth / 2 + 0.6]}>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[2.0, 0.1, 1.0]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-0.8, 0.35, 0.4]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 0.35, 0.4]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
      </group>

      {/* Render the 4 distinct floors */}
      {building.floorsData.map((floorState) => {
        const floorIdx = floorState.floorNumber - 1; // 0, 1, 2, 3
        const isFloorActive = selectedFloor === null || selectedFloor === floorState.floorNumber;
        const isThisFloorSelected = selectedFloor === floorState.floorNumber;

        // Base Y position + exploded displacement
        const baseFloorY = floorIdx * floorHeight;
        const explodedY = baseFloorY + floorIdx * explodeFactor;

        // Dim non-selected floors when a specific floor is chosen
        const floorOpacity = !isFloorActive ? 0.22 : xrayMode ? 0.45 : 1.0;

        return (
          <group
            key={`floor-${floorState.floorNumber}`}
            position={[0, explodedY, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectBuilding(building);
              onSelectFloor(floorState.floorNumber);
            }}
          >
            {/* Concrete Floor Plate Slab */}
            <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
              <boxGeometry args={[width + 0.15, 0.15, depth + 0.15]} />
              <meshStandardMaterial
                color={
                  isThisFloorSelected
                    ? '#0284c7'
                    : isNight
                    ? '#1e293b'
                    : '#cbd5e1'
                }
                roughness={0.5}
                transparent={floorOpacity < 1}
                opacity={floorOpacity}
              />
            </mesh>

            {/* Ceiling Slab */}
            <mesh position={[0, floorHeight - 0.05, 0]} receiveShadow>
              <boxGeometry args={[width + 0.12, 0.1, depth + 0.12]} />
              <meshStandardMaterial
                color={isNight ? '#0f172a' : '#e2e8f0'}
                roughness={0.7}
                transparent={floorOpacity < 1}
                opacity={floorOpacity}
              />
            </mesh>

            {/* Structural corner columns */}
            {[
              [-width / 2 + 0.2, -depth / 2 + 0.2],
              [width / 2 - 0.2, -depth / 2 + 0.2],
              [-width / 2 + 0.2, depth / 2 - 0.2],
              [width / 2 - 0.2, depth / 2 - 0.2],
            ].map(([cx, cz], ci) => (
              <mesh key={`col-${ci}`} position={[cx, floorHeight / 2, cz]}>
                <boxGeometry args={[0.3, floorHeight, 0.3]} />
                <meshStandardMaterial
                  color="#475569"
                  roughness={0.6}
                  transparent={floorOpacity < 1}
                  opacity={floorOpacity}
                />
              </mesh>
            ))}

            {/* Render 4 interactive room zones on this floor (2x2 grid) */}
            {floorState.rooms.map((room, rIdx) => {
              // 4 rooms arranged in 2x2 quadrant layout:
              // r0: front-left, r1: front-right, r2: back-left, r3: back-right
              const rx = (rIdx % 2 === 0 ? -1 : 1) * (width / 4);
              const rz = (rIdx < 2 ? 1 : -1) * (depth / 4);
              const roomW = width / 2 - 0.2;
              const roomD = depth / 2 - 0.2;
              const roomH = floorHeight - 0.25;

              const isRoomSelected = selectedRoomId === room.id;
              const heatColor = getHeatColor(visualizationMode, room, building.status);

              return (
                <group key={room.id} position={[rx, floorHeight / 2, rz]}>
                  {/* Room Interior Volume / Zone Volume */}
                  <mesh
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBuilding(building);
                      onSelectFloor(floorState.floorNumber);
                      onSelectRoom(room.id);
                    }}
                    onPointerOver={(e) => {
                      e.stopPropagation();
                      setHoveredRoom(room);
                      document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={() => {
                      setHoveredRoom(null);
                      document.body.style.cursor = 'auto';
                    }}
                  >
                    <boxGeometry args={[roomW, roomH, roomD]} />
                    <meshStandardMaterial
                      color={heatColor}
                      emissive={heatColor}
                      emissiveIntensity={
                        isRoomSelected ? 0.75 : room.hasAnomaly ? 0.9 : isNight ? 0.4 : 0.15
                      }
                      transparent
                      opacity={
                        isRoomSelected
                          ? 0.85
                          : xrayMode
                          ? 0.3
                          : !isFloorActive
                          ? 0.15
                          : 0.55
                      }
                      roughness={0.3}
                      metalness={0.2}
                    />
                  </mesh>

                  {/* Wireframe selection boundary */}
                  {(isRoomSelected || room.hasAnomaly) && (
                    <lineSegments>
                      <edgesGeometry args={[new THREE.BoxGeometry(roomW + 0.05, roomH + 0.05, roomD + 0.05)]} />
                      <lineBasicMaterial
                        color={room.hasAnomaly ? '#ff2222' : '#22d3ee'}
                        linewidth={2}
                      />
                    </lineSegments>
                  )}

                  {/* Room Anomaly Alert Beacon */}
                  {room.hasAnomaly && (
                    <mesh position={[0, roomH / 2 + 0.3, 0]}>
                      <octahedronGeometry args={[0.22]} />
                      <meshStandardMaterial
                        color="#ef4444"
                        emissive="#ef4444"
                        emissiveIntensity={2.0}
                      />
                    </mesh>
                  )}
                </group>
              );
            })}

            {/* Architectural Windows Band on Exterior Facade */}
            {/* Front Windows */}
            <mesh position={[0, floorHeight / 2, depth / 2 + 0.02]}>
              <planeGeometry args={[width - 0.6, floorHeight * 0.58]} />
              <meshStandardMaterial
                color={
                  floorState.status === 'critical'
                    ? '#ef4444'
                    : isNight
                    ? '#38bdf8'
                    : '#bae6fd'
                }
                emissive={isNight ? '#0284c7' : '#e0f2fe'}
                emissiveIntensity={isNight ? 0.6 : 0.15}
                transparent
                opacity={floorOpacity < 1 ? floorOpacity : 0.75}
                roughness={0.1}
              />
            </mesh>

            {/* Rear Windows */}
            <mesh position={[0, floorHeight / 2, -depth / 2 - 0.02]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[width - 0.6, floorHeight * 0.58]} />
              <meshStandardMaterial
                color={isNight ? '#38bdf8' : '#bae6fd'}
                emissive={isNight ? '#0284c7' : '#e0f2fe'}
                emissiveIntensity={isNight ? 0.6 : 0.15}
                transparent
                opacity={floorOpacity < 1 ? floorOpacity : 0.75}
                roughness={0.1}
              />
            </mesh>

            {/* Floor Level Label Tag when Exploded */}
            {isSelected && explodedView && (
              <Html position={[-width / 2 - 0.8, floorHeight / 2, 0]} center>
                <div className="rounded-md border border-cyan-400/40 bg-slate-900/90 px-2 py-0.5 text-[10px] font-mono text-cyan-300 shadow backdrop-blur whitespace-nowrap">
                  F{floorState.floorNumber} · {floorState.totalPowerKw.toFixed(1)} kW
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Rooftop Structure & Solar PV Array on top of Floor 4 */}
      {(() => {
        const roofY = floorHeight * floorCount + 3 * explodeFactor;
        const solarPanelsCount = Math.max(3, Math.floor(width / 1.5));

        return (
          <group position={[0, roofY, 0]}>
            {/* Roof Slab */}
            <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.25, 0.2, depth + 0.25]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>

            {/* Parapet Wall Perimeter */}
            <mesh position={[0, 0.35, depth / 2 + 0.08]}>
              <boxGeometry args={[width + 0.25, 0.35, 0.1]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 0.35, -depth / 2 - 0.08]}>
              <boxGeometry args={[width + 0.25, 0.35, 0.1]} />
              <meshStandardMaterial color="#475569" />
            </mesh>

            {/* HVAC Chiller Unit on Roof */}
            <mesh position={[width / 3.2, 0.55, -depth / 4]} castShadow>
              <boxGeometry args={[1.2, 0.7, 1.0]} />
              <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.4} />
            </mesh>

            {/* Photovoltaic Solar Panels */}
            {Array.from({ length: solarPanelsCount }).map((_, i) => {
              const panelX = -width / 2 + 1.1 + i * 1.4;
              return (
                <mesh
                  key={`solar-panel-${i}`}
                  position={[panelX, 0.38, 0.2]}
                  rotation={[-0.22, 0, 0]}
                  castShadow
                >
                  <boxGeometry args={[1.1, 0.05, Math.min(depth - 1.2, 2.6)]} />
                  <meshStandardMaterial
                    color="#0c2d48"
                    metalness={0.8}
                    roughness={0.15}
                    emissive={building.solarKw > 0 ? '#0284c7' : '#000000'}
                    emissiveIntensity={building.solarKw > 0 ? 0.35 : 0}
                  />
                </mesh>
              );
            })}

            {/* Solar Generation Shimmer Tag */}
            {building.solarKw > 0 && (
              <Html position={[0, 1.2, 0]} center distanceFactor={25}>
                <div className="flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-950/80 px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow backdrop-blur whitespace-nowrap">
                  <span>☀️</span>
                  <span>+{building.solarKw.toFixed(1)} kW PV</span>
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* Main Building Selection Halo & Status Marker */}
      {(isSelected || hovered) && (
        <group position={[0, height + 4 * explodeFactor + 0.6, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[Math.max(width, depth) * 0.45, Math.max(width, depth) * 0.48, 48]} />
            <meshBasicMaterial
              color={
                building.status === 'critical'
                  ? '#ef4444'
                  : building.status === 'warning'
                  ? '#f59e0b'
                  : '#22d3ee'
              }
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Floating 3D Badge / HUD Label above building */}
      <Html
        position={[0, height + 4 * explodeFactor + 1.2, 0]}
        center
        distanceFactor={22}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectBuilding(building);
          }}
          className={`cursor-pointer rounded-xl border px-3 py-2 text-xs shadow-2xl backdrop-blur transition-all duration-200 whitespace-nowrap ${
            isSelected
              ? 'border-cyan-400 bg-slate-950/95 ring-2 ring-cyan-400/40'
              : 'border-white/20 bg-slate-900/85 hover:border-cyan-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                building.status === 'healthy'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : building.status === 'warning'
                  ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                  : 'bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]'
              }`}
            />
            <span className="font-semibold text-white tracking-wide">{building.name}</span>
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
              4F
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-3 text-[11px]">
            <span className="text-cyan-300 font-mono font-medium">
              ⚡ {building.energyKw.toFixed(1)} kW
            </span>
            <span className="text-slate-300">
              👥 {building.occupancy}
            </span>
            <span className="text-emerald-300 font-mono">
              🌱 {building.carbonKg.toFixed(0)} kg CO₂
            </span>
          </div>
        </div>
      </Html>

      {/* Hovered Room Detailed Tooltip */}
      {hoveredRoom && (
        <Html position={[0, height / 2, depth / 2 + 1.5]} center distanceFactor={16}>
          <div className="pointer-events-none rounded-lg border border-cyan-400/40 bg-slate-950/95 p-2.5 text-xs text-white shadow-xl backdrop-blur">
            <div className="font-semibold text-cyan-200">{hoveredRoom.name}</div>
            <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300">
              <div>Occ: <span className="font-mono text-white">{hoveredRoom.occupancy} / {hoveredRoom.designOccupancy}</span></div>
              <div>Temp: <span className="font-mono text-white">{hoveredRoom.temperature}°C</span></div>
              <div>HVAC: <span className="font-mono text-white">{hoveredRoom.hvacPowerKw} kW ({hoveredRoom.hvacStatus})</span></div>
              <div>Power: <span className="font-mono text-cyan-300">{hoveredRoom.totalPowerKw} kW</span></div>
            </div>
            {hoveredRoom.hasAnomaly && (
              <div className="mt-1 text-[10px] text-rose-400 font-medium">
                ⚠️ {hoveredRoom.anomalyMessage}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
