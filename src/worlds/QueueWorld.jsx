import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, ContactShadows } from "@react-three/drei";
import { animated, useTransition } from "@react-spring/three";
import { useRef } from "react";
import NeonLane from "../components/NeonLane";
import CityTower from "../components/CityTower";

// --- Components ---

function TransportPod({ position, scale, rotation, color, opacity, value }) {
  return (
    <animated.group position={position} scale={scale} rotation={rotation}>
      {/* Metallic Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.4, 1.6]} />
        <animated.meshStandardMaterial 
          color="#0f172a" 
          metalness={0.9} 
          roughness={0.1} 
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Glass Inner Core */}
      <mesh>
        <boxGeometry args={[1.8, 1.2, 1.7]} />
        <animated.meshPhysicalMaterial 
          color={color} 
          transmission={0.8} 
          transparent
          opacity={opacity} 
          metalness={0.2}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Value Text */}
      <animated.group opacity={opacity}>
        <Text
          position={[0, 0, 0.86]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04}
          outlineColor="#000000"
        >
          {value}
        </Text>
      </animated.group>
    </animated.group>
  );
}

function ConveyorBelt() {
  return (
    <group position={[0, -0.7, 0]}>
      {/* Main Track */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[24, 0.2, 4]} />
        <meshStandardMaterial
          color="#020617"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Neon Edges */}
      <mesh position={[0, 0.1, 1.9]}>
        <boxGeometry args={[24, 0.05, 0.1]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0.1, -1.9]}>
        <boxGeometry args={[24, 0.05, 0.1]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
      </mesh>
      {/* Center glowing strip */}
      <mesh position={[0, 0.11, 0]}>
        <planeGeometry args={[24, 0.2]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} transparent opacity={0.6} rotation={[-Math.PI / 2, 0, 0]} />
      </mesh>
    </group>
  );
}

function Gate({ position, color, label }) {
  return (
    <group position={position}>
      {/* Pillars */}
      <mesh position={[0, 1.5, 2.5]} castShadow>
        <boxGeometry args={[1, 4, 1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.5, -2.5]} castShadow>
        <boxGeometry args={[1, 4, 1]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Arch */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Neon inner frame */}
      <mesh position={[0, 1.5, 2]}>
        <boxGeometry args={[0.2, 3.8, 0.1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 1.5, -2]}>
        <boxGeometry args={[0.2, 3.8, 0.1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[0.2, 0.1, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, 4.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.8}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={color}
      >
        {label}
      </Text>
    </group>
  );
}

// --- Main World ---

export default function QueueWorld({ queue, shake }) {
  const colors = [
    "#22d3ee",
    "#f97316",
    "#a855f7",
    "#10b981",
    "#eab308",
  ];

  // The front of the queue is always at x = 4.
  // Each subsequent element is placed 2.8 units to the left.
  const FRONT_X = 4;
  const SPACING = 2.8;
  const ENTRY_X = -10;
  const EXIT_X = 10;

  const transitions = useTransition(queue, {
    keys: (item) => item.id,
    from: (item, index) => ({
      position: [ENTRY_X, 2, 0],
      scale: [0.2, 0.2, 0.2],
      rotation: [0, 0, Math.PI / 2],
      opacity: 0,
    }),
    enter: (item, index) => ({
      position: [FRONT_X - index * SPACING, 0.2, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      opacity: 1,
    }),
    update: (item, index) => ({
      position: [FRONT_X - index * SPACING, 0.2, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      opacity: 1,
    }),
    leave: {
      position: [EXIT_X, 0.2, 0],
      scale: [1.2, 0.2, 1.2],
      rotation: [0, 0, 0],
      opacity: 0,
    },
    config: {
      mass: 1,
      tension: 180,
      friction: 20,
    },
  });

  return (
    <Canvas
      shadows
      camera={{ position: [0, 8, 14], fov: 50 }}
      style={{
        background: "transparent",
        height: "100%",
        width: "100%",
        borderRadius: "24px",
        boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        transform: shake ? "translateX(6px)" : "translateX(0px)",
        transition: "transform 0.22s ease-out",
      }}
    >
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <fog attach="fog" args={["#020617", 10, 30]} />

      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping
        dampingFactor={0.08}
      />

      <ConveyorBelt />

      <Gate position={[ENTRY_X, -0.5, 0]} color="#a855f7" label="ENTRY" />
      <Gate position={[EXIT_X, -0.5, 0]} color="#22d3ee" label="EXIT" />

      {transitions((style, item, t, index) => (
        <TransportPod
          key={item.id}
          value={item.value}
          position={style.position}
          scale={style.scale}
          rotation={style.rotation}
          opacity={style.opacity}
          color={colors[index % colors.length] || "#22d3ee"}
        />
      ))}

      {/* Cyberpunk Environment Decor */}
      <CityTower position={[-8, -2, -8]} height={12} color="#22d3ee" />
      <CityTower position={[-4, -1, -10]} height={14} color="#a855f7" />
      <CityTower position={[0, -2, -9]} height={10} color="#f97316" />
      <CityTower position={[5, -1, -10]} height={16} color="#10b981" />
      <CityTower position={[9, -2, -8]} height={11} color="#eab308" />

      <ContactShadows position={[0, -0.68, 0]} opacity={0.5} scale={30} blur={2} far={4} />
    </Canvas>
  );
}