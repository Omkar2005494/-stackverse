

export default function FloatingXP({ show, amount }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "38%",
        transform: "translateX(-50%)",
        color: "#22c55e",
        fontSize: "38px",
        fontWeight: "bold",
        textShadow: "0 0 20px rgba(34,197,94,0.8)",
        pointerEvents: "none",
        zIndex: 250,
        animation: "floatUp 1s ease-out forwards",
      }}
    >
      +{amount} XP
    </div>
  );
}