import { useState } from "react";
import { useGameProgress } from "../context/GameProgressContext";

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

    if (!value) return false;
    if (graphNodes.includes(value)) return false;

    setGraphNodes((prev) => [...prev, value]);
    addXP(5);
    incrementStat("nodesAdded");
    setVertexInput("");

    return true;
  };

  const deleteVertex = (val) => {
    const value = (val !== undefined ? String(val) : vertexInput).trim().toUpperCase();

    if (!value) return false;
    if (!graphNodes.includes(value)) return false;

    setGraphNodes((prev) => prev.filter((v) => v !== value));
    setGraphEdges((prev) =>
      prev.filter(([from, to]) => from !== value && to !== value)
    );

    setVertexInput("");

    return true;
  };

  const addEdge = () => {
    const [from, to] = edgeInput
      .split("-")
      .map((v) => v.trim().toUpperCase());

    if (!from || !to) return false;
    if (!graphNodes.includes(from) || !graphNodes.includes(to)) return false;

    setGraphEdges((prev) => [...prev, [from, to]]);
    addXP(5);
    incrementStat("graphOperations");
    setEdgeInput("");
    return true;
  };

  const deleteEdge = () => {
    const [from, to] = edgeInput
      .split("-")
      .map((v) => v.trim().toUpperCase());

    setGraphEdges((prev) =>
      prev.filter(([a, b]) => !(a === from && b === to))
    );

    setEdgeInput("");
    return true;
  };

  const resetGraph = () => {
    setGraphNodes([]);
    setGraphEdges([]);
    setShortestPath([]);
    setVertexInput("");
    setEdgeInput("");
  };

  const startGraphBFS = () => {
    if (!graphNodes.length) return [];

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
    if (!graphNodes.length) return [];

    const visited = new Set();
    const result = [];

    const dfs = (node) => {
      if (visited.has(node)) return;

      visited.add(node);
      result.push(node);

      graphEdges.forEach(([from, to]) => {
        if (from === node) dfs(to);
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

  const findShortestPath = () => {
    const start = startVertex.trim().toUpperCase();
    const end = endVertex.trim().toUpperCase();

    if (!start || !end) return [];

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

        return path;
      }

      graphEdges.forEach(([from, to]) => {
        if (from === node && !visited.has(to)) {
          visited.add(to);
          queue.push([...path, to]);
        }
      });
    }

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