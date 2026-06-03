

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
    achievements,
    stats,
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
          width: "500px",
          maxWidth: "90vw",
          background: "rgba(15,23,42,0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(34,211,238,0.3)",
          borderRadius: "24px",
          padding: "2rem",
          color: "white",
        }}
      >
        <h1 style={{ color: "#22d3ee", marginTop: 0 }}>
          👤 Adventurer Profile
        </h1>

        <h2>Level {level}</h2>

        <p>XP: {xp} / 2000</p>

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

        <p>Nodes Added: {stats.nodesAdded}</p>
        <p>Graph Operations: {stats.graphOperations}</p>
        <p>Trees Built: {stats.treesBuilt}</p>
        <p>BFS Runs: {stats.bfsRuns}</p>
        <p>DFS Runs: {stats.dfsRuns}</p>
        <p>Heap Operations: {stats.heapOperations}</p>

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