import React from 'react';

import { MangaDataInList } from '../shared';

export * from '../shared';

export function Cover(props: MangaDataInList) {
  return <img src={props.coverPath} height='100%' />;
}
