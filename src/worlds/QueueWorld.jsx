import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Text, RoundedBox } from "@react-three/drei";
import { useTransition, animated, useSpring } from "@react-spring/three";

// --- Color Palette Gradient (Front Cyan -> Rear Violet) ---
const POD_PALETTES = [
  { main: "#06b6d4", emissive: "#0891b2", edge: "#67e8f9" }, // Front: Cyan
  { main: "#3b82f6", emissive: "#2563eb", edge: "#93c5fd" }, // 1: Electric Blue
  { main: "#8b5cf6", emissive: "#7c3aed", edge: "#c4b5fd" }, // 2: Indigo
  { main: "#a855f7", emissive: "#9333ea", edge: "#d8b4fe" }, // 3: Purple
  { main: "#ec4899", emissive: "#db2777", edge: "#f472b6" }, // 4: Magenta
];

// --- 1. MagLev Shuttle Pod ---
const MagLevPod = React.memo(function MagLevPod({
  position,
  scale,
  rotation,
  opacity,
  value,
  index = 0,
  isPeeked = false,
}) {
  const meshRef = useRef();
  const palette = POD_PALETTES[Math.min(index, POD_PALETTES.length - 1)];

  // Spring animation for smooth 3D levitation during PEEK inspection
  const { levitateY, glowIntensity } = useSpring({
    levitateY: isPeeked ? 0.55 : 0,
    glowIntensity: isPeeked ? 3.5 : 1.3,
    config: { mass: 1, tension: 280, friction: 18 },
  });

  // Magnetic floating hover physics
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(t * 3.5 + index * 0.8) * 0.04;
    }
  });

  const isFront = index === 0;
  const mainColor = isPeeked ? "#38bdf8" : palette.main;
  const emissiveColor = isPeeked ? "#0284c7" : palette.emissive;
  const edgeColor = isPeeked ? "#7dd3fc" : palette.edge;

  return (
    <animated.group position={position} scale={scale} rotation={rotation}>
      <animated.group position-y={levitateY}>
        <group ref={meshRef}>
          {/* Aerodynamic Rounded MagLev Chassis */}
          <RoundedBox
            args={[2.1, 1.15, 1.45]}
            radius={0.12}
            smoothness={4}
            castShadow
            receiveShadow
          >
            <animated.meshStandardMaterial
              color={mainColor}
              emissive={emissiveColor}
              emissiveIntensity={glowIntensity}
              metalness={0.25}
              roughness={0.15}
              transparent
              opacity={opacity}
            />
          </RoundedBox>

          {/* Glowing Neon Edge Wireframe Lattice */}
          <mesh>
            <boxGeometry args={[2.11, 1.16, 1.46]} />
            <meshBasicMaterial
              color={edgeColor}
              wireframe
              transparent
              opacity={isPeeked ? 0.65 : 0.35}
            />
          </mesh>

          {/* Front Bumper Light Stripe */}
          <mesh position={[1.06, 0, 0]}>
            <boxGeometry args={[0.04, 0.6, 1.2]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>

          {/* Front Element Status Badge */}
          {isFront && (
            <group position={[0, 0.85, 0]}>
              <Text
                fontSize={0.22}
                color="#38bdf8"
                fontWeight="900"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.03}
                outlineColor="#0b1329"
              >
                FRONT [0]
              </Text>
            </group>
          )}

          {/* Front & Back Face Laser Value */}
          <Text
            position={[0, 0, 0.74]}
            fontSize={0.55}
            color="#ffffff"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#0f172a"
          >
            {value}
          </Text>
          <Text
            position={[0, 0, -0.74]}
            rotation={[0, Math.PI, 0]}
            fontSize={0.55}
            color="#ffffff"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#0f172a"
          >
            {value}
          </Text>
        </group>
      </animated.group>
    </animated.group>
  );
});

// --- 2. High-Tech MagLev Conveyor Track with Directional Chevrons ---
function AnimatedConveyorTrack() {
  const chevronsRef = useRef();

  useFrame((state) => {
    if (chevronsRef.current) {
      const t = state.clock.getElapsedTime();
      // Flow chevrons rightward toward EXIT
      chevronsRef.current.position.x = ((t * 2.5) % 2) - 1;
    }
  });

  return (
    <group position={[0, -0.62, 0]}>
      {/* Matte Dark Cyber Base Track */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[26, 0.22, 3.4]} />
        <meshStandardMaterial
          color="#020617"
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Dual Neon Guideway Borders */}
      <mesh position={[0, 0.12, 1.62]}>
        <boxGeometry args={[26, 0.08, 0.08]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0, 0.12, -1.62]}>
        <boxGeometry args={[26, 0.08, 0.08]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Center Directional Flow Strip */}
      <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 0.5]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.35} />
      </mesh>

      {/* Directional Flow Chevron Markers */}
      <group ref={chevronsRef} position={[0, 0.125, 0]}>
        {[-8, -5, -2, 1, 4].map((x) => (
          <Text
            key={x}
            position={[x, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.42}
            color="#38bdf8"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
          >
            {"> > >"}
          </Text>
        ))}
      </group>
    </group>
  );
}

