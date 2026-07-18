import { useState, useEffect, useCallback } from "react";

interface FontLoaderReturn {
  loadFont: (fontName: string) => void;
  loadedFonts: Set<string>;
  isLoading: boolean;
  error: string | null;
}

// Cache global agar tidak load ulang
const globalLoadedFonts = new Set<string>();
const loadingPromises = new Map<string, Promise<void>>();

export function useFontLoader(): FontLoaderReturn {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(
    new Set(globalLoadedFonts)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFont = useCallback((fontName: string) => {
    // Sudah dimuat
    if (globalLoadedFonts.has(fontName)) return;

    // Sedang dimuat
    if (loadingPromises.has(fontName)) return;

    setIsLoading(true);
    setError(null);

    const encodedName = encodeURIComponent(fontName);
    const linkId = `font-${encodedName}`;

    // Cek apakah <link> sudah ada
    if (document.getElementById(linkId)) {
      globalLoadedFonts.add(fontName);
      setLoadedFonts(new Set(globalLoadedFonts));
      setIsLoading(false);
      return;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodedName.replace(/%20/g, "+")}&display=swap`;

      link.onload = () => {
        globalLoadedFonts.add(fontName);
        loadingPromises.delete(fontName);
        setLoadedFonts(new Set(globalLoadedFonts));
        setIsLoading(false);
        resolve();
      };

      link.onerror = () => {
        loadingPromises.delete(fontName);
        setError(`Gagal memuat font: ${fontName}`);
        setIsLoading(false);
        reject(new Error(`Failed to load font: ${fontName}`));
      };

      document.head.appendChild(link);
    });

    loadingPromises.set(fontName, promise);
  }, []);

  // Muat font default saat pertama kali
  useEffect(() => {
    const defaultFonts = [
      "Kalam",
      "Caveat",
      "Indie Flower",
      "Patrick Hand",
      "Shadows Into Light",
      "Coming Soon",
    ];
    defaultFonts.forEach((f) => loadFont(f));
  }, [loadFont]);

  return { loadFont, loadedFonts, isLoading, error };
}