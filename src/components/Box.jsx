import React from 'react';
import { animated } from '@react-spring/three';
import { Text } from '@react-three/drei';

const Box = React.memo(function Box({ style, value }) {
  return (
    <animated.mesh
      position={style.position}
      scale={style.scale}
      rotation={style.rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 0.9, 1]} />
      <animated.meshStandardMaterial
        color="#f97316"
        emissive="#ea580c"
        emissiveIntensity={2.2}
        metalness={0.35}
        roughness={0.25}
        transparent={true}
        opacity={style.opacity}
      />
      
      {/* Front face */}
      <Text
        position={[0, 0, 0.51]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
      
      {/* Back face */}
      <Text
        position={[0, 0, -0.51]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>

      {/* Right face */}
      <Text
        position={[0.51, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>

      {/* Left face */}
      <Text
        position={[-0.51, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </animated.mesh>
  );
});

export default Box;