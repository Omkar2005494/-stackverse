

import { useState } from "react";

export function useQueueLogic() {
  const [queue, setQueue] = useState([
    { id: crypto.randomUUID(), value: 1 },
    { id: crypto.randomUUID(), value: 2 },
    { id: crypto.randomUUID(), value: 3 }
  ]);

  const enqueue = (value) => {
    if (queue.length >= 5) {
      return {
        success: false,
        message: "QUEUE OVERFLOW",
      };
    }

    const nextValue = value ?? queue.length + 1;

    setQueue((prev) => [...prev, { id: crypto.randomUUID(), value: nextValue }]);

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

  const peekQueue = () => {
    if (queue.length === 0) {
      return {
        success: false,
        message: "QUEUE IS EMPTY",
      };
    }
    return {
      success: true,
      value: queue[0].value,
    };
  };

  const clearQueue = () => {
    setQueue([]);
    return {
      success: true,
      message: "QUEUE CLEARED",
    };
  };

  return {
    queue,
    setQueue,
    enqueue,
    dequeue,
    peekQueue,
    clearQueue,
  };
}