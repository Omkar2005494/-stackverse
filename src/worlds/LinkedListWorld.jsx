import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Line,
  QuadraticBezierLine,
  Stars,
} from "@react-three/drei";
import * as THREE from "three";
import OperationsPanel from "../components/OperationsPanel";
import { useLinkedListLogic } from "../hooks/useLinkedListLogic";

// --- 1. Emerald Bio-Crystalline Node ---
const NodeOrb = React.memo(function NodeOrb({
  position,
  value,
  index,
  isHead,
  isTail,
  isHighlighted,
}) {
  const groupRef = useRef();
  const crownRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(t * 2.5 + index * 0.7) * 0.08;
    }
    if (crownRef.current) {
      crownRef.current.rotation.z = t * 2;
    }
  });

  const mainColor = isHighlighted
    ? "#fde047"
    : isHead
    ? "#34d399"
    : isTail
    ? "#38bdf8"
    : "#10b981";

  const emissiveColor = isHighlighted
    ? "#eab308"
    : isHead
    ? "#059669"
    : isTail
    ? "#0284c7"
    : "#047857";

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {/* Head / Tail Crown Halo */}
      {(isHead || isTail) && (
        <group ref={crownRef}>
          <mesh rotation={[-Math.PI / 4, 0, 0]}>
            <ringGeometry args={[0.92, 1.06, 32]} />
            <meshBasicMaterial
              color={isHead ? "#6ee7b7" : "#7dd3fc"}
              transparent
              opacity={0.85}
              side={2}
            />
          </mesh>
        </group>
      )}

      {/* Floating Role Badge */}
      {(isHead || isTail) && (
        <group position={[0, 1.25, 0]}>
          <Text
            fontSize={0.25}
            color={isHead ? "#6ee7b7" : "#7dd3fc"}
            fontWeight="900"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#022c22"
          >
            {isHead && isTail ? "HEAD & TAIL" : isHead ? "HEAD [0]" : `TAIL [${index}]`}
          </Text>
        </group>
      )}

      {/* Emerald Crystal Core */}
      <mesh castShadow scale={isHighlighted ? 1.25 : 1}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial
          color={mainColor}
          emissive={emissiveColor}
          emissiveIntensity={isHighlighted ? 4.5 : 2}
          metalness={0.25}
          roughness={0.15}
        />
      </mesh>

      {/* Outer Wireframe Lattice */}
      <mesh scale={isHighlighted ? 1.26 : 1}>
        <sphereGeometry args={[0.64, 16, 16]} />
        <meshBasicMaterial
          color={isHighlighted ? "#ffffff" : isHead ? "#a7f3d0" : "#6ee7b7"}
          wireframe
          transparent
          opacity={isHighlighted ? 0.8 : 0.35}
        />
      </mesh>

      {/* Value Numeral */}
      <Text
        position={[0, 0, 0.74]}
        fontSize={0.46}
        color="#ffffff"
        fontWeight="900"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#022c22"
      >
        {String(value)}
      </Text>

      {/* Index Subscript */}
      <Text
        position={[0, -0.9, 0]}
        fontSize={0.22}
        color="#94a3b8"
        fontWeight="700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {`[${index}]`}
      </Text>
    </group>
  );
});

