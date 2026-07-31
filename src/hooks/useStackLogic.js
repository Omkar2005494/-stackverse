

import { useState } from "react";

export function useStackLogic() {
  const [stack, setStack] = useState([1]);

  const pushBlock = (value = Math.floor(Math.random() * 100)) => {
    if (stack.length >= 10) {
      return {
        success: false,
        message: "Stack Overflow",
      };
    }

    setStack((prev) => [...prev, value]);

    return {
      success: true,
      message: "Push Successful",
    };
  };

  const popBlock = () => {
    if (stack.length === 0) {
      return {
        success: false,
        message: "Stack Underflow",
      };
    }

    setStack((prev) => prev.slice(0, -1));

    return {
      success: true,
      message: "Pop Successful",
    };
  };

  const peekBlock = () => {
    if (stack.length === 0) {
      return {
        success: false,
        message: "Stack is Empty",
        value: null,
      };
    }
    return {
      success: true,
      message: "Peek Successful",
      value: stack[stack.length - 1],
    };
  };

  const clearStack = () => {
    setStack([]);
    return {
      success: true,
      message: "Stack Cleared",
    };
  };

  return {
    stack,
    setStack,
    pushBlock,
    popBlock,
    peekBlock,
    clearStack,
  };
}