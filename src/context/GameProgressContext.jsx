

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { saveProgress, loadProgress } from "../hooks/useCloudSave";

const GameProgressContext = createContext();

export function GameProgressProvider({ children }) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    bfsRuns: 0,
    dfsRuns: 0,
    treesBuilt: 0,
    nodesAdded: 0,
    heapOperations: 0,
    graphOperations: 0,
  });

  const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null);
        return;
      }

      setUid(user.uid);

      const saved = await loadProgress(user.uid);

      if (saved) {
        setXp(saved.xp || 0);
        setLevel(saved.level || 1);
        setAchievements(saved.achievements || []);
        setStats(
          saved.stats || {
            bfsRuns: 0,
            dfsRuns: 0,
            treesBuilt: 0,
            nodesAdded: 0,
            heapOperations: 0,
            graphOperations: 0,
          }
        );
      }
    });

    return () => unsubscribe();
  }, []);

  const addXP = (amount) => {
    setXp((prev) => {
      const newXP = prev + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      setLevel(newLevel);
      return newXP;
    });
  };

  const unlockAchievement = (achievement) => {
    setAchievements((prev) =>
      prev.includes(achievement)
        ? prev
        : [...prev, achievement]
    );
  };

  const incrementStat = (statName, amount = 1) => {
    setStats((prev) => ({
      ...prev,
      [statName]: (prev[statName] || 0) + amount,
    }));
  };

  useEffect(() => {
    if (!uid) return;

    saveProgress(uid, {
      xp,
      level,
      achievements,
      stats,
    });
  }, [uid, xp, level, achievements, stats]);

  return (
    <GameProgressContext.Provider
      value={{
        xp,
        level,
        achievements,
        stats,
        addXP,
        unlockAchievement,
        incrementStat,
      }}
    >
      {children}
    </GameProgressContext.Provider>
  );
}

export function useGameProgress() {
  return useContext(GameProgressContext);
}