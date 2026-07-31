import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Line, QuadraticBezierLine, ContactShadows } from "@react-three/drei";
import { animated, useTransition, useSpring } from "@react-spring/three";
import * as THREE from "three";
import OperationsPanel from "../components/OperationsPanel";
import { useLinkedListLogic } from "../hooks/useLinkedListLogic";

// --- Components ---

function NodeOrb({ position, value, isHighlighted, color = "#22d3ee" }) {
  // Spring animation for entering and highlighting
  const { scale, glowIntensity, orbColor } = useSpring({
    scale: isHighlighted ? [1.3, 1.3, 1.3] : [1, 1, 1],
    glowIntensity: isHighlighted ? 2.5 : 0.8,
    orbColor: isHighlighted ? "#a855f7" : color,
    config: { tension: 200, friction: 15 }
  });

  return (
    <animated.group position={position} scale={scale}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh castShadow>
          <sphereGeometry args={[0.7, 32, 32]} />
          <animated.meshPhysicalMaterial
            color={orbColor}
            emissive={orbColor}
            emissiveIntensity={glowIntensity}
            transparent
            opacity={0.9}
            roughness={0.1}
            metalness={0.3}
            clearcoat={1}
          />
        </mesh>
        
        {/* Inner Core */}
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <Text
          position={[0, 1.1, 0]}
          fontSize={0.65}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {value}
        </Text>
      </Float>
    </animated.group>
  );
}

