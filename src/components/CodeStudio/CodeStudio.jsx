import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Code2,
  Terminal,
  AlertTriangle,
  Layers,
  ListOrdered,
  Network,
  BarChart3,
  GitBranch,
  Crown,
  Trash2,
  Variable,
  Activity,
  Zap,
  LayoutGrid,
} from "lucide-react";
import { parseCodeTo3DActions, detectRealmFromCode } from "../../utils/codeTo3DInterpreter";
import { soundFX } from "../../utils/soundFX";

// 3D World Viewports
import Sorting3DWorld from "../../worlds/Sorting3DWorld";
import StackWorld from "../../worlds/StackWorld";
import QueueWorld from "../../worlds/QueueWorld";
import TreeWorld from "../../worlds/TreeWorld";
import GraphWorld from "../../worlds/GraphWorld";
import HeapWorld from "../../worlds/HeapWorld";
import LinkedListWorld from "../../worlds/LinkedListWorld";
import Matrix3DWorld from "../../worlds/Matrix3DWorld";

// --- QUICK-INSERT ALGORITHMIC TEMPLATES ---
const QUICK_TEMPLATES = [
  {
    name: "Spiral Matrix (2D)",
    realm: "matrix",
    code: `// 🌀 2D Spiral Matrix Traversal
let grid = [
  [ 1,  2,  3 ],
  [ 4,  5,  6 ],
  [ 7,  8,  9 ]
];

let top = 0, bottom = grid.length - 1;
let left = 0, right = grid[0].length - 1;

while (top <= bottom && left <= right) {
  for (let c = left; c <= right; c++) console.log(\`Visited [\${top}][\${c}]\`);
  top++;
  for (let r = top; r <= bottom; r++) console.log(\`Visited [\${r}][\${right}]\`);
  right--;
  if (top <= bottom) {
    for (let c = right; c >= left; c--) console.log(\`Visited [\${bottom}][\${c}]\`);
    bottom--;
  }
  if (left <= right) {
    for (let r = bottom; r >= top; r--) console.log(\`Visited [\${r}][\${left}]\`);
    left++;
  }
}`,
  },
  {
    name: "Matrix Rotate 90°",
    realm: "matrix",
    code: `// 🔄 90° Matrix Rotation (Transpose + Reverse)
let grid = [
  [ 1,  2,  3 ],
  [ 4,  5,  6 ],
  [ 7,  8,  9 ]
];

let n = grid.length;
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    let temp = grid[i][j];
    grid[i][j] = grid[j][i];
    grid[j][i] = temp;
    console.log(\`Transposed [\${i}][\${j}] with [\${j}][\${i}]\`);
  }
}
for (let i = 0; i < n; i++) {
  grid[i].reverse();
}`,
  },
  {
    name: "Bubble Sort",
    realm: "sorting",
    code: `// Bubble Sort Algorithm
let arr = [60, 20, 80, 10, 40];

for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length - i - 1; j++) {
    array.compare(j, j + 1);
    if (arr[j] > arr[j + 1]) {
      array.swap(j, j + 1);
      let temp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = temp;
    }
  }
}`,
  },
  {
    name: "Binary Search",
    realm: "sorting",
    code: `// Binary Search Algorithm
let arr = [10, 20, 30, 40, 50, 60, 70];
let target = 50;
let left = 0, right = arr.length - 1;

while (left <= right) {
  let mid = Math.floor((left + right) / 2);
  array.compare(mid, mid);
  if (arr[mid] === target) {
    console.log("Found at index:", mid);
    break;
  } else if (arr[mid] < target) {
    left = mid + 1;
  } else {
    right = mid - 1;
  }
}`,
  },
  {
    name: "BST Construction",
    realm: "tree",
    code: `// Binary Search Tree (BST)
let values = [50, 25, 75, 12, 37, 62, 87];

for (let val of values) {
  tree.insert(val);
}
tree.search(37);`,
  },
  {
    name: "Graph Routing (BFS)",
    realm: "graph",
    code: `// Graph Network & BFS Traversal
graph.addVertex(0);
graph.addVertex(1);
graph.addVertex(2);
graph.addVertex(3);

graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.addEdge(2, 3);

graph.bfs(0);`,
  },
  {
    name: "Stack Tower (LIFO)",
    realm: "stack",
    code: `// Stack Tower Operations
for (let i = 1; i <= 5; i++) {
  stack.push(i * 15);
}
stack.pop();
stack.push(99);`,
  },
  {
    name: "Queue Stream (FIFO)",
    realm: "queue",
    code: `// FIFO Queue Buffer
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
queue.dequeue();
queue.enqueue(40);`,
  },
  {
    name: "Min-Heap Sift",
    realm: "heap",
    code: `// Min-Heap Invariant
heap.insert(40);
heap.insert(20);
heap.insert(60);
heap.insert(10);
heap.extractRoot();`,
  },
];

