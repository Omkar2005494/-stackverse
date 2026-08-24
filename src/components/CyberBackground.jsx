import React from 'react';

// Static deterministic particles to prevent DOM thrashing on re-renders
const STATIC_CYBER_PARTICLES = Array.from({ length: 25 }).map((_, i) => {
  const seedX = Math.sin(i * 19.123) * 43758.5453;
  const seedY = Math.sin(i * 37.456) * 43758.5453;
  const seedOp = Math.sin(i * 53.789) * 43758.5453;
  const seedDur = Math.sin(i * 71.012) * 43758.5453;

  return {
    left: `${Math.floor((seedX - Math.floor(seedX)) * 100)}%`,
    top: `${Math.floor((seedY - Math.floor(seedY)) * 100)}%`,
    opacity: (seedOp - Math.floor(seedOp)) * 0.4 + 0.1,
    duration: `${((seedDur - Math.floor(seedDur)) * 3 + 2).toFixed(1)}s`,
  };
});

function CyberBackground() {
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
      {STATIC_CYBER_PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "#22d3ee",
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            animation: `pulse ${p.duration} infinite alternate`,
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

export default React.memo(CyberBackground);
