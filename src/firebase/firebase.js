import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFexv4EUG_WvyhpAt9O1F-Xxif3GNDW4M",
  authDomain: "stackverse-9529c.firebaseapp.com",
  projectId: "stackverse-9529c",
  storageBucket: "stackverse-9529c.firebasestorage.app",
  messagingSenderId: "9821929176",
  appId: "1:9821929176:web:f3085eaa2a3e6ff27061ad",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;