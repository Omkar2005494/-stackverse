import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useTransition } from "@react-spring/three";
import { useRef } from "react";

import Box from "../components/Box";
import Floor from "../components/Floor";
import Particles from "../components/Particles";

const BLOCK_HEIGHT = 0.82;
const BASE_Y = BLOCK_HEIGHT / 2;

// Aesthetic Energy Scanner Disc beneath levitating top block
function PeekLevitationField({ topY }) {
  const ringRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 2.2;
    }
  });

  return (
    <group position={[0, topY - 0.05, 0]}>
      {/* 1. Holographic Scan Grid Platform */}
      <group ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[0.65, 1.15, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.7}
            side={2}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.3, 0.55, 6]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.8}
            side={2}
          />
        </mesh>
      </group>

      {/* 2. Soft Vertical Light Cylinder between stack and levitating block */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.6, 24, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.18}
          side={2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function StackWorld({
  stack = [],
  shake,
  powerMode,
  isPeeking = false,
}) {
  const topIndex = stack.length - 1;
  const topY = topIndex >= 0 ? topIndex * BLOCK_HEIGHT + BASE_Y : 0;

  // Physics-based squash & stretch drop transition
  const transitions = useTransition(stack, {
    keys: (item, index) => `${item}-${index}`,
    from: (item, index) => ({
      position: [0, (index * BLOCK_HEIGHT + BASE_Y) + 3.8, 0],
      scale: [0.85, 1.35, 0.85], // Stretched while falling
      rotation: [0.12, 0.08, 0],
      opacity: 0,
    }),
    enter: (item, index) => ({
      position: [0, index * BLOCK_HEIGHT + BASE_Y, 0],
      scale: [1, 1, 1], // Lands and settles
      rotation: [0, 0, 0],
      opacity: 1,
    }),
    leave: (item, index) => ({
      position: [0, (index * BLOCK_HEIGHT + BASE_Y) + 1.8, 0],
      scale: [1.25, 0.65, 1.25], // Squashes before vaporizing upward
      rotation: [0, 0.2, 0],
      opacity: 0,
    }),
    config: {
      mass: 1.1,
      tension: 260,
      friction: 14, // Responsive spring bounce on landing
    },
  });

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      performance={{ min: 0.8 }}
      camera={{
        position: [0, 3.8, 8.5],
        fov: 48,
      }}
      style={{
        background: "transparent",
        width: "100%",
        height: "100%",
        borderRadius: "24px",
        boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        transform: shake ? "translateX(6px)" : "translateX(0px)",
        transition: "transform 0.22s ease-out",
      }}
    >
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[4, 10, 6]}
        intensity={2.8}
        color="#fff7ed"
      />

      <directionalLight
        position={[-5, 6, -4]}
        intensity={1.2}
        color="#38bdf8"
      />

      <pointLight
        position={[0, 4, 3]}
        intensity={powerMode ? 8 : 4}
        color="#f97316"
      />

      <OrbitControls
        target={[0, Math.max(0.6, stack.length * 0.4), 0]}
        enablePan={false}
        minDistance={5}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2.15}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.7}
      />

      <fog
        attach="fog"
        args={[
          powerMode ? "#0ea5e9" : "#020617",
          10,
          24,
        ]}
      />

      {/* Render Stack Boxes */}
      {transitions((style, item, t, index) => (
        <Box
          key={t.key}
          style={style}
          value={item}
          index={index}
          isPeeked={isPeeking && index === topIndex}
        />
      ))}

      {/* Energy Projection Field under levitating top block */}
      {isPeeking && topIndex >= 0 && (
        <PeekLevitationField topY={topY} />
      )}

      <Particles />
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.55}
        scale={8}
        blur={1.5}
        far={3}
        resolution={256}
        frames={1}
        color="#000000"
      />
      <Floor />
    </Canvas>
  );
}