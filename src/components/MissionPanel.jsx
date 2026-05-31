

export default function MissionPanel({ mission, completed }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        right: 30,
        width: "320px",
        background: "rgba(15, 23, 42, 0.88)",
        border: completed
          ? "2px solid #22c55e"
          : "2px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "18px 22px",
        color: "white",
        boxShadow: completed
          ? "0 0 30px rgba(34,197,94,0.5)"
          : "0 0 25px rgba(56,189,248,0.18)",
        backdropFilter: "blur(12px)",
        zIndex: 20,
      }}
    >
      <div
        style={{
          fontSize: "14px",
          letterSpacing: "2px",
          color: "#38bdf8",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        ACTIVE MISSION
      </div>

      <div
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          marginBottom: "12px",
        }}
      >
        {mission}
      </div>

      <div
        style={{
          color: completed ? "#22c55e" : "#facc15",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        {completed ? "MISSION COMPLETE ✓" : "IN PROGRESS..."}
      </div>
    </div>
  );
}