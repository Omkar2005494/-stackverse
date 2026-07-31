import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OperationsPanel({ 
  onInsert,
  insertLabel = "INSERT",
  color = "#f97316",
  secondaryActions = [], // Array of { label, onClick, color, isDanger }
  headerSlot = null, // Optional slot for tabs/modes
  inputType = "number" // Add inputType prop
}) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleInsert = () => {
    let val;
    if (inputValue.trim() === "") {
      val = inputType === "number" ? Math.floor(Math.random() * 100) : "";
    } else {
      val = inputType === "number" ? Number(inputValue) : inputValue;
    }
    if (onInsert) onInsert(val);
    setInputValue("");
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "40px",
        left: "40px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "flex-start",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "99px",
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: "600",
        }}
      >
        <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
          ▲
        </span>
        Operations
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              background: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              minWidth: "220px",
            }}
          >
            {headerSlot && (
              <div style={{ marginBottom: "4px" }}>
                {headerSlot}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type={inputType}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInsert()}
                placeholder="Value..."
                style={{
                  flex: 1,
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  color: "white",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={handleInsert}
                style={{
                  background: `linear-gradient(135deg, ${color}, ${adjustColorBrightness(color, -20)})`,
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: `0 0 15px rgba(${hexToRgb(color)},0.4)`,
                  textTransform: "uppercase",
                }}
              >
                {insertLabel}
              </button>
            </div>

            {secondaryActions.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(secondaryActions.length, 3)}, 1fr)`, gap: "8px" }}>
                {secondaryActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => action.onClick(inputValue)}
                    style={{
                      background: action.isDanger ? "rgba(239, 68, 68, 0.2)" : "rgba(255,255,255,0.1)",
                      border: action.isDanger ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "12px",
                      color: action.isDanger ? "#fca5a5" : "white",
                      padding: "10px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                    onMouseEnter={(e) => (e.target.style.background = action.isDanger ? "rgba(239, 68, 68, 0.3)" : "rgba(255,255,255,0.15)")}
                    onMouseLeave={(e) => (e.target.style.background = action.isDanger ? "rgba(239, 68, 68, 0.2)" : "rgba(255,255,255,0.1)")}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helpers for dynamic styling
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '255, 255, 255';
}

function adjustColorBrightness(hex, percent) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  
  r = Math.floor(r * (100 + percent) / 100);
  g = Math.floor(g * (100 + percent) / 100);
  b = Math.floor(b * (100 + percent) / 100);
  
  r = r < 255 ? r : 255;
  g = g < 255 ? g : 255;
  b = b < 255 ? b : 255;
  
  r = Math.round(r).toString(16).padStart(2, '0');
  g = Math.round(g).toString(16).padStart(2, '0');
  b = Math.round(b).toString(16).padStart(2, '0');
  
  return `#${r}${g}${b}`;
}
