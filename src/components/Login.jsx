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
        background: "radial-gradient(circle at center, #0f172a 0%, #020617 70%)",
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
            background: "rgba(15,23,42,0.75)",
            backdropFilter: "blur(20px)",
            padding: "2.5rem",
            borderRadius: "24px",
            width: "480px",
            maxWidth: "90vw",
            color: "white",
            border: "1px solid rgba(34,211,238,0.3)",
            boxShadow: "0 0 30px rgba(34,211,238,0.2)",
            animation: isEntering
              ? "portalEnter 0.8s ease forwards"
              : "portalFloat 5s ease-in-out infinite",
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1
              style={{
                margin: 0,
                color: "#22d3ee",
                fontSize: "56px",
                letterSpacing: "-2px",
              }}
            >
              STACKVERSE
            </h1>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              boxSizing: "border-box",
              transition: "all 0.3s ease",
              boxShadow: "0 0 10px rgba(34,211,238,0.15)",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              boxSizing: "border-box",
              transition: "all 0.3s ease",
              boxShadow: "0 0 10px rgba(34,211,238,0.15)",
            }}
          />

          <button
            onClick={handleAuth}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "12px",
              border: "none",
              background: "#22d3ee",
              color: "#020617",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              transform: buttonHover ? "scale(1.03)" : "scale(1)",
              boxShadow: buttonHover
                ? "0 0 30px rgba(34,211,238,0.8)"
                : "0 0 12px rgba(34,211,238,0.4)",
              boxSizing: "border-box",
            }}
          >
            {isSignup ? "CREATE ADVENTURER" : "ENTER THE VERSE"}
          </button>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              boxSizing: "border-box",
            }}
          >
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