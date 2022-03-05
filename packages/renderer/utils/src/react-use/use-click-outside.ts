import { useEffect, useRef } from 'react';

export function useClickOutside<H extends HTMLElement = HTMLElement>(
  onOutsideClick: (event: MouseEvent) => any,
) {
  const ref = useRef<H>(null);

  useEffect(() => {
    function clickOutside(event: MouseEvent) {
      if (event.target && ref.current && !ref.current.contains(event.target as Element)) {
        onOutsideClick(event);
      }
    }

    document.addEventListener('click', clickOutside);

    return () => {
      document.removeEventListener('click', clickOutside);
    };
  }, [ref.current]);

  return ref;
}
