import { animated, useSpring } from "@react-spring/three";

export default function NeonLane({ position }) {
  const props = useSpring({
    from: {
      scale: [0.6, 1, 1],
      opacity: 0.4,
    },

    to: async (next) => {
      while (true) {
        await next({
          scale: [1.2, 1, 1],
          opacity: 1,
        });

        await next({
          scale: [0.7, 1, 1],
          opacity: 0.45,
        });
      }
    },

    config: {
      duration: 900,
    },
  });

  return (
    <animated.mesh
      position={position}
      scale={props.scale}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[1.2, 0.08]} />

      <animated.meshStandardMaterial
        color="#22d3ee"
        emissive="#22d3ee"
        emissiveIntensity={2.5}
        transparent
        opacity={props.opacity}
      />
    </animated.mesh>
  );
}
