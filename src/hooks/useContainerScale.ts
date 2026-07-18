import { useState, useEffect, type RefObject } from "react";

export function useContainerScale(
  wrapperRef: RefObject<HTMLDivElement>
): number {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }
    return () => observer.disconnect();
  }, [wrapperRef]);

  return containerWidth;
}