import React from 'react';

export default function CyberBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle at center, #0f172a 0%, #020617 70%)",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          border: "4px solid rgba(34,211,238,0.12)",
          borderTop: "4px solid rgba(34,211,238,0.35)",
          borderRight: "4px solid transparent",
          boxShadow: "0 0 60px rgba(34,211,238,0.15)",
          animation: "spin 20s linear infinite",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          margin: "auto",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: "2px solid rgba(34,211,238,0.08)",
          borderBottom: "2px solid rgba(34,211,238,0.25)",
          borderLeft: "2px solid transparent",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          margin: "auto",
          animation: "spin 12s linear infinite reverse",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "rgba(34,211,238,0.03)",
          boxShadow: "0 0 60px rgba(34,211,238,0.08)",
          filter: "blur(20px)",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          margin: "auto",
        }}
      />
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "#22d3ee",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.1,
            animation: `pulse ${Math.random() * 3 + 2}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { opacity: 0.1; transform: scale(0.8); }
          100% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
