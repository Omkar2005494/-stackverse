import { useEffect, useState } from "react";

const MODES = ["Singly", "Doubly", "Circular"];

export default function LinkedListPreview() {
  const [modeIndex, setModeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setModeIndex((prev) => (prev + 1) % MODES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const mode = MODES[modeIndex];

  return (
    <div
      style={{
        marginTop: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          marginTop: "20px",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#22d3ee",
        }}
      >
        {mode === "Singly" && (
          <>10 → 20 → 30 → 40</>
        )}

        {mode === "Doubly" && (
          <>10 ⇄ 20 ⇄ 30 ⇄ 40</>
        )}

        {mode === "Circular" && (
          <>10 → 20 → 30 → 40 ↺</>
        )}
      </div>

      <div
        style={{
          marginTop: "15px",
          color: "#94a3b8",
        }}
      >
        Mode: {mode}
      </div>
    </div>
  );
}