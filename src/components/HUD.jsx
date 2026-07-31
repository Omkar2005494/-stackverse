export default function HUD({
  xp,
  level,
  combo,
  powerMode,
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        right: "40px",
        zIndex: 1000,
        color: "white",
        background: powerMode
          ? "rgba(8, 47, 73, 0.92)"
          : "rgba(15, 23, 42, 0.6)",
        border: powerMode
          ? "1px solid #22d3ee"
          : "1px solid rgba(255,255,255,0.1)",
        boxShadow: powerMode
          ? "0 0 35px rgba(34,211,238,0.4)"
          : "0 8px 32px rgba(0,0,0,0.3)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "12px 24px",
        borderRadius: "99px",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "all 0.3s ease",
        transform: powerMode ? "scale(1.05)" : "scale(1)",
        animation: powerMode
          ? "powerPulse 1s infinite alternate"
          : "none",
        pointerEvents: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ color: "#94a3b8" }}>LVL</span>
        <span style={{ fontSize: "16px" }}>{level}</span>
      </div>
      
      <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.2)" }} />

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ color: "#94a3b8" }}>XP</span>
        <span style={{ fontSize: "16px" }}>{xp}</span>
      </div>

      <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.2)" }} />

      <div
        style={{
          display: "flex", 
          alignItems: "center", 
          gap: "6px",
          color: powerMode ? "#22d3ee" : "white",
          textShadow: powerMode ? "0 0 10px rgba(34,211,238,0.8)" : "none",
        }}
      >
        <span style={{ color: powerMode ? "#22d3ee" : "#94a3b8" }}>COMBO</span>
        <span style={{ fontSize: "16px" }}>x{combo}</span>
      </div>
    </div>
  );
}
