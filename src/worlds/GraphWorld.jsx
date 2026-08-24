import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Stars } from "@react-three/drei";
import * as THREE from "three";

// --- 1. Amethyst Crystal Vertex Node ---
const GraphNode = React.memo(function GraphNode({
  position,
  value,
  index,
  isHighlighted = false,
  isInPath = false,
}) {
  const groupRef = useRef();
  const haloRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Floating hover loop
      groupRef.current.position.y = position[1] + Math.sin(t * 2.5 + index * 0.9) * 0.08;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 2.2;
    }
  });

  const isSpecial = isHighlighted || isInPath;
  const mainColor = isInPath ? "#38bdf8" : isHighlighted ? "#a855f7" : "#7c3aed";
  const emissiveColor = isInPath ? "#0284c7" : isHighlighted ? "#9333ea" : "#6d28d9";
  const wireColor = isInPath ? "#bae6fd" : isHighlighted ? "#e9d5ff" : "#c4b5fd";

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {/* Orbiting Energy Halo on Highlight / Shortest Path */}
      {isSpecial && (
        <group ref={haloRef}>
          <mesh rotation={[-Math.PI / 4, 0, 0]}>
            <ringGeometry args={[0.85, 1.0, 32]} />
            <meshBasicMaterial color={wireColor} transparent opacity={0.85} side={2} />
          </mesh>
        </group>
      )}

      {/* Crystal Core Sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial
          color={mainColor}
          emissive={emissiveColor}
          emissiveIntensity={isSpecial ? 4.5 : 1.8}
          metalness={0.25}
          roughness={0.15}
        />
      </mesh>

      {/* Outer Wireframe Energy Shell */}
      <mesh>
        <sphereGeometry args={[0.63, 16, 16]} />
        <meshBasicMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={isSpecial ? 0.65 : 0.25}
        />
      </mesh>

      {/* Laser-Etched Vertex Label */}
      <Text
        position={[0, 0, 0.74]}
        fontSize={0.46}
        color="#ffffff"
        fontWeight="900"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#0f172a"
        renderOrder={10}
      >
        {String(value)}
      </Text>
    </group>
  );
});

// --- 2. Holographic Laser Edge with Photon Pulse Runner ---
const Edge = React.memo(function Edge({
  start,
  end,
  isHighlighted = false,
  isPathEdge = false,
}) {
  const pulseRef = useRef();

  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const dz = (end[2] || 0) - (start[2] || 0);
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const angleZ = Math.atan2(dx, dy);

  const mid = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] || 0) + (end[2] || 0) / 2,
  ];

  // Animate photon packet traveling along the shortest path
  useFrame((state) => {
    if (pulseRef.current && isPathEdge) {
      const t = (state.clock.getElapsedTime() * 1.5) % 1;
      const cur = new THREE.Vector3().lerpVectors(startVec, endVec, t);
      pulseRef.current.position.set(cur.x, cur.y, cur.z);
    }
  });

  const edgeColor = isPathEdge ? "#38bdf8" : isHighlighted ? "#c084fc" : "#7c3aed";
  const emissiveColor = isPathEdge ? "#0284c7" : isHighlighted ? "#9333ea" : "#581c87";

  return (
    <>
      {/* Cylindrical Laser Beam */}
      <group position={mid} rotation={[0, 0, -angleZ]}>
        <mesh scale={isPathEdge ? [1.6, 1, 1.6] : isHighlighted ? [1.3, 1, 1.3] : [1, 1, 1]}>
          <cylinderGeometry args={[0.06, 0.06, length, 12]} />
          <meshStandardMaterial
            color={edgeColor}
            emissive={emissiveColor}
            emissiveIntensity={isPathEdge ? 4.5 : isHighlighted ? 3 : 1.2}
            metalness={0.2}
            roughness={0.2}
          />
        </mesh>

        {/* Outer Glow Sleeve */}
        <mesh scale={isPathEdge ? [2.0, 1, 2.0] : [1.3, 1, 1.3]}>
          <cylinderGeometry args={[0.08, 0.08, length, 8]} />
          <meshBasicMaterial
            color={edgeColor}
            transparent
            opacity={isPathEdge ? 0.45 : 0.15}
          />
        </mesh>
      </group>

      {/* Traveling Photon Energy Orb on Shortest Path */}
      {isPathEdge && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </>
  );
});

