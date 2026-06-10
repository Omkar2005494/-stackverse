export default function Controls({ pushBlock, popBlock }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <div
      style={{
        position: "absolute",
        top: isMobile ? "auto" : 30,
        bottom: isMobile ? 20 : "auto",
        left: isMobile ? "50%" : 30,
        transform: isMobile ? "translateX(-50%)" : "none",
        display: "flex",
        gap: isMobile ? "10px" : "12px",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "center",
        width: isMobile ? "90%" : "auto",
        zIndex: 100,
      }}
    >
      <button
        onClick={pushBlock}
        style={{
          padding: isMobile ? "12px 20px" : "14px 28px",
          fontSize: isMobile ? "16px" : "18px",
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
          padding: isMobile ? "12px 20px" : "14px 28px",
          fontSize: isMobile ? "16px" : "18px",
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