import { useState } from "react";
import { soundFX } from "../utils/soundFX";

export function useQueueLogic() {
  const [queue, setQueue] = useState([
    { id: crypto.randomUUID(), value: 1 },
    { id: crypto.randomUUID(), value: 2 },
    { id: crypto.randomUUID(), value: 3 },
  ]);
  const [isPeekingQueue, setIsPeekingQueue] = useState(false);

  const enqueue = (value) => {
    if (queue.length >= 5) {
      soundFX.playWarning();
      return {
        success: false,
        message: "QUEUE OVERFLOW",
      };
    }

    const nextValue = value ?? queue.length + 1;
    setQueue((prev) => [...prev, { id: crypto.randomUUID(), value: nextValue }]);
    soundFX.playPush();

    return {
      success: true,
      message: "ENQUEUE SUCCESS",
    };
  };

  const dequeue = () => {
    if (queue.length === 0) {
      soundFX.playWarning();
      return {
        success: false,
        message: "QUEUE UNDERFLOW",
      };
    }

    setQueue((prev) => prev.slice(1));
    soundFX.playPop();

    return {
      success: true,
      message: "DEQUEUE SUCCESS",
    };
  };

  const peekQueue = () => {
    if (queue.length === 0) {
      soundFX.playWarning();
      return {
        success: false,
        message: "QUEUE IS EMPTY",
        value: null,
      };
    }

    setIsPeekingQueue(true);
    soundFX.playPeek();
    setTimeout(() => setIsPeekingQueue(false), 1500);

    return {
      success: true,
      message: "PEEK SUCCESS",
      value: queue[0].value,
    };
  };

  const clearQueue = () => {
    setQueue([]);
    soundFX.playClear();
    return {
      success: true,
      message: "QUEUE CLEARED",
    };
  };

  return {
    queue,
    setQueue,
    isPeekingQueue,
    enqueue,
    dequeue,
    peekQueue,
    clearQueue,
  };
}