import { ServiceData } from './types';
import { RPC } from '@panda/shared';

export const service: ServiceData = {
  name: RPC.FetchName.IsFocused,
  service(win): boolean {
    return win.isMaximized();
  },
};
