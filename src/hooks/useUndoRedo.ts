import { useState, useCallback, useRef } from "react";

interface UndoRedoState<T> {
  value: T;
  setValue: (newValue: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
}

const MAX_HISTORY = 100;

export function useUndoRedo<T>(initialValue: T): UndoRedoState<T> {
  const historyRef = useRef<T[]>([initialValue]);
  const indexRef = useRef(0);
  const [, forceUpdate] = useState(0);

  const value = historyRef.current[indexRef.current];

  const setValue = useCallback((newValue: T) => {
    // Slice history setelah posisi sekarang (buang redo history)
    historyRef.current = historyRef.current.slice(0, indexRef.current + 1);

    // Batasi ukuran history
    if (historyRef.current.length >= MAX_HISTORY) {
      historyRef.current = historyRef.current.slice(1);
    } else {
      indexRef.current += 1;
    }

    historyRef.current.push(newValue);
    forceUpdate((n) => n + 1);
  }, []);

  const undo = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;
      forceUpdate((n) => n + 1);
    }
  }, []);

  const redo = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
      forceUpdate((n) => n + 1);
    }
  }, []);

  const clear = useCallback(() => {
    historyRef.current = [historyRef.current[indexRef.current]];
    indexRef.current = 0;
    forceUpdate((n) => n + 1);
  }, []);

  return {
    value,
    setValue,
    undo,
    redo,
    canUndo: indexRef.current > 0,
    canRedo: indexRef.current < historyRef.current.length - 1,
    clear,
  };
}