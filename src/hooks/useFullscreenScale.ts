import { useState, useEffect } from "react";
import { PAPER_HEIGHT, PAPER_WIDTH } from "../constants";

export function useFullscreenScale(isFullscreen: boolean): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isFullscreen) {
      setScale(1);
      return;
    }

    const updateScale = () => {
      const availableHeight = window.innerHeight - 130;
      const availableWidth = window.innerWidth - 48;
      const scaleHeight = availableHeight / PAPER_HEIGHT;
      const scaleWidth = availableWidth / PAPER_WIDTH;
      const newScale = Math.max(0.25, Math.min(scaleHeight, scaleWidth, 1.15));
      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [isFullscreen]);

  return scale;
}
