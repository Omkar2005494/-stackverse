export default function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0b1120" />
      </mesh>

      {Array.from({ length: 21 }).map((_, i) => (
        <group key={i}>
          <mesh
            position={[i - 10, 0.01, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.03, 20]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.8}
            />
          </mesh>

          <mesh
            position={[0, 0.01, i - 10]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          >
            <planeGeometry args={[0.03, 20]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}