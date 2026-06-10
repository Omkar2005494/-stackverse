import { Canvas } from "@react-three/fiber";
import { useMemo, useEffect, useState } from "react";
import { OrbitControls, Text } from "@react-three/drei";

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
    <group position={position}>
      <mesh
        scale={
          highlighted
            ? 1.35
            : spawned
            ? 1
            : 0.01
        }
      >
        <sphereGeometry args={[0.85, 32, 32]} />

        <meshStandardMaterial
          color={highlighted ? "#a5f3fc" : "#22d3ee"}
          emissive="#22d3ee"
          emissiveIntensity={highlighted ? 6 : 2}
          metalness={0.35}
          roughness={0.3}
        />
      </mesh>

      <Text
        position={[0, 0, 1.05]}
        fontSize={0.65}
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
      <boxGeometry args={[0.16, length, 0.16]} />

      <meshStandardMaterial
        color="#67e8f9"
        emissive="#22d3ee"
        emissiveIntensity={3}
      />
    </mesh>
  );
}

export default function TreeWorld({
  nodes = [10, 5, 15],
  highlightedNode,
}) {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const treeLayout = useMemo(() => {
    return nodes
      .map((value, index) => {
        if (value === undefined || value === null) return null;

        const level = Math.floor(Math.log2(index + 1));
        const levelStart = Math.pow(2, level) - 1;
        const positionInLevel = index - levelStart;
        const nodesInLevel = Math.pow(2, level);

        const spread = 4.2;

        const y = 3.5 - level * 2.4;

        const x =
          (positionInLevel - (nodesInLevel - 1) / 2) *
          spread *
          2;

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
      camera={{
        position: [0, 2, 12],
        fov: 55,
      }}
      style={{
        width: "100%",
        height: "100%",
        background: "#020617",
      }}
    >
      <ambientLight intensity={2.5} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={5}
        color="#ffffff"
      />
      <pointLight position={[0, 3, 4]} intensity={10} color="#22d3ee" />

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

      <OrbitControls
        target={[0, 0, 0]}
        enablePan={false}
        enableRotate={true}
        enableZoom={true}
        minDistance={8}
        maxDistance={18}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}