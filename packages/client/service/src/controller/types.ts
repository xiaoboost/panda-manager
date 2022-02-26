import { ListenerContext } from '@panda/fetch/client';

export type ServiceData<T = any> = (context: ListenerContext) => T;
