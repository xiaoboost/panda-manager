import { isObject, isFunc, isArray, isBaseType } from './assert';
import { checkCircularStructure } from './clone';

/**
 * 移除数组中的某个值
 */
export function remove<T>(arr: T[], item: T) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            arr.splice(index, 1);
            return;
        }
    }
}

/**
 * 对象是否为空
 * @param obj 待检测对象
 */
export function isEmpty(obj: object): boolean {
    return Object.keys(obj).length > 0;
}

/**
 * 比较两个值是否相等
 * @param from 被比较值
 * @param to 比较值
 */
export function isEqual(from: any, to: any, deepCheck = false): boolean {
    if (isBaseType(from)) {
        return from === to;
    }

    if (deepCheck && checkCircularStructure(from)) {
        throw new Error('(isEqual) Can not have circular structure.');
    }

    if (isFunc(from.isEqual)) {
        return Boolean(from.isEqual(to));
    }

    if (isArray(from)) {
        if (!isArray(to) || from.length !== to.length) {
            return false;
        }
        else {
            return from.every(
                (item, i) => isBaseType(item)
                    ? item === to[i]
                    : isEqual(item, to[i]),
            );
        }
    }
    else {
        if (
            !isObject(to) ||
            !Object.keys(from).every((key) => to.hasOwnProperty(key)) ||
            !Object.keys(to).every((key) => from.hasOwnProperty(key))
        ) {
            return false;
        }
        else {
            return Object.entries(from).every(
                ([key, value]) => isBaseType(value)
                    ? value === to[key]
                    : isEqual(value, to[key]),
            );
        }
    }
}

type CompareMapping = Array<{ fromKey: string; toKey: string }>;

/**
 * 对比对象差异并返回有变化的值的集合对象
 * @param from 原始对象
 * @param to 比较对象
 * @param mapping 属性值映射表
 */
export function compareAssign<T = AnyObject>(from: AnyObject, to: Partial<T>, mapping?: CompareMapping): Partial<T> | null {
    if (!mapping) {
        mapping = Object.keys(from).map((key) => ({
            fromKey: key,
            toKey: key,
        }));
    }

    const result: Partial<T> = {};

    for (const { fromKey, toKey } of mapping) {
        if (!isEqual(from[fromKey], to[toKey])) {
            result[toKey] = from[fromKey];
        }
    }

    return isEmpty(result) ? null : result;
}

/**
 * Define a property.
 */
export function def(obj: object, key: string | symbol, val: any, enumerable = false) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable,
        writable: true,
        configurable: true,
    });
}

// 原生 eval 函数重命名
export const _eval: typeof eval = (window as any).eval;

// 原生 write 函数重命名
export const _write = document.write;

// disabled dangerous api
if (process.env.NODE_ENV !== 'development') {
    (window as any).eval = global.eval = () => {
        throw new Error(`Sorry, this app does not support window.eval().`);
    };

    document.write = () => {
        throw new Error(`Sorry, this app does not support document.write().`);
    };
}
