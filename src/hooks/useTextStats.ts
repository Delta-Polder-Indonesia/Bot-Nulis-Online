import { useMemo } from "react";
import type { TextStats } from "../types";

export function useTextStats(text: string): TextStats {
  return useMemo(() => {
    // Bersihkan LaTeX dan shape tags untuk perhitungan akurat
    const cleanText = text
      .replace(/\$\$.*?\$\$/gs, "X") // Ganti math block dengan 1 token
      .replace(/\[shape:.*?\]/g, ""); // Hapus shape tags

    const charCount = text.length;
    const words = cleanText
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const wordCount = text.trim().length === 0 ? 0 : words.length;
    const lineCount = text.length === 0 ? 0 : text.split("\n").length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    return {
      charCount,
      wordCount,
      lineCount,
      readingTimeMinutes,
    };
  }, [text]);
}
