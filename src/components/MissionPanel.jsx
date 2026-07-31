

export default function MissionPanel({ mission, completed }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: "auto",
        minWidth: "200px",
        background: "rgba(15, 23, 42, 0.75)",
        border: completed
          ? "1px solid rgba(34,197,94,0.5)"
          : "1px solid rgba(255,255,255,0.05)",
        borderRadius: "14px",
        padding: "12px 16px",
        color: "white",
        boxShadow: completed
          ? "0 4px 20px rgba(34,197,94,0.2)"
          : "0 4px 20px rgba(0,0,0,0.3)",
        backdropFilter: "blur(12px)",
        zIndex: 20,
      }}
    >
      <div
        style={{
          fontSize: "10px",
          letterSpacing: "1.5px",
          color: "#38bdf8",
          marginBottom: "4px",
          fontWeight: "800",
          textTransform: "uppercase",
        }}
      >
        ACTIVE MISSION
      </div>

      <div
        style={{
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "6px",
        }}
      >
        {mission}
      </div>

      <div
        style={{
          color: completed ? "#22c55e" : "#facc15",
          fontWeight: "700",
          fontSize: "11px",
          letterSpacing: "0.5px"
        }}
      >
        {completed ? "MISSION COMPLETE ✓" : "IN PROGRESS..."}
      </div>
    </div>
  );
}