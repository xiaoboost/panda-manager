import React from 'react';

import { style } from './style';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { fetch, ServiceName } from '@panda/fetch/renderer';
import { MangaData } from '@panda/plugin-manga/renderer';

type ItemData = MangaData;

export function Detail() {
  const { id } = useParams();
  const [data, setData] = useState<ItemData>();

  useEffect(() => {
    fetch(ServiceName.GetItemDetail, { id }).then((data) => setData(data.data));
  }, []);

  if (!id) {
    return <div>参数 ID 为空</div>;
  }

  return <div className={style.classes.detail}>{JSON.stringify(data)}</div>;
}
