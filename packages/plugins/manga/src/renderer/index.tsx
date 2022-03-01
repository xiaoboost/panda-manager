import React from 'react';

import { MangaRendererData } from '../shared';

export * from '../shared';

export function Render(props: MangaRendererData) {
  return <img src={props.coverPath} height='200' />;
}
