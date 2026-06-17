export default function ComplexityVisualizer({
  operation,
  timeComplexity,
  spaceComplexity,
  actualOperations,
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "320px",
        left: "20px",
        zIndex: 300,
        padding: "14px",
        borderRadius: "18px",
        background: "rgba(15,23,42,0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(34,211,238,0.3)",
        color: "white",
        minWidth: "200px",
        fontSize: "14px",
        boxShadow: "0 0 20px rgba(34,211,238,0.15)",
      }}
    >
      <h3 style={{ color: "#22d3ee", marginTop: 0, marginBottom: "12px" }}>
        ⚡ Complexity Analyzer
      </h3>

      <p><strong>Operation:</strong> {operation}</p>
      <p><strong>Time Complexity:</strong> <span style={{ color: '#22d3ee' }}>{timeComplexity}</span></p>
      <p><strong>Space Complexity:</strong> <span style={{ color: '#22d3ee' }}>{spaceComplexity}</span></p>
      <p><strong>Actual Steps:</strong> {actualOperations}</p>
    </div>
  );
}