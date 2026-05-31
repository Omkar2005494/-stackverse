

import { useEffect, useState } from "react";

export default function QueuePreview() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev >= 20 ? 0 : prev + 1));
    }, 180);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        marginTop: "30px",
        height: "140px",
        overflow: "hidden",
        borderRadius: "18px",
        background: "rgba(2,6,23,0.55)",
        border: "1px solid rgba(168,85,247,0.12)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(168,85,247,0.18)",
          transform: "translateY(-50%)",
        }}
      />

      {[0, 1, 2, 3, 4].map((item, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: "50%",
            left: `${(index * 22 + offset) % 120}%`,
            width: "22px",
            height: "12px",
            borderRadius: "999px",
            background:
              index % 2 === 0
                ? "#a855f7"
                : "#22d3ee",
            transform: "translateY(-50%)",
            boxShadow:
              index % 2 === 0
                ? "0 0 18px rgba(168,85,247,0.9)"
                : "0 0 18px rgba(34,211,238,0.9)",
            transition: "left 0.18s linear",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          bottom: "18px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "180px",
          height: "10px",
          borderRadius: "999px",
          background: "rgba(168,85,247,0.22)",
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}