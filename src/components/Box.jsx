import { animated, useSpring } from "@react-spring/three";

export default function Box({ position }) {
  const props = useSpring({
    from: {
      position: [position[0], position[1] + 4, position[2]],
      scale: [0.7, 0.7, 0.7],
      rotation: [0.4, 0.2, 0],
    },

    to: {
      position,
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
    },

    config: {
      mass: 1,
      tension: 240,
      friction: 14,
    },
  });

  return (
    <animated.mesh
      position={props.position}
      scale={props.scale}
      rotation={props.rotation}
    >
      <boxGeometry args={[1, 0.9, 1]} />
      <meshStandardMaterial
        color="#f97316"
        emissive="#ea580c"
        emissiveIntensity={2.2}
        metalness={0.35}
        roughness={0.25}
      />
    </animated.mesh>
  );
}