import { useEffect, useRef } from 'react';
import { remove } from '@xiao-ai/utils';

type BlurHandler = (event: MouseEvent) => any;

interface State {
  id: number;
  isFocus: boolean;
  el: HTMLElement | null;
  onBlur: BlurHandler;
}

let id = 0;

const blurData: State[] = [];

document.addEventListener('click', (event) => {
  blurData
    .filter((data) => data.isFocus)
    .forEach((ref) => {
      if (event.target && ref.el && !ref.el.contains(event.target as Element)) {
        ref.onBlur(event);
      }
    });
});

export function useBlur<H extends HTMLElement = HTMLElement>(
  isFocus: boolean,
  onBlur: BlurHandler,
) {
  const ref = useRef<H>(null);
  const { current: data } = useRef<State>({
    id: id++,
    el: ref.current,
    isFocus,
    onBlur,
  });

  useEffect(() => {
    blurData.push(data);
    return () => {
      remove(blurData, data, true);
    };
  }, []);

  useEffect(() => {
    data.isFocus = isFocus;
    data.el = ref.current;
    data.onBlur = onBlur;
  }, [ref.current, onBlur, isFocus]);

  return ref;
}
