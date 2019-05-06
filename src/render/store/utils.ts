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
};

/** 对象方法代理 */
export const objectMethods = {
    Partial<T extends object>(to: T, from: Partial<T>): T {
        return {
            ...to,
            ...from,
        };
    },
};
