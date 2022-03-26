import { useEffect } from 'react';

import hotkeys, { KeyHandler } from 'hotkeys-js';

export function useKeyboard(filter: string, handler: KeyHandler) {
  useEffect(() => {
    hotkeys(filter, handler);

    return () => {
      hotkeys.unbind(filter, handler);
    };
  }, []);
}
