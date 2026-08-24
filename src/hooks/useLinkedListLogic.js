import { useState, useCallback } from "react";
import { soundFX } from "../utils/soundFX";

export function useLinkedListLogic(addXP = () => {}, setLearningStats = () => {}) {
  const [nodes, setNodes] = useState([
    { id: "node-10", value: 10 },
    { id: "node-20", value: 20 },
    { id: "node-30", value: 30 },
    { id: "node-40", value: 40 },
  ]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [listType, setListType] = useState("singly"); // "singly" | "doubly" | "circular"
  const [message, setMessage] = useState("");
  const [isCircularRunning, setIsCircularRunning] = useState(false);

  // --- Insert Node (Tail) ---
  const insertNode = useCallback((val) => {
    if (nodes.length >= 8) {
      soundFX.playWarning();
      setMessage("❌ Forest Capacity Reached (Max 8 Nodes)");
      return;
    }
    const nextValue = val !== undefined && val !== "" ? Number(val) : Math.floor(Math.random() * 90) + 10;
    const newNode = { id: `node-${Date.now()}-${Math.random()}`, value: nextValue };
    
    soundFX.playPush();
    setNodes((prev) => [...prev, newNode]);
    addXP(10);
    setMessage(`➕ Inserted ${nextValue} at Tail | +10 XP`);

    const timeComplexity = listType === "doubly" ? "O(1)" : "O(n)";
    setLearningStats("Insert Tail", timeComplexity, "O(1)", nodes.length + 1);
  }, [nodes.length, addXP, listType, setLearningStats]);

  // --- Insert at Head ---
  const insertHead = useCallback((val) => {
    if (nodes.length >= 8) {
      soundFX.playWarning();
      setMessage("❌ Forest Capacity Reached (Max 8 Nodes)");
      return;
    }
    const nextValue = val !== undefined && val !== "" ? Number(val) : Math.floor(Math.random() * 90) + 10;
    const newNode = { id: `node-${Date.now()}-${Math.random()}`, value: nextValue };

    soundFX.playPush();
    setNodes((prev) => [newNode, ...prev]);
    addXP(10);
    setMessage(`➕ Inserted ${nextValue} at Head | +10 XP`);
    setLearningStats("Insert Head", "O(1)", "O(1)", 1);
  }, [nodes.length, addXP, setLearningStats]);

  // --- Delete Node by Value ---
  const deleteNode = useCallback((val) => {
    if (val === undefined || val === "") {
      // Default delete tail if no value given
      if (nodes.length === 0) {
        soundFX.playWarning();
        setMessage("❌ List is Empty");
        return;
      }
      const removed = nodes[nodes.length - 1].value;
      soundFX.playPop();
      setNodes((prev) => prev.slice(0, -1));
      addXP(10);
      setMessage(`🗑️ Deleted Tail (${removed}) | +10 XP`);
      setLearningStats("Delete Tail", listType === "doubly" ? "O(1)" : "O(n)", "O(1)", nodes.length);
      return;
    }

    const target = Number(val);
    const index = nodes.findIndex((n) => n.value === target);
    if (index !== -1) {
      soundFX.playPop();
      setNodes((prev) => prev.filter((_, i) => i !== index));
      addXP(10);
      setMessage(`🗑️ Deleted ${target} at index [${index}] | +10 XP`);
      setLearningStats("Delete", "O(n)", "O(1)", index + 1);
    } else {
      soundFX.playWarning();
      setMessage(`❌ ${target} not found in list`);
      setLearningStats("Delete", "O(n)", "O(1)", nodes.length);
    }
  }, [nodes, addXP, listType, setLearningStats]);

  // --- Search Node ---
  const searchNode = useCallback(async (val) => {
    if (val === undefined || val === "") return;
    const target = Number(val);

    for (let i = 0; i < nodes.length; i++) {
      setHighlightedIndex(i);
      soundFX.playTreeStep(i);
      await new Promise((resolve) => setTimeout(resolve, 450));

      if (nodes[i].value === target) {
        soundFX.playTreeFound();
        addXP(15);
        setMessage(`🎯 Found ${target} at Node [${i}] | +15 XP`);
        setLearningStats("Search", "O(n)", "O(1)", i + 1);
        setTimeout(() => setHighlightedIndex(null), 1200);
        return;
      }
    }

    soundFX.playWarning();
    setHighlightedIndex(null);
    setMessage(`❌ ${target} not found in list`);
    setLearningStats("Search", "O(n)", "O(1)", nodes.length);
  }, [nodes, addXP, setLearningStats]);

  // --- Forward Traversal ---
  const traverseList = useCallback(async () => {
    if (nodes.length === 0) return;
    for (let i = 0; i < nodes.length; i++) {
      setHighlightedIndex(i);
      soundFX.playTreeStep(i);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }
    soundFX.playTreeFound();
    setHighlightedIndex(null);
    addXP(15);
    setMessage("🌿 Forward Traversal Complete | +15 XP");
    setLearningStats("Forward Traverse", "O(n)", "O(1)", nodes.length);
  }, [nodes, addXP, setLearningStats]);

  // --- Backward Traversal (Doubly) ---
  const backwardTraverse = useCallback(async () => {
    if (nodes.length === 0) return;
    for (let i = nodes.length - 1; i >= 0; i--) {
      setHighlightedIndex(i);
      soundFX.playTreeStep(nodes.length - 1 - i);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }
    soundFX.playTreeFound();
    setHighlightedIndex(null);
    addXP(15);
    setMessage("🔙 Backward Traversal Complete | +15 XP");
    setLearningStats("Backward Traverse", "O(n)", "O(1)", nodes.length);
  }, [nodes, addXP, setLearningStats]);

  // --- Circular Traversal ---
  const stopCircular = () => setIsCircularRunning(false);

  const circularTraverse = useCallback(async () => {
    if (nodes.length === 0) return;
    setIsCircularRunning(true);
    const totalSteps = nodes.length * 2; // 2 full cycles

    for (let i = 0; i < totalSteps; i++) {
      setHighlightedIndex(i % nodes.length);
      soundFX.playTreeStep(i % nodes.length);
      await new Promise((resolve) => setTimeout(resolve, 380));
    }

    setIsCircularRunning(false);
    soundFX.playTreeFound();
    setHighlightedIndex(null);
    addXP(20);
    setMessage("🔄 Circular Traversal Complete (2 Cycles) | +20 XP");
    setLearningStats("Circular Traverse", "O(n)", "O(1)", totalSteps);
  }, [nodes, addXP, setLearningStats]);

  // --- Reverse List (3D Inversion Flip) ---
  const reverseList = useCallback(() => {
    if (nodes.length === 0) return;
    soundFX.playTreeFound();
    setNodes((prev) => [...prev].reverse());
    addXP(20);
    setMessage("🔄 Linked List Inverted (Reversed) | +20 XP");
    setLearningStats("Reverse List", "O(n)", "O(1)", nodes.length);
  }, [addXP, setLearningStats, nodes.length]);

  // --- Clear / Reset List ---
  const resetList = useCallback(() => {
    setNodes([]);
    setHighlightedIndex(null);
    setMessage("");
    soundFX.playClear();
    setLearningStats("Reset", "O(1)", "O(1)", 0);
  }, [setLearningStats]);

  return {
    nodes,
    listType,
    setListType,
    highlightedIndex,
    message,
    setMessage,
    insertNode,
    insertHead,
    deleteNode,
    searchNode,
    traverseList,
    backwardTraverse,
    circularTraverse,
    stopCircular,
    isCircularRunning,
    reverseList,
    resetList,
  };
}
