import { ListenerContext } from '@panda/fetch/client';

export type ServiceData<R = any, P = any> = (context: ListenerContext<P>) => R;
