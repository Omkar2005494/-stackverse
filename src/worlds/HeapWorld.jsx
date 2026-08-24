import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, Stars } from "@react-three/drei";

// --- 1. Solar Crystal Heap Node ---
const HeapNode = React.memo(function HeapNode({
  value,
  position,
  index = 0,
  isRoot = false,
  isHighlighted = false,
  heapType = "min",
}) {
  const groupRef = useRef();
  const crownRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Floating hover loop
      groupRef.current.position.y = position[1] + Math.sin(t * 2.6 + index * 0.8) * 0.07;
    }
    if (crownRef.current) {
      crownRef.current.rotation.z = t * 2;
    }
  });

  const mainColor = isRoot ? "#fef08a" : isHighlighted ? "#fde047" : "#fbbf24";
  const emissiveColor = isRoot ? "#eab308" : isHighlighted ? "#f59e0b" : "#d97706";
  const wireColor = isRoot ? "#ffffff" : isHighlighted ? "#fef08a" : "#fde68a";

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {/* Root Element Crown Halo */}
      {isRoot && (
        <group ref={crownRef}>
          <mesh rotation={[-Math.PI / 4, 0, 0]}>
            <ringGeometry args={[0.9, 1.05, 32]} />
            <meshBasicMaterial color="#fef08a" transparent opacity={0.9} side={2} />
          </mesh>
        </group>
      )}

      {/* Floating ROOT Pointer Badge */}
      {isRoot && (
        <group position={[0, 1.15, 0]}>
          <Text
            fontSize={0.24}
            color="#fef08a"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.035}
            outlineColor="#451a03"
          >
            {`ROOT [0] (${heapType.toUpperCase()})`}
          </Text>
        </group>
      )}

      {/* Solar Crystal Core */}
      <mesh castShadow receiveShadow scale={isRoot ? 1.15 : 1}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial
          color={mainColor}
          emissive={emissiveColor}
          emissiveIntensity={isRoot ? 4.5 : isHighlighted ? 3.5 : 1.8}
          metalness={0.25}
          roughness={0.15}
        />
      </mesh>

      {/* Outer Wireframe Lattice */}
      <mesh scale={isRoot ? 1.16 : 1}>
        <sphereGeometry args={[0.63, 16, 16]} />
        <meshBasicMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={isRoot ? 0.75 : 0.3}
        />
      </mesh>

      {/* Laser-Etched Numerals */}
      <Text
        position={[0, 0, (isRoot ? 0.62 * 1.15 : 0.62) + 0.12]}
        fontSize={0.48}
        color="#ffffff"
        fontWeight="900"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#451a03"
        renderOrder={10}
      >
        {String(value)}
      </Text>
    </group>
  );
});

// --- 2. Holographic Solar Energy Branch ---
const Edge = React.memo(function Edge({ start, end, isHighlighted = false }) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dx, dy);
  const mid = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    0,
  ];

  return (
    <group position={mid} rotation={[0, 0, -angle]}>
      {/* Cylindrical Energy Conduit */}
      <mesh scale={isHighlighted ? [1.5, 1, 1.5] : [1, 1, 1]}>
        <cylinderGeometry args={[0.06, 0.06, length, 12]} />
        <meshStandardMaterial
          color={isHighlighted ? "#fef08a" : "#f59e0b"}
          emissive={isHighlighted ? "#fde047" : "#d97706"}
          emissiveIntensity={isHighlighted ? 4 : 1.5}
        />
      </mesh>

      {/* Outer Pulse Sleeve */}
      <mesh scale={isHighlighted ? [1.8, 1, 1.8] : [1.2, 1, 1.2]}>
        <cylinderGeometry args={[0.08, 0.08, length, 8]} />
        <meshBasicMaterial
          color="#fde68a"
          transparent
          opacity={isHighlighted ? 0.5 : 0.15}
        />
      </mesh>
    </group>
  );
});

// --- Main World Component ---

export default function HeapWorld({
  heap = [10, 20, 30, 40, 50],
  heapType = "min",
  highlightedIndex = null,
}) {
  const nodes = heap;
  const positions = {};

  nodes.forEach((value, index) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelStart = 2 ** level - 1;
    const positionInLevel = index - levelStart;
    const nodesInLevel = 2 ** level;

    const spread = Math.max(5.8 - level * 0.9, 2.2);

    positions[index] = [
      (positionInLevel - (nodesInLevel - 1) / 2) * spread,
      3.5 - level * 2.6,
      0,
    ];
  });

  const edges = [];
  for (let i = 1; i < nodes.length; i++) {
    edges.push([Math.floor((i - 1) / 2), i]);
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      performance={{ min: 0.8 }}
      camera={{ position: [0, 1.5, 17], fov: 54 }}
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[6, 12, 6]}
        intensity={3.5}
        color="#fef08a"
      />

      <directionalLight
        position={[-6, 8, -6]}
        intensity={1.5}
        color="#fbbf24"
      />

      <pointLight
        position={[0, 4, 6]}
        intensity={12}
        color="#f59e0b"
      />

      {/* Solar Atmospheric Starfield */}
      <Stars
        radius={70}
        depth={35}
        count={500}
        factor={3.5}
        saturation={1}
        fade
        speed={0.3}
      />

      {/* Solar Energy Conduits */}
      {edges.map(([from, to], index) => (
        <Edge
          key={`edge-${from}-${to}-${index}`}
          start={positions[from]}
          end={positions[to]}
          isHighlighted={highlightedIndex === from || highlightedIndex === to}
        />
      ))}

      {/* Solar Crystal Heap Nodes */}
      {nodes.map((value, index) => (
        <HeapNode
          key={`heap-node-${value}-${index}`}
          value={value}
          position={positions[index]}
          index={index}
          isRoot={index === 0}
          isHighlighted={highlightedIndex === index}
          heapType={heapType}
        />
      ))}

      <OrbitControls
        enablePan={true}
        minDistance={8}
        maxDistance={35}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.95}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}