import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase/firebase";
import MobileApp from "./mobile/MobileApp";

import StackWorld from "./worlds/StackWorld";
import QueueWorld from "./worlds/QueueWorld";
import TreeWorld from "./worlds/TreeWorld";
import GraphWorld from "./worlds/GraphWorld";
import HeapWorld from "./worlds/HeapWorld";
import LinkedListWorld from "./worlds/LinkedListWorld";
import HUD from "./components/HUD";
import OperationsPanel from "./components/OperationsPanel";
import LevelPopup from "./components/LevelPopup";
import LevelUpPopup from "./components/LevelUpPopup";
import WarningPopup from "./components/WarningPopup";
import CyberBackground from "./components/CyberBackground";
import MissionPanel from "./components/MissionPanel";
import ComboPopup from "./components/ComboPopup";
import FloatingXP from "./components/FloatingXP";
import Shockwave from "./components/Shockwave";
import LearningPanel from "./components/LearningPanel";
import MainMenu from "./components/MainMenu";
import Login from "./components/Login";
import GraphPreview from "./components/GraphPreview";
import Sidebar from "./components/Sidebar/Sidebar";
import { missions } from "./game/missions";
import { useAuth } from "./hooks/useAuth";
import { loadProgress, saveProgress } from "./hooks/useProgress";
import { achievementsConfig } from "./data/achievements";
import { useWorldNavigation } from "./hooks/useWorldNavigation";
import { useStackLogic } from "./hooks/useStackLogic";
import { useQueueLogic } from "./hooks/useQueueLogic";
import { useTreeLogic } from "./hooks/useTreeLogic";

import { useHeapLogic } from "./hooks/useHeapLogic";
import { useGraphLogic } from "./hooks/useGraphLogic";
import { useGameProgress } from "./context/GameProgressContext";


