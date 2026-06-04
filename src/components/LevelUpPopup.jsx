import React from "react";
import { getRank } from "../context/GameProgressContext";

export default function LevelUpPopup({
  isOpen,
  level,
}) {
  if (!isOpen) return null;

  const rank = getRank(level);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.75)",
        backdropFilter: "blur(12px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
    >
      <div
        style={{
          background: "rgba(15,23,42,0.95)",
          border: "1px solid rgba(34,211,238,0.4)",
          borderRadius: "24px",
          padding: "2.5rem",
          textAlign: "center",
          color: "white",
          boxShadow: "0 0 60px rgba(34,211,238,0.6)",
          animation: "levelUpAppear 0.4s ease",
          minWidth: "320px",
        }}
      >
        <h1
          style={{
            color: "#22d3ee",
            marginTop: 0,
            marginBottom: "12px",
          }}
        >
          ✨ LEVEL UP! ✨
        </h1>
        <h2 style={{ marginBottom: "8px" }}>
          LEVEL {level}
        </h2>

        <p
          style={{
            color: "#22d3ee",
            fontWeight: "bold",
            fontSize: "20px",
            marginTop: 0,
            marginBottom: "16px",
          }}
        >
          {rank}
        </p>

        <p style={{ opacity: 0.85, margin: 0 }}>
          Keep conquering the realms!
        </p>

        <p
          style={{
            marginTop: "12px",
            fontSize: "14px",
            opacity: 0.7,
          }}
        >
          New Rank Unlocked
        </p>
      </div>
    </div>
  );
}
