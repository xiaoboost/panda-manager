import { ServiceName } from '@panda/shared';
import { ListenerContext } from '@panda/fetch/client';

export interface ServiceData {
  name: ServiceName;
  service(context: ListenerContext): any;
}
