declare module '*.styl' {
    const classes: Record<string, string>;
    export default classes;
}

declare module 'simple-node-logger';

declare type ProgressCb = (progress: number) => any;
