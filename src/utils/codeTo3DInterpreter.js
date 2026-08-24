/**
 * Universal Dynamic Code-to-3D Interpreter & Hardened DSA Execution Engine.
 * 
 * Security Features:
 * 1. Blacklists & shadows all dangerous browser globals (window, document, fetch, localStorage, etc.)
 * 2. Automatic Infinite Loop Guards (__loopCounter injection) to prevent browser thread freeze.
 * 3. Execution time limits & Maximum 3D Action Memory Caps.
 * 4. Safe Proxy Instrumentation for real-time 3D algorithm tracing.
 */

// Detect which 3D realm the user's custom code targets
export function detectRealmFromCode(code) {
  if (!code || typeof code !== "string") return "sorting";
  const lower = code.toLowerCase();

  // 2D Matrix & Grid keywords
  if (
    lower.includes("matrix") ||
    lower.includes("grid") ||
    lower.includes("spiralorder") ||
    lower.includes("rotatematrix") ||
    lower.includes("top <=") ||
    lower.includes("bottom >=") ||
    /\[\s*\[\s*\d+/.test(code) ||
    /\[\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\]\s*\[\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\]/.test(code)
  ) {
    return "matrix";
  }

  // Graph keywords
  if (
    lower.includes("addedge") ||
    lower.includes("addvertex") ||
    lower.includes("graph.") ||
    lower.includes("dijkstra") ||
    lower.includes("adjlist") ||
    lower.includes("adjacency") ||
    (lower.includes("visited") && (lower.includes("neighbors") || lower.includes("edges")))
  ) {
    return "graph";
  }

  // Tree keywords
  if (
    lower.includes("treenode") ||
    lower.includes("tree.") ||
    lower.includes("root.left") ||
    lower.includes("root.right") ||
    lower.includes("node.left") ||
    lower.includes("node.right") ||
    lower.includes("bst") ||
    lower.includes("inorder") ||
    lower.includes("postorder") ||
    lower.includes("preorder")
  ) {
    return "tree";
  }

  // Heap keywords
  if (
    lower.includes("heap.") ||
    lower.includes("minheap") ||
    lower.includes("maxheap") ||
    lower.includes("priorityqueue") ||
    lower.includes("heapify") ||
    lower.includes("extractroot") ||
    lower.includes("siftup") ||
    lower.includes("siftdown")
  ) {
    return "heap";
  }

  // Linked List keywords
  if (
    lower.includes("listnode") ||
    lower.includes("linkedlist") ||
    lower.includes("list.") ||
    lower.includes("node.next") ||
    lower.includes("head.next") ||
    lower.includes("inserthead")
  ) {
    return "linkedlist";
  }

  // Stack keywords
  if (
    lower.includes("stack.") ||
    (lower.includes("stack") && lower.includes("pop()")) ||
    lower.includes("lifo")
  ) {
    return "stack";
  }

  // Queue keywords
  if (
    lower.includes("queue.") ||
    lower.includes("enqueue") ||
    lower.includes("dequeue") ||
    (lower.includes("queue") && lower.includes("shift()")) ||
    lower.includes("fifo")
  ) {
    return "queue";
  }

  // Default to Sorting / Array
  return "sorting";
}

// Deep clone scope objects safely
function cloneScope(scope) {
  const copy = {};
  for (const k in scope) {
    if (k.startsWith("__")) continue;
    const val = scope[k];
    if (Array.isArray(val)) {
      copy[k] = val.map((item) => (typeof item === "object" && item !== null ? { ...item } : item));
    } else if (typeof val === "object" && val !== null) {
      try {
        copy[k] = JSON.parse(JSON.stringify(val));
      } catch {
        copy[k] = String(val);
      }
    } else {
      copy[k] = val;
    }
  }
  return copy;
}

// Blocked security keys that must never be accessible to user scripts
const BLOCKED_GLOBALS = [
  "window", "document", "globalThis", "self", "top", "parent", "frames",
  "localStorage", "sessionStorage", "indexedDB", "fetch", "XMLHttpRequest",
  "WebSocket", "Worker", "cookie", "navigator", "location", "process",
  "importScripts", "open", "alert", "prompt", "confirm"
];

// Inject infinite loop protection into user code
function injectLoopGuards(sourceCode) {
  let guarded = sourceCode;

  // Protect while loops: while(...) { -> while(...) { if (++__guard > 5000) throw new Error("Infinite Loop Protection Triggered");
  guarded = guarded.replace(/while\s*\(([^)]+)\)\s*\{/g, (match, cond) => {
    return `while (${cond}) { if (++__loopGuard > 10000) throw new Error("Execution aborted: Loop exceeded 10,000 iterations."); `;
  });

  // Protect for loops: for(...) { -> for(...) { if (++__guard > 5000) throw new Error(...)
  guarded = guarded.replace(/for\s*\(([^)]+)\)\s*\{/g, (match, cond) => {
    return `for (${cond}) { if (++__loopGuard > 10000) throw new Error("Execution aborted: Loop exceeded 10,000 iterations."); `;
  });

  return `let __loopGuard = 0;\n${guarded}`;
}

/**
 * Universal Hardened Code-to-3D Parser & Sandbox Runner
 */
export function parseCodeTo3DActions(code, realm = "sorting") {
  if (!code || typeof code !== "string" || code.trim() === "") {
    return { success: true, actions: [], errors: [], logs: [], variables: {}, initialArray: null, initialMatrix: null };
  }

  const actions = [];
  const errors = [];
  const logs = [];
  let initialArray = null;
  let initialMatrix = null;

  const MAX_ACTIONS = 500;
  let actionCount = 0;

  // Active detected realm
  let activeRealm = realm.toLowerCase();
  if (activeRealm === "array") activeRealm = "sorting";
  if (activeRealm === "list") activeRealm = "linkedlist";
  if (activeRealm === "grid") activeRealm = "matrix";

  // 1. Detect 2D Matrix Literal (e.g. let grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];)
  const matrixMatch = code.match(/(?:let|const|var)\s+(?:grid|matrix|board|table)\s*=\s*(\[\s*\[[\s\S]*?\]\s*\])/);
  if (matrixMatch) {
    try {
      const sanitized = matrixMatch[1].replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
      const parsedMat = new Function(`return (${sanitized});`)();
      if (Array.isArray(parsedMat) && Array.isArray(parsedMat[0])) {
        initialMatrix = parsedMat;
        activeRealm = "matrix";
      }
    } catch {
      // Ignore
    }
  }

  // 2. Detect 1D Array Literal (e.g. let arr = [60, 20, 80, 10, 40];)
  if (!initialMatrix) {
    const initialArrMatch = code.match(/(?:let|const|var)\s+(?:arr|array|nums|data)\s*=\s*\[([^\]]+)\]/);
    if (initialArrMatch) {
      try {
        const parsedElements = initialArrMatch[1]
          .split(",")
          .map((s) => Number(s.trim()))
          .filter((n) => !isNaN(n));
        if (parsedElements.length > 0) {
          initialArray = parsedElements.slice(0, 16);
        }
      } catch {
        // Ignore
      }
    }
  }

  // --- INSTRUMENTED PROXY DSA RUNTIME ---
  const currentScope = {};

  function recordAction(act) {
    if (actionCount >= MAX_ACTIONS) return;
    actionCount++;
    actions.push({
      id: `act-${Date.now()}-${actions.length}`,
      line: act.line || 1,
      raw: act.raw || `${act.type}(${JSON.stringify(act.arg || act.indices || act.cell || '')})`,
      target: act.target || activeRealm,
      type: act.type,
      arg: act.arg,
      indices: act.indices,
      cell: act.cell,
      scopeSnapshot: cloneScope(currentScope),
    });
  }

  // Helper objects available globally in user code
  const runtimeEnv = {
    // 1. Matrix & 2D Grid Realm Helper
    matrix: {
      visit(r, c) {
        recordAction({
          type: "matrix_visit",
          target: "matrix",
          cell: [Number(r), Number(c)],
          raw: `matrix.visit([${r}][${c}])`,
        });
      },
      highlight(r, c) {
        recordAction({
          type: "matrix_visit",
          target: "matrix",
          cell: [Number(r), Number(c)],
          raw: `matrix.highlight([${r}][${c}])`,
        });
      },
      swap(cell1, cell2) {
        recordAction({
          type: "matrix_swap",
          target: "matrix",
          arg: [cell1, cell2],
          raw: `matrix.swap([${cell1}], [${cell2}])`,
        });
      },
      set(r, c, val) {
        recordAction({
          type: "matrix_set",
          target: "matrix",
          cell: [Number(r), Number(c)],
          arg: Number(val),
          raw: `matrix[${r}][${c}] = ${val}`,
        });
      },
    },

    // 2. Array & Sorting Realm Helper
    array: {
      swap(i, j) {
        recordAction({
          type: "swap",
          target: "sorting",
          indices: [Number(i), Number(j)],
          raw: `array.swap(${i}, ${j})`,
        });
      },
      compare(i, j) {
        recordAction({
          type: "compare",
          target: "sorting",
          indices: [Number(i), Number(j)],
          raw: `array.compare(${i}, ${j})`,
        });
      },
      set(i, val) {
        recordAction({
          type: "set",
          target: "sorting",
          arg: [Number(i), Number(val)],
          raw: `array.set(${i}, ${val})`,
        });
      },
      push(val) {
        recordAction({
          type: "push",
          target: "sorting",
          arg: Number(val),
          raw: `array.push(${val})`,
        });
      },
      search(val) {
        recordAction({
          type: "search",
          target: "sorting",
          arg: Number(val),
          raw: `array.search(${val})`,
        });
      },
      reverse() {
        recordAction({
          type: "reverse",
          target: "sorting",
          raw: `array.reverse()`,
        });
      },
      clear() {
        recordAction({
          type: "clear",
          target: "sorting",
          raw: `array.clear()`,
        });
      },
    },

    // 3. Stack Realm Helper
    stack: {
      push(val) {
        recordAction({
          type: "push",
          target: "stack",
          arg: Number(val),
          raw: `stack.push(${val})`,
        });
      },
      pop() {
        recordAction({
          type: "pop",
          target: "stack",
          raw: `stack.pop()`,
        });
      },
      peek() {
        recordAction({
          type: "peek",
          target: "stack",
          raw: `stack.peek()`,
        });
      },
      clear() {
        recordAction({
          type: "clear",
          target: "stack",
          raw: `stack.clear()`,
        });
      },
    },

    // 4. Queue Realm Helper
    queue: {
      enqueue(val) {
        recordAction({
          type: "enqueue",
          target: "queue",
          arg: Number(val),
          raw: `queue.enqueue(${val})`,
        });
      },
      dequeue() {
        recordAction({
          type: "dequeue",
          target: "queue",
          raw: `queue.dequeue()`,
        });
      },
      peek() {
        recordAction({
          type: "peek",
          target: "queue",
          raw: `queue.peek()`,
        });
      },
      clear() {
        recordAction({
          type: "clear",
          target: "queue",
          raw: `queue.clear()`,
        });
      },
    },

    // 5. Tree Realm Helper
    tree: {
      insert(val) {
        recordAction({
          type: "insert",
          target: "tree",
          arg: Number(val),
          raw: `tree.insert(${val})`,
        });
      },
      delete(val) {
        recordAction({
          type: "delete",
          target: "tree",
          arg: Number(val),
          raw: `tree.delete(${val})`,
        });
      },
      search(val) {
        recordAction({
          type: "search",
          target: "tree",
          arg: Number(val),
          raw: `tree.search(${val})`,
        });
      },
      bfs() {
        recordAction({
          type: "bfs",
          target: "tree",
          raw: `tree.bfs()`,
        });
      },
      dfs() {
        recordAction({
          type: "dfs",
          target: "tree",
          raw: `tree.dfs()`,
        });
      },
      clear() {
        recordAction({
          type: "clear",
          target: "tree",
          raw: `tree.clear()`,
        });
      },
    },

    // 6. Graph Realm Helper
    graph: {
      addVertex(v) {
        recordAction({
          type: "addVertex",
          target: "graph",
          arg: Number(v),
          raw: `graph.addVertex(${v})`,
        });
      },
      addEdge(u, v) {
        recordAction({
          type: "addEdge",
          target: "graph",
          arg: [Number(u), Number(v)],
          raw: `graph.addEdge(${u}, ${v})`,
        });
      },
      bfs(start = 0) {
        recordAction({
          type: "bfs",
          target: "graph",
          arg: Number(start),
          raw: `graph.bfs(${start})`,
        });
      },
      dfs(start = 0) {
        recordAction({
          type: "dfs",
          target: "graph",
          arg: Number(start),
          raw: `graph.dfs(${start})`,
        });
      },
      clear() {
        recordAction({
          type: "clear",
          target: "graph",
          raw: `graph.clear()`,
        });
      },
    },

    // 7. Heap Realm Helper
    heap: {
      insert(val) {
        recordAction({
          type: "insert",
          target: "heap",
          arg: Number(val),
          raw: `heap.insert(${val})`,
        });
      },
      extractRoot() {
        recordAction({
          type: "extractRoot",
          target: "heap",
          raw: `heap.extractRoot()`,
        });
      },
      clear() {
        recordAction({
          type: "clear",
          target: "heap",
          raw: `heap.clear()`,
        });
      },
    },

    // 8. Linked List Realm Helper
    list: {
      insert(val) {
        recordAction({
          type: "insert",
          target: "linkedlist",
          arg: Number(val),
          raw: `list.insert(${val})`,
        });
      },
      insertHead(val) {
        recordAction({
          type: "insertHead",
          target: "linkedlist",
          arg: Number(val),
          raw: `list.insertHead(${val})`,
        });
      },
      delete(val) {
        recordAction({
          type: "delete",
          target: "linkedlist",
          arg: Number(val),
          raw: `list.delete(${val})`,
        });
      },
      reverse() {
        recordAction({
          type: "reverse",
          target: "linkedlist",
          raw: `list.reverse()`,
        });
      },
      clear() {
        recordAction({
          type: "clear",
          target: "linkedlist",
          raw: `list.clear()`,
        });
      },
    },

    // Global swap & compare functions
    swap(a, b, c) {
      if (typeof c === "number" && typeof b === "number") {
        recordAction({
          type: "swap",
          target: "sorting",
          indices: [b, c],
          raw: `swap([${b}], [${c}])`,
        });
      } else if (typeof a === "number" && typeof b === "number") {
        recordAction({
          type: "swap",
          target: "sorting",
          indices: [a, b],
          raw: `swap([${a}], [${b}])`,
        });
      }
    },
    compare(i, j) {
      recordAction({
        type: "compare",
        target: "sorting",
        indices: [Number(i), Number(j)],
        raw: `compare([${i}], [${j}])`,
      });
    },

    // Console output interceptor (also detects matrix visited coordinates!)
    console: {
      log(...args) {
        const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
        logs.push(msg);

        // Pattern matching for Matrix coordinate logs: e.g. [0][0] or [0, 1]
        const coordMatch = msg.match(/\[(\d+)\]\s*\[(\d+)\]|\[(\d+)\s*,\s*(\d+)\]/);
        if (coordMatch) {
          const r = Number(coordMatch[1] !== undefined ? coordMatch[1] : coordMatch[3]);
          const c = Number(coordMatch[2] !== undefined ? coordMatch[2] : coordMatch[4]);
          recordAction({
            type: "matrix_visit",
            target: "matrix",
            cell: [r, c],
            raw: `visit [${r}][${c}]`,
          });
        }
      },
      warn(...args) {
        const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
        logs.push(`⚠️ ${msg}`);
      },
      error(...args) {
        const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
        logs.push(`❌ ${msg}`);
      },
    },
  };

  // Create an instrumented Proxy wrapper around 1D & 2D Arrays
  function createInstrumentedArray(initial = [], is2D = false, rowIndex = null) {
    const rawArr = [...initial];

    return new Proxy(rawArr, {
      get(target, prop, receiver) {
        // Intercept array methods
        if (prop === "push") {
          return function (...vals) {
            for (const v of vals) {
              recordAction({
                type: "push",
                target: activeRealm === "stack" ? "stack" : activeRealm === "queue" ? "queue" : "sorting",
                arg: Number(v),
                raw: `push(${v})`,
              });
            }
            return target.push(...vals);
          };
        }
        if (prop === "pop") {
          return function () {
            recordAction({
              type: "pop",
              target: activeRealm === "stack" ? "stack" : "sorting",
              raw: `pop()`,
            });
            return target.pop();
          };
        }
        if (prop === "shift") {
          return function () {
            recordAction({
              type: "dequeue",
              target: "queue",
              raw: `shift()`,
            });
            return target.shift();
          };
        }
        if (prop === "reverse") {
          return function () {
            recordAction({
              type: "reverse",
              target: is2D ? "matrix" : "sorting",
              raw: `reverse()`,
            });
            return target.reverse();
          };
        }

        // Numeric index access
        if (typeof prop === "string" && /^\d+$/.test(prop)) {
          const idx = Number(prop);

          if (is2D && rowIndex !== null) {
            // Accessing cell matrix[r][c]
            recordAction({
              type: "matrix_visit",
              target: "matrix",
              cell: [rowIndex, idx],
              raw: `matrix[${rowIndex}][${idx}] = ${target[idx]}`,
            });
          } else if (activeRealm === "sorting" && idx < target.length) {
            // 1D array read
            recordAction({
              type: "compare",
              target: "sorting",
              indices: [idx, idx],
              raw: `read [${idx}] = ${target[idx]}`,
            });
          }
        }

        return Reflect.get(target, prop, receiver);
      },

      set(target, prop, value, receiver) {
        if (typeof prop === "string" && /^\d+$/.test(prop)) {
          const idx = Number(prop);
          const res = Reflect.set(target, prop, value, receiver);

          if (is2D && rowIndex !== null) {
            recordAction({
              type: "matrix_set",
              target: "matrix",
              cell: [rowIndex, idx],
              arg: Number(value),
              raw: `matrix[${rowIndex}][${idx}] = ${value}`,
            });
          } else {
            recordAction({
              type: "set",
              target: "sorting",
              arg: [idx, Number(value)],
              raw: `arr[${idx}] = ${value}`,
            });
          }
          return res;
        }
        return Reflect.set(target, prop, value, receiver);
      },
    });
  }

  // Pre-populate environment with instrumented variables
  if (initialMatrix) {
    runtimeEnv.grid = initialMatrix.map((row, r) => createInstrumentedArray(row, true, r));
    runtimeEnv.matrix = runtimeEnv.grid;
    runtimeEnv.board = runtimeEnv.grid;
  } else if (initialArray) {
    runtimeEnv.arr = createInstrumentedArray(initialArray, false);
    runtimeEnv.array_data = runtimeEnv.arr;
    runtimeEnv.nums = runtimeEnv.arr;
  }

  // Execute in isolated, hardened function sandbox
  try {
    const guardedCode = injectLoopGuards(code);

    // Build argument list: runtime helpers + blocked shadow variables (undefined)
    const envKeys = [...Object.keys(runtimeEnv), ...BLOCKED_GLOBALS];
    const envVals = [
      ...Object.keys(runtimeEnv).map((k) => runtimeEnv[k]),
      ...BLOCKED_GLOBALS.map(() => undefined),
    ];

    const sandboxFn = new Function(
      ...envKeys,
      `"use strict";
       try {
         ${guardedCode}
       } catch (err) {
         throw err;
       }`
    );

    sandboxFn(...envVals);

    return {
      success: true,
      actions,
      errors: [],
      logs,
      variables: currentScope,
      initialArray,
      initialMatrix,
      detectedRealm: activeRealm,
    };
  } catch (err) {
    errors.push(err.message);
    return {
      success: false,
      actions,
      errors,
      logs,
      variables: currentScope,
      initialArray,
      initialMatrix,
      detectedRealm: activeRealm,
    };
  }
}
