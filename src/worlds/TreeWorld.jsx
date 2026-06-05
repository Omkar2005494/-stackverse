import { Canvas } from "@react-three/fiber";
import { useMemo, useEffect, useState } from "react";
import { OrbitControls, Float, Text } from "@react-three/drei";

function TreeNode({
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
          <sphereGeometry args={[0.6, 32, 32]} />

          <meshStandardMaterial
            color={highlighted ? "#67e8f9" : "#0891b2"}
            emissive="#22d3ee"
            emissiveIntensity={highlighted ? 5 : 1.8}
            metalness={0.35}
            roughness={0.3}
          />
        </mesh>

        <Text
          position={[0, 0, 1.15]}
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

function Branch({ start, end }) {
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

export default function TreeWorld({
  nodes = [10, 5, 15],
  highlightedNode,
}) {
  const treeLayout = useMemo(() => {
    return nodes
      .map((value, index) => {
        if (value === undefined || value === null) return null;

        const level = Math.floor(Math.log2(index + 1));
        const levelStart = Math.pow(2, level) - 1;
        const positionInLevel = index - levelStart;
        const nodesInLevel = Math.pow(2, level);

        const spread = Math.max(1.5, 8 / Math.pow(2, level));

        const x =
          (positionInLevel - (nodesInLevel - 1) / 2) *
          spread *
          2;

        const y = 5 - level * 3;

        return {
          value,
          index,
          position: [x, y, 0],
        };
      })
      .filter(Boolean);
  }, [nodes]);
  return (
    <Canvas
      camera={{ position: [0, 2, 12], fov: 55 }}
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(circle, #0f172a 0%, #020617 100%)",
      }}
    >
      <ambientLight intensity={1} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={4}
        color="#22d3ee"
      />

      <fog attach="fog" args={["#020617", 12, 24]} />

      {treeLayout.map((node, index) => (
        <TreeNode
          key={index}
          position={node.position}
          value={node.value}
          index={index}
          highlighted={highlightedNode === node.value}
        />
      ))}

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
        enablePan={false}
        minDistance={8}
        maxDistance={16}
      />
    </Canvas>
  );
}