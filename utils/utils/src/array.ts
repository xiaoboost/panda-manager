import { isFunc, isUndef, isDef, isArray } from './assert';
import { AnyObject } from './types';

/** 索引类型 */
type Index = string | number;
/** 数组断言函数 */
type Predicate<T> = (value: T, index: number) => boolean;

/**
 * 删除满足条件的元素
 *  - 在原数组中操作
 *  - predicate 为函数时，删除 predicate 返回 true 的元素
 *  - predicate 为非函数时，删除与 predicate 严格相等的元素
 *  - 当 whole 为 false 时，只删除匹配到的第一个元素；为 true 时，删除所有匹配到的元素
 */
export function remove<T>(
  arr: T[],
  predicate: T | Predicate<T>,
  whole = true,
): T[] {
  const fn = isFunc(predicate) ? predicate : (item: T) => item === predicate;

  let index = 0;

  while (index >= 0) {
    index = arr.findIndex(fn);

    if (index !== -1) {
      arr.splice(index, 1);
    }

    if (!whole) {
      break;
    }
  }

  return arr;
}

/**
 * 替换满足条件的元素
 *  - 在原数组中操作
 *  - predicate 为函数时，替换 predicate 返回 true 的元素
 *  - predicate 为非函数时，替换与 predicate 严格相等的元素
 */
export function replace<T>(
  arr: T[],
  newVal: T,
  predicate: T | Predicate<T>,
): T[] {
  const fn = isFunc(predicate) ? predicate : (item: T) => item === predicate;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const compared = fn(item, i);

    if (compared) {
      arr.splice(i, 1, newVal);
      break;
    }
  }

  return arr;
}

/**
 * 数组去重
 *  - 如果没有输入 label 函数，则对数组元素直接去重
 *  - 如果输入了 label 函数，将会使用该函数对数组元素做一次转换，对转换之后的值进行去重，最后再映射回原数组
 */
export function unique<T extends Index>(arr: T[]): T[];
export function unique<T>(
  arr: T[],
  label: (value: T, index: number) => Index,
): T[];
export function unique<T>(
  arr: T[],
  label?: (value: T, index: number) => Index,
): T[] {
  const labelMap: Record<Index, boolean> = {};

  if (isDef(label)) {
    return arr
      .map((value, index) => ({
        value,
        key: label(value, index),
      }))
      .filter(({ key }) => (labelMap[key] ? false : (labelMap[key] = true)))
      .map(({ value }) => value);
  }
  else {
    return arr.filter((key) =>
      labelMap[key as any] ? false : (labelMap[key as any] = true),
    );
  }
}

/** 连接数组 */
export function concat<T, U>(
  from: T[],
  cb: (val: T) => (U | undefined)[] | U | undefined,
): U[] {
  let result: U[] = [];

  for (let i = 0; i < from.length; i++) {
    const item = cb(from[i]);

    if (isUndef(item)) {
      continue;
    }
    else if (isArray(item)) {
      result = result.concat(item.filter(isDef));
    }
    else {
      result.push(item);
    }
  }

  return result;
}

/** 转换为数组 */
export function toArray<T>(item?: T | T[]): T[] {
  if (!item) {
    return [];
  }
  else if (!Array.isArray(item)) {
    return [item];
  }
  else {
    return item;
  }
}

/** 在`rest`数组中，且不在`arr`数组中的 */
export function exclude<T extends Index>(arr: T[], rest: T[]): T[] {
  const map: Record<Index, boolean> = {};

  for (let i = 0; i < arr.length; i++) {
    map[arr[i]] = true;
  }

  return rest.filter((key) => !map[key]);
}
