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

/**
 * 生成异步延迟函数
 * @param {number} [time=0]
 * @returns {Promise<void>}
 */
export function delay(time = 0) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 生成一个一次性的事件
 * @export
 * @param {(HTMLElement | Worker)} el
 * @param {string} type
 * @returns {Promise<Event>}
 */
export function onceEvent<T extends Event>(el: HTMLElement | Worker, type: string): Promise<T> {
    return new Promise<T>((resolve) => {
        el.addEventListener(type, (resolve as any), {
            passive: true,
            once: true,
        });
    });
}
