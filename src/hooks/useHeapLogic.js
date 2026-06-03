

import { useState } from "react";

export function useHeapLogic() {
  const [heap, setHeap] = useState([10, 20, 30, 40, 50]);
  const [heapInput, setHeapInput] = useState("");
  const [heapInsertCount, setHeapInsertCount] = useState(0);
  const [heapExtractCount, setHeapExtractCount] = useState(0);
  const [heapType, setHeapType] = useState("min");
  const [swappedNodes, setSwappedNodes] = useState([]);
  const [heapSortResult, setHeapSortResult] = useState("");

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
  };
}