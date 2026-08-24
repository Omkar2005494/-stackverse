import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Grid, Float } from "@react-three/drei";

// Single 3D Matrix Cell / Cube
const MatrixCell = React.memo(function MatrixCell({
  value,
  row,
  col,
  totalRows,
  totalCols,
  isVisited = false,
  isActive = false,
  isSwapping = false,
  isComparing = false,
}) {
  const meshRef = useRef();

  // Position calculation centered around origin
  const posX = (col - (totalCols - 1) / 2) * 1.5;
  const posZ = (row - (totalRows - 1) / 2) * 1.5;
  const height = isVisited || isActive ? 1.0 : 0.6;

  useFrame((state) => {
    if (meshRef.current && (isActive || isSwapping)) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = height / 2 + Math.sin(t * 6) * 0.2 + 0.15;
    }
  });

  const mainColor = isActive
    ? "#38bdf8"
    : isSwapping
    ? "#f97316"
    : isComparing
    ? "#fde047"
    : isVisited
    ? "#10b981"
    : "#1e293b";

  const emissiveColor = isActive
    ? "#0284c7"
    : isSwapping
    ? "#ea580c"
    : isComparing
    ? "#ca8a04"
    : isVisited
    ? "#059669"
    : "#0f172a";

  return (
    <group position={[posX, 0, posZ]}>
      {/* 3D Cell Block */}
      <group ref={meshRef} position={[0, height / 2, 0]}>
        <RoundedBox args={[1.2, height, 1.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={mainColor}
            emissive={emissiveColor}
            emissiveIntensity={isActive ? 3.0 : isVisited ? 2.0 : 0.6}
            metalness={0.4}
            roughness={0.2}
            transparent
            opacity={0.92}
          />
        </RoundedBox>

        {/* Wireframe Border Lattice */}
        <mesh scale={[1.02, 1.02, 1.02]}>
          <boxGeometry args={[1.22, height, 1.22]} />
          <meshBasicMaterial
            color={isActive ? "#a5f3fc" : isVisited ? "#6ee7b7" : "#475569"}
            wireframe
            transparent
            opacity={isActive ? 0.8 : 0.3}
          />
        </mesh>

        {/* Floating Value Text */}
        <Text
          position={[0, height / 2 + 0.35, 0]}
          fontSize={0.45}
          color={isActive ? "#ffffff" : isVisited ? "#a7f3d0" : "#cbd5e1"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#020617"
        >
          {String(value !== undefined ? value : "")}
        </Text>
      </group>

      {/* Coordinate Label: [row, col] on Grid Floor */}
      <Text
        position={[0, 0.05, 0.7]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.22}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        {`[${row},${col}]`}
      </Text>

      {/* Glowing Neon Beacon Pillar when Active */}
      {isActive && (
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 4, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
});

export default function Matrix3DWorld({
  matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ],
  activeCell = null,
  visitedCells = [],
  comparingCells = [],
  swappingCells = [],
}) {
  const rows = Array.isArray(matrix) && matrix.length > 0 ? matrix.length : 3;
  const cols = Array.isArray(matrix) && Array.isArray(matrix[0]) ? matrix[0].length : 3;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 8, 7], fov: 45 }}
        style={{ width: "100%", height: "100%", background: "#020617" }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 12, 5]} intensity={2.0} castShadow />
        <pointLight position={[-5, 8, -5]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[5, 8, 5]} intensity={1.5} color="#a855f7" />

        {/* Isometric Orbit Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={4}
          maxDistance={18}
        />

        {/* 3D Grid Plane */}
        <Grid
          position={[0, -0.01, 0]}
          args={[14, 14]}
          cellSize={1.5}
          cellThickness={1}
          cellColor="#1e293b"
          sectionSize={4.5}
          sectionThickness={1.5}
          sectionColor="#334155"
          fadeDistance={25}
          fadeStrength={1.5}
        />

        {/* Render 2D Matrix Grid of Cells */}
        <group position={[0, 0, 0]}>
          {Array.isArray(matrix) &&
            matrix.map((rowArr, r) =>
              Array.isArray(rowArr)
                ? rowArr.map((val, c) => {
                    const isAct = Boolean(activeCell && activeCell[0] === r && activeCell[1] === c);
                    const isVis = visitedCells.some(([vr, vc]) => vr === r && vc === c);
                    const isComp = comparingCells.some(([cr, cc]) => cr === r && cc === c);
                    const isSwap = swappingCells.some(([sr, sc]) => sr === r && sc === c);

                    return (
                      <MatrixCell
                        key={`${r}-${c}`}
                        value={val}
                        row={r}
                        col={c}
                        totalRows={rows}
                        totalCols={cols}
                        isActive={isAct}
                        isVisited={isVis}
                        isComparing={isComp}
                        isSwapping={isSwap}
                      />
                    );
                  })
                : null
            )}
        </group>
      </Canvas>

      {/* Dimensional HUD Indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          background: "rgba(10, 16, 30, 0.8)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(56, 189, 248, 0.2)",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "11px",
          color: "#94a3b8",
          fontFamily: "'JetBrains Mono', monospace",
          pointerEvents: "none",
        }}
      >
        Grid Dimensions: <span style={{ color: "#38bdf8", fontWeight: "700" }}>{rows} × {cols}</span> •{" "}
        Visited: <span style={{ color: "#10b981", fontWeight: "700" }}>{visitedCells.length} / {rows * cols}</span>
      </div>
    </div>
  );
}
