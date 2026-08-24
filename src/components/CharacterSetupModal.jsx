import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Shield,
  Zap,
  Cpu,
  Flame,
  Globe,
  Code2,
  Trophy,
  ArrowRight,
  User,
} from "lucide-react";
import { soundFX } from "../utils/soundFX";

// 5 Cyber Archetypes
export const ARCHETYPES = [
  {
    id: "archmage",
    name: "Binary Archmage",
    role: "Tree & Recursion Sorcerer",
    icon: Zap,
    color: "#10b981",
    bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.05) 100%)",
    borderColor: "rgba(16, 185, 129, 0.4)",
    desc: "Master of branching pathways, divide-and-conquer, and recursive spells.",
    perk: "+15% Tree Traversal XP",
  },
  {
    id: "paladin",
    name: "Stack Paladin",
    role: "LIFO & Memory Knight",
    icon: Shield,
    color: "#fbbf24",
    bgGradient: "linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(217, 119, 6, 0.05) 100%)",
    borderColor: "rgba(251, 191, 36, 0.4)",
    desc: "Unwavering defender of memory safety, call stacks, and buffer order.",
    perk: "+15% Stack Power Bonus",
  },
  {
    id: "voyager",
    name: "Quantum Voyager",
    role: "Graph & Matrix Hacker",
    icon: Zap,
    color: "#a855f7",
    bgGradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(126, 34, 206, 0.05) 100%)",
    borderColor: "rgba(168, 85, 247, 0.4)",
    desc: "Traverses hyper-dimensional meshes, Dijkstra paths, and network matrices.",
    perk: "+15% Shortest Path Mastery",
  },
  {
    id: "sentinel",
    name: "Heap Sentinel",
    role: "Priority & Invariant Guardian",
    icon: Flame,
    color: "#f97316",
    bgGradient: "linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(194, 65, 12, 0.05) 100%)",
    borderColor: "rgba(249, 115, 22, 0.4)",
    desc: "Maintains optimal min/max priority order with lightning-fast sift speeds.",
    perk: "+15% Heap Sort Velocity",
  },
  {
    id: "architect",
    name: "Cyber Architect",
    role: "Universal Multiverse Master",
    icon: Cpu,
    color: "#38bdf8",
    bgGradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(2, 132, 199, 0.05) 100%)",
    borderColor: "rgba(56, 189, 248, 0.4)",
    desc: "Architect of end-to-end data systems, arrays, and real-time 3D pipelines.",
    perk: "+10% All DSA Realms XP",
  },
];

// Avatar Badge Icons
export const AVATAR_PRESETS = [
  "⚡", "🧙‍♂️", "⚔️", "🛡️", "🚀", "💎", "🐉", "🤖", "🌌", "👾", "🔮", "🔥"
];

// Random Cyber Names
const RANDOM_NAMES = [
  "NeoCoder", "ByteBlade", "QuantumKnight", "NovaRecursion", "CyberVortex",
  "AlgoPhantom", "ZenithTree", "MatrixWeaver", "VectorPilot", "ShadowStack"
];

const LANGUAGES = ["JavaScript", "Python", "C++", "Java", "Rust", "Go", "TypeScript"];

