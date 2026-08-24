import React from 'react';

function Floor() {
  return (
    <group position={[0, 0, 0]}>
      {/* Matte Dark Cyber Void Ground (Zero Specular Glare/Reflection) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial
          color="#030712"
        />
      </mesh>

      {/* High-Performance Neon Grid */}
      <gridHelper
        args={[40, 40, "#f97316", "#0369a1"]}
        position={[0, 0.002, 0]}
      />

      {/* Central Launch Pedestal Outer Ring */}
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.35, 48]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.85}
          side={2}
        />
      </mesh>

      {/* Central Launch Pedestal Inner Core */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.18, 32]} />
        <meshBasicMaterial
          color="#0f172a"
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

export default React.memo(Floor);