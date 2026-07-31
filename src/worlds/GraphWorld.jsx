import { Canvas } from "@react-three/fiber";
import { useMemo, useEffect, useState } from "react";
import { useGameProgress } from "../context/GameProgressContext";
import { OrbitControls, Float, Text } from "@react-three/drei";

function GraphNode({
  position,
  value,
  index,
  highlighted,
}) {
  const [spawned, setSpawned] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSpawned(true);
    }, index * 120);

    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group position={position}>
        <mesh
          scale={
            highlighted
              ? 1.28
              : spawned
              ? 1
              : 0
          }
        >
          <sphereGeometry args={[0.45, 32, 32]} />

          <meshStandardMaterial
            color={highlighted ? "#67e8f9" : "#0891b2"}
            emissive="#22d3ee"
            emissiveIntensity={highlighted ? 5 : 1.8}
            metalness={0.35}
            roughness={0.3}
          />
        </mesh>

        <Text
          position={[0, 0, 0.65]}
          fontSize={0.42}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          renderOrder={10}
        >
          {String(value)}
        </Text>
      </group>
    </Float>
  );
}

function Edge({ start, end }) {
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
    <mesh
      position={mid}
      rotation={[0, 0, -angle]}
    >
      <boxGeometry args={[0.12, length, 0.12]} />

      <meshStandardMaterial
        color="#67e8f9"
        emissive="#22d3ee"
        emissiveIntensity={2}
      />
    </mesh>
  );
}

export default function GraphWorld({
  nodes = ["A", "B", "C", "D"],
  edges = [
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
  ],
  highlightedNode,
}) {
  const {
    addXP,
    incrementStat,
    unlockAchievement,
  } = useGameProgress();
  const graphLayout = useMemo(() => {
    if (nodes.length === 0) return [];

    if (edges.length === 0) {
      const spacing = 3;

      return nodes.map((value, index) => ({
        value,
        position: [
          (index - (nodes.length - 1) / 2) * spacing,
          2,
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
      adjacency[from].push(to);
      adjacency[to].push(from);
    });

    const levels = [[root]];
    const visited = new Set([root]);
    const queue = [{ node: root, level: 0 }];

    while (queue.length) {
      const { node, level } = queue.shift();

      adjacency[node].forEach((neighbor) => {
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

    const maxLevelWidth = Math.max(
      ...levels.map((level) => level.length)
    );

    if (maxLevelWidth === 1 && levels.length > 1) {
      return nodes.map((value, index) => ({
        value,
        position: [
          index * 3 - ((nodes.length - 1) * 3) / 2,
          1,
          0,
        ],
      }));
    }

    const positionMap = {};

    levels.forEach((levelNodes, levelIndex) => {
      const spacing = 5;
      const totalWidth = (levelNodes.length - 1) * spacing;

      levelNodes.forEach((node, index) => {
        positionMap[node] = [
          index * spacing - totalWidth / 2,
          5 - levelIndex * 2,
          0,
        ];
      });
    });

    nodes.forEach((node) => {
      if (!positionMap[node]) {
        positionMap[node] = [0, -4, 0];
      }
    });

    return nodes.map((value) => ({
      value,
      position: positionMap[value],
    }));
  }, [nodes, edges]);

  useEffect(() => {
    if (nodes.length > 0) {
      incrementStat("graphOperations");
      addXP(5);
    }

    if (nodes.length >= 5) {
      unlockAchievement("🌐 Graph Explorer");
    }
  }, [nodes.length]);

  const nodePositions = Object.fromEntries(
    graphLayout.map((node) => [
      node.value,
      node.position,
    ])
  );
  return (
    <Canvas
      camera={{ position: [0, 1, 20], fov: 62 }}
      style={{
        width: "100vw",
        height: "100vh",
        background: "transparent",
      }}
    >
      <ambientLight intensity={1} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={4}
        color="#22d3ee"
      />

      <fog attach="fog" args={["#020617", 12, 24]} />

      {graphLayout.map((node, index) => (
        <GraphNode
          key={index}
          position={node.position}
          value={node.value}
          index={index}
          highlighted={highlightedNode === index}
        />
      ))}

      {edges.map(([from, to], index) => {
        const start = nodePositions[from];
        const end = nodePositions[to];

        if (!start || !end) return null;

        return (
          <Edge
            key={`edge-${index}`}
            start={start}
            end={end}
          />
        );
      })}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[40, 40]} />

        <meshStandardMaterial
          color="#020617"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      <mesh position={[0, -4.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 4, 64]} />

        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={2}
          side={2}
        />
      </mesh>

      <OrbitControls
        enablePan={true}
        minDistance={8}
        maxDistance={30}
      />
    </Canvas>
  );
}