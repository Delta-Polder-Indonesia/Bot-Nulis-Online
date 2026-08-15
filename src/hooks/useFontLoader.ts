import { useState, useEffect, useCallback } from "react";

interface FontLoaderReturn {
  loadFont: (fontName: string) => Promise<void>;
  loadedFonts: Set<string>;
  isLoading: boolean;
  error: string | null;
}

// Cache global antar re-render
const globalLoadedFonts = new Set<string>([
  "Kalam",
  "Caveat",
  "Indie Flower",
  "Patrick Hand",
  "Shadows Into Light",
  "Coming Soon",
]);
const loadingPromises = new Map<string, Promise<void>>();

export function useFontLoader(): FontLoaderReturn {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(
    () => new Set(globalLoadedFonts)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFont = useCallback(async (fontName: string): Promise<void> => {
    if (!fontName) return;

    if (globalLoadedFonts.has(fontName)) {
      setLoadedFonts(new Set(globalLoadedFonts));
      return;
    }

    const existingPromise = loadingPromises.get(fontName);
    if (existingPromise) {
      await existingPromise;
      setLoadedFonts(new Set(globalLoadedFonts));
      return;
    }

    setIsLoading(true);
    setError(null);

    const encodedName = encodeURIComponent(fontName);
    const linkId = `font-${encodedName}`;

    const promise = new Promise<void>((resolve, reject) => {
      // Cek apakah <link> sudah ada di DOM
      if (document.getElementById(linkId)) {
        globalLoadedFonts.add(fontName);
        setLoadedFonts(new Set(globalLoadedFonts));
        setIsLoading(false);
        resolve();
        return;
      }

      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}&display=swap`;

      link.onload = () => {
        globalLoadedFonts.add(fontName);
        loadingPromises.delete(fontName);
        setLoadedFonts(new Set(globalLoadedFonts));
        setIsLoading(false);

        if (document.fonts) {
          document.fonts.load(`16px "${fontName}"`).then(() => resolve()).catch(() => resolve());
        } else {
          resolve();
        }
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

    try {
      await promise;
    } catch {
      // Error handled in state
    }
  }, []);

  // Pre-load default fonts
  useEffect(() => {
    const defaultFonts = [
      "Kalam",
      "Caveat",
      "Indie Flower",
      "Patrick Hand",
      "Shadows Into Light",
      "Coming Soon",
    ];
    defaultFonts.forEach((f) => {
      globalLoadedFonts.add(f);
    });
  }, []);

  return { loadFont, loadedFonts, isLoading, error };
}
