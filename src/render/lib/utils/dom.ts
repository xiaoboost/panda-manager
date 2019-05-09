import { isArray, isString, isObject } from './assert';

type ClassOption = string | undefined | { [className: string]: boolean };
export type ClassInput = ClassOption | ClassOption[];

/** 解析对象 class */
export function stringifyClass(opt: ClassInput) {
    interface ClassObject { [key: string]: boolean; }

    /** 解析 class 对象 */
    function parseClassObject(classObject: ClassObject) {
        return Object.keys(classObject).filter((key) => classObject[key]).join(' ');
    }

    let className = '';

    if (isArray(opt)) {
        className = opt.map(stringifyClass).join(' ');
    }
    else if (isObject(opt)) {
        className = parseClassObject(opt);
    }
    else if (isString(opt)) {
        className = opt;
    }
    else {
        className = '';
    }

    return className.trim();
}
