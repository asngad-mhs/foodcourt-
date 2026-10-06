import { useEffect } from 'react';

interface ShortcutHandlers {
  onFocusSearch?: () => void;
  onSimulateQris?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({
  onFocusSearch,
  onSimulateQris,
  onEscape,
}: ShortcutHandlers): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2' && onFocusSearch) {
        e.preventDefault();
        onFocusSearch();
      } else if (e.key === 'F4' && onSimulateQris) {
        e.preventDefault();
        onSimulateQris();
      } else if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFocusSearch, onSimulateQris, onEscape]);
}
