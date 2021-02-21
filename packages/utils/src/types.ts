/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-empty-interface */

export type AnyObject<T = unknown> = Record<string, T>;
export type AnyFunction = (...args: any[]) => any;
export type EmptyObject = Record<string, never>;
export type Empty = {};

export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends AnyFunction
    ? T
    : T extends AnyObject
      ? DeepReadonlyObject<T>
      : T;
 
interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
 
type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
