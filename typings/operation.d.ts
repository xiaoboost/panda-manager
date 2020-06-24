/** part Partial */
declare type PartPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** To overwrite a read-only interface as writable */
declare type Writeable<T extends AnyObject> = { -readonly [P in keyof T]: T[P] };

/** Overwrite some property types in an interface */
declare type Overwrite<T extends AnyObject, K extends AnyObject> = Omit<T, Extract<keyof T, keyof K>> & K;

/** return the array type */
declare type GetArray<T> = T extends (any | (infer R)[]) ? R[] : never;

/** return the array type */
declare type GetArrayItem<T> = T extends (infer R)[] ? R : never;

/** any object */
declare type AnyObject<T = unknown> = Record<string, T>;

/** any Function */
declare type AnyFunction = (...args: any[]) => any;

declare type GetString<T> = T extends string ? T : never;
