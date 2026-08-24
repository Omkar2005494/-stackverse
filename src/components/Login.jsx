import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars, Text, RoundedBox } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import {
  Lock,
  Mail,
  Zap,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { auth } from "../firebase/firebase";
import { soundFX } from "../utils/soundFX";
import * as THREE from "three";

// ─── 1. REFINED 3D DATA STRUCTURE VISUALIZATIONS ───

function AdaptiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / (size.height || 1);
    if (aspect < 1.0) {
      camera.position.set(0, 0, 11);
      camera.fov = 54;
    } else if (aspect < 1.4) {
      camera.position.set(0, 0, 9.5);
      camera.fov = 50;
    } else {
      camera.position.set(0, 0, 8.5);
      camera.fov = 46;
    }
    camera.updateProjectionMatrix();
  }, [size, camera]);
  return null;
}

// 🌲 1. Emerald Octahedral Tree Node with Subtle Quantum Orbit
function RefinedTreeNode({ position, value, color = "#10b981", scale = 1 }) {
  const groupRef = useRef();
  const ringRef = useRef();
  const crystalRef = useRef();

  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.4 + position[0] * 1.2) * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.8;
      ringRef.current.rotation.y = t * 1.0;
    }
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.38 * scale, 0.01 * scale, 16, 28]} />
        <meshStandardMaterial color="#6ee7b7" emissive="#34d399" emissiveIntensity={2.2} />
      </mesh>

      <mesh ref={crystalRef}>
        <octahedronGeometry args={[0.28 * scale, 0]} />
        <meshPhysicalMaterial
          color={color}
          emissive="#059669"
          emissiveIntensity={1.8}
          roughness={0.12}
          metalness={0.25}
          transmission={0.45}
          thickness={0.7}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.11 * scale, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <Text
        position={[0, 0, 0.34 * scale]}
        fontSize={0.2 * scale}
        color="#ffffff"
        fontWeight="800"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#022c22"
      >
        {String(value)}
      </Text>
    </group>
  );
}

function RefinedTreeEdge({ start, end }) {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#34d399" transparent opacity={0.4} />
    </line>
  );
}

function RefinedBinaryTree() {
  const nodes = [
    { pos: [0, 2.0, 0], val: 50 },
    { pos: [-1.15, 0.95, 0], val: 25 },
    { pos: [1.15, 0.95, 0], val: 75 },
    { pos: [-1.75, -0.1, 0], val: 12 },
    { pos: [-0.55, -0.1, 0], val: 37 },
    { pos: [0.55, -0.1, 0], val: 62 },
    { pos: [1.75, -0.1, 0], val: 90 },
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
  ];

  return (
    <group position={[-0.35, 1.65, 0]} scale={0.84}>
      {edges.map(([a, b], i) => (
        <RefinedTreeEdge key={`te-${i}`} start={nodes[a].pos} end={nodes[b].pos} />
      ))}
      {nodes.map((n, i) => (
        <RefinedTreeNode key={`tn-${i}`} position={n.pos} value={n.val} />
      ))}
      <group position={[0, 2.8, 0]}>
        <Text fontSize={0.16} color="#6ee7b7" fontWeight="700" letterSpacing={0.12} anchorX="center">
          BINARY SEARCH TREE
        </Text>
      </group>
    </group>
  );
}

// 🏰 2. Golden Beveled Crystal Stack Pods
function RefinedStackCube({ position, value, index }) {
  const ref = useRef();
  const ringRef = useRef();

  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 1.5 + index * 0.5) * 0.04;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.2;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh ref={ringRef} rotation={[-Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.7, 0.009, 16, 28]} />
        <meshBasicMaterial color="#fde68a" transparent opacity={0.45} />
      </mesh>

      <RoundedBox args={[1.1, 0.48, 0.48]} radius={0.07} smoothness={5}>
        <meshPhysicalMaterial
          color="#fbbf24"
          emissive="#d97706"
          emissiveIntensity={1.6}
          roughness={0.15}
          metalness={0.65}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </RoundedBox>

      <Text position={[0, 0, 0.28]} fontSize={0.2} color="#ffffff" fontWeight="800" anchorX="center" anchorY="middle">
        {String(value)}
      </Text>
    </group>
  );
}

