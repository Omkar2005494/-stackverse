import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase/firebase";

import StackWorld from "./worlds/StackWorld";
import QueueWorld from "./worlds/QueueWorld";
import TreeWorld from "./worlds/TreeWorld";
import GraphWorld from "./worlds/GraphWorld";
import HeapWorld from "./worlds/HeapWorld";
import HUD from "./components/HUD";
import Controls from "./components/Controls";
import LevelPopup from "./components/LevelPopup";
import WarningPopup from "./components/WarningPopup";
import MissionPanel from "./components/MissionPanel";
import ComboPopup from "./components/ComboPopup";
import FloatingXP from "./components/FloatingXP";
import Shockwave from "./components/Shockwave";
import MainMenu from "./components/MainMenu";
import Login from "./components/Login";
import GraphPreview from "./components/GraphPreview";
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
  const {
    xp,
    level,
    addXP,
  } = useGameProgress();
  const { stack, setStack } = useStackLogic();
  const { queue, setQueue } = useQueueLogic();
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
  const [showLevelUp, setShowLevelUp] = useState(false);
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
  const powerMode = combo >= 5;
  const { user, authLoading } = useAuth();
  const {
    currentWorld,
    setCurrentWorld,
    transitioning,
    transitionText,
    switchWorld,
  } = useWorldNavigation();

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

  const pushBlock = () => {
    if (stack.length >= 5) {
      setWarning("STACK OVERFLOW!");
      setShake(true);

      setTimeout(() => {
        setWarning("");
        setShake(false);
      }, 1500);

      return;
    }

    const newStack = [...stack, stack.length + 1];
    setStack(newStack);
    setPushCount((prev) => prev + 1);

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
  };

  const enqueue = () => {
    if (queue.length >= 5) {
      setWarning("QUEUE OVERFLOW!");
      setShake(true);

      setTimeout(() => {
        setWarning("");
        setShake(false);
      }, 1500);

      return;
    }

    const newQueue = [...queue, queue.length + 1];
    setQueue(newQueue);
    setEnqueueCount((prev) => prev + 1);

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
  };



  const insertHeap = () => {
    const value = Number(heapInput);

    if (heapInput.trim() === "" || Number.isNaN(value)) {
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
  };

  const deleteHeapNode = () => {
    const value = Number(heapInput);

    if (heapInput.trim() === "" || Number.isNaN(value)) {
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
  };

  const heapSort = () => {
    const sorted = [...heap].sort((a, b) => a - b);

    setHeapSortResult(
      `SORTED: ${sorted.join(" → ")}`
    );

    addXP(20);
  };

  const handleGraphBFS = async () => {
    const result = startGraphBFS();

    if (!result.length) return;

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

    if (!Array.isArray(result) || !result.length) return;

    setTraversalResult(`POSTORDER: ${result.join(" → ")}`);

    for (const node of result) {
      setHighlightedNode(node);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setHighlightedNode(null);
  };

  const handleTreeSearch = () => {
    const found = searchNode(searchInput);

    if (found) {
      setTraversalResult(`FOUND NODE: ${searchInput}`);
    } else {
      setTraversalResult(`NODE ${searchInput} NOT FOUND`);
    }
  };


  if (authLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#020617",
          color: "white",
          fontSize: "24px",
        }}
      >
        Loading StackVerse...
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
      {currentWorld === "stack" ? (
        <StackWorld
          stack={stack}
          shake={shake}
          pushBlock={pushBlock}
          powerMode={powerMode}
        />
      ) : currentWorld === "queue" ? (
        <QueueWorld queue={queue} />
      ) : currentWorld === "tree" ? (
        <TreeWorld
          nodes={treeNodes}
          highlightedNode={highlightedNode}
        />
      ) : currentWorld === "graph" ? (
        <GraphWorld
          nodes={graphNodes}
          edges={graphEdges}
          shortestPath={shortestPath}
          highlightedNode={highlightedNode}
        />
      ) : (
        <HeapWorld
          heap={heap}
          swappedNodes={swappedNodes}
        />
      )}
      <LevelPopup show={showLevelUp} />
      <WarningPopup warning={warning} />
      <ComboPopup combo={combo} />
      <FloatingXP
        show={showXP}
        amount={powerMode ? 20 : 10}
      />
      <Shockwave show={showShockwave} />
      {currentWorld === "stack" && (
        <HUD
          stack={stack}
          xp={xp}
          level={level}
          combo={combo}
          xpProgress={xpProgress}
          powerMode={powerMode}
        />
      )}

      {currentWorld === "queue" && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            left: "20px",
            zIndex: 300,
            padding: "18px",
            borderRadius: "18px",
            background: "rgba(15,23,42,0.82)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(168,85,247,0.2)",
            color: "white",
            minWidth: "220px",
          }}
        >
          <h3 style={{ margin: 0, color: "#a855f7" }}>
            QUEUE CITY
          </h3>
          <p>Queue Size: {queue.length}/5</p>
          <p>XP: {xp}</p>
          <p>Level: {level}</p>
        </div>
      )}

      {currentWorld === "tree" && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            left: "20px",
            zIndex: 300,
            padding: "18px",
            borderRadius: "18px",
            background: "rgba(15,23,42,0.82)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(20,184,166,0.2)",
            color: "white",
            minWidth: "220px",
          }}
        >
          <h3 style={{ margin: 0, color: "#14b8a6" }}>
            TREE NEXUS
          </h3>
          <p>Height: {Math.ceil(Math.log2(treeNodes.length + 1))}</p>
          <p>Type: BST</p>
          <p>Nodes: {treeNodes.length}</p>
          <p>
            Root: {treeNodes.length > 0 ? treeNodes[0] : "None"}
          </p>
          <p>XP: {xp}</p>
          <p>Level: {level}</p>
        </div>
      )}
      {currentWorld === "graph" && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            left: "20px",
            zIndex: 300,
            padding: "18px",
            borderRadius: "18px",
            background: "rgba(15,23,42,0.82)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(99,102,241,0.25)",
            color: "white",
            minWidth: "220px",
          }}
        >
          <h3 style={{ margin: 0, color: "#6366f1" }}>
            GRAPH REALM
          </h3>
          <p>Vertices: {graphNodes.length}</p>
          <p>Edges: {graphEdges.length}</p>
          <p>Type: Undirected Graph</p>
          <p>
            Root Vertex: {graphNodes.length > 0 ? graphNodes[0] : "None"}
          </p>
          <p>XP: {xp}</p>
          <p>Level: {level}</p>
        </div>
      )}
      {currentWorld === "heap" && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            left: "20px",
            zIndex: 300,
            padding: "18px",
            borderRadius: "18px",
            background: "rgba(15,23,42,0.82)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(249,115,22,0.25)",
            color: "white",
            minWidth: "220px",
          }}
        >
          <h3 style={{ margin: 0, color: "#f97316" }}>
            HEAP CITADEL
          </h3>

          <p>Nodes: {heap.length}</p>
          <p>Root: {heap.length > 0 ? heap[0] : "None"}</p>
          <p>Height: {Math.ceil(Math.log2(heap.length + 1))}</p>
          <p>Type: {heapType === "min" ? "Min Heap" : "Max Heap"}</p>
          <p>XP: {xp}</p>
          <p>Level: {level}</p>
        </div>
      )}

      {currentWorld === "stack" ? (
        <Controls
          pushBlock={pushBlock}
          popBlock={popBlock}
        />
      ) : currentWorld === "queue" ? (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "18px",
            zIndex: 300,
          }}
        >
          <button
            onClick={enqueue}
            style={{
              padding: "14px 24px",
              borderRadius: "16px",
              border: "none",
              background: "#22d3ee",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(34,211,238,0.5)",
            }}
          >
            ENQUEUE
          </button>

          <button
            onClick={dequeue}
            style={{
              padding: "14px 24px",
              borderRadius: "16px",
              border: "none",
              background: "#a855f7",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(168,85,247,0.5)",
            }}
          >
            DEQUEUE
          </button>
        </div>
      ) : (
        <>
          {currentWorld === "tree" && (
            <>
              <div
                style={{
                  position: "absolute",
                  bottom: "40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "18px",
                  zIndex: 300,
                  padding: "18px",
                  background: "rgba(15,23,42,0.82)",
                  borderRadius: "22px",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <input
                  type="number"
                  value={nodeInput}
                  onChange={(e) => setNodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      insertNode();
                    }
                  }}
                  placeholder={
                    treeNodes.length === 0
                      ? "Root Node"
                      : "Node Value"
                  }
                  style={{
                    padding: "14px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(15,23,42,0.9)",
                    color: "white",
                    width: "120px",
                    outline: "none",
                  }}
                />
                <input
                  type="number"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTreeSearch();
                    }
                  }}
                  placeholder="Search"
                  style={{
                    padding: "14px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(15,23,42,0.9)",
                    color: "white",
                    width: "120px",
                    outline: "none",
                  }}
                />
                <button
                  onClick={insertNode}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#22d3ee",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "0 0 20px rgba(34,211,238,0.5)",
                  }}
                >
                  ADD NODE
                </button>
                <button
                  onClick={handleTreeSearch}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#f59e0b",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "0 0 20px rgba(245,158,11,0.5)",
                  }}
                >
                  SEARCH
                </button>
                <button
                  onClick={() => deleteNode(searchInput)}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "0 0 20px rgba(239,68,68,0.5)",
                  }}
                >
                  DELETE
                </button>
                <button
                  onClick={resetTree}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#a855f7",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "0 0 20px rgba(168,85,247,0.5)",
                  }}
                >
                  RESET TREE
                </button>
                <button
                  onClick={handleTreeBFS}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#14b8a6",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "0 0 20px rgba(20,184,166,0.5)",
                  }}
                >
                  START BFS
                </button>
                <button
                  onClick={handleTreeDFS}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#0ea5e9",
                    color: "white",
                    fontWeight: "bold",
                    boxShadow: "0 0 20px rgba(14,165,233,0.5)",
                  }}
                >
                  START DFS
                </button>
                <button
                  onClick={handleTreeInorder}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#10b981",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  INORDER
                </button>
                <button
                  onClick={handleTreePreorder}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#6366f1",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  PREORDER
                </button>
                <button
                  onClick={handleTreePostorder}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#ec4899",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  POSTORDER
                </button>
              </div>
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
          {currentWorld === "graph" && (
            <>
              <div
                style={{
                  position: "absolute",
                  bottom: "40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "18px",
                  zIndex: 300,
                  padding: "18px",
                  background: "rgba(15,23,42,0.82)",
                  borderRadius: "22px",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(99,102,241,0.15)",
                }}
              >
                <input
                  type="text"
                  value={vertexInput}
                  onChange={(e) => setVertexInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addVertex();
                    }
                  }}
                  placeholder="Vertex"
                  style={{
                    padding: "14px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(15,23,42,0.9)",
                    color: "white",
                    width: "120px",
                    outline: "none",
                  }}
                />
                <input
                  type="text"
                  value={edgeInput}
                  onChange={(e) => setEdgeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addEdge();
                    }
                  }}
                  placeholder="A-B"
                  style={{
                    padding: "14px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(15,23,42,0.9)",
                    color: "white",
                    width: "120px",
                    outline: "none",
                  }}
                />
                <input
                  type="text"
                  value={startVertex}
                  onChange={(e) => setStartVertex(e.target.value)}
                  placeholder="Start"
                  style={{
                    padding: "14px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(15,23,42,0.9)",
                    color: "white",
                    width: "90px",
                    outline: "none",
                  }}
                />
                <input
                  type="text"
                  value={endVertex}
                  onChange={(e) => setEndVertex(e.target.value)}
                  placeholder="End"
                  style={{
                    padding: "14px",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(15,23,42,0.9)",
                    color: "white",
                    width: "90px",
                    outline: "none",
                  }}
                />
                <button
                  onClick={addVertex}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#6366f1",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  ADD VERTEX
                </button>
                <button
                  onClick={deleteVertex}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  DELETE VERTEX
                </button>

                <button
                  onClick={addEdge}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#14b8a6",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  ADD EDGE
                </button>
                <button
                  onClick={deleteEdge}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#dc2626",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  DELETE EDGE
                </button>

                <button
                  onClick={handleGraphBFS}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#f59e0b",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  GRAPH BFS
                </button>

                <button
                  onClick={handleGraphDFS}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#ec4899",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  GRAPH DFS
                </button>
                <button
                  onClick={handleShortestPath}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#22c55e",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  SHORTEST PATH
                </button>
                <button
                  onClick={resetGraph}
                  style={{
                    padding: "14px 24px",
                    borderRadius: "16px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  RESET GRAPH
                </button>
              </div>
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
          {currentWorld === "heap" && (
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
              <div
                style={{
                  position: "absolute",
                  bottom: "40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "16px",
                  zIndex: 300,
                  padding: "18px",
                  background: "rgba(15,23,42,0.82)",
                  borderRadius: "22px",
                }}
              >
                <input
                  value={heapInput}
                  onChange={(e) => setHeapInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      insertHeap();
                    }
                  }}
                  placeholder="Value"
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                  }}
                />

                <button
                  onClick={() => {
                    const nextType =
                      heapType === "min" ? "max" : "min";

                    setHeapType(nextType);
                    setWarning(
                      nextType === "min"
                        ? "SWITCHED TO MIN HEAP"
                        : "SWITCHED TO MAX HEAP"
                    );
                    setTimeout(() => {
                      setWarning("");
                    }, 1500);

                    const rebuiltHeap = [];

                    heap.forEach((num) => {
                      rebuiltHeap.push(num);

                      let current = rebuiltHeap.length - 1;

                      while (current > 0) {
                        const parent = Math.floor((current - 1) / 2);

                        const correctOrder =
                          nextType === "min"
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
                    addXP(5);
                  }}
                >
                  {heapType === "min" ? "MIN HEAP" : "MAX HEAP"}
                </button>

                <button onClick={insertHeap}>
                  INSERT
                </button>

                <button onClick={extractRoot}>
                  EXTRACT ROOT
                </button>
                <button onClick={deleteHeapNode}>
                  DELETE NODE
                </button>

                <button onClick={heapSort}>
                  HEAP SORT
                </button>

                <button onClick={() => setHeap([])}>
                  RESET
                </button>
              </div>
            </>
          )}
        </>
      )}

      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "row",
          gap: "12px",
          zIndex: 300,
          padding: "10px 12px",
          borderRadius: "999px",
          background: "rgba(15,23,42,0.72)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button
          onClick={() =>
            switchWorld("tree", "ENTERING TREE NEXUS")
          }
          style={{
            padding: "12px 18px",
            borderRadius: "999px",
            border: "none",
            background:
              currentWorld === "tree"
                ? "#14b8a6"
                : "#1e293b",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            minWidth: "120px",
            fontSize: "16px",
            letterSpacing: "1px",
            transition: "all 0.25s ease",
            boxShadow:
              currentWorld === "tree"
                ? "0 0 20px rgba(20,184,166,0.6)"
                : "none",
          }}
        >
          🌳 Tree
        </button>
        <button
          onClick={() =>
            switchWorld("stack", "ENTERING STACK KINGDOM")
          }
          style={{
            padding: "12px 18px",
            borderRadius: "999px",
            border: "none",
            background:
              currentWorld === "stack"
                ? "#22d3ee"
                : "#1e293b",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            minWidth: "120px",
            fontSize: "16px",
            letterSpacing: "1px",
            transition: "all 0.25s ease",
            boxShadow:
              currentWorld === "stack"
                ? "0 0 20px rgba(34,211,238,0.6)"
                : "none",
          }}
        >
          📚 Stack
        </button>
        <button
          onClick={() =>
            switchWorld("queue", "ENTERING QUEUE CITY")
          }
          style={{
            padding: "12px 18px",
            borderRadius: "999px",
            border: "none",
            background:
              currentWorld === "queue"
                ? "#a855f7"
                : "#1e293b",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            minWidth: "120px",
            fontSize: "16px",
            letterSpacing: "1px",
            transition: "all 0.25s ease",
            boxShadow:
              currentWorld === "queue"
                ? "0 0 20px rgba(168,85,247,0.6)"
                : "none",
          }}
        >
          📬 Queue
        </button>
        <button
          onClick={() =>
            switchWorld("graph", "ENTERING GRAPH REALM")
          }
          style={{
            padding: "12px 18px",
            borderRadius: "999px",
            border: "none",
            background:
              currentWorld === "graph"
                ? "#6366f1"
                : "#1e293b",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            minWidth: "120px",
            fontSize: "16px",
            letterSpacing: "1px",
            boxShadow:
              currentWorld === "graph"
                ? "0 0 20px rgba(99,102,241,0.6)"
                : "none",
          }}
        >
          🌐 Graph
        </button>
        <button
          onClick={() =>
            switchWorld("heap", "ENTERING HEAP CITADEL")
          }
          style={{
            padding: "12px 18px",
            borderRadius: "999px",
            border: "none",
            background:
              currentWorld === "heap"
                ? "#f97316"
                : "#1e293b",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            minWidth: "120px",
            fontSize: "16px",
            letterSpacing: "1px",
            boxShadow:
              currentWorld === "heap"
                ? "0 0 20px rgba(249,115,22,0.6)"
                : "none",
          }}
        >
          🌋 Heap
        </button>
        <button
          onClick={() => setShowAchievements(true)}
          style={{
            padding: "12px 18px",
            borderRadius: "999px",
            border: "none",
            background: "#f59e0b",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            minWidth: "120px",
            boxShadow:
              "0 0 20px rgba(245,158,11,0.35)",
            fontSize: "16px",
            letterSpacing: "1px",
          }}
        >
          🏆 Awards
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          top: "18px",
          right: "20px",
          zIndex: 400,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 10px",
          borderRadius: "999px",
          background: "rgba(15,23,42,0.72)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          style={{
            color: "white",
            fontWeight: "bold",
            maxWidth: "120px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          👤 {user?.email?.split('@')[0]}
        </span>

        <button
          onClick={() => signOut(auth)}
          style={{
            padding: "8px 12px",
            borderRadius: "999px",
            border: "none",
            background: "#ef4444",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "13px",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
          }}
        >
          ⏻
        </button>
      </div>

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
              padding: "24px",
              borderRadius: "20px",
              minWidth: "520px",
              maxWidth: "600px",
              color: "white",
              border: "1px solid rgba(245,158,11,0.3)",
            }}
          >
            <h2>🏆 ACHIEVEMENTS</h2>
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
                background: "rgba(255,255,255,0.05)",
                padding: "14px",
                borderRadius: "14px",
                marginBottom: "20px",
              }}
            >
              <div>Total Pushes: {pushCount}</div>
              <div>Total Enqueues: {enqueueCount}</div>
              <div>BFS Runs: {bfsCount}</div>
              <div>DFS Runs: {dfsCount}</div>
              <div>Heap Inserts: {heapInsertCount}</div>
              <div>Heap Extracts: {heapExtractCount}</div>
            </div>
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                style={{
                  marginBottom: "14px",
                  padding: "12px",
                  borderRadius: "14px",
                  background: achievement.unlocked
                    ? "rgba(245,158,11,0.15)"
                    : "transparent",
                  boxShadow: achievement.unlocked
                    ? "0 0 20px rgba(245,158,11,0.25)"
                    : "none",
                  border: achievement.unlocked
                    ? "1px solid rgba(245,158,11,0.3)"
                    : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <strong>
                  {achievement.unlocked ? "✅" : "🔒"} {achievement.icon} {achievement.name}
                </strong>
                <div>{achievement.progress}</div>
                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    background: "#1e293b",
                    borderRadius: "999px",
                    marginTop: "8px",
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
      )}
      <MissionPanel
        mission={
          allMissionsCompleted
            ? "ALL MISSIONS COMPLETED 🚀"
            : currentMission.text
        }
        completed={missionCompleted}
      />
    </>
  );
}