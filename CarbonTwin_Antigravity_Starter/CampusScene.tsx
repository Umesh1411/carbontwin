import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, Sky, Stars } from "@react-three/drei";
import * as THREE from "three";

export type CampusBuilding = {
  id: string;
  name: string;
  type: string;
  position: [number, number, number];
  size: [number, number, number];
  floors: number;
  energyKw: number;
  carbonKg: number;
  occupancy: number;
  status: "healthy" | "warning" | "critical";
};

type CampusSceneProps = {
  buildings?: CampusBuilding[];
  onSelectBuilding?: (building: CampusBuilding) => void;
  nightMode?: boolean;
};

const defaultBuildings: CampusBuilding[] = [
  { id: "academic-a", name: "Academic Block A", type: "Academic", position: [-7, 0, -3], size: [5, 4, 4], floors: 4, energyKw: 82, carbonKg: 248, occupancy: 63, status: "healthy" },
  { id: "academic-b", name: "Academic Block B", type: "Academic", position: [0, 0, -5], size: [5.5, 5, 4], floors: 5, energyKw: 96, carbonKg: 291, occupancy: 71, status: "warning" },
  { id: "library", name: "Central Library", type: "Library", position: [7, 0, -3], size: [4.5, 3.5, 4], floors: 3, energyKw: 51, carbonKg: 155, occupancy: 38, status: "healthy" },
  { id: "labs", name: "Computer Labs", type: "Laboratory", position: [-6, 0, 5], size: [5, 4, 4.5], floors: 4, energyKw: 118, carbonKg: 356, occupancy: 84, status: "critical" },
  { id: "canteen", name: "Canteen", type: "Canteen", position: [1, 0, 5], size: [5, 2.5, 4], floors: 2, energyKw: 44, carbonKg: 133, occupancy: 49, status: "healthy" },
  { id: "hostel", name: "Student Residence", type: "Hostel", position: [8, 0, 5], size: [4.5, 5.5, 4.5], floors: 6, energyKw: 132, carbonKg: 399, occupancy: 92, status: "warning" },
];

const statusColor: Record<CampusBuilding["status"], string> = {
  healthy: "#22c55e",
  warning: "#f59e0b",
  critical: "#ef4444",
};

