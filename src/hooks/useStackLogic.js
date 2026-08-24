import { useState } from "react";
import { soundFX } from "../utils/soundFX";

export function useStackLogic() {
  const [stack, setStack] = useState([1]);
  const [isPeeking, setIsPeeking] = useState(false);

  const pushBlock = (value = Math.floor(Math.random() * 100)) => {
    if (stack.length >= 5) {
      return {
        success: false,
        message: "Stack Overflow",
      };
    }

    setStack((prev) => [...prev, value]);
    soundFX.playPush();

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
    soundFX.playPop();

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

    setIsPeeking(true);
    soundFX.playPeek();
    setTimeout(() => setIsPeeking(false), 1500);

    return {
      success: true,
      message: "Peek Successful",
      value: stack[stack.length - 1],
    };
  };

  const clearStack = () => {
    setStack([]);
    soundFX.playClear();
    return {
      success: true,
      message: "Stack Cleared",
    };
  };

  return {
    stack,
    setStack,
    isPeeking,
    pushBlock,
    popBlock,
    peekBlock,
    clearStack,
  };
}