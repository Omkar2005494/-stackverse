import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import NeonLane from "../components/NeonLane";
import CityTower from "../components/CityTower";

function Car({ position, color }) {
  const props = useSpring({
    from: {
      position: [position[0] + 4, position[1], position[2]],
      scale: [0.7, 0.7, 0.7],
      rotation: [0, -0.3, 0],
    },

    to: {
      position,
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
    },

    config: {
      mass: 1,
      tension: 220,
      friction: 18,
    },
  });

  return (
    <animated.mesh
      position={props.position}
      scale={props.scale}
      rotation={props.rotation}
    >
      <boxGeometry args={[1.6, 0.7, 0.9]} />

      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        metalness={0.45}
        roughness={0.2}
      />
    </animated.mesh>
  );
}

function Road() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[20, 6]} />

        <meshStandardMaterial
          color="#111827"
          emissive="#0f172a"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 0.08]} />

        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={2}
        />
      </mesh>
    </>
  );
}

export default function QueueWorld({ queue }) {
  const colors = [
    "#22d3ee",
    "#f97316",
    "#a855f7",
    "#10b981",
    "#eab308",
  ];

  return (
    <Canvas
      camera={{ position: [0, 6, 10], fov: 50 }}
      style={{
        background:
          "radial-gradient(circle, #0f172a 0%, #020617 100%)",
        height: "100vh",
      }}
    >
      <ambientLight intensity={0.9} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={4}
      />

      <fog attach="fog" args={["#020617", 8, 22]} />

      <OrbitControls
        enablePan={false}
        minDistance={7}
        maxDistance={14}
        enableDamping
        dampingFactor={0.08}
      />

      <Road />

      <NeonLane position={[-5, 0.03, 0]} />
      <NeonLane position={[-2.5, 0.03, 0]} />
      <NeonLane position={[0, 0.03, 0]} />
      <NeonLane position={[2.5, 0.03, 0]} />
      <NeonLane position={[5, 0.03, 0]} />

      <CityTower
        position={[-8, 2.5, -6]}
        height={5}
        color="#22d3ee"
      />

      <CityTower
        position={[-4, 3, -7]}
        height={6}
        color="#a855f7"
      />

      <CityTower
        position={[0, 2, -8]}
        height={4}
        color="#f97316"
      />

      <CityTower
        position={[4, 3.5, -7]}
        height={7}
        color="#10b981"
      />

      <CityTower
        position={[8, 2.5, -6]}
        height={5}
        color="#eab308"
      />

      {queue.map((_, index) => (
        <Car
          key={index}
          position={[
            index * 2.2 - queue.length,
            0.4,
            0,
          ]}
          color={colors[index % colors.length]}
        />
      ))}
    </Canvas>
  );
}