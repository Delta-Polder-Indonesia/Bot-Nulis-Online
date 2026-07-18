import { useState, useEffect, type RefObject } from "react";

interface PaginationDeps {
  text: string;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  lineCount: number;
}

export function usePagination(
  contentRef: RefObject<HTMLDivElement>,
  deps: PaginationDeps
): number {
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const checkHeight = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        const pageHeight = deps.lineCount * deps.lineHeight;
        if (pageHeight <= 0) return;
        const calculatedPages = Math.max(
          1,
          Math.ceil(height / pageHeight)
        );
        setTotalPages((prev) =>
          prev !== calculatedPages ? calculatedPages : prev
        );
      }
    };

    checkHeight();

    const observer = new ResizeObserver(checkHeight);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    return () => observer.disconnect();
  }, [
    deps.text,
    deps.fontSize,
    deps.lineHeight,
    deps.fontFamily,
    deps.lineCount,
    contentRef,
  ]);

  return totalPages;
}