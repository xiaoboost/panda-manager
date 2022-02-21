import { format } from './time';

const prefix = '[Panda Manager]';

export function log(...message: any[]) {
  console.log(prefix, `[${format(Date.now())}]`, ...message);
}
