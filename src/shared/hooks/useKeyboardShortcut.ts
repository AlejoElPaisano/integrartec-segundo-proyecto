import { useEffect, useRef } from "react";

interface ShortcutOptions {
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: ShortcutOptions = {}
): void {
  const { ctrlKey, metaKey, altKey, shiftKey } = options;
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      const modifiersMatch =
        Boolean(ctrlKey) === event.ctrlKey &&
        Boolean(metaKey) === event.metaKey &&
        Boolean(altKey) === event.altKey &&
        Boolean(shiftKey) === event.shiftKey;
      if (keyMatches && modifiersMatch) {
        event.preventDefault();
        callbackRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, ctrlKey, metaKey, altKey, shiftKey]);
}
