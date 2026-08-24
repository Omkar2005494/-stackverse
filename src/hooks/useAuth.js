import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const loginAsGuest = () => {
    setUser({
      uid: "guest-adventurer",
      displayName: "Guest Adventurer",
      email: "guest@stackverse.io",
      isAnonymous: true,
    });
  };

  const logoutGuest = () => {
    setUser(null);
  };

  return { user, authLoading, loginAsGuest, logoutGuest, setUser };
}