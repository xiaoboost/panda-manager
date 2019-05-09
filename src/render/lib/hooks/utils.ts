import { deleteVal } from 'render/lib/utils';

/** 替换函数 */
// TODO: 替换的时候应该要做是否替换的检测
const Replace = <T>(origin: T, newVal: T) => newVal;

/** 数组方法代理 */
export const arrayMethods = {
    Replace,
    Push<T>(arr: T[], item: T) {
        const newArr = Array.from(arr);
        newArr.push(item);
        return newArr;
    },
    Pop<T>(arr: T[]) {
        const newArr = Array.from(arr);
        newArr.pop();
        return newArr;
    },
    Delete<T>(arr: T[], predicate: T | ((value: T, index: number) => boolean)) {
        const newArr = Array.from(arr);
        deleteVal(newArr, predicate);
        return newArr;
    },
};

/** 对象方法代理 */
export const objectMethods = {
    Replace,
    Partial<T extends object>(to: T, from: Partial<T>): T {
        return {
            ...to,
            ...from,
        };
    },
    Delete<T extends object>(origin: T, key: keyof T): T {
        const data = { ...origin };
        delete data[key];
        return data;
    },
};
