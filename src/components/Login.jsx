import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [buttonHover, setButtonHover] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const handleAuth = async () => {
    try {
      setError("");
      setIsEntering(true);

      if (isSignup) {
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
    } catch (err) {
      setIsEntering(false);
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsEntering(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setIsEntering(false);
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at center, #020617 0%, #000000 100%)",
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            border: "4px solid rgba(34,211,238,0.35)",
            borderTop: "4px solid #67e8f9",
            borderRight: "4px solid transparent",
            boxShadow: buttonHover
              ? "0 0 100px #22d3ee"
              : "0 0 60px #22d3ee",
            transition: "all 0.3s ease",
            animation: "spin 20s linear infinite",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            margin: "auto",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            border: "2px solid rgba(34,211,238,0.18)",
            borderBottom: "2px solid #67e8f9",
            borderLeft: "2px solid transparent",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            margin: "auto",
            animation: "spin 12s linear infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "rgba(34,211,238,0.15)",
            boxShadow: "0 0 60px #22d3ee",
            filter: "blur(20px)",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            margin: "auto",
          }}
        />
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#22d3ee",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.6,
            }}
          />
        ))}
        <div
          style={{
            background: "rgba(10, 15, 30, 0.6)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            padding: "3.5rem 3rem",
            borderRadius: "32px",
            width: "500px",
            maxWidth: "92vw",
            color: "white",
            border: "1px solid rgba(34,211,238,0.2)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.8), inset 0 0 40px rgba(34,211,238,0.05)",
            animation: isEntering
              ? "portalEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards"
              : "portalFloat 6s ease-in-out infinite",
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <h1
              style={{
                margin: 0,
                background: "linear-gradient(to right, #ffffff 30%, #a5f3fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "42px",
                fontWeight: "300",
                letterSpacing: "12px",
                textIndent: "12px", // offsets the letter spacing of the last character
                filter: "drop-shadow(0 0 15px rgba(34,211,238,0.4))",
                textTransform: "uppercase",
              }}
            >
              Stackverse
            </h1>
            <p style={{ margin: 0, color: "rgba(148, 163, 184, 0.8)", fontSize: "12px", letterSpacing: "6px", textTransform: "uppercase", fontWeight: "400", textIndent: "6px" }}>
              Master the Data Realm
            </p>
          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "16px",
              padding: "16px 20px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.4)",
              color: "white",
              fontSize: "15px",
              boxSizing: "border-box",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid rgba(34,211,238,0.5)";
              e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.5), 0 0 15px rgba(34,211,238,0.2)";
              e.target.style.background = "rgba(0,0,0,0.6)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid rgba(255,255,255,0.08)";
              e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.5)";
              e.target.style.background = "rgba(0,0,0,0.4)";
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              marginBottom: "24px",
              padding: "16px 20px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.4)",
              color: "white",
              fontSize: "15px",
              boxSizing: "border-box",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid rgba(34,211,238,0.5)";
              e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.5), 0 0 15px rgba(34,211,238,0.2)";
              e.target.style.background = "rgba(0,0,0,0.6)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid rgba(255,255,255,0.08)";
              e.target.style.boxShadow = "inset 0 2px 10px rgba(0,0,0,0.5)";
              e.target.style.background = "rgba(0,0,0,0.4)";
            }}
          />

          <button
            onClick={handleAuth}
            onMouseEnter={(e) => {
              setButtonHover(true);
              e.target.style.transform = "scale(1.02) translateY(-2px)";
              e.target.style.boxShadow = "0 10px 25px rgba(34,211,238,0.6)";
            }}
            onMouseLeave={(e) => {
              setButtonHover(false);
              e.target.style.transform = "scale(1) translateY(0)";
              e.target.style.boxShadow = "0 0 15px rgba(34,211,238,0.4)";
            }}
            style={{
              width: "100%",
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
              color: "white",
              fontWeight: "900",
              fontSize: "15px",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 0 15px rgba(34,211,238,0.4)",
              boxSizing: "border-box",
              textTransform: "uppercase"
            }}
          >
            {isSignup ? "Create Adventurer" : "Enter The Verse"}
          </button>

          <div style={{ display: "flex", alignItems: "center", width: "100%", margin: "10px 0 20px" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2))" }} />
            <span style={{ padding: "0 16px", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "bold" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,255,255,0.2), transparent)" }} />
          </div>

          <button
            onClick={handleGoogleLogin}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.15)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.05)";
              e.target.style.transform = "translateY(0)";
            }}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p
            style={{
              marginTop: "18px",
              cursor: "pointer",
              opacity: 0.8,
            }}
            onClick={() =>
              setIsSignup(!isSignup)
            }
          >
            {isSignup
              ? "Already have an account?"
              : "Create an account"}
          </p>

          {error && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px 14px",
                borderRadius: "10px",
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
                fontSize: "14px",
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              ⚠ Invalid email or login details
            </div>
          )}
        </div>
      </div>
      {isEntering && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "#22d3ee",
            zIndex: 9999,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              border: "4px solid rgba(34,211,238,0.3)",
              borderTop: "4px solid #67e8f9",
              animation: "spin 1s linear infinite",
              marginBottom: "20px",
            }}
          />
          <h2 style={{ margin: 0 }}>Opening Portal...</h2>
          <p style={{ opacity: 0.7 }}>
            Initializing Realms
          </p>
        </div>
      )}
    </div>
  );
}