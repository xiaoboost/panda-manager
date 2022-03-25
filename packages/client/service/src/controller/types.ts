import { AsyncListenerContext, SyncListenerContext } from '@panda/fetch/client';

export type AsyncService<Parameter, Return> = (
  context: AsyncListenerContext<Parameter>,
) => Promise<Return>;
export type SyncService<Parameter, Return> = (context: SyncListenerContext<Parameter>) => Return;
