import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Stars } from "@react-three/drei";

// --- 1. Bioluminescent Neural Data Sphere ---
const TreeNode = React.memo(function TreeNode({
  position,
  value,
  index,
  highlighted,
  treeDepth,
}) {
  const groupRef = useRef();
  const haloRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Floating hover physics
      groupRef.current.position.y = position[1] + Math.sin(t * 2.8 + index * 0.9) * 0.06;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 2;
    }
  });

  const sphereRadius = treeDepth >= 6 ? 0.72 : treeDepth >= 4 ? 0.82 : 0.92;
  const isHigh = Boolean(highlighted);

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {/* Outer Rotating Energy Halo when Highlighted */}
      {isHigh && (
        <group ref={haloRef}>
          <mesh rotation={[-Math.PI / 4, 0, 0]}>
            <ringGeometry args={[sphereRadius * 1.3, sphereRadius * 1.45, 32]} />
            <meshBasicMaterial color="#34d399" transparent opacity={0.85} side={2} />
          </mesh>
        </group>
      )}

      {/* Main Glowing Crystal Core */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[sphereRadius, 32, 32]} />
        <meshStandardMaterial
          color={isHigh ? "#6ee7b7" : "#10b981"}
          emissive={isHigh ? "#34d399" : "#059669"}
          emissiveIntensity={isHigh ? 4.5 : 1.6}
          metalness={0.2}
          roughness={0.15}
        />
      </mesh>

      {/* Outer Glass Shell Lattice */}
      <mesh>
        <sphereGeometry args={[sphereRadius * 1.02, 16, 16]} />
        <meshBasicMaterial
          color={isHigh ? "#a7f3d0" : "#6ee7b7"}
          wireframe
          transparent
          opacity={isHigh ? 0.6 : 0.25}
        />
      </mesh>

      {/* Laser-Etched Numerals */}
      <Text
        position={[0, 0, sphereRadius + 0.12]}
        fontSize={0.52}
        color="#ffffff"
        fontWeight="900"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.035}
        outlineColor="#022c22"
        renderOrder={10}
      >
        {String(value)}
      </Text>
    </group>
  );
});

// --- 2. Holographic Neural Energy Branch ---
const Branch = React.memo(function Branch({ start, end, isHighlighted = false }) {
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
      {/* Solid Energy Core Conduit */}
      <mesh scale={isHighlighted ? [1.5, 1, 1.5] : [1, 1, 1]}>
        <cylinderGeometry args={[0.07, 0.07, length, 12]} />
        <meshStandardMaterial
          color={isHighlighted ? "#6ee7b7" : "#059669"}
          emissive={isHighlighted ? "#34d399" : "#10b981"}
          emissiveIntensity={isHighlighted ? 4 : 1.4}
        />
      </mesh>

      {/* Outer Pulse Glow Sleeve */}
      <mesh scale={isHighlighted ? [1.8, 1, 1.8] : [1.2, 1, 1.2]}>
        <cylinderGeometry args={[0.09, 0.09, length, 8]} />
        <meshBasicMaterial
          color={isHighlighted ? "#a7f3d0" : "#34d399"}
          transparent
          opacity={isHighlighted ? 0.5 : 0.18}
        />
      </mesh>
    </group>
  );
});

// --- Main World Component ---

export default function TreeWorld({
  nodes = [10, 5, 15],
  highlightedNode,
}) {
  const treeDepth = Math.max(
    1,
    Math.floor(Math.log2(nodes.length || 1))
  );

  const cameraDistance = Math.min(
    28,
    Math.max(13, 13 + treeDepth * 1.5)
  );

  const treeLayout = useMemo(() => {
    if (!nodes.length) return [];

    const maxLevel = Math.max(
      1,
      Math.floor(Math.log2(nodes.length || 1))
    );

    const buildLayout = (
      index,
      depth,
      x,
      offset,
      results
    ) => {
      if (
        index >= nodes.length ||
        nodes[index] === undefined ||
        nodes[index] === null
      ) {
        return;
      }

      const y = maxLevel * 1.8 - depth * 2.5;

      results.push({
        value: nodes[index],
        index,
        position: [x, y, 0],
      });

      const nextOffset = Math.max(2.2, offset * 0.62);

      buildLayout(
        index * 2 + 1,
        depth + 1,
        x - offset,
        nextOffset,
        results
      );

      buildLayout(
        index * 2 + 2,
        depth + 1,
        x + offset,
        nextOffset,
        results
      );
    };

    const results = [];
    buildLayout(
      0,
      0,
      0,
      Math.max(7, maxLevel * 3.8),
      results
    );

    return results;
  }, [nodes]);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      performance={{ min: 0.8 }}
      camera={{
        position: [0, 2, cameraDistance],
        fov: 52,
      }}
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[6, 12, 8]}
        intensity={3.2}
        color="#ffffff"
      />

      <directionalLight
        position={[-6, 8, -6]}
        intensity={1.2}
        color="#34d399"
      />

      <pointLight
        position={[0, 4, 4]}
        intensity={8}
        color="#10b981"
      />

      {/* Atmospheric Space Starfield */}
      <Stars
        radius={70}
        depth={35}
        count={600}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Neural Data Conduits (Branches) */}
      {treeLayout.map((node) => {
        if (node.index === 0) return null;

        const parentArrayIndex = Math.floor((node.index - 1) / 2);
        const parentNode = treeLayout.find(
          (n) => n.index === parentArrayIndex
        );

        if (!parentNode) return null;

        return (
          <Branch
            key={`branch-${node.index}`}
            start={parentNode.position}
            end={node.position}
            isHighlighted={
              highlightedNode === node.value ||
              highlightedNode === parentNode.value
            }
          />
        );
      })}

      {/* Bioluminescent Tree Spheres */}
      {treeLayout.map((node, index) => (
        <TreeNode
          key={`node-${node.index}-${node.value}`}
          position={node.position}
          value={node.value}
          index={index}
          highlighted={highlightedNode === node.value}
          treeDepth={treeDepth}
        />
      ))}

      <OrbitControls
        target={[0, Math.max(0, treeDepth * 0.6), 0]}
        enablePan={true}
        enableRotate={true}
        enableZoom={true}
        minDistance={8}
        maxDistance={50}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.95}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}