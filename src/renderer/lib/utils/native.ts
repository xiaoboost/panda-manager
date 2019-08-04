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
