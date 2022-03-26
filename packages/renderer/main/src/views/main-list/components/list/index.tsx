import React, { useEffect } from 'react';

import { useState } from 'react';
import { MangaDataInList } from '@panda/plugin-manga/renderer';
import { fetch, ServiceName } from '@panda/fetch/renderer';
import { SearchItemData } from '@panda/shared';

import { styles } from './style';
import { Cover } from './cover';

type ItemData = MangaDataInList;

export function List() {
  const [items, setItems] = useState<ItemData[]>([]);

  useEffect(() => {
    fetch<ItemData[], SearchItemData[]>(ServiceName.GetItemsList, []).then((data) =>
      setItems(data.data),
    );
  }, []);

  return (
    <div className={styles.classes.list}>
      {items.map((item) => (
        <Cover data={item} isSelected />
      ))}
    </div>
  );
}
