import { useState, useCallback } from "react";
import type { Preset, PaperSettings } from "../types";
import { STORAGE_KEY_PRESETS, BUILT_IN_PRESETS } from "../constants";

interface UsePresetsReturn {
  presets: Preset[];
  customPresets: Preset[];
  builtInPresets: Preset[];
  savePreset: (name: string, settings: PaperSettings) => void;
  loadPreset: (id: string) => PaperSettings | null;
  deletePreset: (id: string) => void;
  clearAllPresets: () => void;
}

function loadCustomPresets(): Preset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PRESETS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCustomPresets(presets: Preset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(presets));
  } catch (e) {
    console.warn("Gagal menyimpan preset:", e);
  }
}

export function usePresets(): UsePresetsReturn {
  const [customPresets, setCustomPresets] = useState<Preset[]>(loadCustomPresets);

  const presets = [...BUILT_IN_PRESETS, ...customPresets];

  const savePreset = useCallback(
    (name: string, settings: PaperSettings) => {
      const newPreset: Preset = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: name.trim(),
        settings: { ...settings },
        createdAt: Date.now(),
        isDefault: false,
      };
      setCustomPresets((prev) => {
        const updated = [...prev, newPreset];
        saveCustomPresets(updated);
        return updated;
      });
    },
    []
  );

  const loadPreset = useCallback(
    (id: string): PaperSettings | null => {
      const target = presets.find((p) => p.id === id);
      return target ? target.settings : null;
    },
    [presets]
  );

  const deletePreset = useCallback((id: string) => {
    setCustomPresets((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveCustomPresets(updated);
      return updated;
    });
  }, []);

  const clearAllPresets = useCallback(() => {
    setCustomPresets([]);
    localStorage.removeItem(STORAGE_KEY_PRESETS);
  }, []);

  return {
    presets,
    customPresets,
    builtInPresets: BUILT_IN_PRESETS,
    savePreset,
    loadPreset,
    deletePreset,
    clearAllPresets,
  };
}
