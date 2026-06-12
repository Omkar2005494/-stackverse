import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MobileSplash from "./components/MobileSplash";
import MobileHome from "./components/MobileHome";
import MobileStackWorld from "./worlds/MobileStackWorld";
import MobileQueueWorld from "./worlds/MobileQueueWorld";

export default function MobileApp() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("home");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <MobileSplash />;
  }
  if (screen === "stack") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MobileStackWorld onBack={() => setScreen("home")} />
      </motion.div>
    );
  }
  if (screen === "queue") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MobileQueueWorld onBack={() => setScreen("home")} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MobileHome onEnterWorld={setScreen} />
    </motion.div>
  );
}
