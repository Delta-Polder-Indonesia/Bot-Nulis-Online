import { useMemo } from "react";
import type { TextStats } from "../types";

export function useTextStats(text: string): TextStats {
  return useMemo(() => {
    // Bersihkan LaTeX dan shape tags untuk perhitungan akurat
    const cleanText = text
      .replace(/\$\$.*?\$\$/gs, "X") // Ganti math dengan 1 karakter
      .replace(/\[shape:.*?\]/g, ""); // Hapus shape tags

    const charCount = cleanText.length;
    const words = cleanText
      .split(/\s+/)
      .filter((w) => w.trim().length > 0);
    const wordCount = words.length;
    const lineCount = text.split("\n").length;
    // Rata-rata membaca 200 kata per menit
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    return {
      charCount,
      wordCount,
      lineCount,
      readingTimeMinutes,
    };
  }, [text]);
}