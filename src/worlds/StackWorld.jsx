import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Box from "../components/Box";
import Floor from "../components/Floor";
import Particles from "../components/Particles";
import DraggableBlock from "../components/DraggableBlock";

export default function StackWorld({
  stack,
  shake,
  pushBlock,
  powerMode,
}) {
  return (
    <Canvas
      camera={{
        position: [
          6,
          6 + stack.length * 0.12,
          8 + stack.length * 0.2,
        ],
        fov: 50,
      }}
      style={{
        background: powerMode
          ? "radial-gradient(circle, #082f49 0%, #020617 100%)"
          : "#0f172a",
        height: "100vh",
        transform: shake ? "translateX(6px)" : "translateX(0px)",
        transition: "transform 0.22s ease-out",
      }}
    >
      <ambientLight intensity={powerMode ? 0.9 : 0.45} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={powerMode ? 4 : 2.5}
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

      {stack.map((_, index) => (
        <Box
          key={index}
          position={[
            Math.sin(index * 0.3) * 0.08,
            index * 1.15 + 0.6,
            Math.cos(index * 0.3) * 0.08,
          ]}
        />
      ))}

      <Particles />
      <DraggableBlock pushBlock={pushBlock} />
      <Floor />
    </Canvas>
  );
}