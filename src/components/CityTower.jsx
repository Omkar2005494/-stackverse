import { animated, useSpring } from "@react-spring/three";

export default function CityTower({ position, height, color }) {
  const props = useSpring({
    from: {
      scale: [1, 0.2, 1],
      position: [position[0], 0, position[2]],
    },

    to: {
      scale: [1, 1, 1],
      position,
    },

    config: {
      mass: 1,
      tension: 180,
      friction: 16,
    },
  });

  return (
    <animated.mesh
      position={props.position}
      scale={props.scale}
    >
      <boxGeometry args={[1.4, height, 1.4]} />

      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.8}
        metalness={0.45}
        roughness={0.2}
      />
    </animated.mesh>
  );
}
