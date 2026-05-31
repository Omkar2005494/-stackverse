import { useState } from "react";
import StackPreview from "./StackPreview";
import QueuePreview from "./QueuePreview";
import TreePreview from "./TreePreview";
import GraphPreview from "./GraphPreview";
import HeapPreview from "./HeapPreview";

export default function MainMenu({ onStart, graphPreview }) {
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleStart = () => {
    setLoading(true);

    setTimeout(() => {
      onStart();
    }, 2000);
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #164e63 0%, #0f172a 30%, #020617 70%, #000 100%)",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "70px 40px 120px",
        zIndex: 999,
      }}
    >
      {/* Safari fix: disabled large cyan blur orb */}

      {/* Safari fix: disabled large purple blur orb */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "220px",
          background:
            "linear-gradient(to top, rgba(16,185,129,0.15), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "220px",
          clipPath:
            "polygon(0 100%, 8% 70%, 18% 85%, 28% 50%, 38% 78%, 50% 35%, 62% 72%, 74% 45%, 86% 82%, 94% 60%, 100% 100%)",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65), rgba(15,23,42,0.2))",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "900px",
        }}
      >
        <p
          style={{
            color: "#22d3ee",
            letterSpacing: "4px",
            fontSize: "15px",
            marginBottom: "24px",
            textTransform: "uppercase",
          }}
        >
          3D Gamified DSA Experience
        </p>

        <h1
          style={{
            fontSize: "clamp(52px, 8vw, 84px)",
            lineHeight: 0.95,
            margin: 0,
            color: "white",
            fontWeight: 900,
            textShadow: "0 0 40px rgba(34,211,238,0.35)",
            letterSpacing: "6px",
            animation: "titleReveal 1.2s ease forwards",
          }}
        >
          STACKVERSE
        </h1>

        <p
          style={{
            marginTop: "36px",
            color: "rgba(255,255,255,0.72)",
            fontSize: "22px",
            lineHeight: 1.8,
            maxWidth: "480px",
          }}
        >
          Explore ancient ruins, futuristic cities and algorithmic realms while mastering real data structures and algorithms.
        </p>

        <div
          onClick={handleStart}
          style={{
            marginTop: "70px",
            display: "inline-flex",
            alignItems: "center",
            gap: "18px",
            cursor: "pointer",
            color: "#22d3ee",
            fontWeight: "bold",
            fontSize: "22px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            textShadow: "0 0 25px rgba(34,211,238,0.7)",
            animation: "corePulse 2s infinite alternate",
          }}
        >
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "999px",
              background: "rgba(34,211,238,0.15)",
              border: "1px solid rgba(34,211,238,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 25px rgba(34,211,238,0.35)",
              fontSize: "26px",
            }}
          >
            ▶
          </div>

          START ADVENTURE
        </div>
        <div
          style={{
            marginTop: "18px",
            padding: "14px 28px",
            borderRadius: "16px",
            background: "rgba(168,85,247,0.12)",
            border: "1px solid rgba(168,85,247,0.35)",
            color: "#c084fc",
            fontWeight: "bold",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          📖 Explore Worlds
        </div>

      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          flexWrap: "wrap",
          gap: "28px",
          width: "100%",
          maxWidth: "1200px",
          marginTop: "60px",
        }}
      >
        <div
          onMouseEnter={() => setHoveredCard("stack")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            width: "320px",
            minHeight: "320px",
            padding: "28px",
            borderRadius: "26px",
            background: "rgba(15,23,42,0.78)",
            border:
              hoveredCard === "stack"
                ? "1px solid rgba(34,211,238,0.9)"
                : "1px solid rgba(34,211,238,0.28)",
            backdropFilter: "blur(18px)",
            boxShadow:
              hoveredCard === "stack"
                ? "0 0 70px rgba(34,211,238,0.4)"
                : "0 0 45px rgba(34,211,238,0.14)",
            transition: "all 0.35s ease",
            cursor: "pointer",
            transform:
              hoveredCard === "stack"
                ? "translateY(-10px) scale(1.02)"
                : "translateY(0px)",
            animation: "titleReveal 1.1s ease forwards",
          }}
        >
          <p
            style={{
              color: "#22d3ee",
              letterSpacing: "3px",
              fontSize: "14px",
              textTransform: "uppercase",
            }}
          >
            World 01
          </p>

          <h2
            style={{
              color: "white",
              fontSize: "42px",
              marginTop: "12px",
              marginBottom: "18px",
            }}
          >
            Stack Kingdom
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.8,
              fontSize: "17px",
            }}
          >
            Push and pop glowing cyber blocks while surviving overflow and underflow attacks.
          </p>
          <StackPreview />

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              color: "rgba(255,255,255,0.55)",
              fontSize: "14px",
              letterSpacing: "2px",
            }}
          >
            <span>DIFFICULTY: EASY</span>
            <span>STACK ENGINE</span>
          </div>
        </div>

        <div
          onMouseEnter={() => setHoveredCard("queue")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            width: "320px",
            minHeight: "320px",
            padding: "28px",
            borderRadius: "26px",
            background: "rgba(15,23,42,0.78)",
            border:
              hoveredCard === "queue"
                ? "1px solid rgba(168,85,247,0.9)"
                : "1px solid rgba(168,85,247,0.28)",
            backdropFilter: "blur(18px)",
            boxShadow:
              hoveredCard === "queue"
                ? "0 0 70px rgba(168,85,247,0.4)"
                : "0 0 45px rgba(168,85,247,0.14)",
            transition: "all 0.35s ease",
            cursor: "pointer",
            transform:
              hoveredCard === "queue"
                ? "translateY(-10px) scale(1.02)"
                : "translateY(0px)",
            animation: "titleReveal 1.4s ease forwards",
          }}
        >
          <p
            style={{
              color: "#a855f7",
              letterSpacing: "3px",
              fontSize: "14px",
              textTransform: "uppercase",
            }}
          >
            World 02
          </p>

          <h2
            style={{
              color: "white",
              fontSize: "42px",
              marginTop: "12px",
              marginBottom: "18px",
            }}
          >
            Queue City
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.8,
              fontSize: "17px",
            }}
          >
            Control futuristic traffic systems and master FIFO operations inside neon highways.
          </p>
          <QueuePreview />

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              color: "rgba(255,255,255,0.55)",
              fontSize: "14px",
              letterSpacing: "2px",
            }}
          >
            <span>DIFFICULTY: MEDIUM</span>
            <span>QUEUE ENGINE</span>
          </div>
        </div>
        <div
          onMouseEnter={() => setHoveredCard("tree")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            width: "320px",
            minHeight: "320px",
            padding: "28px",
            borderRadius: "26px",
            background: "rgba(15,23,42,0.78)",
            border:
              hoveredCard === "tree"
                ? "1px solid rgba(20,184,166,0.9)"
                : "1px solid rgba(20,184,166,0.28)",
            backdropFilter: "blur(18px)",
            boxShadow:
              hoveredCard === "tree"
                ? "0 0 70px rgba(20,184,166,0.4)"
                : "0 0 45px rgba(20,184,166,0.14)",
            transition: "all 0.35s ease",
            cursor: "pointer",
            transform:
              hoveredCard === "tree"
                ? "translateY(-10px) scale(1.02)"
                : "translateY(0px)",
            animation: "titleReveal 1.7s ease forwards",
          }}
        >
          <p
            style={{
              color: "#14b8a6",
              letterSpacing: "3px",
              fontSize: "14px",
              textTransform: "uppercase",
            }}
          >
            World 03
          </p>

          <h2
            style={{
              color: "white",
              fontSize: "42px",
              marginTop: "12px",
              marginBottom: "18px",
            }}
          >
            Tree Nexus
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.8,
              fontSize: "17px",
            }}
          >
            Explore holographic binary trees with glowing traversal systems and recursive cyber structures.
          </p>

          <TreePreview />

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              color: "rgba(255,255,255,0.55)",
              fontSize: "14px",
              letterSpacing: "2px",
            }}
          >
            <span>DIFFICULTY: HARD</span>
            <span>TREE ENGINE</span>
          </div>
        </div>
        <div
  onMouseEnter={() => setHoveredCard("graph")}
  onMouseLeave={() => setHoveredCard(null)}
  style={{
    width: "320px",
    minHeight: "320px",
    padding: "28px",
    borderRadius: "26px",
    background: "rgba(15,23,42,0.78)",
    border:
      hoveredCard === "graph"
        ? "1px solid rgba(34,211,238,0.9)"
        : "1px solid rgba(34,211,238,0.28)",
    backdropFilter: "blur(18px)",
    boxShadow:
      hoveredCard === "graph"
        ? "0 0 70px rgba(34,211,238,0.4)"
        : "0 0 45px rgba(34,211,238,0.14)",
    transition: "all 0.35s ease",
    cursor: "pointer",
    transform:
      hoveredCard === "graph"
        ? "translateY(-10px) scale(1.02)"
        : "translateY(0px)",
    animation: "titleReveal 2s ease forwards",
  }}