function RefinedStackShowcase() {
  const items = [40, 30, 20, 10];
  return (
    <group position={[-2.4, -2.0, 0]}>
      {items.map((v, i) => (
        <RefinedStackCube key={`sc-${i}`} position={[0, i * 0.64, 0]} value={v} index={i} />
      ))}
      <group position={[0, 2.7, 0]}>
        <Text position={[-0.9, 0, 0]} fontSize={0.13} color="#fde68a" fontWeight="700" anchorX="center">
          ← PUSH
        </Text>
        <Text position={[0.9, 0, 0]} fontSize={0.13} color="#fca5a5" fontWeight="700" anchorX="center">
          POP →
        </Text>
      </group>
      <group position={[0, -0.55, 0]}>
        <Text fontSize={0.16} color="#fbbf24" fontWeight="700" letterSpacing={0.12} anchorX="center">
          STACK (LIFO)
        </Text>
      </group>
    </group>
  );
}

// 🕸️ 3. Amethyst Icosahedral Geode & Quantum Hyper-Mesh
function RefinedGraphConstellation() {
  const ref = useRef();
  const hyperRef = useRef();

  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.3;
      ref.current.rotation.x = Math.sin(t * 0.2) * 0.12;
    }
    if (hyperRef.current) {
      hyperRef.current.rotation.y = -t * 0.18;
      hyperRef.current.rotation.z = t * 0.12;
    }
  });

  const verts = [
    [0, 1.1, 0],
    [1.0, 0.35, 0.35],
    [0.65, -0.85, -0.35],
    [-0.65, -0.85, 0.35],
    [-1.0, 0.35, -0.35],
    [0, -0.25, 0.8],
  ];
  const edges = [
    [0, 1],
    [0, 4],
    [0, 5],
    [1, 2],
    [1, 5],
    [2, 3],
    [2, 5],
    [3, 4],
    [3, 5],
    [4, 0],
    [4, 5],
  ];

  return (
    <group position={[2.2, -1.85, 0]} scale={0.88}>
      <group ref={hyperRef}>
        <mesh>
          <boxGeometry args={[2.0, 2.0, 2.0]} />
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.15} />
        </mesh>
      </group>

      <group ref={ref}>
        {edges.map(([a, b], i) => {
          const pts = [new THREE.Vector3(...verts[a]), new THREE.Vector3(...verts[b])];
          const geo = new THREE.BufferGeometry().setFromPoints(pts);
          return (
            <line key={`ge-${i}`} geometry={geo}>
              <lineBasicMaterial color="#c084fc" transparent opacity={0.45} />
            </line>
          );
        })}
        {verts.map((v, i) => (
          <group key={`gn-${i}`} position={v}>
            <mesh>
              <icosahedronGeometry args={[0.18, 0]} />
              <meshPhysicalMaterial
                color="#c084fc"
                emissive="#9333ea"
                emissiveIntensity={2.6}
                roughness={0.12}
                metalness={0.3}
                clearcoat={1}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>

      <group position={[0, -1.75, 0]}>
        <Text fontSize={0.16} color="#c084fc" fontWeight="700" letterSpacing={0.12} anchorX="center">
          GRAPH NETWORK
        </Text>
      </group>
    </group>
  );
}

function RefinedShowcaseScene() {
  return (
    <>
      <AdaptiveCamera />
      <ambientLight intensity={1.15} />
      <directionalLight position={[8, 12, 8]} intensity={3.2} color="#bae6fd" />
      <directionalLight position={[-8, -8, -6]} intensity={1.8} color="#e9d5ff" />
      <pointLight position={[0, 0, 5]} intensity={7} color="#38bdf8" />
      <pointLight position={[-2, -2, 4]} intensity={4.5} color="#fbbf24" />

      <Stars radius={65} depth={30} count={380} factor={3} saturation={1} fade speed={0.25} />

      <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.2}>
        <RefinedBinaryTree />
      </Float>

      <Float speed={1.3} rotationIntensity={0.06} floatIntensity={0.18}>
        <RefinedStackShowcase />
      </Float>

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.22}>
        <RefinedGraphConstellation />
      </Float>
    </>
  );
}

// ─── 2. PRODUCTION SAAS AUTHENTICATION & PASSWORD RESET ───

