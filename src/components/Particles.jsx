import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const PARTICLE_COUNT = 80;

// Deterministic seed-based particle generator for pure render
function createParticlePositions(count) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Simple deterministic pseudo-random distribution
    const seedX = Math.sin(i * 12.9898) * 43758.5453;
    const seedY = Math.sin(i * 78.233) * 43758.5453;
    const seedZ = Math.sin(i * 45.164) * 43758.5453;

    pos[i * 3] = ((seedX - Math.floor(seedX)) - 0.5) * 20;
    pos[i * 3 + 1] = (seedY - Math.floor(seedY)) * 12;
    pos[i * 3 + 2] = ((seedZ - Math.floor(seedZ)) - 0.5) * 20;
  }
  return pos;
}

const STATIC_POSITIONS = createParticlePositions(PARTICLE_COUNT);

export default function Particles({ count = PARTICLE_COUNT }) {
  const pointsRef = useRef();

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position;
    const array = posAttr.array;

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += delta * 0.4;
      if (array[i * 3 + 1] > 12) {
        array[i * 3 + 1] = 0;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STATIC_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#38bdf8"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}