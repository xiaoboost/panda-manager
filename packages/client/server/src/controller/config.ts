import * as Dir from '../service/directory';
import * as Sort from '../service/sort';

import { EventData, ConfigData, SortOption } from '@panda/shared';

export const ready = Promise.resolve();

export async function get(): Promise<ConfigData> {
  return {
    directories: await Dir.get(),
    sort: await Sort.get(),
  };
}

export async function patchConfig({ data }: EventData<Partial<ConfigData>>) {
  if (data.directories) {
    await Dir.update(data.directories);
  }

  if (data.sort) {
    await Sort.patch(data.sort);
  }
}

export async function patchSort({ data }: EventData<Partial<SortOption>>) {
  await Sort.patch(data);
}
