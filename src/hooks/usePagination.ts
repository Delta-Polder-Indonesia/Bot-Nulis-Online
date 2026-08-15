import { useState, useEffect } from "react";

interface PaginationDeps {
  text: string;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  lineCount: number;
}

export function usePagination(
  element: HTMLElement | null,
  deps: PaginationDeps
): number {
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!element) {
      setTotalPages(1);
      return;
    }

    const checkHeight = () => {
      if (!element) return;
      const height = element.scrollHeight;
      const pageHeight = deps.lineCount * deps.lineHeight;
      if (pageHeight <= 0) return;

      const calculatedPages = Math.max(1, Math.ceil(height / pageHeight));
      setTotalPages((prev) => (prev !== calculatedPages ? calculatedPages : prev));
    };

    // Panggil langsung
    checkHeight();

    // Tunggu fonts ready jika ada font eksternal
    if (document.fonts) {
      document.fonts.ready.then(checkHeight);
    }

    const observer = new ResizeObserver(() => {
      checkHeight();
    });

    observer.observe(element);

    // Re-check kecil setelah rendering settles
    const timer = setTimeout(checkHeight, 150);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [
    element,
    deps.text,
    deps.fontSize,
    deps.lineHeight,
    deps.fontFamily,
    deps.lineCount,
  ]);

  return totalPages;
}