function PointerBeam({ start, end, isCircularReturn = false, color = "#22d3ee", offset = [0,0,0] }) {
  const startVec = new THREE.Vector3(...start).add(new THREE.Vector3(...offset));
  const endVec = new THREE.Vector3(...end).add(new THREE.Vector3(...offset));
  
  if (isCircularReturn) {
    const midVec = new THREE.Vector3(
      (startVec.x + endVec.x) / 2,
      startVec.y - 1, // curve slightly down
      startVec.z + 4  // curve forward out of the screen
    );

    // Approximate direction at the end of the curve
    const arrowDir = new THREE.Vector3().subVectors(endVec, midVec).normalize();
    const arrowPos = endVec.clone().sub(arrowDir.clone().multiplyScalar(0.8));
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrowDir);

    return (
      <group>
        <QuadraticBezierLine
          start={startVec}
          end={endVec}
          mid={midVec}
          color={color}
          lineWidth={3}
          transparent
          opacity={0.6}
        />
        <mesh position={arrowPos} quaternion={quaternion}>
          <coneGeometry args={[0.15, 0.4, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    );
  }

  const arrowDir = new THREE.Vector3().subVectors(endVec, startVec).normalize();
  const arrowPos = endVec.clone().sub(arrowDir.clone().multiplyScalar(0.8));
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrowDir);

  return (
    <group>
      <Line
        points={[startVec, endVec]}
        color={color}
        lineWidth={3}
        dashed={false}
        transparent
        opacity={0.6}
      />
      <mesh position={arrowPos} quaternion={quaternion}>
        <coneGeometry args={[0.15, 0.4, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

// --- Main World ---

export default function LinkedListWorld({ addXP = () => {}, setLearningStats = () => {} }) {
  const {
    nodes,
    listType,
    setListType,
    highlightedIndex,
    message,
    setMessage,
    insertNode,
    deleteNode,
    searchNode,
    traverseList,
    backwardTraverse,
    circularTraverse,
    stopCircular,
    isCircularRunning,
    reverseList
  } = useLinkedListLogic(addXP, setLearningStats);

  // Auto-clear message
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message, setMessage]);

  const SPACING = 2.8;
  const startX = -((nodes.length - 1) * SPACING) / 2;

  // useTransition for nodes so they animate in/out smoothly
  const transitions = useTransition(nodes, {
    keys: (item) => item.id,
    from: { position: [0, 10, 0], scale: [0, 0, 0], opacity: 0 },
    enter: (item, index) => ({
      position: [startX + index * SPACING, 0, 0],
      scale: [1, 1, 1],
      opacity: 1
    }),
    update: (item, index) => ({
      position: [startX + index * SPACING, 0, 0],
      scale: [1, 1, 1],
      opacity: 1
    }),
    leave: { position: [0, -10, 0], scale: [0, 0, 0], opacity: 0 },
    config: { tension: 180, friction: 14 }
  });

  const getSecondaryActions = () => {
    const actions = [
      { label: "Search", onClick: searchNode },
      { label: "Delete", onClick: deleteNode, isDanger: true },
      { label: "Traverse", onClick: traverseList },
      { label: "Reverse", onClick: reverseList },
    ];
    if (listType === "doubly") {
      actions.push({ label: "Backward", onClick: backwardTraverse });
    }
    if (listType === "circular") {
      actions.push({ label: "Circular", onClick: circularTraverse });
      if (isCircularRunning) {
        actions.push({ label: "Stop", onClick: stopCircular, isDanger: true });
      }
    }
    return actions;
  };

  const listTypeTabs = (
    <div style={{ display: "flex", gap: "6px", marginBottom: "8px", background: "rgba(0,0,0,0.3)", padding: "4px", borderRadius: "14px" }}>
      {["singly", "doubly", "circular"].map((type) => (
        <button
          key={type}
          onClick={() => setListType(type)}
          style={{
            flex: 1,
            padding: "6px 0",
            borderRadius: "10px",
            border: "none",
            background: listType === type ? "#22d3ee" : "transparent",
            color: listType === type ? "#0f172a" : "white",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "12px",
            transition: "all 0.2s"
          }}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="world-container" style={{ position: "relative", width: "100%", height: "100%" }}>
      <OperationsPanel
        onInsert={(val) => insertNode(val)}
        insertLabel="INSERT"
        color="#22d3ee"
        secondaryActions={getSecondaryActions()}
        headerSlot={listTypeTabs}
      />
      <div
        style={{
          position: "absolute",
          top: "90px",
          left: "20px",
          zIndex: 300,
          padding: "12px 16px",
          borderRadius: "12px",
          background: "rgba(15,23,42,0.82)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(34,211,238,0.25)",
          color: "white",
          fontSize: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}
      >
        <h3 style={{ margin: 0, color: "#22d3ee", fontSize: "14px", marginBottom: "4px" }}>
          LINKED LIST FOREST
        </h3>
        <div style={{ margin: 0 }}>Nodes: {nodes.length}</div>
        <div style={{ margin: 0 }}>Head: {nodes.length > 0 ? nodes[0].value : "None"}</div>
        <div style={{ margin: 0 }}>Tail: {nodes.length > 0 ? nodes[nodes.length - 1].value : "None"}</div>
        <div style={{ margin: 0 }}>Type: {listType.charAt(0).toUpperCase() + listType.slice(1)}</div>
      </div>

      {message && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15,23,42,0.8)",
            border: "1px solid rgba(34,211,238,0.4)",
            padding: "12px 24px",
            borderRadius: "16px",
            color: "white",
            fontWeight: "bold",
            zIndex: 100,
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 20px rgba(34,211,238,0.2)",
          }}
        >
          {message}
        </div>
      )}

      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 50 }}
        style={{
          background: "transparent",
          height: "100%",
          width: "100%",
          borderRadius: "24px",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={3} castShadow />
        <fog attach="fog" args={["#020617", 10, 30]} />

        <OrbitControls enablePan={false} minDistance={5} maxDistance={25} enableDamping dampingFactor={0.05} />

        {/* Render Links */}
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
                offset={listType === "doubly" ? [0, 0.25, 0] : [0, 0, 0]}
              />
              {listType === "doubly" && index !== nodes.length - 1 && (
                <PointerBeam 
                  start={end} 
                  end={start}
                  offset={[0, -0.25, 0]}
                  color="#f97316"
                />
              )}
            </group>
          );
        })}

        {/* Render Nodes */}
        {transitions((style, item, t, index) => (
          <NodeOrb
            key={item.id}
            value={item.value}
            position={style.position}
            isHighlighted={highlightedIndex === index}
            color={index === 0 ? "#10b981" : index === nodes.length - 1 ? "#f97316" : "#22d3ee"} // Head is green, Tail is orange
          />
        ))}

        {/* Environment Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#020617" roughness={0.8} metalness={0.2} />
        </mesh>
        
        {/* Glow / Reflection under nodes */}
        <ContactShadows position={[0, -1.9, 0]} opacity={0.4} scale={50} blur={2} far={4} />

      </Canvas>
    </div>
  );
}