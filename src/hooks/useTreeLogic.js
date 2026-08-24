import { useState, useRef } from "react";
import { soundFX } from "../utils/soundFX";

export function useTreeLogic() {
  const [treeNodes, setTreeNodes] = useState([]);
  const [nodeInput, setNodeInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [traversalResult, setTraversalResult] = useState("");
  const traversalTimeoutRef = useRef(null);

  const clearTraversalTimer = () => {
    if (traversalTimeoutRef.current) {
      clearTimeout(traversalTimeoutRef.current);
      traversalTimeoutRef.current = null;
    }
  };

  const resetTree = () => {
    clearTraversalTimer();
    setTreeNodes([]);
    setHighlightedNode(null);
    setTraversalResult("");
    soundFX.playClear();
  };

  const searchNode = (value) => {
    clearTraversalTimer();
    const target = value !== undefined ? Number(value) : Number(searchInput);
    if (Number.isNaN(target)) return false;

    const found = treeNodes.find(
      (node) => node !== undefined && Number(node) === target
    );

    if (found !== undefined) {
      setHighlightedNode(target);
      soundFX.playTreeFound();
      setTimeout(() => setHighlightedNode(null), 2000);
      return true;
    } else {
      soundFX.playWarning();
      setHighlightedNode(null);
      return false;
    }
  };

  const insertNode = (val) => {
    clearTraversalTimer();
    const value = val !== undefined ? Number(val) : Number(nodeInput);

    if ((val === undefined && nodeInput.trim() === "") || Number.isNaN(value)) {
      soundFX.playWarning();
      return {
        success: false,
        message: "ENTER A NODE VALUE",
      };
    }

    if (treeNodes.length === 0) {
      setTreeNodes([value]);
      setNodeInput("");
      setHighlightedNode(value);
      soundFX.playPush();
      setTimeout(() => setHighlightedNode(null), 1200);

      return {
        success: true,
        message: `ROOT NODE SET TO ${value}`,
      };
    }

    const newTree = [...treeNodes];
    let index = 0;

    while (true) {
      if (newTree[index] === value) {
        soundFX.playWarning();
        return {
          success: false,
          message: "DUPLICATE VALUE",
        };
      }

      const nextIndex =
        value < newTree[index]
          ? index * 2 + 1
          : index * 2 + 2;

      if (nextIndex > 30) {
        soundFX.playWarning();
        return {
          success: false,
          message: "TREE LIMIT REACHED",
        };
      }

      if (newTree[nextIndex] === undefined) {
        newTree[nextIndex] = value;
        break;
      }

      index = nextIndex;
    }

    setTreeNodes(newTree);
    setNodeInput("");
    setHighlightedNode(value);
    soundFX.playPush();
    setTimeout(() => setHighlightedNode(null), 1200);

    return {
      success: true,
      message: "NODE INSERTED",
    };
  };

  const deleteNode = (val) => {
    clearTraversalTimer();
    const targetValue = val !== undefined ? Number(val) : Number(searchInput);

    if ((val === undefined && searchInput.trim() === "") || Number.isNaN(targetValue)) {
      soundFX.playWarning();
      return {
        success: false,
        message: "ENTER A NODE VALUE",
      };
    }

    const exists = treeNodes.some((node) => node === targetValue);
    if (!exists) {
      soundFX.playWarning();
      return {
        success: false,
        message: "NODE NOT FOUND",
      };
    }

    const remaining = treeNodes.filter((node) => node !== undefined && node !== targetValue);

    if (remaining.length === 0) {
      setTreeNodes([]);
      setSearchInput("");
      setHighlightedNode(null);
      soundFX.playPop();
      return {
        success: true,
        message: "NODE DELETED",
      };
    }

    const newTree = [];
    const insertIntoArray = (tree, value) => {
      let index = 0;
      while (true) {
        if (tree[index] === undefined) {
          tree[index] = value;
          return;
        }
        index = value < tree[index] ? index * 2 + 1 : index * 2 + 2;
      }
    };

    remaining.forEach((v) => insertIntoArray(newTree, v));
    setTreeNodes(newTree);
    setSearchInput("");
    setHighlightedNode(null);
    soundFX.playPop();

    return {
      success: true,
      message: "NODE DELETED",
    };
  };

  // Animate sequential traversal steps with harmonic sound feedback
  const playTraversalAnimation = (sequence) => {
    clearTraversalTimer();
    if (!sequence || sequence.length === 0) return;

    setTraversalResult(sequence.join(" → "));

    let currentStep = 0;
    const runStep = () => {
      if (currentStep < sequence.length) {
        const val = sequence[currentStep];
        setHighlightedNode(val);
        soundFX.playTreeStep(currentStep);
        currentStep++;
        traversalTimeoutRef.current = setTimeout(runStep, 500);
      } else {
        traversalTimeoutRef.current = setTimeout(() => {
          setHighlightedNode(null);
        }, 1500);
      }
    };

    runStep();
  };

  const startBFS = () => {
    const result = treeNodes.filter((node) => node !== undefined);
    playTraversalAnimation(result);
    return result;
  };

  const startDFS = () => {
    const result = [];
    const dfs = (index) => {
      if (treeNodes[index] === undefined) return;
      result.push(treeNodes[index]);
      dfs(index * 2 + 1);
      dfs(index * 2 + 2);
    };
    dfs(0);
    playTraversalAnimation(result);
    return result;
  };

  const startInorder = () => {
    const result = [];
    const inorder = (index) => {
      if (treeNodes[index] === undefined) return;
      inorder(index * 2 + 1);
      result.push(treeNodes[index]);
      inorder(index * 2 + 2);
    };
    inorder(0);
    playTraversalAnimation(result);
    return result;
  };

  const startPreorder = () => {
    const result = [];
    const preorder = (index) => {
      if (treeNodes[index] === undefined) return;
      result.push(treeNodes[index]);
      preorder(index * 2 + 1);
      preorder(index * 2 + 2);
    };
    preorder(0);
    playTraversalAnimation(result);
    return result;
  };

  const startPostorder = () => {
    const result = [];
    const postorder = (index) => {
      if (treeNodes[index] === undefined) return;
      postorder(index * 2 + 1);
      postorder(index * 2 + 2);
      result.push(treeNodes[index]);
    };
    postorder(0);
    playTraversalAnimation(result);
    return result;
  };

  return {
    treeNodes,
    setTreeNodes,
    nodeInput,
    setNodeInput,
    searchInput,
    setSearchInput,
    highlightedNode,
    setHighlightedNode,
    traversalResult,
    setTraversalResult,
    resetTree,
    insertNode,
    searchNode,
    deleteNode,
    startBFS,
    startDFS,
    startInorder,
    startPreorder,
    startPostorder,
  };
}