>
  <p
    style={{
      color: "#22d3ee",
      letterSpacing: "3px",
      fontSize: "14px",
      textTransform: "uppercase",
    }}
  >
    World 04
  </p>

  <h2
    style={{
      color: "white",
      fontSize: "42px",
      marginTop: "12px",
      marginBottom: "18px",
    }}
  >
    Graph Realm
  </h2>

  <p
    style={{
      color: "rgba(255,255,255,0.72)",
      lineHeight: 1.8,
      fontSize: "17px",
    }}
  >
    Master BFS, DFS and shortest-path exploration across dynamic connected networks.
  </p>

  {graphPreview || <GraphPreview />}

  <div
    style={{
      marginTop: "24px",
      display: "flex",
      justifyContent: "space-between",
      color: "rgba(255,255,255,0.55)",
      fontSize: "14px",
      letterSpacing: "2px",
    }}
  >
    <span>DIFFICULTY: EXPERT</span>
    <span>GRAPH ENGINE</span>
  </div>
</div>
<div
  onMouseEnter={() => setHoveredCard("heap")}
  onMouseLeave={() => setHoveredCard(null)}
  style={{
    width: "320px",
    minHeight: "320px",
    padding: "28px",
    borderRadius: "26px",
    background: "rgba(15,23,42,0.78)",
    border:
      hoveredCard === "heap"
        ? "1px solid rgba(249,115,22,0.9)"
        : "1px solid rgba(249,115,22,0.28)",
    backdropFilter: "blur(18px)",
    boxShadow:
      hoveredCard === "heap"
        ? "0 0 70px rgba(249,115,22,0.4)"
        : "0 0 45px rgba(249,115,22,0.14)",
    transition: "all 0.35s ease",
    cursor: "pointer",
    transform:
      hoveredCard === "heap"
        ? "translateY(-10px) scale(1.02)"
        : "translateY(0px)",
    animation: "titleReveal 2.3s ease forwards",
  }}
