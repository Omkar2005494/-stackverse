import { Canvas } from "@react-three/fiber";
import { useMemo, useEffect, useState } from "react";
import { OrbitControls, Text, Stars } from "@react-three/drei";

function TreeNode({
  position,
  value,
  index,
  highlighted,
  treeDepth,
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
        <sphereGeometry
          args={[
            treeDepth >= 6 ? 0.65 : treeDepth >= 4 ? 0.75 : 0.85,
            32,
            32,
          ]}
        />

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

  const treeDepth = Math.max(
    1,
    Math.floor(Math.log2(nodes.length || 1))
  );

  const cameraDistance = Math.min(
    26,
    Math.max(12, 12 + treeDepth * 1.2)
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

      const y = maxLevel * 1.8 - depth * 2.4;

      results.push({
        value: nodes[index],
        index,
        position: [x, y, 0],
      });

      const nextOffset = Math.max(2.5, offset * 0.68);

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
      Math.max(8, maxLevel * 4),
      results
    );

    return results;
  }, [nodes]);

  return (
    <Canvas
      camera={{
        position: [0, 2, cameraDistance],
        fov: 55,
      }}
      style={{
        width: "100%",
        height: "100%",
        background: "#020617",
      }}
    >
      <ambientLight intensity={3} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={5}
        color="#ffffff"
      />

      <pointLight
        position={[0, 3, 4]}
        intensity={14}
        color="#22d3ee"
      />

      <pointLight
        position={[-12, 8, -8]}
        intensity={25}
        color="#22d3ee"
      />

      <pointLight
        position={[12, 6, -10]}
        intensity={18}
        color="#6366f1"
      />

      <mesh position={[-10, 6, -12]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.12}
        />
      </mesh>

      <mesh position={[10, 4, -14]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.1}
        />
      </mesh>

      <mesh position={[0, 8, -18]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.08}
        />
      </mesh>

      <Stars
        radius={80}
        depth={40}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {treeLayout.map((node, index) => (
        <TreeNode
          key={index}
          position={node.position}
          value={node.value}
          index={index}
          highlighted={highlightedNode === node.value}
          treeDepth={treeDepth}
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

      {/* <gridHelper args={[60, 60, "#0f766e", "#082f49"]} /> */}
      <OrbitControls
        target={[0, Math.max(0, treeDepth * 0.8), 0]}
        enablePan={true}
        enableRotate={true}
        enableZoom={true}
        minDistance={8}
        maxDistance={60}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}