// --- Main World Component ---

export default function GraphWorld({
  nodes = ["A", "B", "C", "D"],
  edges = [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
  ],
  shortestPath = [],
  highlightedNode,
}) {
  const graphLayout = useMemo(() => {
    if (nodes.length === 0) return [];

    if (edges.length === 0) {
      const spacing = 3.2;
      return nodes.map((value, index) => ({
        value,
        position: [
          (index - (nodes.length - 1) / 2) * spacing,
          1.8,
          0,
        ],
      }));
    }

    const root = nodes[0];
    const adjacency = {};
    nodes.forEach((node) => {
      adjacency[node] = [];
    });

    edges.forEach(([from, to]) => {
      if (adjacency[from]) adjacency[from].push(to);
      if (adjacency[to]) adjacency[to].push(from);
    });

    const levels = [[root]];
    const visited = new Set([root]);
    const queue = [{ node: root, level: 0 }];

    while (queue.length) {
      const { node, level } = queue.shift();
      (adjacency[node] || []).forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          if (!levels[level + 1]) {
            levels[level + 1] = [];
          }
          levels[level + 1].push(neighbor);
          queue.push({ node: neighbor, level: level + 1 });
        }
      });
    }

    const positionMap = {};
    levels.forEach((levelNodes, levelIndex) => {
      const spacing = 4.2;
      const totalWidth = (levelNodes.length - 1) * spacing;
      levelNodes.forEach((node, index) => {
        positionMap[node] = [
          index * spacing - totalWidth / 2,
          4.5 - levelIndex * 2.6,
          0,
        ];
      });
    });

    nodes.forEach((node) => {
      if (!positionMap[node]) {
        positionMap[node] = [0, -3.5, 0];
      }
    });

    return nodes.map((value) => ({
      value,
      position: positionMap[value],
    }));
  }, [nodes, edges]);

  const nodePositions = useMemo(() => {
    return Object.fromEntries(
      graphLayout.map((node) => [node.value, node.position])
    );
  }, [graphLayout]);

  const isEdgeInShortestPath = (from, to) => {
    if (!shortestPath || shortestPath.length < 2) return false;
    for (let i = 0; i < shortestPath.length - 1; i++) {
      const u = shortestPath[i];
      const v = shortestPath[i + 1];
      if ((u === from && v === to) || (u === to && v === from)) {
        return true;
      }
    }
    return false;
  };

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      performance={{ min: 0.8 }}
      camera={{ position: [0, 2.5, 18], fov: 54 }}
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      <ambientLight intensity={1.4} />

      <directionalLight
        position={[6, 12, 6]}
        intensity={3.5}
        color="#ffffff"
      />

      <directionalLight
        position={[-6, 8, -6]}
        intensity={1.5}
        color="#a855f7"
      />

      <pointLight
        position={[0, 4, 6]}
        intensity={10}
        color="#8b5cf6"
      />

      {/* Cyberpunk Starfield */}
      <Stars
        radius={75}
        depth={40}
        count={500}
        factor={3}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Holographic Laser Edges */}
      {edges.map(([from, to], index) => {
        const start = nodePositions[from];
        const end = nodePositions[to];
        if (!start || !end) return null;

        const isPathEdge = isEdgeInShortestPath(from, to);
        const isHighlighted =
          highlightedNode !== null &&
          (nodes.indexOf(from) === highlightedNode || nodes.indexOf(to) === highlightedNode);

        return (
          <Edge
            key={`edge-${from}-${to}-${index}`}
            start={start}
            end={end}
            isHighlighted={isHighlighted}
            isPathEdge={isPathEdge}
          />
        );
      })}

      {/* Amethyst Crystal Vertices */}
      {graphLayout.map((node, index) => {
        const isInPath = Array.isArray(shortestPath) && shortestPath.includes(node.value);
        const isHighlighted = highlightedNode === index || highlightedNode === node.value;

        return (
          <GraphNode
            key={`node-${node.value}-${index}`}
            position={node.position}
            value={node.value}
            index={index}
            isHighlighted={isHighlighted}
            isInPath={isInPath}
          />
        );
      })}



      <OrbitControls
        enablePan={true}
        minDistance={8}
        maxDistance={38}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.95}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}