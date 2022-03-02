import { Config } from '../../model';
import { SortOption } from '@panda/shared';

export const ready = Config.ready;

export async function patch(sort: Partial<SortOption>): Promise<void> {
  await Config.ready;

  Config.set({
    sort: {
      ...Config.data.sort,
      ...sort,
    },
  });
}

export async function get(): Promise<SortOption> {
  await Config.ready;
  return { ...Config.data.sort };
}
