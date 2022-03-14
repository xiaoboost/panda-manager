/** 获取元素相对于屏幕的位置 */
export function getOffset(el: HTMLElement): [number, number] {
  let left = 0;
  let top = 0;
  let current: HTMLElement | null = el;

  while (current) {
    left += current.offsetLeft;
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return [left, top];
}
