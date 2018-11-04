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
