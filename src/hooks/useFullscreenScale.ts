import { useState, useEffect } from "react";
import { PAPER_HEIGHT } from "../constants";

export function useFullscreenScale(isFullscreen: boolean): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isFullscreen) {
      setScale(1);
      return;
    }

    const updateScale = () => {
      const availableHeight = window.innerHeight - 120;
      const newScale = Math.min(availableHeight / PAPER_HEIGHT, 1);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [isFullscreen]);

  return scale;
}