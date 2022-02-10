import { RPC } from '@panda/shared';

export interface ServiceData {
  name: RPC.Name;
  service(request: RPC.Data): any;
}
