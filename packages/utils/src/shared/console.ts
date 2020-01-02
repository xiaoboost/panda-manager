if (console) {
    const originConsole: typeof console = {} as any;

    Object.keys(console).forEach((key) => {
        originConsole[key] = console[key];
        console[key] = (...args: any[]) => {
            if (process.env.NODE_ENV === 'development') {
                originConsole[key](...args);
            }
        };
    });
}
