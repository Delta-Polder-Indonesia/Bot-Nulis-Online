import { useState, useEffect, type RefObject } from "react";

export function useContainerScale(
  wrapperRef: RefObject<HTMLDivElement | null>
): number {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const updateWidth = () => {
      if (wrapperRef.current) {
        setContainerWidth(wrapperRef.current.clientWidth);
      }
    };

    updateWidth();

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    observer.observe(el);
    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [wrapperRef]);

  return containerWidth;
}
