import { useState, useCallback } from "react";
import type { Form } from "@/features/form-lab/schema";

const MAX_HISTORY = 50;

interface UseHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  pushHistory: (snapshot: Form) => void;
  undo: (current: Form) => Form | null;
  redo: (current: Form) => Form | null;
  clearHistory: () => void;
}

/**
 * Gestiona un stack de undo/redo para el estado del formulario.
 * Limita la historia a MAX_HISTORY entradas para no inflar la memoria.
 * El estado actual NO se guarda aquí — solo los snapshots previos/futuros.
 */
export function useHistory(): UseHistoryReturn {
  const [past, setPast] = useState<Form[]>([]);
  const [future, setFuture] = useState<Form[]>([]);

  const pushHistory = (snapshot: Form) => {
    setPast((prev) => {
      const next = [...prev, snapshot];
      return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
    });
    setFuture([]);
  };

  const undo = useCallback((current: Form): Form | null => {
    if (past.length === 0) return null;
    const previous = past[past.length - 1];
    setPast((prev) => prev.slice(0, -1));
    setFuture((prev) => [current, ...prev]);
    return previous;
  }, [past]);

  const redo = useCallback((current: Form): Form | null => {
    if (future.length === 0) return null;
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setPast((prev) => [...prev, current]);
    return next;
  }, [future]);

  const clearHistory = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  return {
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    pushHistory,
    undo,
    redo,
    clearHistory,
  };
}
