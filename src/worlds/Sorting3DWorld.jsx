import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Stars } from "@react-three/drei";

// --- 1. Single 3D Array Bar Pillar ---
const ArrayPillar = React.memo(function ArrayPillar({
  value,
  index,
  total,
  position,
  isComparing = false,
  isSwapping = false,
  isSorted = false,
  isSelected = false,
}) {
  const meshRef = useRef();
  const height = Math.max(0.6, (value / 100) * 4.5);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current && (isComparing || isSwapping)) {
      meshRef.current.position.y = (height / 2) + Math.sin(t * 8) * 0.15;
    }
  });

  const mainColor = isSorted
    ? "#10b981"
    : isSwapping
    ? "#f97316"
    : isComparing
    ? "#fde047"
    : isSelected
    ? "#a855f7"
    : "#0ea5e9";

  const emissiveColor = isSorted
    ? "#059669"
    : isSwapping
    ? "#ea580c"
    : isComparing
    ? "#ca8a04"
    : isSelected
    ? "#7e22ce"
    : "#0284c7";

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* 3D Crystalline Pillar */}
      <group ref={meshRef} position={[0, height / 2, 0]}>
        <RoundedBox args={[0.75, height, 0.75]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={mainColor}
            emissive={emissiveColor}
            emissiveIntensity={isComparing || isSwapping ? 3.5 : isSorted ? 2.5 : 1.2}
            metalness={0.3}
            roughness={0.2}
            transparent
            opacity={0.92}
          />
        </RoundedBox>

        {/* Wireframe Energy Lattice */}
        <mesh scale={[1.02, 1.02, 1.02]}>
          <boxGeometry args={[0.76, height, 0.76]} />
          <meshBasicMaterial
            color={isComparing || isSwapping ? "#ffffff" : mainColor}
            wireframe
            transparent
            opacity={isComparing || isSwapping ? 0.6 : 0.25}
          />
        </mesh>

        {/* Value Label on Top */}
        <Text
          position={[0, height / 2 + 0.35, 0]}
          fontSize={0.32}
          color="#ffffff"
          fontWeight="900"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.035}
          outlineColor="#020617"
        >
          {String(value)}
        </Text>
      </group>

      {/* Index Label at Base */}
      <Text
        position={[0, -0.4, 0.5]}
        fontSize={0.22}
        color="#94a3b8"
        fontWeight="700"
        anchorX="center"
        anchorY="middle"
      >
        {`[${index}]`}
      </Text>
    </group>
  );
});

// --- Main 3D Sorting World Scene ---

export default function Sorting3DWorld({
  array = [45, 12, 85, 32, 89, 39, 69, 22],
  comparingIndices = [],
  swappingIndices = [],
  sortedIndices = [],
  selectedIndex = null,
}) {
  const SPACING = 1.35;
  const total = array.length;
  const startX = -((total - 1) * SPACING) / 2;

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      performance={{ min: 0.8 }}
      camera={{ position: [0, 4, 13], fov: 52 }}
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      <ambientLight intensity={1.3} />
      <directionalLight position={[8, 14, 8]} intensity={3} color="#bae6fd" />
      <directionalLight position={[-8, -8, -6]} intensity={1.5} color="#c084fc" />
      <pointLight position={[0, 5, 4]} intensity={8} color="#38bdf8" />

      {/* Ambient Starfield */}
      <Stars radius={70} depth={35} count={500} factor={3.5} saturation={1} fade speed={0.3} />

      {/* Grid Floor Line Guide */}
      <group position={[0, -0.05, 0]}>
        <gridHelper args={[20, 20, "#38bdf8", "#1e293b"]} />
      </group>

      {/* Array Pillars */}
      {array.map((val, idx) => (
        <ArrayPillar
          key={`pillar-${idx}`}
          value={val}
          index={idx}
          total={total}
          position={[startX + idx * SPACING, 0, 0]}
          isComparing={comparingIndices.includes(idx)}
          isSwapping={swappingIndices.includes(idx)}
          isSorted={sortedIndices.includes(idx)}
          isSelected={selectedIndex === idx}
        />
      ))}

      <OrbitControls
        enablePan={true}
        minDistance={6}
        maxDistance={30}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
        enableDamping
        dampingFactor={0.06}
      />
    </Canvas>
  );
}
