

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function saveProgress(uid, progress) {
  try {
    await setDoc(
      doc(db, "users", uid),
      progress,
      { merge: true }
    );
  } catch (error) {
    console.error("Save failed:", error);
  }
}

export async function loadProgress(uid) {
  try {
    const snap = await getDoc(
      doc(db, "users", uid)
    );

    if (snap.exists()) {
      return snap.data();
    }

    return null;
  } catch (error) {
    console.error("Load failed:", error);
    return null;
  }
}