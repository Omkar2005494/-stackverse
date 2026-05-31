import { useEffect, useState } from "react";

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
import GraphPreview from "./components/GraphPreview";
import { missions } from "./game/missions";


export default function App() {
  const [stack, setStack] = useState([1]);
  const [queue, setQueue] = useState([1, 2, 3]);
  const [heap, setHeap] = useState([10, 20, 30, 40, 50]);
  const [heapInput, setHeapInput] = useState("");
  const [heapInsertCount, setHeapInsertCount] = useState(0);
  const [heapExtractCount, setHeapExtractCount] = useState(0);
  const [heapType, setHeapType] = useState("min");
  const [swappedNodes, setSwappedNodes] = useState([]);
  const [currentWorld, setCurrentWorld] = useState("stack");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [warning, setWarning] = useState("");
  const [shake, setShake] = useState(false);
  const [combo, setCombo] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [showShockwave, setShowShockwave] = useState(false);
  const [missionIndex, setMissionIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [treeNodes, setTreeNodes] = useState([]);
  const [graphNodes, setGraphNodes] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);
  const [vertexInput, setVertexInput] = useState("");
  const [edgeInput, setEdgeInput] = useState("");
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [nodeInput, setNodeInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [traversalResult, setTraversalResult] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState("");
  const [pushCount, setPushCount] = useState(0);
  const [enqueueCount, setEnqueueCount] = useState(0);
  const [bfsCount, setBfsCount] = useState(0);
  const [dfsCount, setDfsCount] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievementPopup, setAchievementPopup] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [startVertex, setStartVertex] = useState("");
  const [endVertex, setEndVertex] = useState("");
  const [shortestPath, setShortestPath] = useState([]);
  const [heapSortResult, setHeapSortResult] = useState("");
  const powerMode = combo >= 5;

  const currentMission = missions[missionIndex];

  useEffect(() => {
    const savedData = localStorage.getItem("stackverse-save");

    if (!savedData) return;

    const parsed = JSON.parse(savedData);

    setXp(parsed.xp || 0);
    setLevel(parsed.level || 1);
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
        setXp((prev) => prev + 50);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [missionCompleted]);

  useEffect(() => {
    const calculatedLevel = Math.floor(xp / 50) + 1;

    if (calculatedLevel > level) {
      setLevel(calculatedLevel);
      setShowLevelUp(true);

      setTimeout(() => {
        setShowLevelUp(false);
      }, 2000);
    }
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(
      "stackverse-save",
      JSON.stringify({
        xp,
        level,
        currentWorld,
        missionIndex,
        pushCount,
        enqueueCount,
        bfsCount,
        dfsCount,
        unlockedAchievements,
      })
    );
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

  const xpProgress = (xp % 50) * 2;
  const allMissionsCompleted = missionIndex >= missions.length - 1 && missionCompleted;
  const achievements = [
    {
      icon: "🧱",
      name: "Stack Master",
      unlocked: pushCount >= 20,
      progress: `${pushCount}/20`,
    },
    {
      icon: "📬",
      name: "Queue Commander",
      unlocked: enqueueCount >= 25,
      progress: `${enqueueCount}/25`,
    },
    {
      icon: "🌳",
      name: "Tree Explorer",
      unlocked: bfsCount >= 5,
      progress: `${bfsCount}/5`,
    },
    {
      icon: "🔍",
      name: "DFS Hunter",
      unlocked: dfsCount >= 5,
      progress: `${dfsCount}/5`,
    },
    {
      icon: "🏔️",
      name: "Heap Builder",
      unlocked: heapInsertCount >= 10,
      progress: `${heapInsertCount}/10`,
    },
    {
      icon: "⚡",
      name: "Heap Master",
      unlocked: heapExtractCount >= 10,
      progress: `${heapExtractCount}/10`,
    },
  ];

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
        setXp((prev) => prev + 50);

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
    const newXp = xp + gainedXp;
    setXp(newXp);
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

    setXp((prev) => prev + gainedXp);
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

  const insertNode = () => {
    const value = Number(nodeInput);

    if (nodeInput.trim() === "" || Number.isNaN(value)) {
      setWarning("ENTER A NODE VALUE");

      setTimeout(() => {
        setWarning("");
      }, 1500);

      return;
    }

    if (treeNodes.length === 0) {
      setTreeNodes([value]);
      setNodeInput("");

      setWarning(`ROOT NODE SET TO ${value}`);

      setTimeout(() => {
        setWarning("");
      }, 1500);

      return;
    }

    const newTree = [...treeNodes];
    let index = 0;

    while (true) {
      if (newTree[index] === value) {
        setWarning("DUPLICATE VALUE");

        setTimeout(() => {
          setWarning("");
        }, 1500);

        return;
      }

      const nextIndex =
        value < newTree[index]
          ? index * 2 + 1
          : index * 2 + 2;

      if (nextIndex > 30) {
        setWarning("TREE LIMIT REACHED");

        setTimeout(() => {
          setWarning("");
        }, 1500);

        return;
      }

      if (newTree[nextIndex] === undefined) {
        newTree[nextIndex] = value;
        break;
      }

      index = nextIndex;
    }

    setTreeNodes(newTree);
    setNodeInput("");
  };

  const resetTree = () => {
    setTreeNodes([]);
    setHighlightedNode(null);
    setNodeInput("");
    setSearchInput("");
    setTraversalResult("");
  };

  const startBFS = async () => {
    setBfsCount((prev) => prev + 1);
    const bfsOrder = [];

    for (let i = 0; i < treeNodes.length; i++) {
      if (treeNodes[i] !== undefined) {
        bfsOrder.push(i);
      }
    }

    setTraversalResult(
      `BFS: ${bfsOrder
        .map((i) => treeNodes[i])
        .join(" → ")}`
    );

    for (const nodeIndex of bfsOrder) {
      setHighlightedNode(nodeIndex);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    }

    setHighlightedNode(null);
  };

  const startDFS = async () => {
    setDfsCount((prev) => prev + 1);
    const dfsOrder = [];

    const traverse = (index) => {
      if (
        index >= treeNodes.length ||
        treeNodes[index] === undefined
      ) {
        return;
      }

      dfsOrder.push(index);

      traverse(index * 2 + 1);
      traverse(index * 2 + 2);
    };

    traverse(0);
    setTraversalResult(
      `DFS: ${dfsOrder
        .map((i) => treeNodes[i])
        .join(" → ")}`
    );

    for (const nodeIndex of dfsOrder) {
      setHighlightedNode(nodeIndex);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    }

    setHighlightedNode(null);
  };

  // INORDER traversal
  const startInorder = async () => {
    const order = [];

    const traverse = (index) => {
      if (
        index >= treeNodes.length ||
        treeNodes[index] === undefined
      ) {
        return;
      }

      traverse(index * 2 + 1);
      order.push(index);
      traverse(index * 2 + 2);
    };

    traverse(0);

    setTraversalResult(
      `INORDER: ${order
        .map((i) => treeNodes[i])
        .join(" → ")}`
    );

    for (const nodeIndex of order) {
      setHighlightedNode(nodeIndex);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    }

    setHighlightedNode(null);
  };

  // PREORDER traversal
  const startPreorder = async () => {
    const order = [];

    const traverse = (index) => {
      if (
        index >= treeNodes.length ||
        treeNodes[index] === undefined
      ) {
        return;
      }

      order.push(index);
      traverse(index * 2 + 1);
      traverse(index * 2 + 2);
    };

    traverse(0);

    setTraversalResult(
      `PREORDER: ${order
        .map((i) => treeNodes[i])
        .join(" → ")}`
    );

    for (const nodeIndex of order) {
      setHighlightedNode(nodeIndex);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    }

    setHighlightedNode(null);
  };

  // POSTORDER traversal
  const startPostorder = async () => {
    const order = [];

    const traverse = (index) => {
      if (
        index >= treeNodes.length ||
        treeNodes[index] === undefined
      ) {
        return;
      }

      traverse(index * 2 + 1);
      traverse(index * 2 + 2);
      order.push(index);
    };

    traverse(0);

    setTraversalResult(
      `POSTORDER: ${order
        .map((i) => treeNodes[i])
        .join(" → ")}`
    );

    for (const nodeIndex of order) {
      setHighlightedNode(nodeIndex);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    }

    setHighlightedNode(null);
  };

  const searchNode = async () => {
    const target = Number(searchInput);

    if (searchInput.trim() === "" || Number.isNaN(target)) {
      setWarning("ENTER SEARCH VALUE");

      setTimeout(() => {
        setWarning("");
      }, 1500);

      return;
    }

    let index = 0;

    while (
      index < treeNodes.length &&
      treeNodes[index] !== undefined
    ) {
      setHighlightedNode(index);

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      if (treeNodes[index] === target) {
        setWarning(`FOUND ${target} ✅`);

        setTimeout(() => {
          setWarning("");
        }, 1500);

        setHighlightedNode(null);
        return;
      }

      index =
        target < treeNodes[index]
          ? index * 2 + 1
          : index * 2 + 2;
    }

    setWarning(`NODE ${target} NOT FOUND ❌`);

    setTimeout(() => {
      setWarning("");
    }, 1500);

    setHighlightedNode(null);
  };

  // Add Vertex to Graph
  const addVertex = () => {
    const value = vertexInput.trim().toUpperCase();

    if (!value) {
      setWarning("ENTER VERTEX NAME");
      setTimeout(() => setWarning(""), 1500);
      return;
    }

    if (graphNodes.includes(value)) {
      setWarning("VERTEX EXISTS");
      setTimeout(() => setWarning(""), 1500);
      return;
    }

    setGraphNodes((prev) => [...prev, value]);
    if (graphNodes.length === 0) {
      setWarning(`ROOT VERTEX SET TO ${value}`);

      setTimeout(() => {
        setWarning("");
      }, 1500);
    }
    setVertexInput("");
  };

  const addEdge = () => {
    const value = edgeInput.trim().toUpperCase();

    if (!value.includes("-")) {
      setWarning("USE FORMAT A-B");
      setTimeout(() => setWarning(""), 1500);
      return;
    }

    const [from, to] = value.split("-");

    if (!graphNodes.includes(from) || !graphNodes.includes(to)) {
      setWarning("VERTEX NOT FOUND");
      setTimeout(() => setWarning(""), 1500);
      return;
    }

    setGraphEdges((prev) => [...prev, [from, to]]);
    setEdgeInput("");
  };

  const deleteEdge = () => {
    const value = edgeInput.trim().toUpperCase();

    if (!value.includes("-")) {
      setWarning("USE FORMAT A-B");
      setTimeout(() => setWarning(""), 1500);
      return;
    }

    const [from, to] = value.split("-");

    const beforeCount = graphEdges.length;

    setGraphEdges((prev) =>
      prev.filter(
        ([a, b]) => !(a === from && b === to)
      )
    );

    if (beforeCount === graphEdges.length) {
      setWarning("EDGE REMOVED");
    }

    setEdgeInput("");

    setTimeout(() => setWarning(""), 1500);
  };

  // Real Graph BFS functionality
  const startGraphBFS = async () => {
    if (graphNodes.length === 0) return;

    const start = graphNodes[0];

    const adjacency = {};

    graphNodes.forEach((node) => {
      adjacency[node] = [];
    });

    graphEdges.forEach(([from, to]) => {
      adjacency[from]?.push(to);
      adjacency[to]?.push(from);
    });

    const visited = new Set();
    const queue = [start];
    const order = [];

    visited.add(start);

    while (queue.length > 0) {
      const node = queue.shift();
      order.push(node);

      for (const neighbor of adjacency[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    setTraversalResult(`GRAPH BFS: ${order.join(" → ")}`);

    for (const node of order) {
      const index = graphNodes.indexOf(node);
      setHighlightedNode(index);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    }

    setHighlightedNode(null);
  };

  // Real Graph DFS functionality
  const startGraphDFS = async () => {
    if (graphNodes.length === 0) return;

    const start = graphNodes[0];

    const adjacency = {};

    graphNodes.forEach((node) => {
      adjacency[node] = [];
    });

    graphEdges.forEach(([from, to]) => {
      adjacency[from]?.push(to);
      adjacency[to]?.push(from);
    });

    const visited = new Set();
    const order = [];

    const dfs = (node) => {
      visited.add(node);
      order.push(node);

      for (const neighbor of adjacency[node]) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
    };

    dfs(start);

    setTraversalResult(`GRAPH DFS: ${order.join(" → ")}`);

    for (const node of order) {
      const index = graphNodes.indexOf(node);
      setHighlightedNode(index);

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    }

    setHighlightedNode(null);
  };

  const findShortestPath = async () => {
    const start = startVertex.trim().toUpperCase();
    const end = endVertex.trim().toUpperCase();

    if (!start || !end) {
      setWarning("ENTER START & END");
      setTimeout(() => setWarning(""), 1500);
      return;
    }

    const adjacency = {};

    graphNodes.forEach((node) => {
      adjacency[node] = [];
    });

    graphEdges.forEach(([from, to]) => {
      adjacency[from]?.push(to);
      adjacency[to]?.push(from);
    });

    const queue = [[start]];
    const visited = new Set([start]);

    while (queue.length) {
      const path = queue.shift();
      const node = path[path.length - 1];

      if (node === end) {
        setShortestPath(path);
        setTraversalResult(
          `SHORTEST PATH: ${path.join(" → ")}`
        );

        for (const current of path) {
          const index = graphNodes.indexOf(current);
          setHighlightedNode(index);

          await new Promise((resolve) =>
            setTimeout(resolve, 500)
          );
        }

        setHighlightedNode(null);
        return;
      }

      for (const neighbor of adjacency[node] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    setTraversalResult("NO PATH FOUND");
  };

  const resetGraph = () => {
    setGraphNodes([]);
    setGraphEdges([]);
    setVertexInput("");
    setEdgeInput("");
    setHighlightedNode(null);
    setTraversalResult("");
  };

  const deleteVertex = () => {
    const value = vertexInput.trim().toUpperCase();

    if (!value) {
      setWarning("ENTER VERTEX NAME");
      setTimeout(() => setWarning(""), 1500);
      return;
    }

    if (!graphNodes.includes(value)) {
      setWarning("VERTEX NOT FOUND");
      setTimeout(() => setWarning(""), 1500);
      return;
    }

    setGraphNodes((prev) => prev.filter((v) => v !== value));
    setGraphEdges((prev) =>
      prev.filter(([from, to]) => from !== value && to !== value)
    );

    setVertexInput("");
    setWarning(`DELETED ${value}`);
    setTimeout(() => setWarning(""), 1500);
  };

  // Simple BST Delete Node feature
  const deleteNode = () => {
    const target = Number(searchInput);

    if (searchInput.trim() === "" || Number.isNaN(target)) {
      setWarning("ENTER VALUE TO DELETE");

      setTimeout(() => {
        setWarning("");
      }, 1500);

      return;
    }

    const values = treeNodes.filter(
      (value) => value !== undefined
    );

    if (!values.includes(target)) {
      setWarning("NODE NOT FOUND ❌");

      setTimeout(() => {
        setWarning("");
      }, 1500);

      return;
    }

    const remainingValues = values.filter(
      (value) => value !== target
    );

    const rebuiltTree = [];

    const insertIntoBSTArray = (value) => {
      if (rebuiltTree.length === 0) {
        rebuiltTree[0] = value;
        return;
      }

      let index = 0;

      while (true) {
        const nextIndex =
          value < rebuiltTree[index]
            ? index * 2 + 1
            : index * 2 + 2;

        if (rebuiltTree[nextIndex] === undefined) {
          rebuiltTree[nextIndex] = value;
          return;
        }

        index = nextIndex;
      }
    };

    remainingValues.forEach(insertIntoBSTArray);

    setTreeNodes(rebuiltTree);
    setSearchInput("");
    setTraversalResult("");

    setWarning(`DELETED ${target} 🗑️`);

    setTimeout(() => {
      setWarning("");
    }, 1500);
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
    setXp((prev) => prev + 10);
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
    setXp((prev) => prev + 10);
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
    setXp((prev) => prev + 10);
  };

  const heapSort = () => {
    const sorted = [...heap].sort((a, b) => a - b);

    setHeapSortResult(
      `SORTED: ${sorted.join(" → ")}`
    );

    setXp((prev) => prev + 20);
  };

  const switchWorld = (world, label) => {
    if (currentWorld === world) return;

    setTransitionText(label);
    setTransitioning(true);

    setTimeout(() => {
      setCurrentWorld(world);
    }, 350);

    setTimeout(() => {
      setTransitioning(false);
    }, 900);
  };

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
                      searchNode();
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
                  onClick={searchNode}
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
                  onClick={deleteNode}
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
                  onClick={startBFS}
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
                  onClick={startDFS}
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
                  onClick={startInorder}
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
                  onClick={startPreorder}
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
                  onClick={startPostorder}
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
                  onClick={startGraphBFS}
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
                  onClick={startGraphDFS}
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
                  onClick={findShortestPath}
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
                    setXp((prev) => prev + 5);
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