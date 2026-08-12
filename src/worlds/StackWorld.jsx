import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useTransition } from "@react-spring/three";

import Box from "../components/Box";
import Floor from "../components/Floor";
import Particles from "../components/Particles";
import DraggableBlock from "../components/DraggableBlock";

const BLOCK_HEIGHT = 0.9;
const BASE_Y = BLOCK_HEIGHT / 2;

export default function StackWorld({
  stack,
  shake,
  pushBlock,
  powerMode,
}) {
  const transitions = useTransition(stack, {
    keys: (item, index) => index,
    from: (item, index) => ({
      position: [0, (index * BLOCK_HEIGHT + BASE_Y) + 4, 0],
      scale: [0.7, 0.7, 0.7],
      rotation: [0.4, 0.2, 0],
      opacity: 0,
    }),
    enter: (item, index) => ({
      position: [0, index * BLOCK_HEIGHT + BASE_Y, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      opacity: 1,
    }),
    leave: (item, index) => ({
      position: [0, (index * BLOCK_HEIGHT + BASE_Y) + 1.5, 0],
      scale: [1.1, 1.1, 1.1],
      rotation: [0, 0, 0],
      opacity: 0,
    }),
    config: {
      mass: 1,
      tension: 240,
      friction: 14,
    },
  });

  return (
    <Canvas
      shadows
      camera={{
        position: [
          8,
          8 + stack.length * 0.12,
          11 + stack.length * 0.2,
        ],
        fov: 50,
      }}
      style={{
        background: "transparent",
        width: "100%",
        borderRadius: "24px",
        boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        transform: shake ? "translateX(6px)" : "translateX(0px)",
        transition: "transform 0.22s ease-out",
      }}
    >
      <ambientLight intensity={powerMode ? 0.9 : 0.45} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={powerMode ? 4 : 2.5}
        castShadow
      />

      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2.2}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.7}
        autoRotate={stack.length >= 4}
        autoRotateSpeed={powerMode ? 2 : 0.8}
      />

      <fog
        attach="fog"
        args={[
          powerMode ? "#0ea5e9" : "#0f172a",
          8,
          20,
        ]}
      />

      {transitions((style, item, t) => (
        <Box
          key={t.key}
          style={style}
          value={item}
        />
      ))}

      <Particles />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={10} blur={2} far={4} color="#000000" />
      <DraggableBlock pushBlock={pushBlock} />
      <Floor />
    </Canvas>
  );
}