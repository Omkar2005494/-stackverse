import { useGameProgress } from "../context/GameProgressContext";

export default function ProfileModal({
  isOpen,
  onClose,
}) {
  const {
    xp,
    level,
    rank,
    achievements,
    stats,
    streakCount,
  } = useGameProgress();

  if (!isOpen) return null;

  const xpPercent = Math.min((xp / 2000) * 100, 100);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "480px",
          maxWidth: "92vw",
          maxHeight: "85vh",
          overflowY: "auto",
          background: "rgba(10, 15, 30, 0.7)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(34,211,238,0.2)",
          borderRadius: "32px",
          padding: "2.5rem",
          color: "white",
          position: "relative",
          boxShadow: "0 20px 80px rgba(0,0,0,0.8), inset 0 0 40px rgba(34,211,238,0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            fontSize: "28px",
            cursor: "pointer",
            padding: "4px",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => { e.target.style.color = "white"; e.target.style.transform = "scale(1.1)"; }}
          onMouseLeave={(e) => { e.target.style.color = "#94a3b8"; e.target.style.transform = "scale(1)"; }}
        >
          ×
        </button>

        <h1 
          style={{ 
            margin: "0 0 16px 0",
            background: "linear-gradient(to right, #ffffff 30%, #a5f3fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "36px",
            fontWeight: "300",
            letterSpacing: "4px",
            filter: "drop-shadow(0 0 15px rgba(34,211,238,0.3))",
            textAlign: "center"
          }}
        >
          👤 Adventurer
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ margin: 0, fontWeight: "400", fontSize: "18px", letterSpacing: "2px", color: "rgba(255,255,255,0.8)" }}>Level {level}</h2>
          <span
            style={{
              color: "#a5f3fc",
              fontWeight: "bold",
              fontSize: "18px",
              letterSpacing: "1px",
              textShadow: "0 0 10px rgba(165,243,252,0.5)"
            }}
          >
            {rank}
          </span>
        </div>

        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "12px",
            color: "#22d3ee",
            fontSize: "14px",
            letterSpacing: "1px"
          }}
        >
          ⭐ {xp} / 2000 XP
        </p>

        <div
          style={{
            width: "100%",
            height: "6px",
            background: "rgba(0,0,0,0.5)",
            borderRadius: "999px",
            overflow: "hidden",
            marginBottom: "24px",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              width: `${xpPercent}%`,
              height: "100%",
              background: "linear-gradient(90deg, #22d3ee, #6366f1)",
              borderRadius: "999px",
              boxShadow: "0 0 10px rgba(34,211,238,0.5)",
            }}
          />
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.02))",
            border: "1px solid rgba(249,115,22,0.2)",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "24px",
            width: "100%",
            boxSizing: "border-box",
            textAlign: "center",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)"
          }}
        >
          <p style={{ margin: 0, color: "#fed7aa", fontSize: "15px", letterSpacing: "1px" }}>
            🔥 Streak: <strong style={{ color: "#f97316" }}>{streakCount}</strong> day{streakCount === 1 ? "" : "s"}
          </p>
          <p
            style={{
              margin: "8px 0 0",
              color: "rgba(254, 215, 170, 0.7)",
              fontSize: "13px",
              letterSpacing: "1px"
            }}
          >
            🎁 Day 7 Reward: +100 XP
          </p>
        </div>

        <h3 style={{ margin: "0 0 16px 0", color: "#a5f3fc", fontWeight: "400", letterSpacing: "3px", textTransform: "uppercase", fontSize: "14px", width: "100%", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px" }}>🏆 Achievements</h3>

        {achievements.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginBottom: "24px" }}>
            {achievements.map((achievement) => (
              <div 
                key={achievement}
                style={{
                  background: "rgba(0,0,0,0.4)",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  color: "rgba(255,255,255,0.9)"
                }}
              >
                {achievement}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "24px" }}>No achievements unlocked yet.</p>
        )}

        <h3 style={{ margin: "0 0 16px 0", color: "#a5f3fc", fontWeight: "400", letterSpacing: "3px", textTransform: "uppercase", fontSize: "14px", width: "100%", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px" }}>📊 Statistics</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            width: "100%",
          }}
        >
          {[
            ["Nodes", stats.nodesAdded],
            ["BFS", stats.bfsRuns],
            ["Graph", stats.graphOperations],
            ["DFS", stats.dfsRuns],
            ["Trees", stats.treesBuilt],
            ["Heap", stats.heapOperations],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(34,211,238,0.15)",
                borderRadius: "16px",
                padding: "16px",
                textAlign: "center",
                boxShadow: "inset 0 2px 10px rgba(0,0,0,0.3)",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1px solid rgba(34,211,238,0.4)";
                e.currentTarget.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3), 0 0 10px rgba(34,211,238,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = "1px solid rgba(34,211,238,0.15)";
                e.currentTarget.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.3)";
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                {label}
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#22d3ee",
                  textShadow: "0 0 10px rgba(34,211,238,0.3)"
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}