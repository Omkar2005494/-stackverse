import { useState } from "react";
import { useGameProgress } from "../context/GameProgressContext";
import { soundFX } from "../utils/soundFX";

export function useGraphLogic() {
  const {
    addXP,
    incrementStat,
    unlockAchievement,
  } = useGameProgress();

  // Initial state with a connected graph so the 3D world is immediately alive
  const [graphNodes, setGraphNodes] = useState(["A", "B", "C", "D", "E"]);
  const [graphEdges, setGraphEdges] = useState([
    ["A", "B"],
    ["A", "C"],
    ["B", "D"],
    ["C", "E"],
  ]);
  const [vertexInput, setVertexInput] = useState("");
  const [edgeInput, setEdgeInput] = useState("");
  const [startVertex, setStartVertex] = useState("");
  const [endVertex, setEndVertex] = useState("");
  const [shortestPath, setShortestPath] = useState([]);

  // Helper to parse edge from flexible inputs: ("A", "B"), (["A", "B"]), ("A-B"), ("A, B"), ("A B"), ("A->B")
  const parseEdgeInput = (...args) => {
    // 1. Check if two explicit valid string arguments were passed: addEdge("A", "B")
    if (
      args.length >= 2 &&
      typeof args[0] === "string" &&
      typeof args[1] === "string" &&
      args[0].trim() &&
      args[1].trim()
    ) {
      return [args[0].trim().toUpperCase(), args[1].trim().toUpperCase()];
    }

    // 2. Filter out React events, null, undefined, empty strings from args
    let raw = null;
    for (const arg of args) {
      if (!arg) continue;
      // Skip React SyntheticEvents or DOM events
      if (typeof arg === "object" && (arg.nativeEvent || arg._reactName || arg.target)) continue;
      if (Array.isArray(arg) && arg.length >= 2) {
        raw = arg;
        break;
      }
      if (typeof arg === "string" && arg.trim().length > 0) {
        raw = arg.trim();
        break;
      }
    }

    // 3. Fallback to edgeInput state ("Edge (e.g. A-B)...")
    if (!raw && edgeInput && typeof edgeInput === "string" && edgeInput.trim()) {
      raw = edgeInput.trim();
    }

    // 4. Fallback to startVertex and endVertex state
    if (!raw && startVertex && endVertex && String(startVertex).trim() && String(endVertex).trim()) {
      return [String(startVertex).trim().toUpperCase(), String(endVertex).trim().toUpperCase()];
    }

    // 5. Parse array
    if (Array.isArray(raw) && raw.length >= 2) {
      const u = String(raw[0]).trim().toUpperCase();
      const v = String(raw[1]).trim().toUpperCase();
      if (u && v) return [u, v];
    }

    // 6. Parse string formats: "A-B", "A->B", "A,B", "A B"
    if (typeof raw === "string" && raw.trim()) {
      const clean = raw.trim().toUpperCase();
      let parts;
      if (clean.includes("->")) parts = clean.split("->");
      else if (clean.includes("-")) parts = clean.split("-");
      else if (clean.includes(",")) parts = clean.split(",");
      else parts = clean.split(/\s+/);
      parts = parts.map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        return [parts[0], parts[1]];
      }
    }

    return [null, null];
  };

  const addVertex = (val) => {
    const value = (val !== undefined ? String(val) : vertexInput).trim().toUpperCase();

    if (!value) {
      soundFX.playWarning();
      return false;
    }
    if (graphNodes.includes(value)) {
      soundFX.playWarning();
      return false;
    }

    setShortestPath([]);
    setGraphNodes((prev) => [...prev, value]);
    addXP(5);
    incrementStat("nodesAdded");
    soundFX.playPush();
    setVertexInput("");

    return true;
  };

  const deleteVertex = (val) => {
    const value = (val !== undefined ? String(val) : vertexInput).trim().toUpperCase();

    if (!value || !graphNodes.includes(value)) {
      soundFX.playWarning();
      return false;
    }

    setShortestPath([]);
    setGraphNodes((prev) => prev.filter((v) => v !== value));
    setGraphEdges((prev) =>
      prev.filter(([from, to]) => from !== value && to !== value)
    );

    soundFX.playPop();
    setVertexInput("");

    return true;
  };

  const addEdge = (...args) => {
    const [from, to] = parseEdgeInput(...args);

    if (!from || !to) {
      soundFX.playWarning();
      return false;
    }
    if (from === to) {
      // Disallow self-loops
      soundFX.playWarning();
      return false;
    }

    // Auto-create vertices if they don't exist yet
    const nodesToAdd = [];
    if (!graphNodes.includes(from)) nodesToAdd.push(from);
    if (!graphNodes.includes(to)) nodesToAdd.push(to);
    if (nodesToAdd.length > 0) {
      setGraphNodes((prev) => [...prev, ...nodesToAdd]);
    }

    // Prevent duplicate undirected edges
    const exists = graphEdges.some(
      ([a, b]) => (a === from && b === to) || (a === to && b === from)
    );
    if (exists) {
      soundFX.playWarning();
      return false;
    }

    setShortestPath([]);
    setGraphEdges((prev) => [...prev, [from, to]]);
    addXP(5);
    incrementStat("graphOperations");
    soundFX.playPush();
    setEdgeInput("");
    return true;
  };

  const deleteEdge = (...args) => {
    const [from, to] = parseEdgeInput(...args);

    if (!from || !to) {
      soundFX.playWarning();
      return false;
    }

    const exists = graphEdges.some(
      ([a, b]) => (a === from && b === to) || (a === to && b === from)
    );
    if (!exists) {
      soundFX.playWarning();
      return false;
    }

    setShortestPath([]);
    setGraphEdges((prev) =>
      prev.filter(([a, b]) => !((a === from && b === to) || (a === to && b === from)))
    );

    soundFX.playPop();
    setEdgeInput("");
    return true;
  };

  const resetGraph = () => {
    setGraphNodes([]);
    setGraphEdges([]);
    setShortestPath([]);
    setVertexInput("");
    setEdgeInput("");
    setStartVertex("");
    setEndVertex("");
    soundFX.playClear();
  };

  const startGraphBFS = (customStart) => {
    if (!graphNodes.length) {
      soundFX.playWarning();
      return [];
    }

    const targetStart = (customStart || startVertex).trim().toUpperCase();
    const start = graphNodes.includes(targetStart) ? targetStart : graphNodes[0];

    const visited = new Set();
    const queue = [start];
    const result = [];

    while (queue.length > 0) {
      const node = queue.shift();

      if (visited.has(node)) continue;

      visited.add(node);
      result.push(node);

      graphEdges.forEach(([from, to]) => {
        if (from === node && !visited.has(to)) {
          queue.push(to);
        } else if (to === node && !visited.has(from)) {
          queue.push(from);
        }
      });
    }

    addXP(25);
    incrementStat("bfsRuns");

    if (result.length >= 4) {
      unlockAchievement("🌐 BFS Explorer");
    }

    return result;
  };

  const startGraphDFS = (customStart) => {
    if (!graphNodes.length) {
      soundFX.playWarning();
      return [];
    }

    const targetStart = (customStart || startVertex).trim().toUpperCase();
    const start = graphNodes.includes(targetStart) ? targetStart : graphNodes[0];

    const visited = new Set();
    const result = [];

    const dfs = (node) => {
      if (visited.has(node)) return;

      visited.add(node);
      result.push(node);

      graphEdges.forEach(([from, to]) => {
        if (from === node) dfs(to);
        else if (to === node) dfs(from);
      });
    };

    dfs(start);

    addXP(25);
    incrementStat("dfsRuns");

    if (result.length >= 4) {
      unlockAchievement("🕸 DFS Explorer");
    }

    return result;
  };

  const findShortestPath = (customStart, customEnd) => {
    if (graphNodes.length < 2) {
      soundFX.playWarning();
      return [];
    }

    let start = (customStart || startVertex).trim().toUpperCase();
    let end = (customEnd || endVertex).trim().toUpperCase();

    // Default to first and last node if user hasn't typed in the boxes
    if (!start && !end) {
      start = graphNodes[0];
      end = graphNodes[graphNodes.length - 1];
    } else if (!start) {
      start = graphNodes[0];
    } else if (!end) {
      end = graphNodes[graphNodes.length - 1];
    }

    if (!graphNodes.includes(start) || !graphNodes.includes(end)) {
      soundFX.playWarning();
      return [];
    }

    if (start === end) {
      setShortestPath([start]);
      return [start];
    }

    const queue = [[start]];
    const visited = new Set([start]);

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      if (node === end) {
        setShortestPath(path);
        addXP(50);
        incrementStat("graphOperations");
        unlockAchievement("🧭 Pathfinder");
        soundFX.playTreeFound();
        return path;
      }

      graphEdges.forEach(([from, to]) => {
        const neighbor = from === node ? to : to === node ? from : null;
        if (neighbor && !visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      });
    }

    soundFX.playWarning();
    setShortestPath([]);
    return [];
  };

  return {
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
  };
}