const SPEEDS = {
  slow: { label: "0.5x", delayMs: 1100 },
  normal: { label: "1x", delayMs: 600 },
  fast: { label: "2x", delayMs: 280 },
  ultra: { label: "4x", delayMs: 90 },
};

const REALM_CONFIG = {
  matrix: { label: "2D Matrix Grid", icon: LayoutGrid, color: "#22d3ee", time: "O(M × N)", space: "O(1)", helper: "matrix.visit(r, c), grid[r][c], console.log('[r][c]')" },
  sorting: { label: "Array & Sorting", icon: BarChart3, color: "#38bdf8", time: "O(n log n)", space: "O(1)", helper: "array.swap(i, j), array.compare(i, j), array.push(val)" },
  stack: { label: "Stack (LIFO)", icon: Layers, color: "#f59e0b", time: "O(1)", space: "O(1)", helper: "stack.push(val), stack.pop(), stack.peek()" },
  queue: { label: "Queue (FIFO)", icon: ListOrdered, color: "#06b6d4", time: "O(1)", space: "O(1)", helper: "queue.enqueue(val), queue.dequeue(), queue.peek()" },
  linkedlist: { label: "LinkedList", icon: GitBranch, color: "#10b981", time: "O(1) / O(n)", space: "O(1)", helper: "list.insert(val), list.insertHead(val), list.delete(val), list.reverse()" },
  tree: { label: "Tree (BST)", icon: Network, color: "#34d399", time: "O(log n)", space: "O(1)", helper: "tree.insert(val), tree.delete(val), tree.search(val)" },
  graph: { label: "Graph Network", icon: Network, color: "#a855f7", time: "O(V + E)", space: "O(V)", helper: "graph.addVertex(v), graph.addEdge(u, v), graph.bfs(start)" },
  heap: { label: "Binary Heap", icon: Crown, color: "#fbbf24", time: "O(log n)", space: "O(1)", helper: "heap.insert(val), heap.extractRoot()" },
};

