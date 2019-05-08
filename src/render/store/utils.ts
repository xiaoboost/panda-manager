import { deleteVal } from '../lib/utils';

/** 数组方法代理 */
export const arrayMethods = {
    Push<T>(arr: T[], ...items: T[]) {
        const newArr = Array.from(arr);
        newArr.push(...items);
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
