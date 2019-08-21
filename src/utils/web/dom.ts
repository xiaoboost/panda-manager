import { isArray, isString, isObject } from '../shared';

export type ClassInput = string | undefined | { [className: string]: boolean };

/** 解析对象 class */
export function stringifyClass(...opt: ClassInput[]) {
    interface ClassObject { [key: string]: boolean; }

    /** 解析 class 对象 */
    function parseClassObject(classObject: ClassObject) {
        return Object.keys(classObject).filter((key) => classObject[key]);
    }

    const className: string[] = [];

    for (const item of opt) {
        if (isObject(item)) {
            className.push(...parseClassObject(item));
        }
        else if (isString(item)) {
            className.push(item.trim());
        }
    }

    return className.join(' ');
}
