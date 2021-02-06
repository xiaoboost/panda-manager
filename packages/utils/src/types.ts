export type AnyObject<T = unknown> = Record<string, T>;
export type AnyFunction = (...args: any[]) => any;
export type EmptyObject = Record<string, never>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type Empty = {};
