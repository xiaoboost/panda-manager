import { SyncService } from './types';

import { Manga } from '@panda/plugin-manga/client';
import { match, SearchOption, SortBy, ItemKind, ItemDataInList } from '@panda/shared';
import { Config, Files } from '../model';
import { isDef } from '@xiao-ai/utils';

function toOrderBy(by: SortBy) {
  switch (by) {
    case SortBy.lastModified:
      return 'lastModified';
    case SortBy.name:
      return 'name';
    case SortBy.size:
      return 'fileSize';
  }
}

export const service: SyncService<SearchOption[], ItemDataInList[]> = ({ requestData }) => {
  const { sort } = Config.data;
  const dataInDb = Files.orderBy(toOrderBy(sort.by), sort.asc ? 'asc' : 'desc')
    .where((data) => match({ tags: data.tags, text: data.name }, requestData.data))
    .toQuery()
    .map((data) => {
      if (data.data.kind === ItemKind.Manga) {
        return Manga.createByData(data.id, data.data as any).toRendererDataInList();
      }
    })
    .filter(isDef);

  return dataInDb;
};
