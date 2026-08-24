/**
 * Universal Multi-Language Code-to-3D Interpreter & Hardened DSA Execution Engine.
 */

// Detect language from source code
export function detectLanguageFromCode(code) {
  if (!code || typeof code !== "string") return "javascript";
  const lower = code.toLowerCase();

  if (code.includes("#include") && (lower.includes("iostream") || lower.includes("vector") || lower.includes("using namespace std") || lower.includes("stack") || lower.includes("queue") || lower.includes("algorithm"))) {
    return "cpp";
  }
  if (code.includes("#include") && lower.includes("stdio.h")) {
    return "c";
  }
  if (code.includes("public class") || code.includes("public static void main") || code.includes("System.out.print")) {
    return "java";
  }
  if (/^\s*def\s+[a-zA-Z_]/m.test(code) || /^\s*class\s+[a-zA-Z_].*:/m.test(code) || code.includes("print(") || code.includes("range(") || code.includes("elif ") || code.includes("import ")) {
    return "python";
  }

  return "javascript";
}

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
    lower.includes("spiral_order") ||
    lower.includes("rotate_matrix") ||
    lower.includes("top <=") ||
    lower.includes("bottom >=") ||
    /\[\s*\[\s*\d+/.test(code) ||
    /\{\s*\{\s*\d+/.test(code) ||
    /\[\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\]\s*\[\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\]/.test(code)
  ) {
    return "matrix";
  }

  // Graph keywords
  if (
    lower.includes("addedge") ||
    lower.includes("addvertex") ||
    lower.includes("add_edge") ||
    lower.includes("add_vertex") ||
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
    lower.includes("tree_node") ||
    lower.includes("tree.") ||
    lower.includes("root.left") ||
    lower.includes("root.right") ||
    lower.includes("root->left") ||
    lower.includes("root->right") ||
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
    lower.includes("min_heap") ||
    lower.includes("priorityqueue") ||
    lower.includes("priority_queue") ||
    lower.includes("heapify") ||
    lower.includes("extractroot") ||
    lower.includes("extract_root") ||
    lower.includes("siftup") ||
    lower.includes("siftdown")
  ) {
    return "heap";
  }

  // Linked List keywords
  if (
    lower.includes("listnode") ||
    lower.includes("list_node") ||
    lower.includes("linkedlist") ||
    lower.includes("linked_list") ||
    lower.includes("list.") ||
    lower.includes("node.next") ||
    lower.includes("node->next") ||
    lower.includes("head.next") ||
    lower.includes("head->next") ||
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

// Convert Python indentation-based code to JavaScript blocks
export function pythonToJavaScript(pyCode) {
  const lines = pyCode.split("\n");
  const jsLines = [];
  const indentStack = [0];
  const declaredVars = new Set();
  let bracketDepth = 0;

  for (let rawLine of lines) {
    // Preserve line comments
    if (rawLine.trim().startsWith("#")) {
      jsLines.push(rawLine.replace("#", "//"));
      continue;
    }
    if (!rawLine.trim()) {
      jsLines.push("");
      continue;
    }

    const indent = rawLine.search(/\S/);
    let line = rawLine.trim();

    // Check if elif or else
    const isElifOrElse = /^(?:elif\b|else\s*:)/.test(line);

    if (isElifOrElse) {
      // Unindent back to parent if level without emitting duplicate closing braces
      while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1] - 4) {
        indentStack.pop();
        jsLines.push(" ".repeat(indentStack[indentStack.length - 1]) + "}");
      }
    } else {
      // Close blocks when unindenting
      while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        jsLines.push(" ".repeat(indentStack[indentStack.length - 1]) + "}");
      }
    }

    // 0. Python f-strings: f"Visited [{top}][{c}]" -> `Visited [${top}][${c}]`
    line = line.replace(/f"([^"]*)"/g, (m, content) => {
      const templated = content.replace(/\{([^}]+)\}/g, "${$1}");
      return `\`${templated}\``;
    });
    line = line.replace(/f'([^']*)'/g, (m, content) => {
      const templated = content.replace(/\{([^}]+)\}/g, "${$1}");
      return `\`${templated}\``;
    });

    // 1. Python Tuple Swaps: a, b = b, a or arr[i], arr[j] = arr[j], arr[i]
    const tupleSwap = line.match(/^([a-zA-Z0-9_\[\]+-\s]+),\s*([a-zA-Z0-9_\[\]+-\s]+)\s*=\s*([a-zA-Z0-9_\[\]+-\s]+),\s*([a-zA-Z0-9_\[\]+-\s]+)$/);
    if (tupleSwap) {
      const left1 = tupleSwap[1].trim();
      const left2 = tupleSwap[2].trim();
      const right1 = tupleSwap[3].trim();
      const right2 = tupleSwap[4].trim();

      const arrIdx1 = left1.match(/^arr\[([^\]]+)\]$/);
      const arrIdx2 = left2.match(/^arr\[([^\]]+)\]$/);
      const matIdx1 = left1.match(/^grid\[([^\]]+)\]\[([^\]]+)\]$/);
      const matIdx2 = left2.match(/^grid\[([^\]]+)\]\[([^\]]+)\]$/);

      if (arrIdx1 && arrIdx2) {
        line = `array.swap(${arrIdx1[1]}, ${arrIdx2[1]}); [${left1}, ${left2}] = [${right1}, ${right2}];`;
      } else if (matIdx1 && matIdx2) {
        line = `matrix.swap([${matIdx1[1]}, ${matIdx1[2]}], [${matIdx2[1]}, ${matIdx2[2]}]); [${left1}, ${left2}] = [${right1}, ${right2}];`;
      } else {
        line = `[${left1}, ${left2}] = [${right1}, ${right2}];`;
      }
    } else {
      // Multiple assignment: a, b = 0, n - 1
      const multiAssign = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^,]+),\s*(.+)$/);
      if (multiAssign) {
        const v1 = multiAssign[1];
        const v2 = multiAssign[2];
        const val1 = multiAssign[3].trim();
        const val2 = multiAssign[4].trim();
        const prefix = (!declaredVars.has(v1) || !declaredVars.has(v2)) ? "let " : "";
        declaredVars.add(v1);
        declaredVars.add(v2);
        line = `${prefix}[${v1}, ${v2}] = [${val1}, ${val2}];`;
      } else {
        // Single variable assignment: var = expr
        const singleAssign = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
        if (singleAssign && !line.startsWith("==") && !declaredVars.has(singleAssign[1])) {
          const varName = singleAssign[1];
          declaredVars.add(varName);
          line = `let ${varName} = ${singleAssign[2]}`;
        }
      }
    }

    // 2. Range loops: 3-argument range(start, stop, step)
    line = line.replace(/for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+range\(([^,]+),\s*([^,]+),\s*(-1|-?\d+)\)\s*:/g, (m, v, start, stop, step) => {
      const s = Number(step);
      declaredVars.add(v);
      if (s < 0) return `for (let ${v} = ${start}; ${v} > ${stop}; ${v} += ${step}) {`;
      return `for (let ${v} = ${start}; ${v} < ${stop}; ${v} += ${step}) {`;
    });

    // 2-argument range(start, stop)
    line = line.replace(/for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+range\(([^,]+),\s*([^)]+)\)\s*:/g, (m, v, start, stop) => {
      declaredVars.add(v);
      return `for (let ${v} = ${start}; ${v} < ${stop}; ${v}++) {`;
    });

    // 1-argument range(stop)
    line = line.replace(/for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+range\(([^)]+)\)\s*:/g, (m, v, stop) => {
      declaredVars.add(v);
      return `for (let ${v} = 0; ${v} < ${stop}; ${v}++) {`;
    });

    // for item in iterable
    line = line.replace(/for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+([^:]+):/g, (m, v, iter) => {
      declaredVars.add(v);
      return `for (let ${v} of ${iter}) {`;
    });

    // 3. Conditionals & while (replace elif BEFORE if, using word boundary \bif)
    line = line.replace(/while\s+(.+)\s*:/g, "while ($1) {");
    line = line.replace(/\belif\s+(.+)\s*:/g, "} else if ($1) {");
    line = line.replace(/\bif\s+(.+)\s*:/g, "if ($1) {");
    line = line.replace(/\belse\s*:/g, "} else {");

    // 4. Function & Class definitions
    line = line.replace(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*(?:->\s*[^:]+)?\s*:/g, (m, fnName, args) => {
      const cleanArgs = args.replace(/\bself\b\s*,?\s*/g, "").replace(/:[^,)]+/g, "");
      return `function ${fnName}(${cleanArgs}) {`;
    });
    line = line.replace(/class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:\([^)]*\))?\s*:/g, "class $1 {");

    // 5. Python methods & builtins
    line = line.replace(/\blen\(([^)]+)\)/g, "$1.length");
    line = line.replace(/\bprint\(/g, "console.log(");
    line = line.replace(/\.append\(/g, ".push(");
    line = line.replace(/\.pop\(0\)/g, ".shift()");
    line = line.replace(/\bTrue\b/g, "true");
    line = line.replace(/\bFalse\b/g, "false");
    line = line.replace(/\bNone\b/g, "null");
    line = line.replace(/\band\b/g, "&&");
    line = line.replace(/\bor\b/g, "||");
    line = line.replace(/\bnot\b/g, "!");
    line = line.replace(/\/\//g, "/");

    // Helper method translations
    line = line.replace(/graph\.add_vertex\(/g, "graph.addVertex(");
    line = line.replace(/graph\.add_edge\(/g, "graph.addEdge(");
    line = line.replace(/heap\.extract_root\(/g, "heap.extractRoot(");
    line = line.replace(/list\.insert_head\(/g, "list.insertHead(");

    // Track bracket depth for multi-line lists/dicts
    const opens = (line.match(/[\[\(\{]/g) || []).length;
    const closes = (line.match(/[\]\)\}]/g) || []).length;
    bracketDepth += opens - closes;

    // Check if block was opened or line needs semicolon
    if (rawLine.trim().endsWith(":")) {
      if (!isElifOrElse) {
        indentStack.push(indent + 4);
      }
    } else if (
      bracketDepth <= 0 &&
      !line.endsWith(";") &&
      !line.endsWith("{") &&
      !line.endsWith("}") &&
      !line.endsWith("[") &&
      !line.endsWith(",") &&
      !line.endsWith("(")
    ) {
      line += ";";
    }

    jsLines.push(" ".repeat(indent) + line);
  }

  // Close remaining indentation blocks
  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push(" ".repeat(indentStack[indentStack.length - 1]) + "}");
  }

  return jsLines.join("\n");
}

// Convert C++ / C / Java code to executable JavaScript
export function cppJavaToJavaScript(code) {
  let js = code;

  // 1. Remove preprocessor & package headers
  js = js.replace(/#include\s*<[^>]+>/g, "");
  js = js.replace(/#include\s*"[^"]+"/g, "");
  js = js.replace(/using\s+namespace\s+std\s*;/g, "");
  js = js.replace(/package\s+[a-zA-Z0-9_.]+;/g, "");
  js = js.replace(/import\s+[a-zA-Z0-9_.*]+;/g, "");

  // 2. Remove Java class wrapping cleanly
  if (/public\s+class\s+[a-zA-Z0-9_]+[\s\S]*?\{/.test(js)) {
    js = js.replace(/public\s+class\s+[a-zA-Z0-9_]+\s*\{/, "");
    const lastBrace = js.lastIndexOf("}");
    if (lastBrace !== -1) {
      js = js.substring(0, lastBrace) + js.substring(lastBrace + 1);
    }
  }

  // 3. Convert C++ / C / Java main():
  js = js.replace(/(?:public\s+)?(?:static\s+)?(?:void|int)\s+main\s*\([^)]*\)\s*\{/g, "function __main__() {");

  // 4. Convert other functions (void bubbleSort, int binarySearch, etc.)
  js = js.replace(/(?:public\s+)?(?:static\s+)?(?:private\s+)?(?:protected\s+)?\b(?:void|int|bool|double|float|vector<[^>]+>|int\[\]|int\[\]\[\]|char\*?)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/g, (m, fnName, args) => {
    if (fnName === "if" || fnName === "for" || fnName === "while" || fnName === "switch") return m;
    const cleanArgs = args.split(",").map((a) => {
      const parts = a.trim().split(/\s+/);
      return parts[parts.length - 1].replace(/[&*\[\]]/g, "");
    }).filter(Boolean).join(", ");
    return `function ${fnName}(${cleanArgs}) {`;
  });

  // 5. C sizeof: sizeof(arr) / sizeof(arr[0]) -> arr.length
  js = js.replace(/sizeof\s*\(\s*([a-zA-Z0-9_]+)\s*\)\s*\/\s*sizeof\s*\(\s*[a-zA-Z0-9_]+\[\d*\]\s*\)/g, "$1.length");
  js = js.replace(/sizeof\s*\([^)]*\)/g, "4");

  // 6. Convert std::cout / printf / System.out.println
  js = js.replace(/cout\s*<<\s*([^;]+);/g, (m, expr) => {
    const parts = expr.split("<<").map((p) => p.trim()).filter((p) => p !== "endl" && p !== "'\\n'" && p !== '"\\n"');
    return `console.log(${parts.join(", ")});`;
  });
  js = js.replace(/std::cout\s*<<\s*([^;]+);/g, (m, expr) => {
    const parts = expr.split("<<").map((p) => p.trim()).filter((p) => p !== "endl" && p !== "'\\n'" && p !== '"\\n"');
    return `console.log(${parts.join(", ")});`;
  });
  js = js.replace(/printf\s*\(([^;]+)\);/g, "console.log($1);");
  js = js.replace(/System\.out\.println\s*\(([^;]*)\);/g, "console.log($1);");
  js = js.replace(/System\.out\.print\s*\(([^;]*)\);/g, "console.log($1);");

  // 7. Convert 2D Matrix / Vector literals: {{1, 2}, {3, 4}} -> [[1, 2], [3, 4]]
  js = js.replace(/=\s*\{\s*\{/g, "= [[");
  js = js.replace(/\}\s*,\s*\{/g, "], [");
  js = js.replace(/\}\s*\};/g, "]];");

  // 8. Convert 1D array literals: {1, 2, 3, 4} -> [1, 2, 3, 4]
  js = js.replace(/=\s*\{([^}]+)\};/g, "= [$1];");

  // 9. Strip C++ / Java / C array declarations with brackets: e.g. int grid[3][3] = ... or int arr[] = ...
  js = js.replace(/\b(?:int|float|double|char|bool|auto|long|void)\s+([a-zA-Z_][a-zA-Z0-9_]*)\[\d*\]\[\d*\]\s*=/g, "let $1 =");
  js = js.replace(/\b(?:int|float|double|char|bool|auto|long|void)\s+([a-zA-Z_][a-zA-Z0-9_]*)\[\d*\]\s*=/g, "let $1 =");

  // 10. Strip general C++ / Java / C types in declarations
  js = js.replace(/\b(?:vector<vector<[a-zA-Z0-9_]+>>|vector<[a-zA-Z0-9_]+>|stack<[a-zA-Z0-9_]+>|queue<[a-zA-Z0-9_]+>|int\[\]\[\]|int\[\]|int|float|double|char|bool|auto|long|void|size_t)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g, "let $1 =");
  js = js.replace(/\b(?:vector<vector<[a-zA-Z0-9_]+>>|vector<[a-zA-Z0-9_]+>|stack<[a-zA-Z0-9_]+>|queue<[a-zA-Z0-9_]+>|int\[\]\[\]|int\[\]|int|float|double|char|bool|auto|long|void|size_t)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*;/g, "let $1;");

  // 11. Convert Java for-each loop: for (int val : values) -> for (let val of values)
  js = js.replace(/for\s*\(\s*(?:int|float|double|String|auto|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([^)]+)\)/g, "for (let $1 of $2)");

  // 12. Convert C++ swap(a, b) or swap(arr[i], arr[j])
  js = js.replace(/\bswap\s*\(\s*([a-zA-Z0-9_\[\]]+)\s*,\s*([a-zA-Z0-9_\[\]]+)\s*\);/g, (m, a, b) => {
    const arrIdx1 = a.match(/^arr\[([^\]]+)\]$/);
    const arrIdx2 = b.match(/^arr\[([^\]]+)\]$/);
    const matIdx1 = a.match(/^grid\[([^\]]+)\]\[([^\]]+)\]$/);
    const matIdx2 = b.match(/^grid\[([^\]]+)\]\[([^\]]+)\]$/);

    if (arrIdx1 && arrIdx2) {
      return `array.swap(${arrIdx1[1]}, ${arrIdx2[1]}); [${a}, ${b}] = [${b}, ${a}];`;
    } else if (matIdx1 && matIdx2) {
      return `matrix.swap([${matIdx1[1]}, ${matIdx1[2]}], [${matIdx2[1]}, ${matIdx2[2]}]); [${a}, ${b}] = [${b}, ${a}];`;
    }
    return `[${a}, ${b}] = [${b}, ${a}];`;
  });

  // 13. Methods: .size() -> .length, push_back() -> push(), reverse(...)
  js = js.replace(/\.size\(\)/g, ".length");
  js = js.replace(/\.push_back\(/g, ".push(");
  js = js.replace(/reverse\s*\(\s*([a-zA-Z0-9_\[\]]+)\.begin\(\)\s*,\s*[a-zA-Z0-9_\[\]]+\.end\(\)\s*\);/g, "$1.reverse();");

  // 14. Auto-invoke __main__() if defined
  if (js.includes("function __main__()")) {
    js += "\n__main__();\n";
  }

  return js;
}

// Universal Multi-Language Transpiler
export function transpileToExecutableJS(sourceCode, language = "auto") {
  if (!sourceCode || typeof sourceCode !== "string") return "";

  let lang = language;
  if (lang === "auto") {
    lang = detectLanguageFromCode(sourceCode);
  }

  if (lang === "python") {
    return pythonToJavaScript(sourceCode);
  }
  if (lang === "cpp" || lang === "c" || lang === "java") {
    return cppJavaToJavaScript(sourceCode);
  }

  return sourceCode;
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

  guarded = guarded.replace(/while\s*\(([^)]+)\)\s*\{/g, (match, cond) => {
    return `while (${cond}) { if (++__loopGuard > 10000) throw new Error("Execution aborted: Loop exceeded 10,000 iterations."); `;
  });

  guarded = guarded.replace(/for\s*\(([^)]+)\)\s*\{/g, (match, cond) => {
    return `for (${cond}) { if (++__loopGuard > 10000) throw new Error("Execution aborted: Loop exceeded 10,000 iterations."); `;
  });

  return `let __loopGuard = 0;\n${guarded}`;
}

/**
 * Universal Multi-Language Code-to-3D Parser & Sandbox Runner
 */
export function parseCodeTo3DActions(code, realm = "sorting", language = "auto") {
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

  // Transpile to executable JS if Python, C++, Java, or C
  let executableJS = transpileToExecutableJS(code, language);

  // 1. Detect 2D Matrix Literal (e.g. grid = [[1, 2, 3], ...];)
  const matrixMatch = executableJS.match(/(?:let|const|var)?\s*(?:grid|matrix|board|table)\s*=\s*(\[\s*\[[\s\S]*?\]\s*\])/);
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

  // 2. Detect 1D Array Literal (e.g. arr = [60, 20, 80, 10, 40];)
  if (!initialMatrix) {
    const initialArrMatch = executableJS.match(/(?:let|const|var)?\s*(?:arr|array|nums|data|values)\s*=\s*\[([^\]]+)\]/);
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

  // Replace variable redeclarations with proxy-assign so proxy intercepts operations
  if (initialMatrix) {
    executableJS = executableJS.replace(/(?:let|const|var)\s+(grid|matrix|board|table)\s*=\s*(\[\s*\[[\s\S]*?\]\s*\]);?/g, "$1 = __createMatrix($2);");
  }
  if (initialArray) {
    executableJS = executableJS.replace(/(?:let|const|var)\s+(arr|array|nums|data|values)\s*=\s*(\[[^\]]+\]);?/g, "$1 = __createArray($2);");
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
      reverseRow(r) {
        recordAction({
          type: "matrix_reverse_row",
          target: "matrix",
          arg: Number(r),
          raw: `matrix.reverseRow(${r})`,
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
          arg: v,
          raw: `graph.addVertex(${v})`,
        });
      },
      addEdge(u, v) {
        recordAction({
          type: "addEdge",
          target: "graph",
          arg: [u, v],
          raw: `graph.addEdge(${u}, ${v})`,
        });
      },
      bfs(start = 0) {
        recordAction({
          type: "bfs",
          target: "graph",
          arg: start,
          raw: `graph.bfs(${start})`,
        });
      },
      dfs(start = 0) {
        recordAction({
          type: "dfs",
          target: "graph",
          arg: start,
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

    // Console output interceptor (detects matrix visited coordinates)
    console: {
      log(...args) {
        let msg = "";
        if (typeof args[0] === "string" && (args[0].includes("%d") || args[0].includes("%s") || args[0].includes("%f"))) {
          let str = args[0];
          let argIdx = 1;
          msg = str.replace(/%[dsf]/g, () => (args[argIdx++] !== undefined ? args[argIdx - 1] : ""));
          if (argIdx < args.length) {
            msg += " " + args.slice(argIdx).join(" ");
          }
        } else {
          msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
        }

        logs.push(msg);

        // Pattern matching for Matrix coordinate logs: e.g. [0][0] or [0, 1] with any spacing
        const coordMatch = msg.match(/\[\s*(\d+)\s*\]\s*\[\s*(\d+)\s*\]|\[\s*(\d+)\s*,\s*(\d+)\s*\]/);
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

    const proxy = new Proxy(rawArr, {
      get(target, prop, receiver) {
        // Intercept helper methods
        if (prop === "swap") {
          return function (c1, c2) {
            recordAction({
              type: "matrix_swap",
              target: "matrix",
              arg: [c1, c2],
              raw: `matrix.swap([${c1}], [${c2}])`,
            });
          };
        }
        if (prop === "reverseRow") {
          return function (r = 0) {
            recordAction({
              type: "matrix_reverse_row",
              target: "matrix",
              arg: Number(r),
              raw: `matrix.reverseRow(${r})`,
            });
          };
        }
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
              type: is2D ? "matrix_reverse_row" : "reverse",
              target: is2D ? "matrix" : "sorting",
              arg: rowIndex !== null ? rowIndex : 0,
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
            // 1D array read / comparison
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

    return proxy;
  }

  function createMatrixProxy(mat) {
    const matProxy = mat.map((row, r) => createInstrumentedArray(row, true, r));
    matProxy.swap = function (c1, c2) {
      recordAction({
        type: "matrix_swap",
        target: "matrix",
        arg: [c1, c2],
        raw: `matrix.swap([${c1}], [${c2}])`,
      });
    };
    matProxy.reverseRow = function (r = 0) {
      recordAction({
        type: "matrix_reverse_row",
        target: "matrix",
        arg: Number(r),
        raw: `matrix.reverseRow(${r})`,
      });
    };
    return matProxy;
  }

  runtimeEnv.__createMatrix = (mat) => createMatrixProxy(mat);
  runtimeEnv.__createArray = (arr) => createInstrumentedArray(arr, false);

  // Pre-populate environment with instrumented variables
  if (initialMatrix) {
    runtimeEnv.grid = createMatrixProxy(initialMatrix);
    runtimeEnv.matrix = runtimeEnv.grid;
    runtimeEnv.board = runtimeEnv.grid;
  } else if (initialArray) {
    runtimeEnv.arr = createInstrumentedArray(initialArray, false);
    runtimeEnv.array_data = runtimeEnv.arr;
    runtimeEnv.nums = runtimeEnv.arr;
    runtimeEnv.values = runtimeEnv.arr;
  }

  // Execute in isolated, hardened function sandbox
  try {
    const guardedCode = injectLoopGuards(executableJS);

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
