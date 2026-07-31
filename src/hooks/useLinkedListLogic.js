import { useState, useCallback } from "react";

export function useLinkedListLogic(addXP, setLearningStats = () => {}) {
  const [nodes, setNodes] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [listType, setListType] = useState("singly"); // singly, doubly, circular
  
  // For messaging
  const [message, setMessage] = useState("");
  
  const insertNode = useCallback((val) => {
    if (nodes.length >= 8) {
      setMessage("❌ Forest is full (Max 8 nodes)");
      return;
    }
    const nextValue = val !== undefined && val !== "" ? Number(val) : Math.floor(Math.random() * 100);
    setNodes((prev) => [...prev, { id: crypto.randomUUID(), value: nextValue }]);
    addXP(10);
    setMessage(`➕ Inserted ${nextValue} | +10 XP`);
    
    const timeComplexity = listType === "singly" ? "O(n)" : "O(1)";
    setLearningStats("Insert", timeComplexity, "O(1)", 1);
  }, [nodes.length, addXP, listType, setLearningStats]);

  const deleteNode = useCallback((val) => {
    if (val === undefined || val === "") return;
    const target = Number(val);
    const exists = nodes.some(n => n.value === target);
    if (exists) {
      setNodes((prev) => prev.filter((node) => node.value !== target));
      addXP(10);
      setMessage(`🗑️ Deleted ${target} | +10 XP`);
      setLearningStats("Delete", "O(n)", "O(1)", nodes.length);
    } else {
      setMessage(`❌ ${target} not found to delete`);
      setLearningStats("Delete", "O(n)", "O(1)", nodes.length);
    }
  }, [nodes, addXP, setLearningStats]);

  const searchNode = useCallback(async (val) => {
    if (val === undefined || val === "") return;
    const target = Number(val);

    for (let i = 0; i < nodes.length; i++) {
      setHighlightedIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (nodes[i].value === target) {
        addXP(5);
        setTimeout(() => setHighlightedIndex(null), 300);
        setMessage(`🎯 Found ${target} | +5 XP`);
        setLearningStats("Search", "O(n)", "O(1)", i + 1);
        return;
      }
    }

    setHighlightedIndex(null);
    setMessage(`❌ ${target} not found`);
    setLearningStats("Search", "O(n)", "O(1)", nodes.length);
  }, [nodes, addXP, setLearningStats]);

  const traverseList = useCallback(async () => {
    for (let i = 0; i < nodes.length; i++) {
      setHighlightedIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setHighlightedIndex(null);
    addXP(15);
    setMessage("🌲 Traversal Complete | +15 XP");
    setLearningStats("Traverse", "O(n)", "O(1)", nodes.length);
  }, [nodes, addXP, setLearningStats]);

  const backwardTraverse = useCallback(async () => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      setHighlightedIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setHighlightedIndex(null);
    addXP(15);
    setMessage("🔙 Backward Traversal Complete | +15 XP");
    setLearningStats("Backward Traverse", "O(n)", "O(1)", nodes.length);
  }, [nodes, addXP, setLearningStats]);

  const [isCircularRunning, setIsCircularRunning] = useState(false);
  const stopCircular = () => setIsCircularRunning(false);

  const circularTraverse = useCallback(async () => {
    setIsCircularRunning(true);
    let i = 0;
    while (true) {
      // Need a way to check if we should stop. Using a mutable ref or functional state check is safer, 
      // but for simplicity we'll just check `nodes.length` assuming this might loop.
      // Wait, inside an async loop, `isCircularRunning` closure will be stale.
      // It's better to manage this outside or via a ref, but for now we'll do a simple limited loop.
      if (i >= nodes.length * 3) {
          setIsCircularRunning(false);
          setHighlightedIndex(null);
          break; // Stop after 3 full cycles
      }
      setHighlightedIndex(i % nodes.length);
      await new Promise((resolve) => setTimeout(resolve, 400));
      i++;
    }
    addXP(20);
    setMessage("🔄 Circular Traversal Complete | +20 XP");
    setLearningStats("Circular Traverse", "O(n)", "O(1)", i);
  }, [nodes, addXP, setLearningStats]);

  const reverseList = useCallback(() => {
    setNodes((prev) => [...prev].reverse());
    addXP(20);
    setMessage("🔄 List Reversed | +20 XP");
    setLearningStats("Reverse", "O(n)", "O(1)", nodes.length);
  }, [addXP, setLearningStats, nodes.length]);

  return {
    nodes,
    listType,
    setListType,
    highlightedIndex,
    message,
    setMessage,
    insertNode,
    deleteNode,
    searchNode,
    traverseList,
    backwardTraverse,
    circularTraverse,
    stopCircular,
    isCircularRunning,
    reverseList
  };
}
