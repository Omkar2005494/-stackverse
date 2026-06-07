import React, { useEffect, useState } from "react";

export default function LinkedListWorld({ addXP = () => {} }) {
  const [nodes, setNodes] = useState([10, 20, 30]);
  const [input, setInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [operationCount, setOperationCount] = useState(0);
  const [traversalCount, setTraversalCount] = useState(0);
  const [message, setMessage] = useState("");
  const [listType, setListType] = useState("singly");
  const [isCircularRunning, setIsCircularRunning] = useState(false);

  const missionTarget = 5;
  const missionProgress = Math.min(operationCount, missionTarget);
  const missionComplete = operationCount >= missionTarget;

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const insertNode = () => {
    if (!input.trim()) return;

    setNodes((prev) => [...prev, Number(input)]);
    addXP(10);
    setOperationCount((prev) => prev + 1);
    setMessage(`➕ Inserted ${input} | +10 XP`);
    setInput("");
  };

  const deleteNode = () => {
    if (!input.trim()) return;

    setNodes((prev) =>
      prev.filter((node) => node !== Number(input))
    );

    addXP(10);
    setOperationCount((prev) => prev + 1);
    setMessage(`🗑️ Deleted ${input} | +10 XP`);
    setInput("");
  };

  const searchNode = async () => {
    if (!input.trim()) return;

    const target = Number(input);

    for (let i = 0; i < nodes.length; i++) {
      setHighlightedIndex(i);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      if (nodes[i] === target) {
        addXP(5);
        setOperationCount((prev) => prev + 1);

        setTimeout(() => {
          setHighlightedIndex(null);
        }, 300);

        setMessage(`🎯 Found ${target} | +5 XP`);
        return;
      }
    }

    setHighlightedIndex(null);
    addXP(5);
    setOperationCount((prev) => prev + 1);
    setMessage(`❌ ${target} not found`);
  };

  const traverseList = async () => {
    for (let i = 0; i < nodes.length; i++) {
      setHighlightedIndex(i);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    }

    setHighlightedIndex(null);
    setTraversalCount((prev) => prev + 1);
    setOperationCount((prev) => prev + 1);
    addXP(15);
    setMessage("🌲 Traversal Complete | +15 XP");
  };

  const backwardTraverse = async () => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      setHighlightedIndex(i);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    }

    setHighlightedIndex(null);
    setTraversalCount((prev) => prev + 1);
    setOperationCount((prev) => prev + 1);
    addXP(20);

    setMessage(
      "🔄 Backward Traversal Complete | +20 XP"
    );
  };

  const circularTraverse = async () => {
    if (isCircularRunning || nodes.length === 0) return;

    setIsCircularRunning(true);

    for (let loop = 0; loop < 2 && isCircularRunning !== false; loop++) {
      for (let i = 0; i < nodes.length; i++) {
        setHighlightedIndex(i);

        await new Promise((resolve) =>
          setTimeout(resolve, 500)
        );
      }
    }

    setHighlightedIndex(null);
    setTraversalCount((prev) => prev + 1);
    setOperationCount((prev) => prev + 1);
    addXP(25);
    setMessage("🔄 Circular Traversal Complete | +25 XP");
    setIsCircularRunning(false);
  };

  const stopCircularTraverse = () => {
    setIsCircularRunning(false);
    setHighlightedIndex(null);
    setMessage("⏹️ Circular Traversal Stopped");
  };

  const reverseList = () => {
    setNodes((prev) => [...prev].reverse());
    setOperationCount((prev) => prev + 1);
    addXP(20);
    setMessage("🔄 List Reversed | +20 XP");
  };

  return (
    <div className="world-container">
      <div
        style={{
          background: "rgba(15,23,42,0.7)",
          border: "1px solid rgba(34,211,238,0.3)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
          textAlign: "center",
          color: "#e2e8f0",
          boxShadow: "0 0 20px rgba(34,211,238,0.15)",
        }}
      >
        <h2 style={{ margin: 0, color: "#22d3ee" }}>
          🌲 LINKED LIST FOREST
        </h2>
        <p style={{ marginTop: "8px" }}>
          {listType === "singly"
            ? "Learn singly linked lists."
            : listType === "doubly"
            ? "Explore bidirectional traversal."
            : "Master circular linked list structures."}
        </p>
      </div>

      <div
        style={{
          position: "fixed",
          left: "20px",
          top: "160px",
          zIndex: 50,
          background: "rgba(15,23,42,0.8)",
          border: "1px solid rgba(34,211,238,0.3)",
          borderRadius: "16px",
          padding: "16px",
          minWidth: "180px",
          color: "#e2e8f0",
          maxWidth: "200px",
          boxShadow: "0 0 20px rgba(34,211,238,0.15)",
        }}
      >
        <h3 style={{ color: "#22d3ee", marginTop: 0 }}>
          🌲 Forest Stats
        </h3>
        <p>Nodes: {nodes.length}</p>
        <p>Operations: {operationCount}</p>
        <p>Traversals: {traversalCount}</p>
        <p>
          Mode: {listType.charAt(0).toUpperCase() + listType.slice(1)}
        </p>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(34,211,238,0.2)",
            margin: "12px 0",
          }}
        />

        <div>
          <p style={{ color: "#22d3ee", fontWeight: "bold" }}>
            🎯 Current Mission
          </p>

          <p>
            {listType === "circular"
              ? "Complete Circular Traversal"
              : "Perform 5 Operations"}
          </p>

          <p>
            Progress: {missionProgress} / {missionTarget}
          </p>

          <div
            style={{
              height: "8px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: `${(missionProgress / missionTarget) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg,#22d3ee,#22c55e)",
              }}
            />
          </div>

          <p>
            Reward: +50 XP
          </p>

          {missionComplete && (
            <p style={{ color: "#22c55e", fontWeight: "bold" }}>
              ✅ Mission Complete
            </p>
          )}
        </div>
      </div>

      {message && (
        <div
          style={{
            textAlign: "center",
            color: "#22d3ee",
            fontWeight: "bold",
            marginBottom: "12px",
            fontSize: "18px",
            textShadow: "0 0 12px rgba(34,211,238,0.8)",
          }}
        >
          {message}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {["singly", "doubly", "circular"].map((type) => (
          <button
            key={type}
            onClick={() => setListType(type)}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              background:
                listType === type
                  ? "#22d3ee"
                  : "rgba(255,255,255,0.1)",
              color:
                listType === type
                  ? "#0f172a"
                  : "white",
              boxShadow:
                listType === type
                  ? "0 0 15px rgba(34,211,238,0.6)"
                  : "none",
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "12px",
          padding: "16px",
          background: "rgba(15,23,42,0.85)",
          border: "1px solid rgba(34,211,238,0.25)",
          borderRadius: "18px",
          boxShadow: "0 0 25px rgba(34,211,238,0.15)",
          flexWrap: "wrap",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <input
          type="number"
          placeholder="Enter value"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              insertNode();
            }
          }}
          style={{
            width: "180px",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #22d3ee",
            background: "#0f172a",
            color: "white",
          }}
        />

        <button
          onClick={insertNode}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg,#22d3ee,#2563eb)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 12px rgba(34,211,238,0.4)",
          }}
        >
          Insert
        </button>
        <button
          onClick={deleteNode}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg,#22d3ee,#2563eb)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 12px rgba(34,211,238,0.4)",
          }}
        >
          Delete
        </button>
        <button
          onClick={searchNode}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg,#22d3ee,#2563eb)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 12px rgba(34,211,238,0.4)",
          }}
        >
          Search
        </button>
        <button
          onClick={traverseList}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg,#22d3ee,#2563eb)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 12px rgba(34,211,238,0.4)",
          }}
        >
          Traverse
        </button>
        {listType === "doubly" && (
          <button
            onClick={backwardTraverse}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "none",
              background:
                "linear-gradient(135deg,#22d3ee,#2563eb)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow:
                "0 0 12px rgba(34,211,238,0.4)",
            }}
          >
            Backward
          </button>
        )}
        {listType === "circular" && (
          <>
            <button
              onClick={circularTraverse}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg,#22d3ee,#2563eb)",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 12px rgba(34,211,238,0.4)",
              }}
            >
              Circular Traverse
            </button>

            <button
              onClick={stopCircularTraverse}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg,#ef4444,#dc2626)",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Stop
            </button>
          </>
        )}
        <button
          onClick={reverseList}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg,#22d3ee,#2563eb)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 12px rgba(34,211,238,0.4)",
          }}
        >
          Reverse
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginTop: "60px",
          paddingBottom: "140px",
        }}
      >
        {nodes.map((node, index) => (
          <React.Fragment key={`${node}-${index}`}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background:
                  highlightedIndex === index
                    ? "#22c55e"
                    : "#22d3ee",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "24px",
                boxShadow:
                  highlightedIndex === index
                    ? "0 0 25px rgba(34,197,94,0.9)"
                    : "0 0 20px rgba(34,211,238,0.7)",
              }}
            >
              {node}
            </div>

            {index < nodes.length - 1 && (
              listType === "doubly" ? (
                <div
                  style={{
                    color: "#22d3ee",
                    fontSize: "42px",
                    fontWeight: "bold",
                    textShadow: "0 0 12px rgba(34,211,238,0.8)",
                  }}
                >
                  ⇄
                </div>
              ) : (
                <div
                  style={{
                    width: "80px",
                    height: "6px",
                    borderRadius: "999px",
                    background:
                      "linear-gradient(90deg, #22d3ee, #38bdf8)",
                    boxShadow:
                      "0 0 12px rgba(34,211,238,0.8)",
                  }}
                />
              )
            )}
          </React.Fragment>
        ))}
        {listType === "circular" && nodes.length > 1 && (
          <div
            style={{
              marginTop: "20px",
              color: "#22d3ee",
              fontWeight: "bold",
              textShadow: "0 0 12px rgba(34,211,238,0.8)",
            }}
          >
            ↺ Last node links back to first node
          </div>
        )}
      </div>
    </div>
  );
}