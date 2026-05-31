import { useEffect, useState } from "react";

export default function StackPreview() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev >= 10 ? 0 : prev + 1));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "160px",
        marginTop: "28px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {[0, 1, 2, 3].map((item, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            bottom: `${index * 28}px`,
            width: "90px",
            height: "24px",
            borderRadius: "8px",
            background:
              index % 2 === 0
                ? "linear-gradient(90deg, #06b6d4, #22d3ee)"
                : "linear-gradient(90deg, #67e8f9, #22d3ee)",
            boxShadow:
              index === offset % 4
                ? "0 0 35px rgba(34,211,238,0.95)"
                : "0 0 18px rgba(34,211,238,0.35)",
            transform:
              index === offset % 4
                ? "translateY(-8px) scale(1.05)"
                : "translateY(0px)",
            transition: "all 0.45s ease",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          bottom: "-8px",
          width: "120px",
          height: "12px",
          borderRadius: "999px",
          background: "rgba(34,211,238,0.35)",
          filter: "blur(12px)",
        }}
      />
    </div>
  );
}
