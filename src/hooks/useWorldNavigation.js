import { useState } from "react";

export function useWorldNavigation() {
  const [currentWorld, setCurrentWorld] = useState("stack");
  const [transitioning, setTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState("");

  const switchWorld = (world, label) => {
    if (currentWorld === world) return;

    setTransitionText(label);
    setTransitioning(true);

    setTimeout(() => {
      setCurrentWorld(world);
    }, 350);

    setTimeout(() => {
      setTransitioning(false);
    }, 900);
  };

  return {
    currentWorld,
    setCurrentWorld,
    transitioning,
    transitionText,
    switchWorld,
  };
}
