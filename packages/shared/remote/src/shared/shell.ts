import type { Shell } from 'electron';

export type { RemoteReplyEvent, RemoteToEvent } from './dialog';

export const RemoteEventName = '_remote_shell_event';

type ToPromise<T> = T extends Promise<any> ? T : Promise<T>;
type FunctionPromise<F extends (...args: any[]) => any> = (
  ...params: Parameters<F>
) => ToPromise<ReturnType<F>>;

export type RemoteShell = {
  [Key in keyof Shell]: FunctionPromise<Shell[Key]>;
};
