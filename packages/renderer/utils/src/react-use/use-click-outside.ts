import { useEffect } from 'react';

export function useClickOutside(
  element: HTMLElement | undefined | null,
  onOutsideClick: (event: MouseEvent) => any,
) {
  useEffect(() => {
    function clickOutside(event: MouseEvent) {
      if (event.target && element && !element.contains(event.target as Element)) {
        onOutsideClick(event);
      }
    }

    document.addEventListener('click', clickOutside);

    return () => {
      document.removeEventListener('click', clickOutside);
    };
  }, [element]);
}
