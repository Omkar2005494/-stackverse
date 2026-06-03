import { useState } from "react";

export function useTreeLogic() {
  const [treeNodes, setTreeNodes] = useState([]);
  const [nodeInput, setNodeInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [traversalResult, setTraversalResult] = useState("");

  const resetTree = () => {
    setTreeNodes([]);
    setHighlightedNode(null);
    setTraversalResult("");
  };

  const searchNode = (value) => {
    const target = value ?? searchInput;
    const found = treeNodes.find(
      (node) => String(node) === String(target)
    );

    setHighlightedNode(found ? Number(target) : null);

    return !!found;
  };

  const insertNode = () => {
    const value = Number(nodeInput);

    if (nodeInput.trim() === "" || Number.isNaN(value)) {
      return {
        success: false,
        message: "ENTER A NODE VALUE",
      };
    }

    if (treeNodes.length === 0) {
      setTreeNodes([value]);
      setNodeInput("");

      return {
        success: true,
        message: `ROOT NODE SET TO ${value}`,
      };
    }

    const newTree = [...treeNodes];
    let index = 0;

    while (true) {
      if (newTree[index] === value) {
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

    return {
      success: true,
      message: "NODE INSERTED",
    };
  };

  const deleteNode = (value) => {
    const target = Number(value ?? searchInput);

    const newTree = [...treeNodes];
    const index = newTree.findIndex((node) => node === target);

    if (index === -1) {
      return {
        success: false,
        message: "NODE NOT FOUND",
      };
    }

    newTree[index] = undefined;
    setTreeNodes(newTree);

    return {
      success: true,
      message: "NODE DELETED",
    };
  };

  const startBFS = () => {
    const result = treeNodes.filter((node) => node !== undefined);
    setTraversalResult(result.join(" → "));
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
    setTraversalResult(result.join(" → "));
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
    setTraversalResult(result.join(" → "));
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
    setTraversalResult(result.join(" → "));
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
    setTraversalResult(result.join(" → "));
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
    insertNode,
    resetTree,
    searchNode,
    deleteNode,
    startBFS,
    startDFS,
    startInorder,
    startPreorder,
    startPostorder,
  };
}
