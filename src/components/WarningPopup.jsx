export default function WarningPopup({ warning }) {
  if (!warning) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "18%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(239,68,68,0.15)",
        border: "2px solid #ef4444",
        padding: "18px 40px",
        borderRadius: "18px",
        color: "white",
        fontSize: "28px",
        fontWeight: "bold",
        boxShadow: "0 0 30px rgba(239,68,68,0.7)",
        backdropFilter: "blur(12px)",
        zIndex: 120,
      }}
    >
      {warning}
    </div>
  );
}