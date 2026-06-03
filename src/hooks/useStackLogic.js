

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

  return {
    stack,
    setStack,
    pushBlock,
    popBlock,
  };
}