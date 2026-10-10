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
      // Gentle floating hover loop
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
            <ringGeometry args={[0.85, 1.05, 32]} />
            <meshBasicMaterial color={wireColor} transparent opacity={0.85} side={THREE.DoubleSide} />
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
        <sphereGeometry args={[0.64, 16, 16]} />
        <meshBasicMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={isSpecial ? 0.75 : 0.25}
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

// --- 2. Holographic Laser Edge with True 3D Quaternion & Photon Pulse ---
const Edge = React.memo(function Edge({
  start,
  end,
  from,
  to,
  isHighlighted = false,
  isPathEdge = false,
  shortestPath = [],
}) {
  const pulseRef = useRef();

  // True 3D alignment using Quaternion
  const { mid, length, quaternion, p1, p2 } = useMemo(() => {
    const v1 = new THREE.Vector3(start[0], start[1], start[2] || 0);
    const v2 = new THREE.Vector3(end[0], end[1], end[2] || 0);
    const midPoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(v2, v1);
    const len = dir.length();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion();
    if (len > 0.0001) {
      quat.setFromUnitVectors(up, dir.clone().normalize());
    }
    return { mid: midPoint, length: len, quaternion: quat, p1: v1, p2: v2 };
  }, [start, end]);

  // Determine direction of photon packet travel along the shortest path
  const isForward = useMemo(() => {
    if (!isPathEdge || !Array.isArray(shortestPath) || shortestPath.length < 2) return true;
    for (let i = 0; i < shortestPath.length - 1; i++) {
      if (shortestPath[i] === from && shortestPath[i + 1] === to) return true;
      if (shortestPath[i] === to && shortestPath[i + 1] === from) return false;
    }
    return true;
  }, [isPathEdge, shortestPath, from, to]);

  const travelStart = isForward ? p1 : p2;
  const travelEnd = isForward ? p2 : p1;

  // Animate photon packet traveling along the shortest path
  useFrame((state) => {
    if (pulseRef.current && isPathEdge) {
      const t = (state.clock.getElapsedTime() * 1.6) % 1;
      const cur = new THREE.Vector3().lerpVectors(travelStart, travelEnd, t);
      pulseRef.current.position.set(cur.x, cur.y, cur.z);
    }
  });

  const edgeColor = isPathEdge ? "#38bdf8" : isHighlighted ? "#c084fc" : "#7c3aed";
  const emissiveColor = isPathEdge ? "#0284c7" : isHighlighted ? "#9333ea" : "#581c87";

  return (
    <>
      {/* Cylindrical Laser Beam Oriented via 3D Quaternion */}
      <group position={mid} quaternion={quaternion}>
        <mesh scale={isPathEdge ? [1.6, 1, 1.6] : isHighlighted ? [1.3, 1, 1.3] : [1, 1, 1]}>
          <cylinderGeometry args={[0.06, 0.06, Math.max(0.01, length), 12]} />
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
          <cylinderGeometry args={[0.08, 0.08, Math.max(0.01, length), 8]} />
          <meshBasicMaterial
            color={edgeColor}
            transparent
            opacity={isPathEdge ? 0.45 : 0.18}
          />
        </mesh>
      </group>

      {/* Traveling Photon Energy Orb on Shortest Path */}
      {isPathEdge && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </>
  );
});

// --- 3. Clean Hierarchical BFS Graph Layout ---
function computeGraphLayout(nodes = [], edges = []) {
  if (!Array.isArray(nodes) || nodes.length === 0) return [];

  // Single node
  if (nodes.length === 1) {
    return [{ value: nodes[0], position: [0, 3.2, 0] }];
  }

  if (edges.length === 0) {
    const spacing = 3;
    return nodes.map((value, index) => ({
      value,
      position: [
        Number(((index - (nodes.length - 1) / 2) * spacing).toFixed(3)),
        1.5,
        0,
      ],
    }));
  }

  const root = nodes[0];
  const adjacency = {};
  nodes.forEach((n) => {
    adjacency[n] = [];
  });
  edges.forEach(([u, v]) => {
    if (adjacency[u]) adjacency[u].push(v);
    if (adjacency[v]) adjacency[v].push(u);
  });

  const levels = [[root]];
  const visited = new Set([root]);
  const queue = [{ node: root, level: 0 }];

  while (queue.length > 0) {
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

  // Include any unvisited / disconnected nodes on an extra level
  const unvisited = nodes.filter((n) => !visited.has(n));
  if (unvisited.length > 0) {
    levels.push(unvisited);
  }

  const positionMap = {};
  const spacing = 4.8;

  levels.forEach((levelNodes, levelIndex) => {
    const totalWidth = (levelNodes.length - 1) * spacing;

    levelNodes.forEach((node, index) => {
      positionMap[node] = [
        Number((index * spacing - totalWidth / 2).toFixed(3)),
        Number((3.2 - levelIndex * 2.2).toFixed(3)),
        0,
      ];
    });
  });

  // Fallback for safety
  nodes.forEach((node, idx) => {
    if (!positionMap[node]) {
      positionMap[node] = [
        Number(((idx - (nodes.length - 1) / 2) * 3).toFixed(3)),
        -4,
        0,
      ];
    }
  });

  return nodes.map((value) => ({
    value,
    position: positionMap[value],
  }));
}

// --- Main World Component ---
export default function GraphWorld({
  nodes = ["A", "B", "C", "D", "E"],
  edges = [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
    ["C", "E"],
  ],
  shortestPath = [],
  highlightedNode = null,
}) {
  const safeNodes = useMemo(() => (Array.isArray(nodes) ? nodes : []), [nodes]);
  const safeEdges = useMemo(() => (Array.isArray(edges) ? edges : []), [edges]);

  const graphLayout = useMemo(() => {
    return computeGraphLayout(safeNodes, safeEdges);
  }, [safeNodes, safeEdges]);

  const nodePositions = useMemo(() => {
    const map = {};
    graphLayout.forEach((node) => {
      map[node.value] = node.position;
      // Also map string representation if numbers are passed
      map[String(node.value)] = node.position;
    });
    return map;
  }, [graphLayout]);

  const isEdgeInShortestPath = (from, to) => {
    if (!Array.isArray(shortestPath) || shortestPath.length < 2) return false;
    for (let i = 0; i < shortestPath.length - 1; i++) {
      const u = shortestPath[i];
      const v = shortestPath[i + 1];
      if ((u === from && v === to) || (u === to && v === from)) {
        return true;
      }
    }
    return false;
  };

  // Resilient check for highlight supporting string or number
  const isNodeHighlighted = (val, idx) => {
    if (highlightedNode === null || highlightedNode === undefined) return false;
    if (highlightedNode === val || highlightedNode === idx) return true;
    if (typeof highlightedNode === "number" && safeNodes[highlightedNode] === val) return true;
    if (typeof highlightedNode === "string" && safeNodes.indexOf(highlightedNode) === idx) return true;
    return false;
  };

  const isEdgeHighlighted = (from, to) => {
    if (highlightedNode === null || highlightedNode === undefined) return false;
    if (from === highlightedNode || to === highlightedNode) return true;
    if (typeof highlightedNode === "number") {
      const activeVal = safeNodes[highlightedNode];
      return activeVal === from || activeVal === to;
    }
    return false;
  };

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      performance={{ min: 0.8 }}
      camera={{ position: [0, 2.5, 18], fov: 52 }}
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
      {safeEdges.map(([from, to], index) => {
        const start = nodePositions[from];
        const end = nodePositions[to];
        if (!start || !end) return null;

        const isPathEdge = isEdgeInShortestPath(from, to);
        const isHighlighted = isEdgeHighlighted(from, to);

        return (
          <Edge
            key={`edge-${from}-${to}-${index}`}
            start={start}
            end={end}
            from={from}
            to={to}
            isHighlighted={isHighlighted}
            isPathEdge={isPathEdge}
            shortestPath={shortestPath}
          />
        );
      })}

      {/* Amethyst Crystal Vertices */}
      {graphLayout.map((node, index) => {
        const isInPath = Array.isArray(shortestPath) && shortestPath.includes(node.value);
        const isHighlighted = isNodeHighlighted(node.value, index);

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
        minDistance={6}
        maxDistance={45}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI * 0.95}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}