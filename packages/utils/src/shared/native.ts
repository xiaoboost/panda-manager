/* eslint-disable no-eval */

// 原生 eval 函数重命名
export const _eval: typeof eval = globalThis.eval;

// 原生 write 函数重命名
export const _write = globalThis.document ? globalThis.document.write : () => void 0;

// disabled dangerous api
if (process.env.NODE_ENV !== 'development') {
    globalThis.eval = () => {
        throw new Error('Sorry, this app does not support window.eval().');
    };

    if (globalThis.document) {
        globalThis.document.write = () => {
            throw new Error('Sorry, this app does not support document.write().');
        };
    }
}