>
  <p
    style={{
      color: "#f97316",
      letterSpacing: "3px",
      fontSize: "14px",
      textTransform: "uppercase",
    }}
  >
    World 05
  </p>

  <h2
    style={{
      color: "white",
      fontSize: "42px",
      marginTop: "12px",
      marginBottom: "18px",
    }}
  >
    Heap Citadel
  </h2>

  <p
    style={{
      color: "rgba(255,255,255,0.72)",
      lineHeight: 1.8,
      fontSize: "17px",
    }}
  >
    Build min and max heaps, extract roots and master priority-based data organization.
  </p>

  <HeapPreview />

  <div
    style={{
      marginTop: "24px",
      display: "flex",
      justifyContent: "space-between",
      color: "rgba(255,255,255,0.55)",
      fontSize: "14px",
      letterSpacing: "2px",
    }}
  >
    <span>DIFFICULTY: EXPERT</span>
    <span>HEAP ENGINE</span>
  </div>
</div>
      </div>
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(2,6,23,0.96)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(18px)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "180px",
              height: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "180px",
                height: "180px",
                borderRadius: "999px",
                border: "2px solid rgba(34,211,238,0.18)",
                animation: "spinLoader 1.2s linear infinite",
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "130px",
                height: "130px",
                borderRadius: "999px",
                border: "3px solid rgba(168,85,247,0.25)",
                animation: "spinLoaderReverse 0.9s linear infinite",
              }}
            />

            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "999px",
                background: "#22d3ee",
                boxShadow: "0 0 45px rgba(34,211,238,0.95)",
                animation: "corePulse 0.8s infinite alternate",
              }}
            />
          </div>

          <h2
            style={{
              marginTop: "40px",
              color: "#22d3ee",
              fontSize: "36px",
              letterSpacing: "6px",
              textShadow: "0 0 30px rgba(34,211,238,0.7)",
            }}
          >
            INITIALIZING
          </h2>

          <p
            style={{
              marginTop: "14px",
              color: "rgba(255,255,255,0.65)",
              fontSize: "18px",
              letterSpacing: "2px",
            }}
          >
            Loading DSA Worlds...
          </p>
        </div>
      )}
    </div>
  );
}