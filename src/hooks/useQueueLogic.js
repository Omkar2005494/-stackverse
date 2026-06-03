

import { useState } from "react";

export function useQueueLogic() {
  const [queue, setQueue] = useState([1, 2, 3]);

  const enqueue = (value) => {
    if (queue.length >= 5) {
      return {
        success: false,
        message: "QUEUE OVERFLOW",
      };
    }

    const nextValue = value ?? queue.length + 1;

    setQueue((prev) => [...prev, nextValue]);

    return {
      success: true,
      message: "ENQUEUE SUCCESS",
    };
  };

  const dequeue = () => {
    if (queue.length === 0) {
      return {
        success: false,
        message: "QUEUE UNDERFLOW",
      };
    }

    setQueue((prev) => prev.slice(1));

    return {
      success: true,
      message: "DEQUEUE SUCCESS",
    };
  };

  return {
    queue,
    setQueue,
    enqueue,
    dequeue,
  };
}