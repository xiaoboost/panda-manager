import { Worker } from 'worker_threads';
import { CompressOption, ExtendOption } from './types';
import { resolveRoot } from '@panda/client-utils';

const compressWorker = new Worker(resolveRoot('worker/image/index.js'));

function resolveResult(resolve: (value: Buffer | PromiseLike<Buffer>) => void) {
  compressWorker.once('message', (data) => {
    if (data.error) {
      throw new Error(data.error);
    }

    resolve(data.data);
  });
}

export function compress(image: Buffer, opt: CompressOption = {}): Promise<Buffer> {
  compressWorker.postMessage({
    name: 'compress',
    params: [image, opt],
  });

  return new Promise<Buffer>((resolve) => resolveResult(resolve));
}

export async function extend(
  main: Buffer,
  extended: Buffer,
  opt: ExtendOption = {},
): Promise<Buffer> {
  compressWorker.postMessage({
    name: 'extend',
    params: [main, extended, opt],
  });

  return new Promise<Buffer>((resolve) => resolveResult(resolve));
}
