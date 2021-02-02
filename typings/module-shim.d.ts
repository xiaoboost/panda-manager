declare module '*.styl' {
    const classes: Record<string, string>;
    export default classes;
}

declare module 'friendly-errors-webpack-plugin';
declare module 'generate-json-webpack-plugin';
declare module 'mini-css-extract-plugin';
declare module 'css-minimizer-webpack-plugin';
declare module 'webpack-bundle-analyzer';

declare type ProgressCb = (progress: number) => any;
