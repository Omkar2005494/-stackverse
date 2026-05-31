export default function ComboPopup({ combo }) {
  if (combo < 3) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "18%",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "18px 40px",
        borderRadius: "20px",
        background: "rgba(249,115,22,0.12)",
        border: "2px solid #f97316",
        color: "white",
        fontSize: "32px",
        fontWeight: "bold",
        boxShadow: "0 0 30px rgba(249,115,22,0.5)",
        backdropFilter: "blur(12px)",
        zIndex: 200,
        animation: "pulse 0.5s infinite alternate",
        letterSpacing: "2px",
      }}
    >
      COMBO x{combo} 🔥
    </div>
  );
}