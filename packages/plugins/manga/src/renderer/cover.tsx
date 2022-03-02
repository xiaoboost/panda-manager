import React from 'react';

import { MangaRendererData } from '../shared';

export * from '../shared';

export function Cover(props: MangaRendererData) {
  return <img src={props.coverPath} height='100%' />;
}
