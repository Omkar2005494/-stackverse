import { useEffect, useState } from "react";

export default function TreePreview() {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev >= 2 ? 0 : prev + 1));
    }, 900);

    return () => clearInterval(interval);
  }, []);

  const nodes = [
    {
      value: 10,
      left: "50%",
      top: "18px",
    },
    {
      value: 5,
      left: "28%",
      top: "88px",
    },
    {
      value: 15,
      left: "72%",
      top: "88px",
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        marginTop: "30px",
        height: "180px",
        borderRadius: "22px",
        overflow: "hidden",
        background: "rgba(2,6,23,0.55)",
        border: "1px solid rgba(34,211,238,0.14)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "58px",
          left: "39%",
          width: "2px",
          height: "48px",
          background: "rgba(34,211,238,0.5)",
          transform: "rotate(-35deg)",
          boxShadow: "0 0 12px rgba(34,211,238,0.8)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "58px",
          left: "61%",
          width: "2px",
          height: "48px",
          background: "rgba(34,211,238,0.5)",
          transform: "rotate(35deg)",
          boxShadow: "0 0 12px rgba(34,211,238,0.8)",
        }}
      />

      {nodes.map((node, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: node.left,
            top: node.top,
            transform: "translateX(-50%)",
            width: activeNode === index ? "62px" : "54px",
            height: activeNode === index ? "62px" : "54px",
            borderRadius: "999px",
            background:
              activeNode === index
                ? "linear-gradient(135deg, #67e8f9, #22d3ee)"
                : "linear-gradient(135deg, #0891b2, #22d3ee)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow:
              activeNode === index
                ? "0 0 35px rgba(34,211,238,0.95)"
                : "0 0 20px rgba(34,211,238,0.45)",
            transition: "all 0.45s ease",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          {node.value}
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "180px",
          height: "12px",
          borderRadius: "999px",
          background: "rgba(34,211,238,0.22)",
          filter: "blur(12px)",
        }}
      />
    </div>
  );
}