function Building({
  building,
  selected,
  onSelect,
}: {
  building: CampusBuilding;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [width, height, depth] = building.size;
  const windowRows = Math.max(1, building.floors);

  const windows = useMemo(() => {
    const items: Array<[number, number, number]> = [];
    const columns = Math.max(2, Math.floor(width / 0.8));
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = -width / 2 + ((col + 1) * width) / (columns + 1);
        const y = 0.7 + row * (height / (windowRows + 0.5));
        items.push([x, y, depth / 2 + 0.012]);
        items.push([x, y, -depth / 2 - 0.012]);
      }
    }
    return items;
  }, [width, height, depth, windowRows]);

  return (
    <group position={building.position}>
      {/* Main architectural mass */}
      <mesh
        position={[0, height / 2, 0]}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={selected ? "#9bdcf7" : hovered ? "#a8bdcf" : "#64788c"}
          roughness={0.72}
          metalness={0.12}
        />
      </mesh>

      {/* Roof slab and solar-panel array */}
      <mesh position={[0, height + 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.18, 0.16, depth + 0.18]} />
        <meshStandardMaterial color="#d8e0e8" roughness={0.65} />
      </mesh>
      <group position={[0, height + 0.19, 0]}>
        {Array.from({ length: Math.max(2, Math.floor(width / 1.2)) }).map((_, i) => (
          <mesh key={i} position={[-width / 2 + 0.7 + i * 1.1, 0, 0]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[0.8, 0.045, Math.min(depth - 0.6, 2.2)]} />
            <meshStandardMaterial color="#123b67" metalness={0.45} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Front and rear window bands */}
      {windows.map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]}>
          <boxGeometry args={[0.28, 0.36, 0.035]} />
          <meshStandardMaterial
            color={statusColor[building.status]}
            emissive={statusColor[building.status]}
            emissiveIntensity={selected ? 0.35 : 0.08}
            roughness={0.25}
          />
        </mesh>
      ))}

      {/* Side windows */}
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: Math.max(2, Math.floor(depth / 0.8)) }).map((__, col) => {
          const z = -depth / 2 + ((col + 1) * depth) / (Math.max(2, Math.floor(depth / 0.8)) + 1);
          const y = 0.7 + row * (height / (windowRows + 0.5));
          return (
            <mesh key={`side-${row}-${col}-a`} position={[width / 2 + 0.012, y, z]}>
              <boxGeometry args={[0.035, 0.36, 0.28]} />
              <meshStandardMaterial color={statusColor[building.status]} emissive={statusColor[building.status]} emissiveIntensity={0.08} />
            </mesh>
          );
        }),
      )}

      {/* Status halo / selection marker */}
      {(selected || hovered) && (
        <mesh position={[0, height + 0.42, 0]}>
          <torusGeometry args={[Math.max(width, depth) * 0.38, 0.035, 8, 48]} />
          <meshBasicMaterial color={selected ? "#22d3ee" : "#e2e8f0"} />
        </mesh>
      )}

      {/* Floating label */}
      {(selected || hovered) && (
        <Html position={[0, height + 0.8, 0]} center distanceFactor={18} occlude>
          <div className="rounded-lg border border-cyan-300/40 bg-slate-950/90 px-3 py-2 text-xs text-white shadow-xl backdrop-blur whitespace-nowrap">
            <div className="font-semibold">{building.name}</div>
            <div className="mt-1 text-cyan-200">{building.energyKw.toFixed(1)} kW · {building.occupancy}% occupancy</div>
            <div className="text-slate-300">Estimated {building.carbonKg.toFixed(0)} kg CO₂e</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function CampusGround() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#45634f" roughness={1} />
      </mesh>

      {/* Main campus paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.09, 0]}>
        <planeGeometry args={[2.5, 48]} />
        <meshStandardMaterial color="#8b949e" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.085, 0]}>
        <planeGeometry args={[42, 2.2]} />
        <meshStandardMaterial color="#8b949e" roughness={0.95} />
      </mesh>

      {/* Path markings */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.075, -21 + i * 3.8]}>
          <planeGeometry args={[0.08, 1.2]} />
          <meshBasicMaterial color="#e5e7eb" />
        </mesh>
      ))}

      {/* Low-poly trees around the campus */}
      {Array.from({ length: 26 }).map((_, i) => {
        const angle = (i / 26) * Math.PI * 2;
        const radius = 19 + (i % 3) * 1.4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.65, 0]} castShadow>
              <cylinderGeometry args={[0.13, 0.2, 1.3, 7]} />
              <meshStandardMaterial color="#72533c" />
            </mesh>
            <mesh position={[0, 1.65, 0]} castShadow>
              <icosahedronGeometry args={[0.85 + (i % 3) * 0.12, 1]} />
              <meshStandardMaterial color={i % 2 ? "#2f855a" : "#3f9b68"} roughness={1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function CampusScene({
  buildings = defaultBuildings,
  onSelectBuilding,
  nightMode = false,
}: CampusSceneProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedBuilding = buildings.find((building) => building.id === selectedId);

  function selectBuilding(building: CampusBuilding) {
    setSelectedId(building.id);
    onSelectBuilding?.(building);
  }

  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden rounded-2xl bg-slate-950">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [22, 20, 26], fov: 42, near: 0.1, far: 200 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={() => setSelectedId(null)}
      >
        <color attach="background" args={[nightMode ? "#07111f" : "#b8d7e8"]} />
        <fog attach="fog" args={[nightMode ? "#07111f" : "#b8d7e8", 38, 95]} />

        <ambientLight intensity={nightMode ? 0.45 : 1.15} />
        <directionalLight
          position={[18, 28, 12]}
          intensity={nightMode ? 1.1 : 2.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        {nightMode ? <Stars radius={75} depth={30} count={900} factor={3} fade /> : <Sky sunPosition={[80, 25, 30]} />}

        <CampusGround />

        {/* Building pads and entrances */}
        {buildings.map((building) => (
          <group key={building.id}>
            <mesh position={[building.position[0], -0.045, building.position[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[building.size[0] + 1.4, building.size[2] + 1.4]} />
              <meshStandardMaterial color="#a8b3bb" roughness={0.9} />
            </mesh>
            <mesh position={[building.position[0], 0.42, building.position[2] + building.size[2] / 2 + 0.05]}>
              <boxGeometry args={[0.9, 0.8, 0.15]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            <Building
              building={building}
              selected={selectedId === building.id}
              onSelect={() => selectBuilding(building)}
            />
          </group>
        ))}

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={10}
          maxDistance={58}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 1, 0]}
        />
      </Canvas>

      {/* Overlay controls / legend */}
      <div className="pointer-events-none absolute left-4 top-4 max-w-[70%] rounded-xl border border-white/15 bg-slate-950/80 p-3 text-white shadow-lg backdrop-blur">
        <div className="text-sm font-semibold tracking-wide">CARBONTWIN / CAMPUS TWIN</div>
        <div className="mt-1 text-xs text-slate-300">Illustrative 3D campus · Select a building</div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-3 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white backdrop-blur">
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-green-500" /> Efficient</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber-400" /> Warning</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-red-500" /> Critical</span>
      </div>

      {selectedBuilding && (
        <div className="absolute right-4 top-4 w-64 max-w-[calc(100%-2rem)] rounded-xl border border-cyan-200/20 bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs uppercase tracking-wider text-cyan-300">{selectedBuilding.type}</div>
              <h3 className="mt-1 text-lg font-semibold">{selectedBuilding.name}</h3>
            </div>
            <button
              className="rounded-md px-2 py-1 text-slate-300 hover:bg-white/10"
              onClick={() => setSelectedId(null)}
              aria-label="Close building details"
            >
              ×
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Metric label="Energy" value={`${selectedBuilding.energyKw.toFixed(1)} kW`} />
            <Metric label="Occupancy" value={`${selectedBuilding.occupancy}%`} />
            <Metric label="CO₂e" value={`${selectedBuilding.carbonKg.toFixed(0)} kg`} />
            <Metric label="Floors" value={`${selectedBuilding.floors}`} />
          </div>
          <div className="mt-3 text-xs text-slate-400">Illustrative simulated values — not measured campus data.</div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
