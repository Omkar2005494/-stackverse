import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Award, Star, X } from "lucide-react";
import { getRank } from "../context/GameProgressContext";

export default function LevelUpPopup({
  isOpen,
  level = 1,
  onClose,
}) {
  const rank = getRank(level);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2, 6, 23, 0.78)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
            padding: "20px",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {/* Ambient Rotating Glow Ray Background */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              width: "500px",
              height: "500px",
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(56, 189, 248, 0.12) 40%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          {/* Luxury Modal Card */}
          <motion.div
            initial={{ scale: 0.82, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "420px",
              background: "linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.38)",
              borderRadius: "32px",
              padding: "36px 32px 28px",
              textAlign: "center",
              color: "#ffffff",
              boxShadow: "0 0 60px rgba(245, 158, 11, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Close / Dismiss Button */}
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
              >
                <X size={14} />
              </button>
            )}

            {/* Glowing Category Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "99px",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                color: "#fbbf24",
                fontSize: "11.5px",
                fontWeight: "800",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              <Star size={13} color="#fbbf24" fill="#fbbf24" />
              <span>Milestone Achieved</span>
            </motion.div>

            {/* Grand Crest Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.2 }}
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "26px",
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.1) 100%)",
                border: "2px solid rgba(251, 191, 36, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                boxShadow: "0 0 35px rgba(245, 158, 11, 0.4), inset 0 0 20px rgba(251, 191, 36, 0.2)",
                position: "relative",
              }}
            >
              <Trophy size={44} color="#fef08a" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                }}
              >
                <Star size={18} color="#fbbf24" fill="#fbbf24" />
              </motion.div>
            </motion.div>

            {/* Level Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              style={{
                fontSize: "36px",
                fontWeight: "900",
                letterSpacing: "-0.5px",
                margin: "0 0 6px 0",
                background: "linear-gradient(135deg, #ffffff 0%, #fef08a 60%, #f59e0b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(245, 158, 11, 0.4)",
              }}
            >
              LEVEL {level}
            </motion.h1>

            {/* Rank Badge Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                width: "100%",
                background: "rgba(15, 23, 42, 0.7)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "18px",
                padding: "12px 18px",
                margin: "12px 0 16px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Award size={20} color="#38bdf8" />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>
                    New Rank Tier
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "#38bdf8" }}>
                    {rank}
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "rgba(56, 189, 248, 0.15)",
                  color: "#38bdf8",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: "800",
                }}
              >
                UNLOCKED
              </div>
            </motion.div>

            {/* Subtext */}
            <p style={{ margin: "0 0 18px 0", fontSize: "13px", color: "#94a3b8", lineHeight: "1.4" }}>
              Your algorithmic mastery expands across the multiverse realms.
            </p>

            {/* Progress Auto-Dismiss Bar */}
            <div
              style={{
                width: "100%",
                height: "4px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3.5, ease: "linear" }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #f59e0b, #38bdf8)",
                  borderRadius: "99px",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
