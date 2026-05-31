

import { Canvas } from "@react-three/fiber";
import { Float, Text, OrbitControls } from "@react-three/drei";

function HeapNode({ value, position }) {
  return (
    <Float speed={2} floatIntensity={0.4}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color="#fed7aa"
            emissive="#fb923c"
            emissiveIntensity={1.8}
          />
        </mesh>

        <Text
          position={[0, 0, 0.9]}
          fontSize={0.42}
          color="#111111"
          anchorX="center"
          anchorY="middle"
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

  return (
    <mesh
      position={[
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2,
        0,
      ]}
      rotation={[0, 0, -angle]}
    >
      <boxGeometry args={[0.12, length, 0.12]} />
      <meshStandardMaterial
        color="#fdba74"
        emissive="#fb923c"
        emissiveIntensity={2}
      />
    </mesh>
  );
}

export default function HeapWorld({ heap = [10, 20, 30, 40, 50] }) {
  const nodes = heap;

  const positions = {};

  nodes.forEach((value, index) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelStart = 2 ** level - 1;
    const positionInLevel = index - levelStart;
    const nodesInLevel = 2 ** level;

    const spread = Math.max(6 - level, 2);

    positions[index] = [
      (positionInLevel - (nodesInLevel - 1) / 2) * spread,
      3 - level * 3,
      0,
    ];
  });

  const edges = [];

  for (let i = 1; i < nodes.length; i++) {
    edges.push([Math.floor((i - 1) / 2), i]);
  }

  return (
    <Canvas
      camera={{ position: [0, 2, 14], fov: 55 }}
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(circle, #1c1917 0%, #0c0a09 100%)",
      }}
    >
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={4}
      />

      {edges.map(([from, to], index) => (
        <Edge
          key={index}
          start={positions[from]}
          end={positions[to]}
        />
      ))}

      {nodes.map((value, index) => (
        <HeapNode
          key={`${value}-${index}`}
          value={value}
          position={positions[index]}
        />
      ))}

      <OrbitControls />
    </Canvas>
  );
}