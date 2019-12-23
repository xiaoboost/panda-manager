if (console) {
    const originConsole = console;

    Object.keys(originConsole).forEach((key) => {
        console[key] = (...args: any[]) => {
            if (process.env.NODE_ENV === 'development') {
                originConsole[key](...args);
            }
        };
    });
}
