import { useState, useCallback } from "react";
import type { Preset, PaperSettings } from "../types";
import { STORAGE_KEY_PRESETS } from "../constants";

interface UsePresetsReturn {
  presets: Preset[];
  savePreset: (name: string, settings: PaperSettings) => void;
  loadPreset: (id: string) => PaperSettings | null;
  deletePreset: (id: string) => void;
  clearAllPresets: () => void;
}

function loadFromStorage(): Preset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PRESETS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(presets: Preset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
  } catch (e) {
    console.warn("Gagal menyimpan preset:", e);
  }
}

export function usePresets(): UsePresetsReturn {
  const [presets, setPresets] = useState<Preset[]>(loadFromStorage);

  const savePreset = useCallback(
    (name: string, settings: PaperSettings) => {
      const newPreset: Preset = {
        id: crypto.randomUUID(),
        name: name.trim(),
        settings,
        createdAt: Date.now(),
      };
      const updated = [...presets, newPreset];
      setPresets(updated);
      saveToStorage(updated);
    },
    [presets]
  );

  const loadPreset = useCallback(
    (id: string): PaperSettings | null => {
      return presets.find((p) => p.id === id)?.settings ?? null;
    },
    [presets]
  );

  const deletePreset = useCallback(
    (id: string) => {
      const updated = presets.filter((p) => p.id !== id);
      setPresets(updated);
      saveToStorage(updated);
    },
    [presets]
  );

  const clearAllPresets = useCallback(() => {
    setPresets([]);
    localStorage.removeItem(STORAGE_KEY_PRESETS);
  }, []);

  return {
    presets,
    savePreset,
    loadPreset,
    deletePreset,
    clearAllPresets,
  };
}