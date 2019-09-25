import {
    isFunc,
    isUndef,
} from './assert';

/**
 * 根据下标取出当前数组元素
 * @template T
 * @param {T[]} arr
 * @param {number} index
 * @returns {T}
 */
export function get<T>(arr: T[], index: number): T {
    const sub = (index >= 0) ? index : arr.length + index;

    if (sub < 0 || sub >= arr.length) {
        throw new Error('(array) index out of bounds.');
    }

    return arr[sub];
}

/**
 * 删除满足条件的元素
 *  - 原数组不变，返回新数组
 *  - predicate 为函数时，删除 predicate 返回 true 的元素
 *  - predicate 为非函数时，删除与 predicate 严格相等的元素
 *  - 当 whole 为 false 时，只删除匹配到的第一个元素；为 true 时，删除所有匹配到的元素
 */
export function deleteVal<T>(
    arr: T[],
    predicate: T | ((value: T, index: number) => boolean),
    whole = true
) {
    const fn = isFunc(predicate) ? predicate : (item: T) => item === predicate;
    const newArr = arr.slice();

    let index = 0;

    while (index >= 0) {
        index = newArr.findIndex(fn);

        if (index !== -1) {
            newArr.splice(index, 1);
        }

        if (!whole) {
            break;
        }
    }

    return newArr;
}

/**
 * 删除满足条件的元素
 *  - 原数组不变，返回新数组
 *  - predicate 为函数时，删除 predicate 返回 true 的元素
 *  - predicate 为非函数时，删除与 predicate 严格相等的元素
 */
export function replace<T>(
    arr: T[],
    newVal: T,
    predicate: T | ((value: T, index: number) => boolean),
    whole = false
) {
    const fn = isFunc(predicate) ? predicate : (item: T) => item === predicate;
    const newArr = arr.slice();

    for (let i = 0; i < newArr.length; i++) {
        const item = newArr[i];
        const compared = fn(item, i);

        if (compared) {
            newArr.splice(i, 1, newVal);

            if (!whole) {
                break;
            }

            i++;
        }
    }

    return newArr;
}

/**
 * 数组去重
 *  - 如果没有输入 label 函数，则对数组元素直接去重
 *  - 如果输入了 label 函数，将会使用该函数对数组元素做一次转换，对转换之后的值进行去重，最后再映射回原数组
 *
 * @template T
 * @param {T[]} arr
 * @param {((value: T, index: number) => number | string)} [label]
 * @returns {T[]}
 */
export function unique<T>(arr: T[], label?: (value: T, index: number) => number | string): T[] {
    if (isUndef(label)) {
        return [...new Set(arr)];
    }

    const labelMap: { [key: string]: boolean } = {};
    return arr
        .map((value, index) => ({ value, key: label(value, index) }))
        .filter(({ key }) => (labelMap[key] ? false : (labelMap[key] = true)))
        .map(({ value }) => value);
}

/** 连接数组 */
export function concat<T, U>(from: T[], callback: (val: T) => U[] | undefined): U[] {
    let result: U[] = [];

    for (let i = 0; i < from.length; i++) {
        result = result.concat(callback(from[i]) || []);
    }

    return result;
}

/** 转换为数组 */
export function transArr<T>(item?: T | T[]): T[] {
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
