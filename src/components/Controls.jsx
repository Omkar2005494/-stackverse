

export default function Controls({ pushBlock, popBlock }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        left: 30,
        display: "flex",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <button
        onClick={pushBlock}
        style={{
          padding: "14px 28px",
          fontSize: "18px",
          cursor: "pointer",
          borderRadius: "14px",
          border: "none",
          background: "#f97316",
          color: "white",
          fontWeight: "bold",
          boxShadow: "0 0 20px rgba(249,115,22,0.45)",
        }}
      >
        PUSH
      </button>

      <button
        onClick={popBlock}
        style={{
          padding: "14px 28px",
          fontSize: "18px",
          cursor: "pointer",
          borderRadius: "14px",
          border: "none",
          background: "#1e293b",
          color: "white",
          fontWeight: "bold",
          boxShadow: "0 0 15px rgba(255,255,255,0.1)",
        }}
      >
        POP
      </button>
    </div>
  );
}