export default function CodeStudio() {
  const [activeRealm, setActiveRealm] = useState("matrix");
  const [code, setCode] = useState("");

  const [selectedSpeed, setSelectedSpeed] = useState("normal");
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [actionQueue, setActionQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [statusLog, setStatusLog] = useState("Ready. Type any DSA code & press Cmd+Enter to visualize in 3D.");
  const [highlightedLine, setHighlightedLine] = useState(null);
  const [activeTab, setActiveTab] = useState("console");
  const [liveScope, setLiveScope] = useState({});
  const [consoleLogs, setConsoleLogs] = useState([]);

  // Dedicated 3D State Containers
  // 1. Matrix 2D Grid
  const [matrixData, setMatrixData] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  const [activeCell, setActiveCell] = useState(null);
  const [visitedCells, setVisitedCells] = useState([]);
  const [swappingCells, setSwappingCells] = useState([]);

  // 2. Sorting Array
  const [arrayData, setArrayData] = useState([60, 20, 80, 10, 40]);
  const [comparingIndices, setComparingIndices] = useState([]);
  const [swappingIndices, setSwappingIndices] = useState([]);

  // 3. Stack / Queue / Tree / Graph / Heap
  const [stackData, setStackData] = useState([]);
  const [queueData, setQueueData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [treeHighlight, setTreeHighlight] = useState(null);
  const [graphNodes, setGraphNodes] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);
  const [graphHighlight, setGraphHighlight] = useState(null);
  const [heapData, setHeapData] = useState([]);

  const isPlayingRef = useRef(false);
  const actionQueueRef = useRef([]);
  const stepIndexRef = useRef(-1);
  const textareaRef = useRef(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    actionQueueRef.current = actionQueue;
    stepIndexRef.current = activeStepIndex;
  }, [isPlaying, actionQueue, activeStepIndex]);

  // Execute a single action against active realm 3D model
  const executeSingleAction = useCallback(
    (action) => {
      if (!action) return;

      setHighlightedLine(action.line);
      setStatusLog(`[Step] ${action.raw}`);
      if (action.scopeSnapshot) {
        setLiveScope(action.scopeSnapshot);
      }

      const target = action.target || activeRealm;

      // 1. Matrix 2D Grid
      if (target === "matrix") {
        if (action.type === "matrix_visit" && action.cell) {
          const [r, c] = action.cell;
          setActiveCell([r, c]);
          setVisitedCells((prev) => (prev.some(([vr, vc]) => vr === r && vc === c) ? prev : [...prev, [r, c]]));
          soundFX.playPeek();
        } else if (action.type === "matrix_set" && action.cell) {
          const [r, c] = action.cell;
          const val = action.arg;
          setMatrixData((prev) => {
            const next = prev.map((row) => [...row]);
            if (next[r] && next[r][c] !== undefined) {
              next[r][c] = val;
            }
            return next;
          });
          soundFX.playPush();
        } else if (action.type === "matrix_swap" && action.arg) {
          const [c1, c2] = action.arg;
          setSwappingCells([c1, c2]);
          soundFX.playPush();
          setTimeout(() => setSwappingCells([]), 600);
        } else if (action.type === "reverse") {
          setMatrixData((prev) => prev.map((row) => [...row].reverse()));
          soundFX.playPush();
        }
      }
      // 2. Sorting / Array
      else if (target === "sorting") {
        if (action.type === "swap" && action.indices) {
          const [i, j] = action.indices;
          setSwappingIndices([i, j]);
          soundFX.playPush();
          setArrayData((prev) => {
            if (i >= prev.length || j >= prev.length) return prev;
            const next = [...prev];
            [next[i], next[j]] = [next[j], next[i]];
            return next;
          });
          setTimeout(() => setSwappingIndices([]), 500);
        } else if (action.type === "compare" && action.indices) {
          const [i, j] = action.indices;
          setComparingIndices([i, j]);
          soundFX.playPeek();
          setTimeout(() => setComparingIndices([]), 600);
        } else if (action.type === "set" && action.arg) {
          const [i, val] = action.arg;
          setArrayData((prev) => {
            const next = [...prev];
            next[i] = val;
            return next;
          });
          soundFX.playPush();
        } else if (action.type === "push") {
          const val = Number(action.arg);
          setArrayData((prev) => [...prev, val]);
          soundFX.playPush();
        } else if (action.type === "reverse") {
          setArrayData((prev) => [...prev].reverse());
          soundFX.playPush();
        } else if (action.type === "clear") {
          setArrayData([]);
          soundFX.playClear();
        }
      }
      // 3. Stack
      else if (target === "stack") {
        if (action.type === "push") {
          const val = action.arg !== undefined ? Number(action.arg) : Math.floor(Math.random() * 100);
          soundFX.playPush();
          setStackData((prev) => (prev.length >= 8 ? prev : [...prev, val]));
        } else if (action.type === "pop") {
          soundFX.playPop();
          setStackData((prev) => (prev.length > 0 ? prev.slice(0, -1) : []));
        } else if (action.type === "clear") {
          soundFX.playClear();
          setStackData([]);
        }
      }
      // 4. Queue
      else if (target === "queue") {
        if (action.type === "enqueue") {
          const val = action.arg !== undefined ? Number(action.arg) : Math.floor(Math.random() * 100);
          soundFX.playPush();
          setQueueData((prev) => (prev.length >= 6 ? prev : [...prev, { id: `q-${Date.now()}-${Math.random()}`, value: val }]));
        } else if (action.type === "dequeue") {
          soundFX.playPop();
          setQueueData((prev) => (prev.length > 0 ? prev.slice(1) : []));
        } else if (action.type === "clear") {
          soundFX.playClear();
          setQueueData([]);
        }
      }
      // 5. Tree
      else if (target === "tree") {
        if (action.type === "insert") {
          const val = Number(action.arg);
          soundFX.playPush();
          setTreeData((prev) => {
            if (prev.length === 0) return [val];
            const next = [...prev];
            let idx = 0;
            while (idx <= 30) {
              if (next[idx] === val) return prev;
              const nextIdx = val < next[idx] ? idx * 2 + 1 : idx * 2 + 2;
              if (nextIdx > 30) break;
              if (next[nextIdx] === undefined) {
                next[nextIdx] = val;
                break;
              }
              idx = nextIdx;
            }
            return next;
          });
        } else if (action.type === "search") {
          const targetVal = Number(action.arg);
          soundFX.playTreeFound();
          setTreeHighlight(targetVal);
          setTimeout(() => setTreeHighlight(null), 1200);
        } else if (action.type === "clear") {
          soundFX.playClear();
          setTreeData([]);
        }
      }
      // 6. Graph
      else if (target === "graph") {
        if (action.type === "addVertex") {
          const v = Number(action.arg);
          soundFX.playPush();
          setGraphNodes((prev) => (prev.includes(v) ? prev : [...prev, v]));
        } else if (action.type === "addEdge") {
          const [u, v] = action.arg;
          soundFX.playPush();
          setGraphEdges((prev) => [...prev, [Number(u), Number(v)]]);
        } else if (action.type === "bfs" || action.type === "dfs") {
          const start = Number(action.arg);
          soundFX.playTreeStep(0);
          setGraphHighlight(start);
          setTimeout(() => setGraphHighlight(null), 1200);
        } else if (action.type === "clear") {
          soundFX.playClear();
          setGraphNodes([]);
          setGraphEdges([]);
        }
      }
      // 7. Heap
      else if (target === "heap") {
        if (action.type === "insert") {
          const val = Number(action.arg);
          soundFX.playPush();
          setHeapData((prev) => [...prev, val]);
        } else if (action.type === "extractRoot") {
          soundFX.playPop();
          setHeapData((prev) => (prev.length > 0 ? prev.slice(1) : []));
        } else if (action.type === "clear") {
          soundFX.playClear();
          setHeapData([]);
        }
      }
    },
    [activeRealm]
  );

  // Full 3D Reset
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setActiveStepIndex(-1);
    stepIndexRef.current = -1;
    setHighlightedLine(null);
    setErrorMessage(null);
    setLiveScope({});
    setStatusLog("3D scene reset. Ready to execute.");

    setMatrixData([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    setActiveCell(null);
    setVisitedCells([]);
    setSwappingCells([]);

    setArrayData([60, 20, 80, 10, 40]);
    setComparingIndices([]);
    setSwappingIndices([]);
    setStackData([]);
    setQueueData([]);
    setTreeData([]);
    setTreeHighlight(null);
    setGraphNodes([]);
    setGraphEdges([]);
    setGraphHighlight(null);
    setHeapData([]);
  }, []);

  // Clear Code
  const handleClearCode = () => {
    setCode("");
    handleReset();
    soundFX.playClear();
  };

  // Switch Realm
  const handleSwitchRealm = (realmKey) => {
    handleReset();
    setActiveRealm(realmKey);
    soundFX.playPeek();
  };

  // Compile Code & Execute
  const compileCode = (customCode = code, customRealm = activeRealm) => {
    setErrorMessage(null);

    const detected = detectRealmFromCode(customCode);
    const targetRealm = customRealm || detected;
    if (detected !== activeRealm && customCode.trim()) {
      setActiveRealm(detected);
    }

    const parsed = parseCodeTo3DActions(customCode, targetRealm);

    if (parsed.logs) {
      setConsoleLogs(parsed.logs);
    }

    if (parsed.initialMatrix) {
      setMatrixData(parsed.initialMatrix);
      setActiveRealm("matrix");
    } else if (parsed.initialArray) {
      setArrayData(parsed.initialArray);
    }

    if (!parsed.success && parsed.errors.length > 0) {
      soundFX.playWarning();
      setErrorMessage(parsed.errors.join("\n"));
      setIsPlaying(false);
      return null;
    }

    if (parsed.actions.length === 0) {
      soundFX.playWarning();
      setErrorMessage(`No 3D actions generated yet. Write operations like: ${REALM_CONFIG[targetRealm]?.helper || "array.swap(i, j)"}`);
      setIsPlaying(false);
      return null;
    }

    setActionQueue(parsed.actions);
    return parsed.actions;
  };

  // Run in 3D
  const handleRunAll = async (customCode = code, customRealm = activeRealm) => {
    let queueList = actionQueue;
    const isFromStart = activeStepIndex === -1 || activeStepIndex >= queueList.length - 1;

    if (isFromStart) {
      handleReset();
      queueList = compileCode(customCode, customRealm);
      if (!queueList || queueList.length === 0) return;
      setActiveStepIndex(-1);
      stepIndexRef.current = -1;
      await new Promise((r) => setTimeout(r, 60));
    }

    setIsPlaying(true);
    isPlayingRef.current = true;

    let currentIndex = stepIndexRef.current;
    const delay = SPEEDS[selectedSpeed].delayMs;

    while (currentIndex + 1 < queueList.length) {
      if (!isPlayingRef.current) break;

      currentIndex++;
      stepIndexRef.current = currentIndex;
      setActiveStepIndex(currentIndex);

      executeSingleAction(queueList[currentIndex]);
      await new Promise((r) => setTimeout(r, delay));
    }

    if (isPlayingRef.current && currentIndex + 1 >= queueList.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      soundFX.playTreeFound();
      setStatusLog(`✅ Completed execution of all ${queueList.length} 3D actions.`);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setStatusLog(`Paused at step ${activeStepIndex + 1} of ${actionQueue.length}.`);
  };

  const handleStepNext = () => {
    let queueList = actionQueue;
    if (activeStepIndex === -1 && queueList.length === 0) {
      queueList = compileCode();
      if (!queueList) return;
    }

    if (activeStepIndex + 1 < queueList.length) {
      const nextIdx = activeStepIndex + 1;
      setActiveStepIndex(nextIdx);
      stepIndexRef.current = nextIdx;
      executeSingleAction(queueList[nextIdx]);
    }
  };

  // Keyboard: Tab indentation + Cmd+Enter to run
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunAll();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Quick insert template
  const handleInsertTemplate = (tmpl) => {
    setActiveRealm(tmpl.realm);
    setCode(tmpl.code);
    handleReset();
    soundFX.playTreeFound();
  };

  const lines = (code || "").split("\n");
  const realmInfo = REALM_CONFIG[activeRealm] || REALM_CONFIG.matrix;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#020617",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* LEFT PANE: Free Code Editor & DSA Tools (48% Width) */}
      <div
        style={{
          width: "530px",
          minWidth: "440px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "rgba(10, 15, 30, 0.98)",
          borderRight: "1px solid rgba(56, 189, 248, 0.16)",
          zIndex: 20,
        }}
      >
        {/* Main Header Bar */}
        <div
          style={{
            padding: "12px 18px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Header Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 14px rgba(56, 189, 248, 0.3)",
              }}
            >
              <Code2 size={16} color="#020817" />
            </div>
            <div>
              <span style={{ color: "#ffffff", fontWeight: "900", fontSize: "14px", letterSpacing: "0.5px" }}>
                Free Code Editor
              </span>
              <span style={{ display: "block", color: "#38bdf8", fontSize: "10.5px", fontWeight: "700" }}>
                3D Live Execution Sandbox
              </span>
            </div>
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClearCode}
            title="Clear Editor"
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#fca5a5",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; }}
          >
            <Trash2 size={12} /> Clear
          </button>
        </div>

        {/* 8 Realm Tabs including 2D Matrix Grid */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "8px 12px",
            background: "rgba(0, 0, 0, 0.3)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            overflowX: "auto",
          }}
        >
          {Object.entries(REALM_CONFIG).map(([key, config]) => {
            const isActive = activeRealm === key;
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => handleSwitchRealm(key)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: isActive ? `1px solid ${config.color}66` : "1px solid transparent",
                  background: isActive ? `${config.color}22` : "transparent",
                  color: isActive ? config.color : "#94a3b8",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                }}
              >
                <Icon size={12} color={isActive ? config.color : "#64748b"} />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick-Insert Algorithmic Snippets Bar */}
        <div
          style={{
            padding: "6px 12px",
            background: "rgba(15, 23, 42, 0.7)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            overflowX: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#38bdf8", fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap" }}>
            <Zap size={12} />
            <span>Snippets:</span>
          </div>
          {QUICK_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              onClick={() => handleInsertTemplate(tmpl)}
              style={{
                padding: "3px 8px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#cbd5e1",
                fontSize: "10.5px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(56, 189, 248, 0.15)";
                e.currentTarget.style.color = "#38bdf8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "#cbd5e1";
              }}
            >
              {tmpl.name}
            </button>
          ))}
        </div>

        {/* Monospace Free Editor */}
        <div style={{ flex: 1, display: "flex", background: "#050811", position: "relative", overflow: "hidden" }}>
          {/* Line Numbers Gutter */}
          <div
            style={{
              width: "36px",
              padding: "16px 0",
              background: "rgba(0, 0, 0, 0.35)",
              borderRight: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              userSelect: "none",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              lineHeight: "1.6",
            }}
          >
            {lines.map((_, i) => {
              const lineNum = i + 1;
              const isActive = highlightedLine === lineNum;
              return (
                <div
                  key={lineNum}
                  style={{
                    height: "20.8px",
                    color: isActive ? "#38bdf8" : "#334155",
                    fontWeight: isActive ? "800" : "500",
                    textShadow: isActive ? "0 0 8px #38bdf8" : "none",
                  }}
                >
                  {lineNum}
                </div>
              );
            })}
          </div>

          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setErrorMessage(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={`// Free Code Canvas: Type ANY JavaScript or DSA algorithm here...\n// e.g. 2D Spiral Matrix, BubbleSort, BST, Graphs, Stack, Queue, Heap\n// The 3D Engine will trace comparisons, swaps, matrix coordinates & routes in real-time!\n// Press Cmd+Enter to execute!`}
            spellCheck="false"
            style={{
              flex: 1,
              height: "100%",
              background: "transparent",
              color: "#f8fafc",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
              lineHeight: "1.6",
              padding: "16px 18px",
              border: "none",
              outline: "none",
              resize: "none",
              caretColor: "#38bdf8",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Playback Controls Footer Bar */}
        <div
          style={{
            padding: "10px 16px",
            background: "rgba(10, 16, 30, 0.95)",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isPlaying ? (
              <button
                onClick={handlePause}
                style={{
                  padding: "7px 15px",
                  borderRadius: "9px",
                  background: "rgba(245, 158, 11, 0.2)",
                  border: "1px solid rgba(245, 158, 11, 0.5)",
                  color: "#f59e0b",
                  fontSize: "12px",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Pause size={14} /> Pause
              </button>
            ) : (
              <button
                onClick={() => handleRunAll()}
                style={{
                  padding: "7px 16px",
                  borderRadius: "9px",
                  background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                  border: "none",
                  color: "#020817",
                  fontSize: "12px",
                  fontWeight: "900",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 0 16px rgba(56, 189, 248, 0.4)",
                }}
              >
                <Play size={14} fill="#020817" /> Run 3D
              </button>
            )}

            <button
              onClick={handleStepNext}
              disabled={isPlaying}
              style={{
                padding: "7px 12px",
                borderRadius: "9px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#cbd5e1",
                fontSize: "12px",
                fontWeight: "600",
                cursor: isPlaying ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                opacity: isPlaying ? 0.5 : 1,
              }}
            >
              <SkipForward size={13} /> Step
            </button>

            <button
              onClick={handleReset}
              style={{
                padding: "7px 12px",
                borderRadius: "9px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#cbd5e1",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Speed Multiplier Pill */}
          <div
            style={{
              display: "flex",
              background: "rgba(0, 0, 0, 0.4)",
              borderRadius: "8px",
              padding: "3px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {Object.entries(SPEEDS).map(([key, spd]) => (
              <button
                key={key}
                onClick={() => setSelectedSpeed(key)}
                style={{
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "none",
                  background: selectedSpeed === key ? "#38bdf8" : "transparent",
                  color: selectedSpeed === key ? "#020817" : "#64748b",
                  fontSize: "11px",
                  fontWeight: selectedSpeed === key ? "800" : "600",
                  cursor: "pointer",
                }}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Console / Variables / Complexity Bottom Drawer */}
        <div
          style={{
            height: "160px",
            background: "#030712",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer Tabs */}
          <div
            style={{
              padding: "4px 12px",
              background: "rgba(0, 0, 0, 0.4)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              onClick={() => setActiveTab("console")}
              style={{
                background: "transparent",
                border: "none",
                color: activeTab === "console" ? "#38bdf8" : "#64748b",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 0",
                borderBottom: activeTab === "console" ? "2px solid #38bdf8" : "none",
              }}
            >
              <Terminal size={12} /> Terminal Console
            </button>
            <button
              onClick={() => setActiveTab("variables")}
              style={{
                background: "transparent",
                border: "none",
                color: activeTab === "variables" ? "#38bdf8" : "#64748b",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 0",
                borderBottom: activeTab === "variables" ? "2px solid #38bdf8" : "none",
              }}
            >
              <Variable size={12} /> Variables Inspector
            </button>
            <button
              onClick={() => setActiveTab("complexity")}
              style={{
                background: "transparent",
                border: "none",
                color: activeTab === "complexity" ? "#38bdf8" : "#64748b",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 0",
                borderBottom: activeTab === "complexity" ? "2px solid #38bdf8" : "none",
              }}
            >
              <Activity size={12} /> Complexity Matrix
            </button>
          </div>

          {/* Drawer Body */}
          <div
            style={{
              flex: 1,
              padding: "10px 14px",
              overflowY: "auto",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11.5px",
              color: "#94a3b8",
            }}
          >
            {errorMessage && (
              <div style={{ color: "#f87171", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <AlertTriangle size={13} />
                <span>{errorMessage}</span>
              </div>
            )}

            {activeTab === "console" && (
              <div>
                <div style={{ color: "#38bdf8", marginBottom: "4px" }}>&gt; {statusLog}</div>
                {consoleLogs.map((log, idx) => (
                  <div key={idx} style={{ color: "#cbd5e1" }}>{log}</div>
                ))}
              </div>
            )}

            {activeTab === "variables" && (
              <div>
                {Object.keys(liveScope).length === 0 ? (
                  <span style={{ color: "#64748b" }}>No active local variables in current step scope.</span>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 14px" }}>
                    {Object.entries(liveScope).map(([k, v]) => (
                      <div key={k} style={{ display: "contents" }}>
                        <span style={{ color: "#38bdf8", fontWeight: "700" }}>{k}:</span>
                        <span style={{ color: "#f8fafc" }}>{JSON.stringify(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "complexity" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div>
                  <span style={{ color: "#94a3b8" }}>Realm: </span>
                  <span style={{ color: realmInfo.color, fontWeight: "800" }}>{realmInfo.label}</span>
                </div>
                <div>
                  <span style={{ color: "#94a3b8" }}>Time Complexity: </span>
                  <span style={{ color: "#38bdf8", fontWeight: "800" }}>{realmInfo.time}</span>
                </div>
                <div>
                  <span style={{ color: "#94a3b8" }}>Space Complexity: </span>
                  <span style={{ color: "#34d399", fontWeight: "800" }}>{realmInfo.space}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANE: 3D Multiverse Simulation Viewport (52% Width) */}
      <div
        style={{
          flex: 1,
          height: "100%",
          position: "relative",
          background: "radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)",
        }}
      >
        {/* Active Realm Hologram Badge */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "24px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(10, 16, 30, 0.85)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${realmInfo.color}44`,
            padding: "8px 14px",
            borderRadius: "12px",
            boxShadow: `0 0 20px ${realmInfo.color}22`,
          }}
        >
          <realmInfo.icon size={16} color={realmInfo.color} />
          <span style={{ color: "#ffffff", fontWeight: "800", fontSize: "13px" }}>{realmInfo.label}</span>
          <span style={{ color: realmInfo.color, fontSize: "11px", fontWeight: "700" }}>3D Engine</span>
        </div>

        {/* 3D World Rendering */}
        {activeRealm === "matrix" && (
          <Matrix3DWorld
            matrix={matrixData}
            activeCell={activeCell}
            visitedCells={visitedCells}
            swappingCells={swappingCells}
          />
        )}

        {activeRealm === "sorting" && (
          <Sorting3DWorld
            array={arrayData}
            comparingIndices={comparingIndices}
            swappingIndices={swappingIndices}
            sortedIndices={[]}
            isSorting={isPlaying}
          />
        )}

        {activeRealm === "stack" && (
          <StackWorld
            stack={stackData}
            isPeeking={false}
            peekBlock={null}
          />
        )}

        {activeRealm === "queue" && (
          <QueueWorld
            queue={queueData}
            isPeekingQueue={false}
          />
        )}

        {activeRealm === "tree" && (
          <TreeWorld
            treeNodes={treeData}
            searchHighlight={treeHighlight}
            highlightNode={treeHighlight}
          />
        )}

        {activeRealm === "graph" && (
          <GraphWorld
            graphNodes={graphNodes}
            graphEdges={graphEdges}
            searchHighlight={graphHighlight}
          />
        )}

        {activeRealm === "heap" && (
          <HeapWorld
            heapArray={heapData}
            heapType="min"
          />
        )}

        {activeRealm === "linkedlist" && (
          <LinkedListWorld />
        )}
      </div>
    </div>
  );
}
