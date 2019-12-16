declare module 'progress-bar-webpack-plugin';

declare module '*.less' {
    const classes: Record<string, string>;
    export default classes;
}
