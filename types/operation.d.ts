/** Ignoring some properties in an interface */
declare type Omit<T, K extends keyof T> = {
    [U in Exclude<keyof T, K>]: T[U];
};

/** To overwrite a read-only interface as writable */
declare type Writeable<T extends object, K extends keyof T> = Omit<T, K> & { -readonly [P in K]: T[P] };

/** Overwrite some property types in an interface */
declare type Overwrite<T extends object, K extends object> = Omit<T, Extract<keyof T, keyof K>> & K;

/** return the array type */
declare type GetArray<T> = T extends (any | (infer R)[]) ? R[] : never;

/** any object */
declare type AnyObject<T = any> = { [key: string]: T };
