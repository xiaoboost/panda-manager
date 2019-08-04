import { isFunc } from './assert';

export function hasOwn(obj: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

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

export function parserBody<T = AnyObject>(body: T | string): T {
    let data = body;

    if (!body) {
        data = {} as any;
    }
    else if (typeof body === 'string') {
        try {
            data = JSON.parse(body);
        }
        catch (e) {
            data = {} as any;
            console.warn(`JSON 格式错误: ${body}`);
        }
    }

    return data as T;
}

/**
 * 在对象中添加隐藏属性
 * @param {object} from 待添加属性的对象
 * @param {object} properties 添加的属性
 */
export function def(from: object, properties: object) {
    Object.entries(properties).forEach(
        ([key, value]) => Object.defineProperty(from, key, {
            configurable: true,
            writable: true,
            enumerable: false,
            value,
        }),
    );
}

/** 连接数组 */
export function concat<T, U>(from: T[], callback: (val: T) => U[] | undefined): U[] {
    let result: U[] = [];

    for (let i = 0; i < from.length; i++) {
        result = result.concat(callback(from[i]) || []);
    }

    return result;
}

/**
 * 删除满足条件的元素
 *  - predicate 为函数时，删除 predicate 返回 true 的元素
 *  - predicate 为非函数时，删除与 predicate 严格相等的元素
 *  - 当 whole 为 false 时，只删除匹配到的第一个元素；为 true 时，删除所有匹配到的元素
 *
 * @template T
 * @param {T[]} arr
 * @param {(T | ((value: T, index: number) => boolean))} predicate
 * @param {boolean} [whole=true]
 * @returns {boolean}
 */
export function deleteItem<T>(arr: T[], predicate: T | ((value: T, index: number) => boolean), whole = true): boolean {
    const fn = isFunc(predicate) ? predicate : (item: T) => item === predicate;

    let index = 0, flag = false;
    while (index >= 0) {
        index = arr.findIndex(fn);
        if (index !== -1) {
            arr.splice(index, 1);
            flag = true;
        }
        if (!whole) {
            break;
        }
    }

    return flag;
}
