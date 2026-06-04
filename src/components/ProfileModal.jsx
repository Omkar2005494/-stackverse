import React from "react";
import { useGameProgress } from "../context/GameProgressContext";

export default function ProfileModal({
  isOpen,
  onClose,
}) {
  if (!isOpen) return null;

  const {
    xp,
    level,
    rank,
    achievements,
    stats,
    streakCount,
  } = useGameProgress();

  const xpPercent = Math.min((xp / 2000) * 100, 100);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "460px",
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflowY: "auto",
          background: "rgba(15,23,42,0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(34,211,238,0.3)",
          borderRadius: "24px",
          padding: "2rem",
          color: "white",
        }}
      >
        <h1 style={{ color: "#22d3ee", marginTop: 0 }}>
          👤 Adventurer
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <h2 style={{ margin: 0 }}>Level {level}</h2>

          <span
            style={{
              color: "#22d3ee",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            {rank}
          </span>
        </div>

        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#22d3ee",
          }}
        >
          ⭐ {xp} / 2000 XP
        </p>

        <div
          style={{
            width: "100%",
            height: "12px",
            background: "#1e293b",
            borderRadius: "999px",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: `${xpPercent}%`,
              height: "100%",
              background: "#22d3ee",
            }}
          />
        </div>

        <div
          style={{
            background: "rgba(249,115,22,0.08)",
            border: "1px solid rgba(249,115,22,0.25)",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "18px",
          }}
        >
          <p style={{ margin: 0 }}>
            🔥 Streak: <strong>{streakCount}</strong> day{streakCount === 1 ? "" : "s"}
          </p>

          <p
            style={{
              margin: "6px 0 0",
              opacity: 0.8,
              fontSize: "14px",
            }}
          >
            🎁 Day 7 Reward: +100 XP
          </p>
        </div>

        <h3>🏆 Achievements</h3>

        {achievements.length ? (
          <ul>
            {achievements.map((achievement) => (
              <li key={achievement}>{achievement}</li>
            ))}
          </ul>
        ) : (
          <p>No achievements unlocked yet.</p>
        )}

        <h3>📊 Statistics</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginTop: "12px",
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
                background: "rgba(34,211,238,0.08)",
                border: "1px solid rgba(34,211,238,0.18)",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  opacity: 0.8,
                  marginBottom: "6px",
                }}
              >
                {label}
              </div>

              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#22d3ee",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "#22d3ee",
            color: "#020617",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}