// --- 3. Quantum Portal Gate ---
function QuantumPortal({ position, color, label, isExit = false }) {
  const irisRef = useRef();

  useFrame((state) => {
    if (irisRef.current) {
      const t = state.clock.getElapsedTime();
      irisRef.current.rotation.x = isExit ? t * 3 : -t * 3;
    }
  });

  return (
    <group position={position}>
      {/* Matte Dark Pillars */}
      <mesh position={[0, 1.6, 2.1]} castShadow>
        <boxGeometry args={[0.7, 3.6, 0.6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.6, -2.1]} castShadow>
        <boxGeometry args={[0.7, 3.6, 0.6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Top Header Beam */}
      <mesh position={[0, 3.3, 0]} castShadow>
        <boxGeometry args={[0.7, 0.6, 4.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Neon Energy Ring Frame */}
      <mesh position={[0, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[1.5, 1.65, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} side={2} />
      </mesh>

      {/* Rotating Inner Quantum Iris */}
      <group ref={irisRef} position={[0, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <ringGeometry args={[0.8, 1.45, 6]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.6} side={2} />
        </mesh>
      </group>

      {/* Top Signboard */}
      <Text
        position={[0, 4.0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.42}
        color={color}
        fontWeight="900"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#0b1329"
      >
        {label}
      </Text>
    </group>
  );
}

// --- 4. Tractor Beam Peek Field on Front Element ---
function QueueTractorBeam({ frontX }) {
  const beamRef = useRef();

  useFrame((state) => {
    if (beamRef.current) {
      const t = state.clock.getElapsedTime();
      beamRef.current.rotation.y = t * 2.5;
    }
  });

  return (
    <group position={[frontX, 0, 0]}>
      {/* Floor Scan Halo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <ringGeometry args={[0.9, 1.4, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.75} side={2} />
      </mesh>

      {/* Vertical Cyan Tractor Beam Column */}
      <mesh ref={beamRef} position={[0, 1.4, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 3.8, 24, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.16}
          side={2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// --- Main World Component ---

export default function QueueWorld({
  queue = [],
  shake,
  isPeeking = false,
}) {
  const FRONT_X = 4.2;
  const SPACING = 2.7;
  const ENTRY_X = -10.5;
  const EXIT_X = 7.8;

  const transitions = useTransition(queue, {
    keys: (item) => item.id,
    from: () => ({
      position: [ENTRY_X, 0.25, 0],
      scale: [0.2, 1.4, 0.2], // Compressed while materializing from entry portal
      rotation: [0, 0, 0],
      opacity: 0,
    }),
    enter: (item, index) => ({
      position: [FRONT_X - index * SPACING, 0.25, 0],
      scale: [1, 1, 1], // Settles into queue position
      rotation: [0, 0, 0],
      opacity: 1,
    }),
    update: (item, index) => ({
      position: [FRONT_X - index * SPACING, 0.25, 0], // Smoothly glides forward when front dequeues
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      opacity: 1,
    }),
    leave: {
      position: [EXIT_X + 4.5, 0.25, 0], // Hyper-eject forward through exit gate
      scale: [1.6, 0.4, 1.6],
      rotation: [0, 0, 0],
      opacity: 0,
    },
    config: {
      mass: 1.1,
      tension: 240,
      friction: 18,
    },
  });

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      performance={{ min: 0.8 }}
      camera={{ position: [0, 6.5, 13.5], fov: 48 }}
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
        position={[5, 12, 6]}
        intensity={2.8}
        color="#fff7ed"
      />

      <directionalLight
        position={[-5, 8, -4]}
        intensity={1.4}
        color="#38bdf8"
      />

      <pointLight
        position={[0, 4, 3]}
        intensity={5}
        color="#a855f7"
      />

      <fog attach="fog" args={["#020617", 12, 32]} />

      <OrbitControls
        target={[0, 0.6, 0]}
        enablePan={false}
        minDistance={8}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping
        dampingFactor={0.08}
      />

      {/* MagLev Track with Directional Chevrons */}
      <AnimatedConveyorTrack />

      {/* Quantum Portals */}
      <QuantumPortal position={[ENTRY_X, -0.5, 0]} color="#a855f7" label="REAR (ENTRY)" />
      <QuantumPortal position={[EXIT_X, -0.5, 0]} color="#22d3ee" label="FRONT (EXIT)" isExit={true} />

      {/* Queue Shuttle Pods */}
      {transitions((style, item, t, index) => (
        <MagLevPod
          key={item.id}
          value={item.value}
          index={index}
          position={style.position}
          scale={style.scale}
          rotation={style.rotation}
          opacity={style.opacity}
          isPeeked={isPeeking && index === 0}
        />
      ))}

      {/* Front Peek Tractor Beam */}
      {isPeeking && queue.length > 0 && (
        <QueueTractorBeam frontX={FRONT_X} />
      )}

      {/* Matte Floor Void & Contact Shadows */}
      <ContactShadows
        position={[0, -0.61, 0]}
        opacity={0.6}
        scale={28}
        blur={1.4}
        far={3}
        resolution={256}
        frames={1}
        color="#000000"
      />
    </Canvas>
  );
}