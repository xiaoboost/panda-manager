import { format } from './time';

const prefix = '[Panda Manager]';

export function log(...message: any[]) {
  console.log(prefix, `[${format(Date.now())}]`, ...message);
}

export function warn(...message: any[]) {
  console.warn(prefix, `[${format(Date.now())}]`, ...message);
}
