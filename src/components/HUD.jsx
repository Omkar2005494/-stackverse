export default function HUD({
  stack,
  xp,
  level,
  combo,
  xpProgress,
  powerMode,
}) {
  return (
    <div
      style={{
        color: "white",
        background: powerMode
          ? "rgba(8, 47, 73, 0.92)"
          : "rgba(15, 23, 42, 0.85)",
        border: powerMode
          ? "2px solid #22d3ee"
          : "2px solid rgba(255,255,255,0.08)",
        boxShadow: powerMode
          ? "0 0 35px rgba(34,211,238,0.65)"
          : "0 0 15px rgba(0,0,0,0.35)",
        backdropFilter: "blur(16px)",
        padding: "18px 22px",
        borderRadius: "20px",
        fontSize: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minWidth: "210px",
        transition: "all 0.3s ease",
        transform: powerMode ? "scale(1.03)" : "scale(1)",
        animation: powerMode
          ? "powerPulse 1s infinite alternate"
          : "none",
      }}
    >
      <div
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: powerMode ? "#22d3ee" : "#f97316",
          textShadow: powerMode
            ? "0 0 20px rgba(34,211,238,0.9)"
            : "none",
          letterSpacing: powerMode ? "3px" : "1px",
          transform: powerMode ? "scale(1.08)" : "scale(1)",
          transition: "all 0.3s ease",
        }}
      >
        STACKVERSE
      </div>

      <div>STACK: {stack.length} / 5</div>
      <div>XP: {xp}</div>
      <div>LEVEL: {level}</div>
      <div
        style={{
          color: powerMode ? "#22d3ee" : "white",
          fontWeight: powerMode ? "bold" : "normal",
          transform: powerMode
            ? "scale(1.12) rotate(-1deg)"
            : "scale(1)",
          transition: "all 0.25s ease",
          textShadow: powerMode
            ? "0 0 18px rgba(34,211,238,0.8)"
            : "none",
          animation: powerMode
            ? "comboPulse 0.6s infinite alternate"
            : "none",
        }}
      >
        COMBO: x{combo}
      </div>

      <div
        style={{
          marginTop: "10px",
          width: "100%",
          height: "12px",
          background: "rgba(255,255,255,0.08)",
          boxShadow: powerMode
            ? "0 0 18px rgba(34,211,238,0.5)"
            : "none",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${xpProgress}%`,
            height: "100%",
            background: powerMode
              ? "linear-gradient(90deg, #06b6d4, #22d3ee)"
              : "linear-gradient(90deg, #f97316, #fb923c)",
            boxShadow: powerMode
              ? "0 0 18px rgba(34,211,238,0.8)"
              : "none",
            transition: "all 0.3s ease",
            transform: powerMode ? "scaleY(1.25)" : "scaleY(1)",
          }}
        />
      </div>
    </div>
  );
}
