export default function HeapPreview() {
  return (
    <div
      style={{
        height: "140px",
        marginTop: "18px",
        borderRadius: "16px",
        background: "rgba(0,0,0,0.25)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="100%"
        height="140"
        viewBox="0 0 220 140"
        style={{ overflow: "visible" }}
      >
        <line x1="110" y1="30" x2="70" y2="70" stroke="#fbbf24" strokeWidth="4" />
        <line x1="110" y1="30" x2="150" y2="70" stroke="#fbbf24" strokeWidth="4" />
        <line x1="70" y1="70" x2="50" y2="110" stroke="#fbbf24" strokeWidth="4" />
        <line x1="70" y1="70" x2="90" y2="110" stroke="#fbbf24" strokeWidth="4" />

        <circle cx="110" cy="30" r="18" fill="#f59e0b" style={{ animation: "heapFloat 2.5s ease-in-out infinite", transformOrigin: "center" }} />
        <circle cx="70" cy="70" r="18" fill="#fbbf24" style={{ animation: "heapFloat 2.5s ease-in-out infinite", transformOrigin: "center" }} />
        <circle cx="150" cy="70" r="18" fill="#fbbf24" style={{ animation: "heapFloat 2.5s ease-in-out infinite", transformOrigin: "center" }} />
        <circle cx="50" cy="110" r="18" fill="#fde68a" style={{ animation: "heapFloat 2.5s ease-in-out infinite", transformOrigin: "center" }} />
        <circle cx="90" cy="110" r="18" fill="#fde68a" style={{ animation: "heapFloat 2.5s ease-in-out infinite", transformOrigin: "center" }} />

        <text x="110" y="35" textAnchor="middle" fill="white" fontSize="12">5</text>
        <text x="70" y="75" textAnchor="middle" fill="white" fontSize="12">10</text>
        <text x="150" y="75" textAnchor="middle" fill="white" fontSize="12">15</text>
        <text x="50" y="115" textAnchor="middle" fill="black" fontSize="12">20</text>
        <text x="90" y="115" textAnchor="middle" fill="black" fontSize="12">25</text>
      </svg>
      <style>
        {`
          @keyframes heapFloat {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </div>
  );
}
