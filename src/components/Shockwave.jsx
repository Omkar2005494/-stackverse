

export default function Shockwave({ show }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "58%",
        width: "120px",
        height: "120px",
        borderRadius: "999px",
        border: "4px solid rgba(56,189,248,0.9)",
        transform: "translate(-50%, -50%)",
        boxShadow: "0 0 40px rgba(56,189,248,0.8)",
        pointerEvents: "none",
        zIndex: 180,
        animation: "shockwave 0.8s ease-out forwards",
      }}
    />
  );
}