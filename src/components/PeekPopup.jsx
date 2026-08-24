import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export default function PeekPopup({
  isOpen,
  value,
  title = "TOP POINTER",
  world = "stack",
  onClose,
  duration = 2000,
}) {
  useEffect(() => {
    if (isOpen && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  const getThemeColor = () => {
    if (world === "stack") return { accent: "#38bdf8", glow: "rgba(56, 189, 248, 0.4)", badge: "#f97316" };
    if (world === "queue") return { accent: "#22d3ee", glow: "rgba(34, 211, 238, 0.4)", badge: "#a855f7" };
    return { accent: "#34d399", glow: "rgba(52, 211, 153, 0.4)", badge: "#10b981" };
  };

  const theme = getThemeColor();

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          {/* Apple Dynamic Island Capsule */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.85, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, scale: 0.85, filter: "blur(8px)" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
              background: "rgba(2, 6, 23, 0.94)",
              border: `1px solid ${theme.accent}66`,
              backdropFilter: "blur(24px)",
              borderRadius: "999px",
              padding: "8px 20px 8px 14px",
              boxShadow: `0 0 30px ${theme.glow}, 0 16px 36px rgba(0, 0, 0, 0.7)`,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#ffffff",
              fontFamily: "'Inter', -apple-system, sans-serif",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Animated Pulsing Beacon Dot */}
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.accent}33, ${theme.badge}44)`,
                border: `1px solid ${theme.accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 0 12px ${theme.glow}`,
              }}
            >
              <Zap size={14} color={theme.accent} />
            </div>

            {/* Content Pill */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "0.8px",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                }}
              >
                {title}
              </span>

              {/* Value Highlight */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "99px",
                  padding: "2px 10px",
                  fontSize: "15px",
                  fontWeight: "900",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#ffffff",
                  textShadow: `0 0 10px ${theme.accent}`,
                }}
              >
                {value !== undefined && value !== null ? value : "—"}
              </div>

              {/* O(1) Badge */}
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "800",
                  color: theme.accent,
                  background: `${theme.accent}15`,
                  padding: "2px 7px",
                  borderRadius: "99px",
                  border: `1px solid ${theme.accent}33`,
                }}
              >
                O(1)
              </span>
            </div>

            {/* Bottom Progress Timer Line */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "2px",
                background: `linear-gradient(90deg, ${theme.accent}, ${theme.badge})`,
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
