import { Canvas } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";

function Node({ position, label }) {
  return (
    <Float speed={2} floatIntensity={0.3}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={4}
          />
        </mesh>

        <Text
          position={[0, 0, 0.35]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
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
      <boxGeometry args={[0.09, length, 0.09]} />
      <meshStandardMaterial
        color="#67e8f9"
        emissive="#22d3ee"
        emissiveIntensity={2}
      />
    </mesh>
  );
}

export default function GraphPreview() {
  const nodes = {
    A: [0, 1.2, 0],
    B: [-1.5, 0.1, 0],
    C: [1.5, 0.1, 0],
    D: [-2.0, -1.1, 0],
    E: [2.0, -1.1, 0],
  };

  const edges = [
    ["A", "B"],
    ["A", "C"],
    ["B", "C"],
    ["B", "D"],
    ["C", "E"],
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "150px",
        marginTop: "16px",
        borderRadius: "12px",
        overflow: "hidden",
        background: "rgba(2,6,23,0.35)",
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[3, 5, 3]}
          intensity={3}
        />

        {edges.map(([from, to], index) => (
          <Edge
            key={index}
            start={nodes[from]}
            end={nodes[to]}
          />
        ))}

        {Object.entries(nodes).map(([label, position]) => (
          <Node
            key={label}
            label={label}
            position={position}
          />
        ))}
      </Canvas>
    </div>
  );
}