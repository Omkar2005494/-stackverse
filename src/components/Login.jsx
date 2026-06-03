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

  const handleAuth = async () => {
    try {
      setError("");

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
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
      }}
    >
      <div
        style={{
          background: "#111827",
          padding: "2rem",
          borderRadius: "12px",
          width: "350px",
          color: "white",
        }}
      >
        <h2>
          {isSignup ? "Create Account" : "Login"}
        </h2>

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
          }}
        />

        <button
          onClick={handleAuth}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "10px",
          }}
        >
          Continue with Google
        </button>

        <p
          style={{
            marginTop: "12px",
            cursor: "pointer",
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
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}