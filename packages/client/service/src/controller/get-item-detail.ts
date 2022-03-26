import { SyncService } from './types';

import { ItemDataInDetail, ItemKind } from '@panda/shared';
import { Manga, MangaData } from '@panda/plugin-manga/client';
import { Files } from '../model';

export const service: SyncService<{ id: string }, ItemDataInDetail | undefined> = ({
  requestData,
}) => {
  const data = Files.where((data) => data.id === Number(requestData.data.id))
    .limit(1)
    .toQuery()[0];

  if (data.data.kind === ItemKind.Manga) {
    return Manga.createByData(data.id, data.data as unknown as MangaData).toRendererDataInDetail();
  }
};
