import { useEffect, useState } from "react";

export default function LinkedListPreview() {
  const modes = ["Singly", "Doubly", "Circular"];

  const [modeIndex, setModeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setModeIndex((prev) => (prev + 1) % modes.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const mode = modes[modeIndex];

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