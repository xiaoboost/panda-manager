import * as fs from '@panda/client-utils';

import { ItemData, warn } from '@panda/shared';

export async function readManga(filePath: string, stat?: fs.Stats): Promise<ItemData | undefined> {
  const fileStat = stat ?? await fs.stat(filePath);
  const isDirectory = fileStat.isDirectory();

  if (fileStat.isDirectory()) {
    // ..
  }
  else {
    // ..
  }
}