export default function CharacterSetupModal({ user, onComplete, initialProfile }) {
  const [codename, setCodename] = useState(
    initialProfile?.codename || user?.displayName || "NeoCoder"
  );
  const [selectedArchetype, setSelectedArchetype] = useState(
    initialProfile?.archetype || "architect"
  );
  const [selectedAvatar, setSelectedAvatar] = useState(
    initialProfile?.avatar || "⚡"
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    initialProfile?.language || "JavaScript"
  );
  const [tagline, setTagline] = useState(
    initialProfile?.tagline || "Mastering the Multiverse, one node at a time."
  );

  const activeArchetype = ARCHETYPES.find((a) => a.id === selectedArchetype) || ARCHETYPES[4];

  // Random Name Generator
  const handleRandomizeName = () => {
    soundFX.playPeek();
    const rand = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setCodename(`${rand}_${num}`);
  };

  // Submit Profile Setup
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!codename.trim()) {
      soundFX.playWarning();
      return;
    }

    soundFX.playLevelUp();
    const profileData = {
      codename: codename.trim(),
      archetype: selectedArchetype,
      archetypeName: activeArchetype.name,
      archetypeRole: activeArchetype.role,
      archetypeColor: activeArchetype.color,
      avatar: selectedAvatar,
      language: selectedLanguage,
      tagline: tagline.trim() || "Mastering the Multiverse.",
      setupCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    // Persist to localStorage
    if (user?.uid) {
      localStorage.setItem(`stackverse_profile_${user.uid}`, JSON.stringify(profileData));
    }
    localStorage.setItem("stackverse_current_profile", JSON.stringify(profileData));

    if (onComplete) {
      onComplete(profileData);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(3, 7, 18, 0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "880px",
          maxHeight: "92vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, #0f172a 0%, #060914 100%)",
          border: `1px solid ${activeArchetype.borderColor}`,
          borderRadius: "20px",
          padding: "32px 36px",
          boxShadow: `0 0 50px ${activeArchetype.color}33, 0 25px 50px rgba(0,0,0,0.7)`,
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          position: "relative",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: `${activeArchetype.color}22`,
                  border: `1px solid ${activeArchetype.color}66`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                {selectedAvatar}
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: "800",
                  letterSpacing: "1.5px",
                  color: "#f8fafc",
                  textTransform: "uppercase",
                }}
              >
                INITIALIZE YOUR CHARACTER
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", color: "#94a3b8" }}>
              Customize your developer codename, archetype class, and avatar before entering the Multiverse.
            </p>
          </div>

          <div
            style={{
              padding: "6px 12px",
              borderRadius: "99px",
              background: `${activeArchetype.color}15`,
              border: `1px solid ${activeArchetype.color}44`,
              color: activeArchetype.color,
              fontSize: "12px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Trophy size={13} />
            <span>{activeArchetype.perk}</span>
          </div>
        </div>

        {/* 2-Column Split: Config Left, ID Card Live Preview Right */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }} className="setup-grid">
          <style>{`
            @media (max-width: 768px) {
              .setup-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>

          {/* LEFT: Configuration Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* 1. Codename */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Developer Codename
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex" }}>
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    value={codename}
                    onChange={(e) => setCodename(e.target.value)}
                    placeholder="Enter codename..."
                    maxLength={20}
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 14px 0 38px",
                      borderRadius: "10px",
                      background: "rgba(15, 23, 42, 0.7)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#f8fafc",
                      fontSize: "14px",
                      fontWeight: "600",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = activeArchetype.color)}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.1)")}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  title="Generate Random Name"
                  style={{
                    height: "42px",
                    padding: "0 14px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#cbd5e1",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>🎲</span> Random
                </button>
              </div>
            </div>

            {/* 2. Avatar Picker */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Avatar Emblem
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {AVATAR_PRESETS.map((av) => {
                  const isSelected = selectedAvatar === av;
                  return (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(av);
                        soundFX.playPeek();
                      }}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: isSelected ? `${activeArchetype.color}33` : "rgba(255, 255, 255, 0.04)",
                        border: isSelected ? `2px solid ${activeArchetype.color}` : "1px solid rgba(255, 255, 255, 0.08)",
                        fontSize: "18px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        boxShadow: isSelected ? `0 0 12px ${activeArchetype.color}66` : "none",
                      }}
                    >
                      {av}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Class Archetype Selector */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Select Class Archetype
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
                {ARCHETYPES.map((arch) => {
                  const isSelected = selectedArchetype === arch.id;
                  const Icon = arch.icon;
                  return (
                    <div
                      key={arch.id}
                      onClick={() => {
                        setSelectedArchetype(arch.id);
                        soundFX.playPush();
                      }}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        background: isSelected ? arch.bgGradient : "rgba(255, 255, 255, 0.03)",
                        border: isSelected ? `1.5px solid ${arch.color}` : "1px solid rgba(255, 255, 255, 0.06)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.2s",
                        boxShadow: isSelected ? `0 0 16px ${arch.color}33` : "none",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            background: `${arch.color}22`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: arch.color,
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: "13.5px", fontWeight: "700", color: isSelected ? "#ffffff" : "#cbd5e1" }}>
                            {arch.name}
                          </div>
                          <div style={{ fontSize: "11px", color: arch.color, fontWeight: "600" }}>
                            {arch.role}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: arch.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
                          <Check size={13} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Language & Tagline */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase" }}>
                  Primary Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 12px",
                    borderRadius: "10px",
                    background: "rgba(15, 23, 42, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#f8fafc",
                    fontSize: "13px",
                    fontWeight: "600",
                    outline: "none",
                  }}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l} style={{ background: "#0f172a", color: "#fff" }}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11.5px", fontWeight: "700", color: "#94a3b8", marginBottom: "6px", textTransform: "uppercase" }}>
                  Bio / Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Mastering DSA..."
                  maxLength={40}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 12px",
                    borderRadius: "10px",
                    background: "rgba(15, 23, 42, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#f8fafc",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Live Holographic Developer ID Card Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Holographic ID Card Preview
            </label>

            {/* ID Card */}
            <div
              style={{
                flex: 1,
                minHeight: "280px",
                borderRadius: "18px",
                background: `linear-gradient(145deg, #0c1322 0%, #050814 100%)`,
                border: `2px solid ${activeArchetype.color}88`,
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: `0 0 35px ${activeArchetype.color}25`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Card Ambient Aura */}
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${activeArchetype.color}44 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Card Top */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 2 }}>
                <div>
                  <div style={{ fontSize: "10px", color: "#64748b", fontWeight: "800", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    STACKVERSE PASSPORT
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "900", color: "#ffffff", marginTop: "2px" }}>
                    {codename || "Anonymous"}
                  </div>
                </div>

                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: `${activeArchetype.color}22`,
                    border: `1.5px solid ${activeArchetype.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    boxShadow: `0 0 16px ${activeArchetype.color}66`,
                  }}
                >
                  {selectedAvatar}
                </div>
              </div>

              {/* Card Middle: Archetype Banner */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: `${activeArchetype.color}15`,
                  border: `1px solid ${activeArchetype.color}33`,
                  margin: "14px 0",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "800", color: activeArchetype.color }}>
                    {activeArchetype.name}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.4" }}>
                  {activeArchetype.desc}
                </div>
              </div>

              {/* Card Bottom: Metadata Badges */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ padding: "4px 8px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", fontSize: "11px", fontWeight: "700", color: "#38bdf8" }}>
                    {selectedLanguage}
                  </span>
                  <span style={{ padding: "4px 8px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", fontSize: "11px", fontWeight: "700", color: "#34d399" }}>
                    LVL 1
                  </span>
                </div>

                <div style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "600" }}>
                  ID: #{user?.uid ? user.uid.substring(0, 6).toUpperCase() : "GUEST"}
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <motion.button
              type="button"
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "12px",
                border: "none",
                background: `linear-gradient(135deg, ${activeArchetype.color} 0%, #0284c7 100%)`,
                color: "#020817",
                fontSize: "15px",
                fontWeight: "900",
                letterSpacing: "0.5px",
                cursor: "pointer",
                boxShadow: `0 0 24px ${activeArchetype.color}66`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span>ENTER THE MULTIVERSE</span>
              <ArrowRight size={17} strokeWidth={3} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
