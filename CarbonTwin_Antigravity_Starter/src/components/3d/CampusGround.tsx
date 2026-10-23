import React from 'react';
import * as THREE from 'three';

export const CampusGround: React.FC<{ isNight: boolean }> = ({ isNight }) => {
  return (
    <group>
      {/* Main grass campus ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[75, 75]} />
        <meshStandardMaterial
          color={isNight ? '#142820' : '#2d5a3f'}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Central Campus Plaza / Courtyard Quad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <circleGeometry args={[9.5, 48]} />
        <meshStandardMaterial color={isNight ? '#1c2635' : '#8c9aa8'} roughness={0.8} />
      </mesh>

      {/* Plaza inner ring decoration */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]}>
        <ringGeometry args={[4.5, 4.8, 32]} />
        <meshBasicMaterial color={isNight ? '#0284c7' : '#e2e8f0'} />
      </mesh>

      {/* Central campus green fountain / water pond */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <circleGeometry args={[3.2, 32]} />
        <meshStandardMaterial
          color={isNight ? '#063d59' : '#0284c7'}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* North-South Main Pedestrian Boulevard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.042, 0]} receiveShadow>
        <planeGeometry args={[3.6, 55]} />
        <meshStandardMaterial color={isNight ? '#222d3d' : '#9ca3af'} roughness={0.9} />
      </mesh>

      {/* East-West Walkway Avenue */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.041, 0]} receiveShadow>
        <planeGeometry args={[52, 3.4]} />
        <meshStandardMaterial color={isNight ? '#222d3d' : '#9ca3af'} roughness={0.9} />
      </mesh>

      {/* Diagonal interconnecting campus pathways */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[0, -0.043, 0]} receiveShadow>
        <planeGeometry args={[2.0, 42]} />
        <meshStandardMaterial color={isNight ? '#1e2838' : '#cbd5e1'} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 4]} position={[0, -0.043, 0]} receiveShadow>
        <planeGeometry args={[2.0, 42]} />
        <meshStandardMaterial color={isNight ? '#1e2838' : '#cbd5e1'} roughness={0.9} />
      </mesh>

      {/* Campus perimeter low-poly shade trees */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const radius = 24.5 + (i % 4) * 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={`tree-${i}`} position={[x, 0, z]}>
            {/* Trunk */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.25, 1.4, 7]} />
              <meshStandardMaterial color={isNight ? '#2b2118' : '#5a4231'} roughness={0.9} />
            </mesh>
            {/* Foliage */}
            <mesh position={[0, 1.9, 0]} castShadow>
              <icosahedronGeometry args={[1.0 + (i % 3) * 0.15, 1]} />
              <meshStandardMaterial
                color={isNight ? (i % 2 ? '#0e3822' : '#144d30') : (i % 2 ? '#227a48' : '#2ea05f')}
                roughness={0.9}
              />
            </mesh>
          </group>
        );
      })}

      {/* Courtyard decorative planter boxes */}
      {[-5.5, 5.5].map((x) =>
        [-5.5, 5.5].map((z) => (
          <group key={`planter-${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.6, 0.5, 1.6]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.9, 0]} castShadow>
              <sphereGeometry args={[0.65, 8, 8]} />
              <meshStandardMaterial color="#16a34a" roughness={0.9} />
            </mesh>
          </group>
        ))
      )}

      {/* Solar light poles along main promenade */}
      {[-16, -8, 8, 16].map((posZ, i) => (
        <group key={`light-n-${i}`} position={[2.2, 0, posZ]}>
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 2.8, 6]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} />
          </mesh>
          <mesh position={[0, 2.85, 0]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial
              color={isNight ? '#38bdf8' : '#ffffff'}
              emissive={isNight ? '#0284c7' : '#ffffff'}
              emissiveIntensity={isNight ? 1.5 : 0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
