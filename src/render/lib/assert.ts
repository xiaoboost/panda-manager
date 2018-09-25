/** 断言 x 是否是字符串 */
export function isString(x: any): x is string {
    return typeof x === 'string';
}

/** 断言 arg 是否是数组 */
export const isArray = Array.isArray;