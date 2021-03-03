import { Config } from '../model';
import { SortOption } from 'src/utils/typings';

export async function patch(sort: Partial<SortOption>): Promise<void> {
  await Config.ready;

  Config.data.sort = {
    ...Config.data.sort,
    ...sort,
  };
}

export async function get(): Promise<SortOption> {
  await Config.ready;
  return { ...Config.data.sort };
}
