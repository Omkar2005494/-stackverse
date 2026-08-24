import React, { useRef } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const BLOCK_PALETTES = [
  { main: "#f97316", emissive: "#ea580c", edge: "#fed7aa", core: "#ffedd5" }, // Level 0: Amber
  { main: "#fb923c", emissive: "#f97316", edge: "#ffedd5", core: "#fff7ed" }, // Level 1: Flame
  { main: "#f43f5e", emissive: "#e11d48", edge: "#ffe4e6", core: "#fff1f2" }, // Level 2: Coral
  { main: "#ec4899", emissive: "#db2777", edge: "#fce7f3", core: "#fdf2f8" }, // Level 3: Magenta
  { main: "#8b5cf6", emissive: "#7c3aed", edge: "#ede9fe", core: "#f5f3ff" }, // Level 4: Violet
];

const Box = React.memo(function Box({
  style,
  value,
  index = 0,
  isPeeked = false,
}) {
  const meshRef = useRef();
  const palette = BLOCK_PALETTES[Math.min(index, BLOCK_PALETTES.length - 1)];

  // Spring animation for smooth 3D levitation during PEEK inspection
  const { levitateY, glowIntensity } = useSpring({
    levitateY: isPeeked ? 0.55 : 0,
    glowIntensity: isPeeked ? 3.8 : 1.2,
    config: { mass: 1, tension: 280, friction: 18 },
  });

  // Subtle floating hover idle when peeked
  useFrame((state) => {
    if (isPeeked && meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(t * 5) * 0.04;
    } else if (meshRef.current) {
      meshRef.current.position.y = 0;
    }
  });

  const mainColor = isPeeked ? "#38bdf8" : palette.main;
  const emissiveColor = isPeeked ? "#0284c7" : palette.emissive;
  const edgeColor = isPeeked ? "#7dd3fc" : palette.edge;

  return (
    <animated.group
      position={style.position}
      scale={style.scale}
      rotation={style.rotation}
    >
      {/* 3D Levitation Offset Group */}
      <animated.group position-y={levitateY}>
        <group ref={meshRef}>
          {/* Main Beveled Sci-Fi Crystal Chassis */}
          <RoundedBox
            args={[1.34, 0.82, 1.34]}
            radius={0.06}
            smoothness={4}
            castShadow
            receiveShadow
          >
            <animated.meshStandardMaterial
              color={mainColor}
              emissive={emissiveColor}
              emissiveIntensity={glowIntensity}
              metalness={0.2}
              roughness={0.15}
              transparent
              opacity={style.opacity}
            />
          </RoundedBox>

          {/* Luminous Outer Edge Wireframe Lattice */}
          <mesh>
            <boxGeometry args={[1.345, 0.825, 1.345]} />
            <meshBasicMaterial
              color={edgeColor}
              wireframe
              transparent
              opacity={isPeeked ? 0.65 : 0.35}
            />
          </mesh>

          {/* Glowing Energy Aura Ring when Peeked */}
          {isPeeked && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]}>
              <ringGeometry args={[0.7, 1.05, 32]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={0.7}
                side={2}
              />
            </mesh>
          )}

          {/* Front Face Laser Numeral */}
          <Text
            position={[0, 0, 0.68]}
            fontSize={0.44}
            color="#ffffff"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.035}
            outlineColor="#090d16"
          >
            {value}
          </Text>

          {/* Back Face Laser Numeral */}
          <Text
            position={[0, 0, -0.68]}
            rotation={[0, Math.PI, 0]}
            fontSize={0.44}
            color="#ffffff"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.035}
            outlineColor="#090d16"
          >
            {value}
          </Text>

          {/* Right Face Laser Numeral */}
          <Text
            position={[0.68, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            fontSize={0.44}
            color="#ffffff"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.035}
            outlineColor="#090d16"
          >
            {value}
          </Text>

          {/* Left Face Laser Numeral */}
          <Text
            position={[-0.68, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            fontSize={0.44}
            color="#ffffff"
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.035}
            outlineColor="#090d16"
          >
            {value}
          </Text>
        </group>
      </animated.group>
    </animated.group>
  );
});

export default Box;