function getFriendlyAuthError(errorCode) {
  if (!errorCode) return "An unexpected error occurred. Please try again.";
  const code = errorCode.toLowerCase();
  if (code.includes("user-not-found") || code.includes("invalid-credential")) {
    return "Invalid email or password. Please check your credentials.";
  }
  if (code.includes("wrong-password")) {
    return "Incorrect password. Please try again or use Forgot Password.";
  }
  if (code.includes("email-already-in-use")) {
    return "An account with this email already exists. Sign in instead.";
  }
  if (code.includes("weak-password")) {
    return "Password is too weak. Please use at least 6 characters.";
  }
  if (code.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (code.includes("popup-closed-by-user")) {
    return "Sign-in popup was closed. Please try again.";
  }
  if (code.includes("too-many-requests")) {
    return "Too many failed attempts. Please wait a moment and try again.";
  }
  if (code.includes("expired-action-code")) {
    return "This reset link has expired. Please request a new one.";
  }
  if (code.includes("invalid-action-code")) {
    return "This reset link is invalid or has already been used.";
  }
  return errorCode.replace("Firebase: ", "").replace(/\(auth\/.*\)/, "").trim() || "Authentication failed.";
}

export default function Login({ onGuestLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // In-App Password Reset Link State
  const [isResettingFromLink, setIsResettingFromLink] = useState(false);
  const [actionCode, setActionCode] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false);

  // Check URL parameters on mount for ?mode=resetPassword&oobCode=...
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get("mode");
      const oobCode = urlParams.get("oobCode");

      if (mode === "resetPassword" && oobCode) {
        setActionCode(oobCode);
        setIsResettingFromLink(true);
        setLoading(true);

        verifyPasswordResetCode(auth, oobCode)
          .then((verifiedEmail) => {
            setResetEmail(verifiedEmail);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            setError(getFriendlyAuthError(err.code || err.message));
          });
      }
    } catch {
      // ignore param parsing issues
    }
  }, []);

  const isValidEmail = (val) => /\S+@\S+\.\S+/.test(val);

  // Handle Login / Sign Up
  const handleAuth = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      soundFX.playWarning();
      setError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      soundFX.playWarning();
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      soundFX.playWarning();
      setError("Please enter your password.");
      return;
    }
    if (isSignup && password.length < 6) {
      soundFX.playWarning();
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      soundFX.playPush();
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      soundFX.playTreeFound();
    } catch (err) {
      setLoading(false);
      soundFX.playWarning();
      setError(getFriendlyAuthError(err.code || err.message));
    }
  };

  // Google SSO Handler
  const handleGoogleLogin = async () => {
    try {
      setError("");
      setSuccessMessage("");
      setLoading(true);
      soundFX.playPush();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      soundFX.playTreeFound();
    } catch (err) {
      setLoading(false);
      soundFX.playWarning();
      setError(getFriendlyAuthError(err.code || err.message));
    }
  };

  // Send Password Reset Link with In-App Redirect Action URL
  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim() || !isValidEmail(email.trim())) {
      soundFX.playWarning();
      setError("Please enter a valid email address to receive the password reset link.");
      return;
    }

    try {
      setLoading(true);
      soundFX.playPush();

      // Configure ActionCodeSettings to redirect straight back into the StackVerse themed app!
      const actionCodeSettings = {
        url: window.location.origin,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
      soundFX.playTreeFound();
      setLoading(false);
      setSuccessMessage(`Password reset link sent to ${email.trim()}. Check your inbox!`);
    } catch (err) {
      setLoading(false);
      soundFX.playWarning();
      setError(getFriendlyAuthError(err.code || err.message));
    }
  };

  // Execute Password Reset via Action Code
  const handleConfirmReset = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!newPassword || newPassword.length < 6) {
      soundFX.playWarning();
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      soundFX.playWarning();
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      setLoading(true);
      soundFX.playPush();
      await confirmPasswordReset(auth, actionCode, newPassword);
      soundFX.playLevelUp();
      setLoading(false);
      setPasswordChangedSuccess(true);
      // Clean query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setLoading(false);
      soundFX.playWarning();
      setError(getFriendlyAuthError(err.code || err.message));
    }
  };

  const handleGuestEntry = () => {
    soundFX.playTreeFound();
    if (onGuestLogin) onGuestLogin();
  };

  const inputStyle = {
    width: "100%",
    height: "44px",
    padding: "0 14px 0 40px",
    borderRadius: "10px",
    background: "rgba(15, 23, 42, 0.65)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    boxSizing: "border-box",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        background: "#030712",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
      className="login-container"
    >
      <style>{`
        .login-container {
          flex-direction: row;
        }
        .login-3d-pane {
          flex: 1;
          position: relative;
          min-width: 0;
          height: 100%;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        }
        .login-auth-pane {
          width: 460px;
          min-width: 380px;
          max-width: 460px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justifyContent: center;
          align-items: center;
          padding: 36px 42px;
          box-sizing: border-box;
          background: linear-gradient(180deg, #090d1a 0%, #04060f 100%);
          position: relative;
          overflow-y: auto;
        }
        @media (max-width: 960px) and (min-width: 768px) {
          .login-auth-pane {
            width: 400px;
            min-width: 360px;
            padding: 32px 36px;
          }
        }
        @media (max-width: 767px) {
          .login-container {
            flex-direction: column !important;
            overflow-y: auto !important;
          }
          .login-3d-pane {
            width: 100% !important;
            height: 220px !important;
            flex: none !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          }
          .login-auth-pane {
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            flex: 1 !important;
            padding: 24px 20px 32px 20px !important;
            justifyContent: flex-start !important;
          }
        }
      `}</style>

      {/* ═══ LEFT HALF: 3D Visualization Environment ═══ */}
      <div className="login-3d-pane">
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(56, 189, 248, 0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.018) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent", width: "100%", height: "100%" }}
        >
          <RefinedShowcaseScene />
        </Canvas>

        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "28px",
            zIndex: 10,
            color: "#475569",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            userSelect: "none",
          }}
        >
          3D ALGORITHMIC MULTIVERSE • v2.0
        </div>
      </div>

      {/* ═══ RIGHT HALF: Production SaaS Auth & Password Reset ═══ */}
      <div className="login-auth-pane">
        <div
          style={{
            position: "absolute",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.07) 0%, transparent 70%)",
            top: "-80px",
            right: "-80px",
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{
            width: "100%",
            maxWidth: "350px",
            display: "flex",
            flexDirection: "column",
            zIndex: 5,
          }}
        >
          {/* Header Brand */}
          <div style={{ marginBottom: "26px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "800",
                  letterSpacing: "2.5px",
                  color: "#f8fafc",
                  textTransform: "uppercase",
                }}
              >
                STACKVERSE
              </h1>
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#38bdf8",
                  boxShadow: "0 0 8px #38bdf8",
                }}
              />
            </div>

            <p style={{ margin: 0, fontSize: "13.5px", color: "#94a3b8", fontWeight: "500" }}>
              {isResettingFromLink
                ? "Set a new secure password for your account"
                : isForgotPassword
                ? "Reset your account password"
                : isSignup
                ? "Create an account to save your progress"
                : "Sign in to explore 3D data structures"}
            </p>
          </div>

          {/* Feedback Alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 14 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: "100%",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.28)",
                  borderRadius: "9px",
                  padding: "9px 12px",
                  color: "#fca5a5",
                  fontSize: "12.5px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxSizing: "border-box",
                  lineHeight: "1.4",
                }}
              >
                <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 14 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: "100%",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "9px",
                  padding: "9px 12px",
                  color: "#6ee7b7",
                  fontSize: "12.5px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxSizing: "border-box",
                  lineHeight: "1.4",
                }}
              >
                <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ VIEW A: IN-THEME RESET PASSWORD HANDLER (FROM EMAIL LINK) ═══ */}
          {isResettingFromLink ? (
            passwordChangedSuccess ? (
              <div
                style={{
                  background: "rgba(15, 23, 42, 0.7)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  borderRadius: "12px",
                  padding: "24px 20px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle2 size={26} color="#34d399" />
                </div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#f8fafc" }}>
                  PASSWORD RE-ENCRYPTED!
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
                  Your password has been successfully updated in StackVerse. You can now sign in with your new credentials.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsResettingFromLink(false);
                    setPasswordChangedSuccess(false);
                    setPassword("");
                    soundFX.playPush();
                  }}
                  style={{
                    width: "100%",
                    height: "44px",
                    marginTop: "8px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                    color: "#020817",
                    fontSize: "14px",
                    fontWeight: "800",
                    cursor: "pointer",
                    boxShadow: "0 0 16px rgba(56, 189, 248, 0.35)",
                  }}
                >
                  Enter Workspace →
                </motion.button>
              </div>
            ) : (
              <form onSubmit={handleConfirmReset} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
                {resetEmail && (
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
                    Account: <strong style={{ color: "#38bdf8" }}>{resetEmail}</strong>
                  </div>
                )}

                {/* New Password */}
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex" }}>
                    <Lock size={15} />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password (min. 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: "40px" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#38bdf8";
                      e.target.style.boxShadow = "0 0 0 1px #38bdf8, 0 0 12px rgba(56, 189, 248, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                    }}
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex" }}>
                    <Lock size={15} />
                  </div>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#38bdf8";
                      e.target.style.boxShadow = "0 0 0 1px #38bdf8, 0 0 12px rgba(56, 189, 248, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    width: "100%",
                    height: "44px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                    color: "#020817",
                    fontSize: "14px",
                    fontWeight: "800",
                    cursor: loading ? "wait" : "pointer",
                    boxShadow: "0 0 16px rgba(56, 189, 248, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                  <span>{loading ? "Updating..." : "Update Password →"}</span>
                </motion.button>
              </form>
            )
          ) : isForgotPassword ? (
            /* ═══ VIEW B: REQUEST PASSWORD RESET ═══ */
            <form onSubmit={handleForgotPassword} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex" }}>
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#38bdf8";
                    e.target.style.boxShadow = "0 0 0 1px #38bdf8, 0 0 12px rgba(56, 189, 248, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  width: "100%",
                  height: "44px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                  color: "#020817",
                  fontSize: "14px",
                  fontWeight: "800",
                  cursor: loading ? "wait" : "pointer",
                  boxShadow: "0 0 16px rgba(56, 189, 248, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
                <span>{loading ? "Sending..." : "Send Reset Link"}</span>
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError("");
                  setSuccessMessage("");
                  soundFX.playPeek();
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "12.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  marginTop: "6px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#38bdf8")}
                onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
              >
                <ChevronLeft size={14} /> Back to Sign In
              </button>
            </form>
          ) : (
            /* ═══ VIEW C: STANDARD LOGIN / SIGNUP ═══ */
            <form onSubmit={handleAuth} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex" }}>
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#38bdf8";
                    e.target.style.boxShadow = "0 0 0 1px #38bdf8, 0 0 12px rgba(56, 189, 248, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex" }}>
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignup ? "Password (min. 6 characters)" : "Password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  style={{ ...inputStyle, paddingRight: "40px" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#38bdf8";
                    e.target.style.boxShadow = "0 0 0 1px #38bdf8, 0 0 12px rgba(56, 189, 248, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {!isSignup && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-3px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError("");
                      setSuccessMessage("");
                      soundFX.playPeek();
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                      padding: "2px 0",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#38bdf8")}
                    onMouseLeave={(e) => (e.target.style.color = "#64748b")}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                style={{
                  width: "100%",
                  height: "44px",
                  marginTop: "4px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                  color: "#020817",
                  fontSize: "14px",
                  fontWeight: "800",
                  letterSpacing: "0.3px",
                  cursor: loading ? "wait" : "pointer",
                  boxShadow: "0 0 18px rgba(56, 189, 248, 0.32)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  opacity: loading ? 0.75 : 1,
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignup ? "Create Account →" : "Enter Workspace →"}</span>
                  </>
                )}
              </motion.button>
            </form>
          )}

          {/* Minimalist Divider & Social SSO */}
          {!isResettingFromLink && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  margin: "18px 0",
                  color: "#475569",
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "1px",
                }}
              >
                <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.07)" }} />
                <span style={{ padding: "0 10px" }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.07)" }} />
              </div>

              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                <motion.button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  whileHover={{ scale: 1.01, background: "rgba(255, 255, 255, 0.06)" }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    width: "100%",
                    height: "42px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.09)",
                    color: "#e2e8f0",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: loading ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "9px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span>Continue with Google</span>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleGuestEntry}
                  whileHover={{ scale: 1.01, background: "rgba(168, 85, 247, 0.12)" }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    width: "100%",
                    height: "42px",
                    borderRadius: "10px",
                    background: "rgba(168, 85, 247, 0.06)",
                    border: "1px solid rgba(168, 85, 247, 0.28)",
                    color: "#c084fc",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Zap size={14} color="#c084fc" />
                  <span>Explore as Guest</span>
                </motion.button>
              </div>

              <div style={{ marginTop: "22px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setIsForgotPassword(false);
                    setError("");
                    setSuccessMessage("");
                    soundFX.playPeek();
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    fontSize: "12.5px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{isSignup ? "Already have an account?" : "New to StackVerse?"}</span>
                  <span
                    style={{
                      color: "#38bdf8",
                      fontWeight: "700",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: "rgba(56, 189, 248, 0.1)",
                      border: "1px solid rgba(56, 189, 248, 0.25)",
                    }}
                  >
                    {isSignup ? "Sign In" : "Create Account"}
                  </span>
                </button>
              </div>
            </>
          )}
        </motion.div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "24px",
            textAlign: "center",
            fontSize: "11px",
            color: "#475569",
            fontWeight: "500",
            letterSpacing: "0.4px",
          }}
        >
          © 2026 STACKVERSE • 3D DATA STRUCTURES
        </div>
      </div>
    </div>
  );
}