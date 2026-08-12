import { useMemo } from 'react';

export default function Particles() {
  const particles = useMemo(() => Array.from({ length: 80 }).map(() => [
    (Math.random() - 0.5) * 20,
    Math.random() * 10,
    (Math.random() - 0.5) * 20,
  ]), []);

  return (
    <>
      {particles.map((pos, i) => (
        <mesh
          key={i}
          position={pos}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </>
  );
}