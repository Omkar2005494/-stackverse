export default function LevelPopup({ show }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(249,115,22,0.15)",
        border: "2px solid #f97316",
        padding: "30px 60px",
        borderRadius: "24px",
        color: "white",
        fontSize: "42px",
        fontWeight: "bold",
        boxShadow: "0 0 40px rgba(249,115,22,0.7)",
        backdropFilter: "blur(14px)",
        zIndex: 100,
      }}
    >
      LEVEL UP! 🚀
    </div>
  );
}