import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LearningPanel({
  operation,
  timeComplexity,
  spaceComplexity,
  actualOperations,
  worldName
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          zIndex: 900,
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          color: "white",
          padding: "12px 24px",
          borderRadius: "99px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => { e.target.style.background = "rgba(15, 23, 42, 0.9)"; }}
        onMouseLeave={(e) => { e.target.style.background = "rgba(15, 23, 42, 0.7)"; }}
      >
        <span style={{ fontSize: "18px" }}>⚡</span> Complexity
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "absolute",
              top: "50%",
              right: "40px",
              transform: "translateY(-50%)",
              zIndex: 1000,
              width: "320px",
              background: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "24px",
              color: "white",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>⚡</span> Complexity Analyzer
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "4px",
                }}
              >
                ✕
              </button>
            </div>

            {operation ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3b8" }}>Operation:</span>
                  <span>{operation}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3b8" }}>Time:</span>
                  <span style={{ color: "#22d3ee", fontWeight: "bold", fontSize: "16px" }}>{timeComplexity}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3b8" }}>Space:</span>
                  <span style={{ color: "#22d3ee", fontWeight: "bold", fontSize: "16px" }}>{spaceComplexity}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3b8" }}>Actual Steps:</span>
                  <span>{actualOperations}</span>
                </div>
              </div>
            ) : (
              <div style={{ color: "#94a3b8", textAlign: "center", fontStyle: "italic", padding: "20px 0" }}>
                Perform an operation to view its complexity.
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
