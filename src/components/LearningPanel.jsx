import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, Activity, Database, Clock } from "lucide-react";

export default function LearningPanel({
  operation = "None",
  timeComplexity = "-",
  spaceComplexity = "-",
  actualOperations = 0,
  worldName = "stack",
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Hide in CodeStudio or Menu
  if (worldName === "codestudio" || worldName === "menu") {
    return null;
  }

  const getTimeColor = (complexity) => {
    if (!complexity || complexity === "-") return "#94a3b8";
    if (complexity.includes("O(1)")) return "#10b981"; // Emerald - Constant
    if (complexity.includes("log n") && !complexity.includes("n log") && !complexity.includes("+")) return "#38bdf8"; // Cyan - Logarithmic
    if (complexity.includes("O(n)") && !complexity.includes("log")) return "#f59e0b"; // Amber - Linear
    if (complexity.includes("O(n log n)")) return "#f97316"; // Orange - Linearithmic
    if (complexity.includes("V + E") || complexity.includes("V")) return "#a855f7"; // Purple - Graph
    return "#38bdf8";
  };

  const getComplexityExplanation = (op) => {
    const key = op?.toLowerCase() || "";
    if (key.includes("push")) return "Adds an element to the top of the stack in O(1) constant time.";
    if (key.includes("pop") && !key.includes("queue")) return "Removes top element from the stack in O(1) constant time.";
    if (key.includes("peek")) return "Directly inspects the active pointer (top/front) in O(1) without mutation.";
    if (key.includes("enqueue")) return "Inserts a new element at the rear of the FIFO pipeline in O(1) time.";
    if (key.includes("dequeue")) return "Removes and retrieves the front element in O(1) FIFO order.";
    if (key.includes("inorder")) return "Traverses left subtree, root, right subtree producing sorted order in O(n) time, O(h) space.";
    if (key.includes("preorder")) return "Visits root before recursive child traversals in O(n) time, O(h) space.";
    if (key.includes("postorder")) return "Visits children prior to root node (ideal for tree deletion) in O(n) time, O(h) space.";
    if (key.includes("bfs") || key.includes("breadth")) return "Layer-by-layer exploration using a queue in O(V + E) or O(n) time, O(w) space.";
    if (key.includes("dfs") || key.includes("depth")) return "Deep recursive exploration using call stack in O(V + E) or O(n) time, O(h) space.";
    if (key.includes("dijkstra") || key.includes("shortest")) return "Finds minimum distance path with priority queue in O((V + E) log V) time, O(V) space.";
    if (key.includes("extract root")) return "Removes root and heapifies down with sift-down in O(log n) time, O(1) space.";
    if (key.includes("heap sort")) return "Repeatedly extracts root into sorted array in O(n log n) time, O(1) in-place space.";
    if (key.includes("reverse")) return "Reverses all pointer arrows iteratively in O(n) time and O(1) auxiliary space.";
    if (key.includes("insert")) return "Navigates logarithmic tree/heap depth in O(log n) average time, O(1) space.";
    if (key.includes("delete")) return "Locates node and rebalances pointers in O(log n) or O(n) time.";
    if (key.includes("search")) return "Binary Search Tree decision traversal in O(log n) time, or O(n) linear search.";
    if (key.includes("clear")) return "Deallocates all active world nodes in O(n) or O(1) time.";
    return "Real-time algorithmic complexity analyzer tracking active 3D operations.";
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          zIndex: 800,
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.92) 100%)",
          border: "1px solid rgba(56, 189, 248, 0.4)",
          backdropFilter: "blur(16px)",
          color: "#f8fafc",
          padding: "10px 18px",
          borderRadius: "99px",
          fontSize: "13px",
          fontWeight: "700",
          cursor: "pointer",
          boxShadow: "0 0 24px rgba(56, 189, 248, 0.25), 0 10px 30px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "border-color 0.2s",
        }}
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "rgba(56, 189, 248, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zap size={13} color="#38bdf8" />
        </div>
        <span>Complexity</span>
        <div
          style={{
            padding: "2px 6px",
            borderRadius: "6px",
            background: "rgba(56, 189, 248, 0.15)",
            color: getTimeColor(timeComplexity),
            fontSize: "11px",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: "800",
          }}
        >
          {timeComplexity !== "-" ? timeComplexity : "LIVE"}
        </div>
      </motion.button>

      {/* Complexity Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            style={{
              position: "fixed",
              bottom: "84px",
              right: "32px",
              zIndex: 900,
              width: "350px",
              background: "linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(10, 15, 29, 0.98) 100%)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              borderRadius: "20px",
              padding: "20px",
              color: "#f8fafc",
              boxShadow: "0 0 40px rgba(56, 189, 248, 0.2), 0 20px 50px rgba(0,0,0,0.7)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              fontFamily: "'Inter', -apple-system, sans-serif",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "rgba(56, 189, 248, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Zap size={16} color="#38bdf8" />
                </div>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: "800", letterSpacing: "0.3px", color: "#f8fafc" }}>
                    COMPLEXITY ANALYZER
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "600" }}>
                    Real-Time Big-O Performance
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "none",
                  borderRadius: "6px",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Active Operation Hero Card */}
            <div
              style={{
                background: "rgba(30, 41, 59, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ fontSize: "10.5px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Active Operation
              </div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#ffffff", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "#38bdf8" }}>▶</span> {operation}
              </div>
              <div style={{ fontSize: "11.5px", color: "#94a3b8", lineHeight: "1.4", marginTop: "2px" }}>
                {getComplexityExplanation(operation)}
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {/* Time Complexity Card */}
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                  borderRadius: "12px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#94a3b8", fontSize: "11px", fontWeight: "700" }}>
                  <Clock size={12} color="#38bdf8" /> Time
                </div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: "900",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: getTimeColor(timeComplexity),
                    marginTop: "2px",
                  }}
                >
                  {timeComplexity}
                </div>
              </div>

              {/* Space Complexity Card */}
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: "12px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#94a3b8", fontSize: "11px", fontWeight: "700" }}>
                  <Database size={12} color="#a855f7" /> Space
                </div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: "900",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#a855f7",
                    marginTop: "2px",
                  }}
                >
                  {spaceComplexity}
                </div>
              </div>
            </div>

            {/* Executed Step Counter */}
            <div
              style={{
                background: "rgba(15, 23, 42, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "10px",
                padding: "10px 12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#94a3b8", fontWeight: "600" }}>
                <Activity size={13} color="#10b981" /> Atomic Steps Executed
              </div>
              <div style={{ fontSize: "14px", fontWeight: "900", fontFamily: "'JetBrains Mono', monospace", color: "#10b981" }}>
                {actualOperations} ops
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