// --- 2. Holographic Pointer Beam ---
const PointerBeam = React.memo(function PointerBeam({
  start,
  end,
  isCircularReturn = false,
  color = "#34d399",
  offset = [0, 0, 0],
}) {
  const startVec = new THREE.Vector3(...start).add(new THREE.Vector3(...offset));
  const endVec = new THREE.Vector3(...end).add(new THREE.Vector3(...offset));

  if (isCircularReturn) {
    const midVec = new THREE.Vector3(
      (startVec.x + endVec.x) / 2,
      startVec.y - 1.8,
      startVec.z + 4.5
    );

    const arrowDir = new THREE.Vector3().subVectors(endVec, midVec).normalize();
    const arrowPos = endVec.clone().sub(arrowDir.clone().multiplyScalar(0.7));
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      arrowDir
    );

    return (
      <group>
        <QuadraticBezierLine
          start={startVec}
          end={endVec}
          mid={midVec}
          color={color}
          lineWidth={3.5}
          transparent
          opacity={0.8}
        />
        <mesh position={arrowPos} quaternion={quaternion}>
          <coneGeometry args={[0.16, 0.42, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
        </mesh>
      </group>
    );
  }

  const arrowDir = new THREE.Vector3().subVectors(endVec, startVec).normalize();
  const arrowPos = endVec.clone().sub(arrowDir.clone().multiplyScalar(0.7));
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    arrowDir
  );

  return (
    <group>
      <Line
        points={[startVec, endVec]}
        color={color}
        lineWidth={3.5}
        transparent
        opacity={0.8}
      />
      <mesh position={arrowPos} quaternion={quaternion}>
        <coneGeometry args={[0.16, 0.42, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
    </group>
  );
});

// --- 3. NULL Terminal Beacon ---
function NullTerminal({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.5, 0.2]} />
        <meshStandardMaterial
          color="#334155"
          emissive="#475569"
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.26}
        color="#94a3b8"
        fontWeight="900"
        anchorX="center"
        anchorY="middle"
      >
        NULL
      </Text>
    </group>
  );
}

// --- Main LinkedListWorld Component ---

