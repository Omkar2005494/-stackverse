import { useRef } from "react";
import { useDrag } from "@use-gesture/react";

export default function DraggableBlock({ pushBlock }) {
  const meshRef = useRef();

  const bind = useDrag(({ offset: [x, y], down, last }) => {
    const posX = x / 120;
    const posY = 1 - y / 120;

    if (meshRef.current) {
      meshRef.current.position.x = posX;
      meshRef.current.position.y = posY;

      meshRef.current.rotation.y += 0.03;
      meshRef.current.rotation.x += 0.01;

      meshRef.current.scale.set(
        down ? 1.12 : 1,
        down ? 1.12 : 1,
        down ? 1.12 : 1
      );
    }

    if (last) {
      const nearStack =
        Math.abs(posX) < 1 &&
        Math.abs(posY - 1) < 1;

      if (nearStack) {
        pushBlock();
      }

      if (meshRef.current) {
        meshRef.current.position.set(2, 1, 0);
        meshRef.current.rotation.set(0, 0, 0);
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      {...bind()}
      position={[2, 1, 0]}
    >
      <boxGeometry args={[1, 1, 1]} />

      <meshStandardMaterial
        color="#38bdf8"
        emissive="#0ea5e9"
        emissiveIntensity={1.5}
      />
    </mesh>
  );
}