export default function App() {
  const isMobile = window.innerWidth < 768;
  const {
    xp,
    level,
    rank,
    addXP,
    showLevelUp,
    levelReached,
  } = useGameProgress();
  const { stack, setStack, peekBlock, clearStack } = useStackLogic();
  const { queue, setQueue, peekQueue, clearQueue } = useQueueLogic();
  const {
    treeNodes,
    setTreeNodes,
    nodeInput,
    setNodeInput,
    searchInput,
    setSearchInput,
    highlightedNode,
    setHighlightedNode,
    traversalResult,
    setTraversalResult,
    resetTree,
    insertNode,
    searchNode,
    deleteNode,
    startBFS,
    startDFS,
    startInorder,
    startPreorder,
    startPostorder,
  } = useTreeLogic();
  const {
    graphNodes,
    setGraphNodes,
    graphEdges,
    setGraphEdges,
    vertexInput,
    setVertexInput,
    edgeInput,
    setEdgeInput,
    startVertex,
    setStartVertex,
    endVertex,
    setEndVertex,
    shortestPath,
    setShortestPath,
    addVertex,
    deleteVertex,
    addEdge,
    deleteEdge,
    resetGraph,
    startGraphBFS,
    startGraphDFS,
    findShortestPath,
  } = useGraphLogic();
  const {
    heap,
    setHeap,
    heapInput,
    setHeapInput,
    heapInsertCount,
    setHeapInsertCount,
    heapExtractCount,
    setHeapExtractCount,
    heapType,
    setHeapType,
    swappedNodes,
    setSwappedNodes,
    heapSortResult,
    setHeapSortResult,
  } = useHeapLogic();
  // XP and level are now managed by GameProgressContext
  const [warning, setWarning] = useState("");
  const [shake, setShake] = useState(false);
  const [combo, setCombo] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);
  const [missionIndex, setMissionIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [pushCount, setPushCount] = useState(0);
  const [enqueueCount, setEnqueueCount] = useState(0);
  const [bfsCount, setBfsCount] = useState(0);
  const [dfsCount, setDfsCount] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievementPopup, setAchievementPopup] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [actualSteps, setActualSteps] = useState(0);
  const [currentOperation, setCurrentOperation] = useState("None");
  const [timeComplexity, setTimeComplexity] = useState("-");
  const [spaceComplexity, setSpaceComplexity] = useState("-");
  const powerMode = combo >= 5;
  const { user, authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const {
    currentWorld,
    setCurrentWorld,
    transitioning,
    transitionText,
    switchWorld,
  } = useWorldNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const currentMission = missions[missionIndex];


  useEffect(() => {
    const parsed = loadProgress();

    if (!parsed) return;

    // XP and level are now managed by GameProgressContext
    setCurrentWorld(parsed.currentWorld || "stack");
    setMissionIndex(parsed.missionIndex || 0);
    setPushCount(parsed.pushCount || 0);
    setEnqueueCount(parsed.enqueueCount || 0);
    setBfsCount(parsed.bfsCount || 0);
    setDfsCount(parsed.dfsCount || 0);
    setUnlockedAchievements(
      parsed.unlockedAchievements || []
    );
  }, []);

  const missionCompleted = currentMission.check(
    stack,
    combo
  );

  useEffect(() => {
    if (!missionCompleted) return;

    const timeout = setTimeout(() => {
      if (missionIndex < missions.length - 1) {
        setMissionIndex(missionIndex + 1);
        addXP(50);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [missionCompleted]);


  useEffect(() => {
    saveProgress({
      xp,
      level,
      currentWorld,
      missionIndex,
      pushCount,
      enqueueCount,
      bfsCount,
      dfsCount,
      unlockedAchievements,
    });
  }, [
    xp,
    level,
    currentWorld,
    missionIndex,
    pushCount,
    enqueueCount,
    bfsCount,
    dfsCount,
    unlockedAchievements,
  ]);

  // Clear traversal result and highlighted node when switching worlds
  useEffect(() => {
    setTraversalResult("");
    setHighlightedNode(null);
  }, [currentWorld]);

  const xpProgress = (xp % 50) * 2;
  const allMissionsCompleted = missionIndex >= missions.length - 1 && missionCompleted;
  const achievements = achievementsConfig.map((achievement) => {
    const value = {
      pushCount,
      enqueueCount,
      bfsCount,
      dfsCount,
      heapInsertCount,
      heapExtractCount,
    }[achievement.type] || 0;

    return {
      ...achievement,
      unlocked: value >= achievement.target,
      progress: `${value}/${achievement.target}`,
    };
  });

  const completedAchievements =
    achievements.filter((a) => a.unlocked).length;

  const completionPercent = Math.round(
    (completedAchievements / achievements.length) * 100
  );

  useEffect(() => {
    achievements.forEach((achievement) => {
      if (
        achievement.unlocked &&
        !unlockedAchievements.includes(achievement.name)
      ) {
        setUnlockedAchievements((prev) => [
          ...prev,
          achievement.name,
        ]);

        setAchievementPopup(achievement.name);
        addXP(50);

        setTimeout(() => {
          setAchievementPopup(null);
        }, 2500);
      }
    });
    // eslint-disable-next-line
  }, [achievements, unlockedAchievements]);

  const pushBlock = (val = null) => {
    if (stack.length >= 5) {
      setWarning("STACK OVERFLOW!");
      setShake(true);

      setTimeout(() => {
        setWarning("");
        setShake(false);
      }, 1500);

      return;
    }

    const newValue = val !== null ? val : stack.length + 1;
    const newStack = [...stack, newValue];
    setStack(newStack);
    setPushCount((prev) => prev + 1);
    
    setCurrentOperation("Push");
    setTimeComplexity("O(1)");
    setSpaceComplexity("O(1)");
    setActualSteps(1);

    const gainedXp = powerMode ? 20 : 10;
    addXP(gainedXp);
    setCombo(combo + 1);
    setShowXP(true);
    setShowShockwave(true);

    setTimeout(() => {
      setShowXP(false);
      setShowShockwave(false);
    }, 900);
  };

  const popBlock = () => {
    if (stack.length <= 0) {
      setWarning("STACK UNDERFLOW!");
      setShake(true);

      setTimeout(() => {
        setWarning("");
        setShake(false);
      }, 1500);

      return;
    }

    setCombo(0);
    setStack(stack.slice(0, -1));

    setCurrentOperation("Pop");
    setTimeComplexity("O(1)");
    setSpaceComplexity("O(1)");
    setActualSteps(1);
  };

  const enqueue = (val = null) => {
    if (queue.length >= 5) {
      setWarning("QUEUE OVERFLOW!");
      setShake(true);

      setTimeout(() => {
        setWarning("");
        setShake(false);
      }, 1500);

      return;
    }

    const newValue = val !== null ? val : queue.length + 1;
    const newQueue = [...queue, { id: crypto.randomUUID(), value: newValue }];
    setQueue(newQueue);
    setEnqueueCount((prev) => prev + 1);

    setCurrentOperation("Enqueue");
    setTimeComplexity("O(1)");
    setSpaceComplexity("O(1)");
    setActualSteps(1);

    const gainedXp = powerMode ? 20 : 10;

    addXP(gainedXp);
    setCombo((prev) => prev + 1);

    setShowXP(true);
    setShowShockwave(true);

    setTimeout(() => {
      setShowXP(false);
      setShowShockwave(false);
    }, 900);
  };

  const dequeue = () => {
    if (queue.length <= 0) {
      setWarning("QUEUE UNDERFLOW!");
      setShake(true);

      setTimeout(() => {
        setWarning("");
        setShake(false);
      }, 1500);

      return;
    }

    setQueue(queue.slice(1));
    setCombo(0);

    setCurrentOperation("Dequeue");
    setTimeComplexity("O(1)");
    setSpaceComplexity("O(1)");
    setActualSteps(1);
  };



  const insertHeap = (val) => {
    const value = val !== undefined ? Number(val) : Number(heapInput);

    if ((val === undefined && heapInput.trim() === "") || Number.isNaN(value)) {
      return;
    }

    if (heap.length >= 15) {
      setWarning("HEAP FULL");

      setTimeout(() => {
        setWarning("");
      }, 1500);

      return;
    }
    const newHeap = [...heap, value];

    let index = newHeap.length - 1;

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);

      const correctOrder =
        heapType === "min"
          ? newHeap[parent] <= newHeap[index]
          : newHeap[parent] >= newHeap[index];

      if (correctOrder) {
        break;
      }

      [newHeap[parent], newHeap[index]] = [
        newHeap[index],
        newHeap[parent],
      ];

      index = parent;
    }

    setHeapInsertCount((prev) => prev + 1);
    addXP(10);
    setHeap(newHeap);
    setHeapInput("");

    setCurrentOperation("Insert");
    setTimeComplexity("O(log n)");
    setSpaceComplexity("O(1)");
    setActualSteps(Math.ceil(Math.log2(newHeap.length || 2)));
  };

  const extractRoot = () => {
    if (heap.length === 0) return;

    if (heap.length === 1) {
      setHeap([]);
      return;
    }

    const newHeap = [...heap];

    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();

    let index = 0;

    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;

      let target = index;

      if (
        left < newHeap.length &&
        (heapType === "min"
          ? newHeap[left] < newHeap[target]
          : newHeap[left] > newHeap[target])
      ) {
        target = left;
      }

      if (
        right < newHeap.length &&
        (heapType === "min"
          ? newHeap[right] < newHeap[target]
          : newHeap[right] > newHeap[target])
      ) {
        target = right;
      }

      if (target === index) {
        break;
      }

      [newHeap[index], newHeap[target]] = [
        newHeap[target],
        newHeap[index],
      ];

      index = target;
    }

    setHeapExtractCount((prev) => prev + 1);
    addXP(10);
    setHeap(newHeap);

    setCurrentOperation("Extract Root");
    setTimeComplexity("O(log n)");
    setSpaceComplexity("O(1)");
    setActualSteps(Math.ceil(Math.log2(newHeap.length || 2)));
  };

  const deleteHeapNode = (val) => {
    const value = val !== undefined ? Number(val) : Number(heapInput);

    if ((val === undefined && heapInput.trim() === "") || Number.isNaN(value)) {
      return;
    }

    const index = heap.indexOf(value);

    if (index === -1) {
      setWarning("VALUE NOT FOUND");

      setTimeout(() => {
        setWarning("");
      }, 1500);

      return;
    }

    const values = heap.filter((_, i) => i !== index);

    const rebuiltHeap = [];

    values.forEach((num) => {
      rebuiltHeap.push(num);

      let current = rebuiltHeap.length - 1;

      while (current > 0) {
        const parent = Math.floor((current - 1) / 2);

        const correctOrder =
          heapType === "min"
            ? rebuiltHeap[parent] <= rebuiltHeap[current]
            : rebuiltHeap[parent] >= rebuiltHeap[current];

        if (correctOrder) {
          break;
        }

        [rebuiltHeap[parent], rebuiltHeap[current]] = [
          rebuiltHeap[current],
          rebuiltHeap[parent],
        ];

        current = parent;
      }
    });

    setHeap(rebuiltHeap);
    setHeapInput("");
    addXP(10);

    setCurrentOperation("Delete Node");
    setTimeComplexity("O(n)");
    setSpaceComplexity("O(n)");
    setActualSteps(heap.length);
  };

  const heapSort = () => {
    const sorted = [...heap].sort((a, b) => a - b);

    setHeapSortResult(
      `SORTED: ${sorted.join(" → ")}`
    );

    addXP(20);

    setCurrentOperation("Heap Sort");
    setTimeComplexity("O(n log n)");
    setSpaceComplexity("O(1)");
    setActualSteps(heap.length);
  };

  const handleGraphBFS = async () => {
    const result = startGraphBFS();

    if (!result.length) return;

    setCurrentOperation("Graph BFS");
    setTimeComplexity("O(V + E)");
    setSpaceComplexity("O(V)");
    setActualSteps(result.length);

    setTraversalResult(`GRAPH BFS: ${result.join(" → ")}`);
    setBfsCount((prev) => prev + 1);

    for (const node of result) {
      const index = graphNodes.indexOf(node);
      setHighlightedNode(index);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setHighlightedNode(null);
  };

  const handleGraphDFS = async () => {
    const result = startGraphDFS();

    if (!result.length) return;

    setCurrentOperation("Graph DFS");
    setTimeComplexity("O(V + E)");
    setSpaceComplexity("O(V)");
    setActualSteps(result.length);

    setTraversalResult(`GRAPH DFS: ${result.join(" → ")}`);
    setDfsCount((prev) => prev + 1);

    for (const node of result) {
      const index = graphNodes.indexOf(node);
      setHighlightedNode(index);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setHighlightedNode(null);
  };

  const handleShortestPath = async () => {
    const path = findShortestPath();

    if (!path.length) {
      setTraversalResult("NO PATH FOUND");
      return;
    }

    setCurrentOperation("Dijkstra's Shortest Path");
    setTimeComplexity("O((V + E) log V)");
    setSpaceComplexity("O(V)");
    setActualSteps(path.length);

    setTraversalResult(`PATH: ${path.join(" → ")}`);

    for (const node of path) {
      const index = graphNodes.indexOf(node);
      setHighlightedNode(index);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setHighlightedNode(null);
  };

  const handleTreeBFS = async () => {
    const result = startBFS();
    setCurrentOperation("BFS Traversal");
    setTimeComplexity("O(n)");
    setSpaceComplexity("O(n)");
    setActualSteps(treeNodes.length);

    if (!Array.isArray(result) || !result.length) return;

    setTraversalResult(`TREE BFS: ${result.join(" → ")}`);
    setBfsCount((prev) => prev + 1);

    for (const node of result) {
      setHighlightedNode(node);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setHighlightedNode(null);
  };

  const handleTreeDFS = async () => {
    const result = startDFS();
    setCurrentOperation("DFS Traversal");
    setTimeComplexity("O(n)");
    setSpaceComplexity("O(log n)");
    setActualSteps(treeNodes.length);

    if (!Array.isArray(result) || !result.length) return;

    setTraversalResult(`TREE DFS: ${result.join(" → ")}`);
    setDfsCount((prev) => prev + 1);

    for (const node of result) {
      setHighlightedNode(node);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setHighlightedNode(null);
  };

  const handleTreeInorder = async () => {
    const result = startInorder();
    setCurrentOperation("Inorder Traversal");
    setTimeComplexity("O(n)");
    setSpaceComplexity("O(log n)");
    setActualSteps(treeNodes.length);

    if (!Array.isArray(result) || !result.length) return;

    setTraversalResult(`INORDER: ${result.join(" → ")}`);

    for (const node of result) {
      setHighlightedNode(node);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setHighlightedNode(null);
  };

  const handleTreePreorder = async () => {
    const result = startPreorder();
    setCurrentOperation("Preorder Traversal");
    setTimeComplexity("O(n)");
    setSpaceComplexity("O(log n)");
    setActualSteps(treeNodes.length);

    if (!Array.isArray(result) || !result.length) return;

    setTraversalResult(`PREORDER: ${result.join(" → ")}`);

    for (const node of result) {
      setHighlightedNode(node);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setHighlightedNode(null);
  };

  const handleTreePostorder = async () => {
    const result = startPostorder();
    setCurrentOperation("Postorder Traversal");
    setTimeComplexity("O(n)");
    setSpaceComplexity("O(log n)");
    setActualSteps(treeNodes.length);

    if (!Array.isArray(result) || !result.length) return;

    setTraversalResult(`POSTORDER: ${result.join(" → ")}`);

    for (const node of result) {
      setHighlightedNode(node);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setHighlightedNode(null);
  };

  const handleTreeSearch = (val) => {
    const success = searchNode(val);
    setCurrentOperation("Search");
    setTimeComplexity("O(log n)");
    setSpaceComplexity("O(1)");
    setActualSteps(
      Math.max(1, Math.ceil(Math.log2(treeNodes.length + 1)))
    );
    if (success) {
      setTraversalResult(`FOUND NODE: ${val}`);
    } else {
      setTraversalResult(`NODE ${val} NOT FOUND`);
    }
  };

  if (isMobile) {
    return <MobileApp />;
  }
  if (authLoading || showSplash) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "radial-gradient(circle at center, #020617 0%, #000000 100%)",
          fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "rgba(34,211,238,0.08)",
            filter: "blur(50px)",
          }}
        />

        <div
          style={{
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            border: "5px solid rgba(34,211,238,0.18)",
            borderTop: "5px solid #22d3ee",
            boxShadow: "0 0 60px rgba(34,211,238,0.45)",
            animation: "spin 1.2s linear infinite",
            position: "absolute",
            zIndex: 0,
          }}
        />

        <h1
          style={{
            margin: 0,
            background: "linear-gradient(to right, #ffffff 30%, #a5f3fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "42px",
            fontWeight: "300",
            letterSpacing: "12px",
            textIndent: "12px",
            filter: "drop-shadow(0 0 15px rgba(34,211,238,0.4))",
            textTransform: "uppercase",
            marginBottom: "16px",
            zIndex: 1,
          }}
        >
          Stackverse
        </h1>

        <p
          style={{
            margin: 0,
            color: "rgba(148, 163, 184, 0.8)",
            fontSize: "12px",
            letterSpacing: "6px",
            textTransform: "uppercase",
            fontWeight: "400",
            textIndent: "6px",
            marginBottom: "40px",
            zIndex: 1,
          }}
        >
          Entering the Data Structure Universe...
        </p>

        <div
          style={{
            width: "350px",
            maxWidth: "80vw",
            height: "4px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "75%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, #a5f3fc, #22d3ee)",
              borderRadius: "999px",
              boxShadow: "0 0 10px rgba(34,211,238,0.5)",
            }}
          />
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }


  return (
    <>
      {!gameStarted && (
        <MainMenu
          onStart={() => setGameStarted(true)}
          graphPreview={<GraphPreview />}
        />
      )}
      
      {gameStarted && (
        <Sidebar
          currentWorld={currentWorld}
          switchWorld={switchWorld}
          user={user}
          level={level}
          xp={xp}
          signOut={() => signOut(auth)}
          setShowAchievements={setShowAchievements}
        />
      )}

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <CyberBackground />
        
        {currentWorld === "stack" ? (
        <StackWorld
          stack={stack}
          shake={shake}
          pushBlock={pushBlock}
          powerMode={powerMode}
        />
      ) : currentWorld === "queue" ? (
        <QueueWorld queue={queue} shake={shake} />
      ) : currentWorld === "tree" ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          {console.log('APP TREE NODES:', treeNodes)}
          <TreeWorld
            nodes={treeNodes}
            highlightedNode={highlightedNode}
          />
        </div>
      ) : currentWorld === "graph" ? (
        <GraphWorld
          nodes={graphNodes}
          edges={graphEdges}
          shortestPath={shortestPath}
          highlightedNode={highlightedNode}
        />
      ) : currentWorld === "linkedlist" ? (
        <LinkedListWorld 
          addXP={addXP} 
          setLearningStats={(op, time, space, steps) => {
            setCurrentOperation(op);
            setTimeComplexity(time);
            setSpaceComplexity(space);
            setActualSteps(steps);
          }}
        />
      ) : (
        <HeapWorld
          heap={heap}
          swappedNodes={swappedNodes}
        />
      )}
      <LevelPopup show={showLevelUp} />
      <LevelUpPopup
        isOpen={showLevelUp}
        level={levelReached}
      />
      <WarningPopup warning={warning} />
      <ComboPopup combo={combo} />
      <FloatingXP
        show={showXP}
        amount={powerMode ? 20 : 10}
      />
      <Shockwave show={showShockwave} />

      {currentWorld !== "menu" && gameStarted && (
        <LearningPanel
          operation={currentOperation}
          timeComplexity={timeComplexity}
          spaceComplexity={spaceComplexity}
          actualOperations={actualSteps}
          worldName={currentWorld}
        />
      )}

      {currentWorld === "stack" && (
        <>
          <HUD
            stack={stack}
            xp={xp}
            level={level}
            combo={combo}
            xpProgress={xpProgress}
            powerMode={powerMode}
          />
          <div
            style={{
              position: "absolute",
              top: "90px",
              left: "20px",
              zIndex: 300,
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(15,23,42,0.82)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(249,115,22,0.25)",
              color: "white",
              fontSize: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}
          >
            <h3 style={{ margin: 0, color: "#f97316", fontSize: "14px", marginBottom: "4px" }}>
              STACK KINGDOM
            </h3>
            <div style={{ margin: 0 }}>Stack Size: {stack.length}/5</div>
            <div style={{ margin: 0 }}>Top: {stack.length > 0 ? stack[stack.length - 1] : "None"}</div>
          </div>
        </>
      )}

      {currentWorld === "queue" && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            left: "20px",
            zIndex: 300,
            padding: "12px 16px",
            borderRadius: "12px",
            background: "rgba(15,23,42,0.82)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(168,85,247,0.2)",
            color: "white",
            fontSize: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}
        >
          <h3 style={{ margin: 0, color: "#a855f7", fontSize: "14px", marginBottom: "4px" }}>
            QUEUE CITY
          </h3>
          <div style={{ margin: 0 }}>Queue Size: {queue.length}/5</div>
        </div>
      )}

      {currentWorld === "tree" && (
        <>
          {console.log('TREE STATS NODES:', treeNodes)}
          <div
            style={{
              position: "absolute",
              top: "110px",
              left: "20px",
              zIndex: 300,
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(15,23,42,0.82)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(20,184,166,0.2)",
              color: "white",
              fontSize: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}
          >
            <h3 style={{ margin: 0, color: "#14b8a6", fontSize: "14px", marginBottom: "4px" }}>
              TREE NEXUS
            </h3>
            <div style={{ margin: 0 }}>Height: {Math.ceil(Math.log2(treeNodes.length + 1))}</div>
            <div style={{ margin: 0 }}>Type: BST</div>
            <div style={{ margin: 0 }}>Nodes: {treeNodes.length}</div>
            <div style={{ margin: 0 }}>Root: {treeNodes.length > 0 ? treeNodes[0] : "None"}</div>
          </div>
        </>
      )}
      {currentWorld === "graph" && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            left: "20px",
            zIndex: 300,
            padding: "12px 16px",
            borderRadius: "12px",
            background: "rgba(15,23,42,0.82)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(99,102,241,0.25)",
            color: "white",
            fontSize: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}
        >
          <h3 style={{ margin: 0, color: "#6366f1", fontSize: "14px", marginBottom: "4px" }}>
            GRAPH REALM
          </h3>
          <div style={{ margin: 0 }}>Vertices: {graphNodes.length}</div>
          <div style={{ margin: 0 }}>Edges: {graphEdges.length}</div>
          <div style={{ margin: 0 }}>Type: Undirected</div>
          <div style={{ margin: 0 }}>Root: {graphNodes.length > 0 ? graphNodes[0] : "None"}</div>
        </div>
      )}
      {currentWorld === "heap" && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            left: "20px",
            zIndex: 300,
            padding: "12px 16px",
            borderRadius: "12px",
            background: "rgba(15,23,42,0.82)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(249,115,22,0.25)",
            color: "white",
            fontSize: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}
        >
          <h3 style={{ margin: 0, color: "#f97316", fontSize: "14px", marginBottom: "4px" }}>
            HEAP CITADEL
          </h3>
          <div style={{ margin: 0 }}>Nodes: {heap.length}</div>
          <div style={{ margin: 0 }}>Root: {heap.length > 0 ? heap[0] : "None"}</div>
          <div style={{ margin: 0 }}>Height: {Math.ceil(Math.log2(heap.length + 1))}</div>
          <div style={{ margin: 0 }}>Type: {heapType === "min" ? "Min Heap" : "Max Heap"}</div>
        </div>
      )}

      {gameStarted && currentWorld === "stack" ? (
        <OperationsPanel
          onInsert={pushBlock}
          insertLabel="PUSH"
          color="#f97316"
          secondaryActions={[
            { label: "POP", onClick: popBlock },
            { label: "PEEK", onClick: () => {
                setCurrentOperation("Peek");
                setTimeComplexity("O(1)");
                setSpaceComplexity("O(1)");
                setActualSteps(1);
                const res = peekBlock();
                if (res?.success) alert(`PEEK Result: ${res.value}`);
                else if (res?.message) alert(res.message);
              }
            },
            { label: "CLEAR", onClick: () => {
                setCurrentOperation("Clear");
                setTimeComplexity("O(n)");
                setSpaceComplexity("O(1)");
                setActualSteps(stack.length);
                clearStack();
              }, 
              isDanger: true 
            }
          ]}
        />
      ) : gameStarted && currentWorld === "queue" ? (
        <OperationsPanel
          onInsert={enqueue}
          insertLabel="ENQUEUE"
          color="#a855f7"
          secondaryActions={[
            { label: "DEQUEUE", onClick: dequeue },
            { label: "PEEK", onClick: () => {
                setCurrentOperation("Peek");
                setTimeComplexity("O(1)");
                setSpaceComplexity("O(1)");
                setActualSteps(1);
                const res = peekQueue();
                if (res?.success) alert(`PEEK Result: ${res.value}`);
                else if (res?.message) alert(res.message);
              }
            },
            { label: "CLEAR", onClick: () => {
                setCurrentOperation("Clear");
                setTimeComplexity("O(n)");
                setSpaceComplexity("O(1)");
                setActualSteps(queue.length);
                clearQueue();
              }, 
              isDanger: true 
            }
          ]}
        />
      ) : (
        <>
          {gameStarted && currentWorld === "tree" && (
            <>
              <OperationsPanel
                onInsert={(val) => {
                  insertNode(val);
                  setCurrentOperation("Insert");
                  setTimeComplexity("O(log n)");
                  setSpaceComplexity("O(1)");
                  setActualSteps(Math.max(1, Math.ceil(Math.log2(treeNodes.length + 2))));
                }}
                insertLabel="ADD NODE"
                color="#22d3ee"
                secondaryActions={[
                  { 
                    label: "SEARCH", 
                    onClick: (val) => {
                      const res = handleTreeSearch(val);
                    }
                  },
                  { 
                    label: "DELETE", 
                    onClick: (val) => {
                      deleteNode(val);
                      setCurrentOperation("Delete");
                      setTimeComplexity("O(log n)");
                      setSpaceComplexity("O(1)");
                      setActualSteps(Math.max(1, Math.ceil(Math.log2(treeNodes.length + 1))));
                    },
                    isDanger: true
                  },
                  { label: "BFS", onClick: handleTreeBFS },
                  { label: "DFS", onClick: handleTreeDFS },
                  { label: "INORDER", onClick: handleTreeInorder },
                  { label: "PREORDER", onClick: handleTreePreorder },
                  { label: "POSTORDER", onClick: handleTreePostorder },
                  { label: "RESET", onClick: resetTree, isDanger: true }
                ]}
              />

              {traversalResult && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 400,
                    padding: "14px 22px",
                    borderRadius: "16px",
                    background: "rgba(15,23,42,0.9)",
                    color: "#22d3ee",
                    fontWeight: "bold",
                    border: "1px solid rgba(34,211,238,0.25)",
                    boxShadow: "0 0 20px rgba(34,211,238,0.2)",
                    maxWidth: "80%",
                    textAlign: "center",
                  }}
                >
                  {traversalResult}
                </div>
              )}
            </>
          )}
          {gameStarted && currentWorld === "graph" && (
            <>
              <OperationsPanel
                inputType="text"
                onInsert={(val) => addVertex(val)}
                insertLabel="ADD VERTEX"
                color="#6366f1"
                headerSlot={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        value={edgeInput} 
                        onChange={(e) => setEdgeInput(e.target.value)} 
                        placeholder="Edge (A-B)" 
                        style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "10px 14px", color: "white", outline: "none", fontSize: "14px" }} 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        value={startVertex} 
                        onChange={(e) => setStartVertex(e.target.value)} 
                        placeholder="Start Node" 
                        style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "10px 14px", color: "white", outline: "none", fontSize: "14px" }} 
                      />
                      <input 
                        value={endVertex} 
                        onChange={(e) => setEndVertex(e.target.value)} 
                        placeholder="End Node" 
                        style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "10px 14px", color: "white", outline: "none", fontSize: "14px" }} 
                      />
                    </div>
                  </div>
                }
                secondaryActions={[
                  { label: "DEL VERTEX", onClick: (val) => deleteVertex(val), isDanger: true },
                  { label: "ADD EDGE", onClick: addEdge },
                  { label: "DEL EDGE", onClick: deleteEdge, isDanger: true },
                  { label: "GRAPH BFS", onClick: handleGraphBFS },
                  { label: "GRAPH DFS", onClick: handleGraphDFS },
                  { label: "SHORTEST", onClick: handleShortestPath, color: "#22c55e" },
                  { label: "RESET", onClick: resetGraph, isDanger: true }
                ]}
              />
              {traversalResult && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "140px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 400,
                    padding: "14px 22px",
                    borderRadius: "16px",
                    background: "rgba(15,23,42,0.9)",
                    color: "#6366f1",
                    fontWeight: "bold",
                    border: "1px solid rgba(99,102,241,0.25)",
                    boxShadow: "0 0 20px rgba(99,102,241,0.2)",
                    maxWidth: "80%",
                    textAlign: "center",
                  }}
                >
                  {traversalResult}
                </div>
              )}
            </>
          )}
          {gameStarted && currentWorld === "heap" && (
            <>
              {heapSortResult && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "140px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 400,
                    padding: "14px 22px",
                    borderRadius: "16px",
                    background: "rgba(15,23,42,0.9)",
                    color: "#f97316",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {heapSortResult}
                </div>
              )}
              <OperationsPanel
                onInsert={(val) => insertHeap(val)}
                insertLabel="INSERT"
                color="#f97316"
                secondaryActions={[
                  { label: "EXTRACT ROOT", onClick: extractRoot },
                  { label: "DELETE NODE", onClick: (val) => deleteHeapNode(val), isDanger: true },
                  { label: "HEAP SORT", onClick: heapSort },
                  { label: "TOGGLE TYPE", onClick: () => {
                    const nextType = heapType === "min" ? "max" : "min";
                    setHeapType(nextType);
                    setWarning(nextType === "min" ? "SWITCHED TO MIN HEAP" : "SWITCHED TO MAX HEAP");
                    setTimeout(() => setWarning(""), 1500);
                    const rebuiltHeap = [];
                    heap.forEach((num) => {
                      rebuiltHeap.push(num);
                      let current = rebuiltHeap.length - 1;
                      while (current > 0) {
                        const parent = Math.floor((current - 1) / 2);
                        const correctOrder = nextType === "min" ? rebuiltHeap[parent] <= rebuiltHeap[current] : rebuiltHeap[parent] >= rebuiltHeap[current];
                        if (correctOrder) break;
                        [rebuiltHeap[parent], rebuiltHeap[current]] = [rebuiltHeap[current], rebuiltHeap[parent]];
                        current = parent;
                      }
                    });
                    setHeap(rebuiltHeap);
                    addXP(5);
                  }},
                  { label: "RESET", onClick: () => setHeap([]), isDanger: true }
                ]}
              />
            </>
          )}
        </>
      )}

      {achievementPopup && (
        <div
          style={{
            position: "fixed",
            top: "120px",
            right: "30px",
            zIndex: 6000,
            background: "rgba(15,23,42,0.95)",
            border: "2px solid #f59e0b",
            borderRadius: "20px",
            padding: "20px 24px",
            color: "white",
            boxShadow: "0 0 35px rgba(245,158,11,0.45)",
            minWidth: "280px",
          }}
        >
          <div
            style={{
              color: "#fbbf24",
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            🏆 ACHIEVEMENT UNLOCKED
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {achievementPopup}
          </div>

          <div style={{ color: "#22d3ee" }}>
            +50 XP
          </div>
        </div>
      )}

      {transitioning && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background:
              "radial-gradient(circle, rgba(15,23,42,0.92), rgba(2,6,23,1))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            style={{
              width: "220px",
              height: "220px",
              borderRadius: "999px",
              border: "5px solid rgba(34,211,238,0.25)",
              borderTop: "5px solid #22d3ee",
              animation: "spin 1s linear infinite",
              boxShadow: "0 0 60px rgba(34,211,238,0.45)",
              position: "absolute",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "420px",
              height: "420px",
              borderRadius: "999px",
              background: "rgba(34,211,238,0.08)",
              filter: "blur(40px)",
            }}
          />

          <h1
            style={{
              position: "relative",
              color: "white",
              fontSize: "42px",
              letterSpacing: "4px",
              textShadow: "0 0 25px rgba(34,211,238,0.7)",
              animation: "pulse 1.2s ease-in-out infinite",
            }}
          >
            {transitionText}
          </h1>

          <style>
            {`
              @keyframes spin {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }

              @keyframes pulse {
                0% {
                  opacity: 0.6;
                  transform: scale(0.96);
                }
                50% {
                  opacity: 1;
                  transform: scale(1);
                }
                100% {
                  opacity: 0.6;
                  transform: scale(0.96);
                }
              }

              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }

              @keyframes levelUpAppear {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }

                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}
          </style>
        </div>
      )}

      {showAchievements && (
        <div
          onClick={() => setShowAchievements(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 5000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0f172a",
              padding: "32px",
              borderRadius: "24px",
              minWidth: "600px",
              maxWidth: "800px",
              color: "white",
              border: "1px solid rgba(245,158,11,0.3)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowAchievements(false)}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "28px",
                cursor: "pointer",
                padding: "4px",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.color = "white"}
              onMouseLeave={(e) => e.target.style.color = "#94a3b8"}
            >
              ×
            </button>
            <h2 style={{ marginTop: 0 }}>🏆 ACHIEVEMENTS</h2>
            <p
              style={{
                color: "#fbbf24",
                marginBottom: "20px",
                fontWeight: "bold",
              }}
            >
              Completion: {completionPercent}%
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              {[
                { label: "Pushes", value: pushCount },
                { label: "Enqueues", value: enqueueCount },
                { label: "BFS Runs", value: bfsCount },
                { label: "DFS Runs", value: dfsCount },
                { label: "Heap Inserts", value: heapInsertCount },
                { label: "Heap Extracts", value: heapExtractCount },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    padding: "12px",
                    borderRadius: "12px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>{stat.label}</div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#f59e0b", marginTop: "4px" }}>{stat.value}</div>
                </div>
              ))}
            </div>
            
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                maxHeight: "45vh",
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                style={{
                  padding: "12px",
                  borderRadius: "14px",
                  background: achievement.unlocked
                    ? "rgba(245,158,11,0.15)"
                    : "rgba(15,23,42,0.6)",
                  boxShadow: achievement.unlocked
                    ? "0 0 20px rgba(245,158,11,0.2)"
                    : "none",
                  border: achievement.unlocked
                    ? "1px solid rgba(245,158,11,0.3)"
                    : "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <strong style={{ fontSize: "14px" }}>
                    {achievement.unlocked ? "✅" : "🔒"} {achievement.icon} {achievement.name}
                  </strong>
                  <span style={{ fontSize: "12px", opacity: 0.8 }}>{achievement.progress}</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: achievement.unlocked
                        ? "100%"
                        : achievement.name === "Stack Master"
                        ? `${Math.min((pushCount / 20) * 100, 100)}%`
                        : achievement.name === "Queue Commander"
                        ? `${Math.min((enqueueCount / 25) * 100, 100)}%`
                        : achievement.name === "Tree Explorer"
                        ? `${Math.min((bfsCount / 5) * 100, 100)}%`
                        : achievement.name === "DFS Hunter"
                        ? `${Math.min((dfsCount / 5) * 100, 100)}%`
                        : achievement.name === "Heap Builder"
                        ? `${Math.min((heapInsertCount / 10) * 100, 100)}%`
                        : `${Math.min((heapExtractCount / 10) * 100, 100)}%`,
                      height: "100%",
                      background: "#f59e0b",
                      transition: "0.3s ease",
                    }}
                  />
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}
      <MissionPanel
        mission={
          allMissionsCompleted
            ? "ALL MISSIONS COMPLETED 🚀"
            : currentMission.text
        }
        completed={missionCompleted}
      />
      </div>
    </>
  );
}