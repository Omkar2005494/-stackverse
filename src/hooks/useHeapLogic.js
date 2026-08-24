import { useState } from "react";
import { soundFX } from "../utils/soundFX";

export function useHeapLogic() {
  const [heap, setHeap] = useState([10, 20, 30, 40, 50]);
  const [heapInput, setHeapInput] = useState("");
  const [heapInsertCount, setHeapInsertCount] = useState(0);
  const [heapExtractCount, setHeapExtractCount] = useState(0);
  const [heapType, setHeapType] = useState("min"); // "min" | "max"
  const [swappedNodes, setSwappedNodes] = useState([]);
  const [heapSortResult, setHeapSortResult] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const insertHeap = (val) => {
    const value = val !== undefined ? Number(val) : Number(heapInput);

    if ((val === undefined && heapInput.trim() === "") || Number.isNaN(value)) {
      soundFX.playWarning();
      return { success: false, message: "ENTER A VALID NUMBER" };
    }

    if (heap.length >= 15) {
      soundFX.playWarning();
      return { success: false, message: "CITADEL CAPACITY REACHED (MAX 15)" };
    }

    const newHeap = [...heap, value];
    let index = newHeap.length - 1;
    const swapped = [];

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      const correctOrder =
        heapType === "min"
          ? newHeap[parent] <= newHeap[index]
          : newHeap[parent] >= newHeap[index];

      if (correctOrder) break;

      swapped.push(newHeap[index], newHeap[parent]);
      [newHeap[parent], newHeap[index]] = [newHeap[index], newHeap[parent]];
      index = parent;
    }

    soundFX.playPush();
    setHeapInsertCount((prev) => prev + 1);
    setHeap(newHeap);
    setSwappedNodes(swapped);
    setHeapInput("");
    setHighlightedIndex(index);
    setTimeout(() => {
      setHighlightedIndex(null);
      setSwappedNodes([]);
    }, 1200);

    return {
      success: true,
      message: `INSERTED ${value} (SIFT-UP COMPLETE)`,
      steps: Math.max(1, Math.ceil(Math.log2(newHeap.length || 2))),
    };
  };

  const extractRoot = () => {
    if (heap.length === 0) {
      soundFX.playWarning();
      return { success: false, message: "HEAP IS EMPTY" };
    }

    const rootValue = heap[0];

    if (heap.length === 1) {
      soundFX.playPop();
      setHeap([]);
      setHeapExtractCount((prev) => prev + 1);
      return { success: true, message: `EXTRACTED ROOT (${rootValue})`, value: rootValue, steps: 1 };
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
        (heapType === "min" ? newHeap[left] < newHeap[target] : newHeap[left] > newHeap[target])
      ) {
        target = left;
      }

      if (
        right < newHeap.length &&
        (heapType === "min" ? newHeap[right] < newHeap[target] : newHeap[right] > newHeap[target])
      ) {
        target = right;
      }

      if (target === index) break;

      [newHeap[index], newHeap[target]] = [newHeap[target], newHeap[index]];
      index = target;
    }

    soundFX.playPop();
    setHeapExtractCount((prev) => prev + 1);
    setHeap(newHeap);

    return {
      success: true,
      message: `EXTRACTED ROOT (${rootValue})`,
      value: rootValue,
      steps: Math.max(1, Math.ceil(Math.log2(newHeap.length || 2))),
    };
  };

  const deleteHeapNode = (val) => {
    const value = val !== undefined ? Number(val) : Number(heapInput);

    if ((val === undefined && heapInput.trim() === "") || Number.isNaN(value)) {
      soundFX.playWarning();
      return { success: false, message: "ENTER A VALID NUMBER" };
    }

    const index = heap.indexOf(value);
    if (index === -1) {
      soundFX.playWarning();
      return { success: false, message: "VALUE NOT FOUND" };
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

        if (correctOrder) break;

        [rebuiltHeap[parent], rebuiltHeap[current]] = [rebuiltHeap[current], rebuiltHeap[parent]];
        current = parent;
      }
    });

    soundFX.playPop();
    setHeap(rebuiltHeap);
    setHeapInput("");

    return {
      success: true,
      message: `DELETED ${value}`,
      steps: heap.length,
    };
  };

  const heapSort = () => {
    if (heap.length === 0) {
      soundFX.playWarning();
      return { success: false, message: "HEAP EMPTY" };
    }

    const sorted = [...heap].sort((a, b) => (heapType === "min" ? a - b : b - a));
    const resultString = `HEAP SORT (${heapType.toUpperCase()}): ${sorted.join(" → ")}`;
    setHeapSortResult(resultString);
    soundFX.playTreeFound();

    return {
      success: true,
      result: resultString,
      sorted,
      steps: heap.length * Math.max(1, Math.ceil(Math.log2(heap.length))),
    };
  };

  const toggleHeapType = () => {
    const nextType = heapType === "min" ? "max" : "min";
    setHeapType(nextType);

    // Rebuild existing items with new min/max invariant
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

        if (correctOrder) break;

        [rebuiltHeap[parent], rebuiltHeap[current]] = [rebuiltHeap[current], rebuiltHeap[parent]];
        current = parent;
      }
    });

    soundFX.playPeek();
    setHeap(rebuiltHeap);
    return { success: true, type: nextType };
  };

  const resetHeap = () => {
    setHeap([]);
    setHeapInput("");
    setHeapSortResult("");
    setSwappedNodes([]);
    setHighlightedIndex(null);
    soundFX.playClear();
    return { success: true };
  };

  return {
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
    highlightedIndex,
    setHighlightedIndex,
    insertHeap,
    extractRoot,
    deleteHeapNode,
    heapSort,
    toggleHeapType,
    resetHeap,
  };
}