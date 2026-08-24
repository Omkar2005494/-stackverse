import { useState } from "react";
import { useGameProgress } from "../context/GameProgressContext";
import { soundFX } from "../utils/soundFX";

export function useGraphLogic() {
  const {
    addXP,
    incrementStat,
    unlockAchievement,
  } = useGameProgress();

  const [graphNodes, setGraphNodes] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);
  const [vertexInput, setVertexInput] = useState("");
  const [edgeInput, setEdgeInput] = useState("");
  const [startVertex, setStartVertex] = useState("");
  const [endVertex, setEndVertex] = useState("");
  const [shortestPath, setShortestPath] = useState([]);

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

    setGraphNodes((prev) => prev.filter((v) => v !== value));
    setGraphEdges((prev) =>
      prev.filter(([from, to]) => from !== value && to !== value)
    );

    soundFX.playPop();
    setVertexInput("");

    return true;
  };

  const addEdge = (customEdge) => {
    const raw = customEdge || edgeInput;
    const [from, to] = raw
      .split("-")
      .map((v) => v.trim().toUpperCase());

    if (!from || !to) {
      soundFX.playWarning();
      return false;
    }
    if (!graphNodes.includes(from) || !graphNodes.includes(to)) {
      soundFX.playWarning();
      return false;
    }

    // Prevent duplicate edges
    const exists = graphEdges.some(
      ([a, b]) => (a === from && b === to) || (a === to && b === from)
    );
    if (exists) {
      soundFX.playWarning();
      return false;
    }

    setGraphEdges((prev) => [...prev, [from, to]]);
    addXP(5);
    incrementStat("graphOperations");
    soundFX.playPush();
    setEdgeInput("");
    return true;
  };

  const deleteEdge = (customEdge) => {
    const raw = customEdge || edgeInput;
    const [from, to] = raw
      .split("-")
      .map((v) => v.trim().toUpperCase());

    if (!from || !to) {
      soundFX.playWarning();
      return false;
    }

    setGraphEdges((prev) =>
      prev.filter(([a, b]) => !( (a === from && b === to) || (a === to && b === from) ))
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
    soundFX.playClear();
  };

  const startGraphBFS = () => {
    if (!graphNodes.length) {
      soundFX.playWarning();
      return [];
    }

    const visited = new Set();
    const queue = [graphNodes[0]];
    const result = [];

    while (queue.length) {
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

    if (result.length >= 5) {
      unlockAchievement("🌐 BFS Explorer");
    }

    return result;
  };

  const startGraphDFS = () => {
    if (!graphNodes.length) {
      soundFX.playWarning();
      return [];
    }

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

    dfs(graphNodes[0]);

    addXP(25);
    incrementStat("dfsRuns");

    if (result.length >= 5) {
      unlockAchievement("🕸 DFS Explorer");
    }

    return result;
  };

  const findShortestPath = (customStart, customEnd) => {
    const start = (customStart || startVertex).trim().toUpperCase();
    const end = (customEnd || endVertex).trim().toUpperCase();

    if (!start || !end) {
      soundFX.playWarning();
      return [];
    }

    if (!graphNodes.includes(start) || !graphNodes.includes(end)) {
      soundFX.playWarning();
      return [];
    }

    const queue = [[start]];
    const visited = new Set([start]);

    while (queue.length) {
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