import { useState, useCallback, useRef } from "react";

interface UndoRedoState<T> {
  value: T;
  setValue: (newValue: T) => void;
  undo: () => T | null;
  redo: () => T | null;
  canUndo: boolean;
  canRedo: boolean;
  reset: (newValue: T) => void;
}

const MAX_HISTORY = 100;

export function useUndoRedo<T>(initialValue: T): UndoRedoState<T> {
  const historyRef = useRef<T[]>([initialValue]);
  const indexRef = useRef(0);
  const [, forceUpdate] = useState(0);

  const value = historyRef.current[indexRef.current] ?? initialValue;

  const setValue = useCallback((newValue: T) => {
    // Hindari duplikasi jika nilainya sama persis
    if (historyRef.current[indexRef.current] === newValue) return;

    // Slice history setelah posisi sekarang (buang redo history)
    const newHistory = historyRef.current.slice(0, indexRef.current + 1);

    if (newHistory.length >= MAX_HISTORY) {
      newHistory.shift();
    } else {
      indexRef.current += 1;
    }

    newHistory.push(newValue);
    historyRef.current = newHistory;
    forceUpdate((n) => n + 1);
  }, []);

  const undo = useCallback((): T | null => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;
      const target = historyRef.current[indexRef.current];
      forceUpdate((n) => n + 1);
      return target;
    }
    return null;
  }, []);

  const redo = useCallback((): T | null => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
      const target = historyRef.current[indexRef.current];
      forceUpdate((n) => n + 1);
      return target;
    }
    return null;
  }, []);

  const reset = useCallback((newValue: T) => {
    historyRef.current = [newValue];
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
    reset,
  };
}