export default function LinkedListWorld({
  addXP = () => {},
  setLearningStats = () => {},
}) {
  const {
    nodes,
    listType,
    setListType,
    highlightedIndex,
    message,
    setMessage,
    insertNode,
    insertHead,
    deleteNode,
    searchNode,
    traverseList,
    backwardTraverse,
    circularTraverse,
    reverseList,
    resetList,
  } = useLinkedListLogic(addXP, setLearningStats);

  // Auto-clear notification
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 2600);
    return () => clearTimeout(timer);
  }, [message, setMessage]);

  const SPACING = 2.8;
  const startX = -((nodes.length - 1) * SPACING) / 2;

  const getSecondaryActions = () => {
    const actions = [
      { label: "INSERT HEAD", onClick: insertHead },
      { label: "SEARCH", onClick: searchNode },
      { label: "DELETE", onClick: deleteNode, isDanger: true },
      { label: "TRAVERSE", onClick: traverseList },
      { label: "REVERSE", onClick: reverseList },
    ];
    if (listType === "doubly") {
      actions.push({ label: "BACKWARD", onClick: backwardTraverse });
    }
    if (listType === "circular") {
      actions.push({ label: "CIRCULAR LOOP", onClick: circularTraverse });
    }
    actions.push({ label: "RESET", onClick: resetList, isDanger: true });
    return actions;
  };

  const listTypeTabs = (
    <div
      style={{
        display: "flex",
        gap: "6px",
        marginBottom: "8px",
        background: "rgba(0,0,0,0.4)",
        padding: "4px",
        borderRadius: "14px",
      }}
    >
      {["singly", "doubly", "circular"].map((type) => (
        <button
          key={type}
          onClick={() => setListType(type)}
          style={{
            flex: 1,
            padding: "7px 0",
            borderRadius: "10px",
            border: "none",
            background: listType === type ? "#10b981" : "transparent",
            color: listType === type ? "#022c22" : "#94a3b8",
            fontWeight: "800",
            cursor: "pointer",
            fontSize: "12px",
            transition: "all 0.2s",
            textTransform: "uppercase",
          }}
        >
          {type}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className="world-container"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <OperationsPanel
        onInsert={(val) => insertNode(val)}
        insertLabel="INSERT TAIL"
        color="#10b981"
        secondaryActions={getSecondaryActions()}
        headerSlot={listTypeTabs}
      />

      {/* Info Card */}
      <div
        style={{
          position: "absolute",
          top: "90px",
          left: "20px",
          zIndex: 300,
          padding: "14px 18px",
          borderRadius: "16px",
          background: "rgba(15,23,42,0.85)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(16,185,129,0.3)",
          color: "white",
          fontSize: "12.5px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          boxShadow: "0 0 30px rgba(0,0,0,0.5)",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#34d399",
            fontSize: "14px",
            fontWeight: "800",
            letterSpacing: "0.5px",
            marginBottom: "2px",
          }}
        >
          🌿 LINKEDLIST FOREST
        </h3>
        <div>Nodes: <strong style={{ color: "#34d399" }}>{nodes.length}</strong></div>
        <div>Head: <strong style={{ color: "#6ee7b7" }}>{nodes.length > 0 ? nodes[0].value : "NULL"}</strong></div>
        <div>Tail: <strong style={{ color: "#7dd3fc" }}>{nodes.length > 0 ? nodes[nodes.length - 1].value : "NULL"}</strong></div>
        <div>Type: <strong style={{ color: "#fbbf24" }}>{listType.toUpperCase()}</strong></div>
      </div>

      {/* Action Notification Toast */}
      {message && (
        <div
          style={{
            position: "absolute",
            top: "35px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(16,185,129,0.45)",
            padding: "12px 24px",
            borderRadius: "16px",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "14px",
            zIndex: 400,
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 30px rgba(16,185,129,0.3)",
          }}
        >
          {message}
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
        performance={{ min: 0.8 }}
        camera={{ position: [0, 2, 14], fov: 50 }}
        style={{
          background: "transparent",
          height: "100%",
          width: "100%",
        }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[6, 12, 6]} intensity={3.5} color="#a7f3d0" />
        <directionalLight position={[-6, -8, -6]} intensity={1.5} color="#34d399" />
        <pointLight position={[0, 3, 5]} intensity={10} color="#10b981" />

        <Stars radius={70} depth={35} count={500} factor={3.5} saturation={1} fade speed={0.3} />

        <OrbitControls
          enablePan={true}
          minDistance={6}
          maxDistance={30}
          enableDamping
          dampingFactor={0.06}
        />

        {/* Pointer Beams */}
        {nodes.map((node, index) => {
          if (index === nodes.length - 1 && listType !== "circular") return null;

          const start = [startX + index * SPACING, 0, 0];
          let end;
          let isCircularReturn = false;

          if (index === nodes.length - 1 && listType === "circular") {
            end = [startX, 0, 0];
            isCircularReturn = true;
          } else {
            end = [startX + (index + 1) * SPACING, 0, 0];
          }

          return (
            <group key={`link-${node.id}`}>
              <PointerBeam
                start={start}
                end={end}
                isCircularReturn={isCircularReturn}
                color="#34d399"
                offset={listType === "doubly" ? [0, 0.22, 0] : [0, 0, 0]}
              />
              {listType === "doubly" && index !== nodes.length - 1 && (
                <PointerBeam
                  start={end}
                  end={start}
                  color="#f97316"
                  offset={[0, -0.22, 0]}
                />
              )}
            </group>
          );
        })}

        {/* NULL Terminal (Singly / Doubly) */}
        {nodes.length > 0 && listType !== "circular" && (
          <group key="null-terminal">
            <PointerBeam
              start={[startX + (nodes.length - 1) * SPACING, 0, 0]}
              end={[startX + nodes.length * SPACING - 0.5, 0, 0]}
              color="#64748b"
            />
            <NullTerminal position={[startX + nodes.length * SPACING - 0.2, 0, 0]} />
          </group>
        )}

        {/* Node Orbs */}
        {nodes.map((item, index) => (
          <NodeOrb
            key={item.id}
            value={item.value}
            index={index}
            position={[startX + index * SPACING, 0, 0]}
            isHead={index === 0}
            isTail={index === nodes.length - 1}
            isHighlighted={highlightedIndex === index}
          />
        ))}
      </Canvas>
    </div>
  );
}