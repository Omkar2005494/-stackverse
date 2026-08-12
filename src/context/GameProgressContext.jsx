/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
 
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { saveProgress, loadProgress } from "../hooks/useCloudSave";

const GameProgressContext = createContext();

export function getRank(level) {
  if (level >= 20) return "👑 Realm Master";
  if (level >= 15) return "🛡 Guardian";
  if (level >= 10) return "🧭 Pathfinder";
  if (level >= 5) return "🌎 Explorer";
  return "⚔️ Adventurer";
}

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

  const [streakCount, setStreakCount] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState(null);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelReached, setLevelReached] = useState(1);

  const [uid, setUid] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const addXP = (amount) => {
    setXp((prev) => {
      const newXP = prev + amount;
      const newLevel = Math.floor(newXP / 500) + 1;

      if (newLevel > level) {
        setLevelReached(newLevel);
        setShowLevelUp(true);

        setTimeout(() => {
          setShowLevelUp(false);
        }, 2000);
      }

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null);
        setIsLoaded(false);
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
        setStreakCount(saved.streakCount || 0);
        setLastLoginDate(saved.lastLoginDate || null);
      }

      const today = new Date().toISOString().split("T")[0];
      const previousDate = saved?.lastLoginDate;

      if (previousDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday
          .toISOString()
          .split("T")[0];

        let newStreak = 1;

        if (previousDate === yesterdayString) {
          newStreak = (saved?.streakCount || 0) + 1;
        }

        setStreakCount(newStreak);
        setLastLoginDate(today);

        if (newStreak === 1) {
          addXP(25);
        } else if (newStreak === 3) {
          addXP(50);
          unlockAchievement("🔥 First Flame");
        } else if (newStreak === 7) {
          addXP(100);
          unlockAchievement("🔥 Consistent Hero");
        }
      }

      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid || !isLoaded) return;

    saveProgress(uid, {
      xp,
      level,
      achievements,
      stats,
      streakCount,
      lastLoginDate,
    });
  }, [uid, xp, level, achievements, stats, streakCount, lastLoginDate, isLoaded]);

  return (
    <GameProgressContext.Provider
      value={{
        xp,
        level,
        rank: getRank(level),
        showLevelUp,
        levelReached,
        achievements,
        stats,
        streakCount,
        lastLoginDate,
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