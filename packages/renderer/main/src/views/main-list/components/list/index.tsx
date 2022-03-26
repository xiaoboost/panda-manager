import React, { useEffect } from 'react';

import { useState } from 'react';
import { MangaDataInList } from '@panda/plugin-manga/renderer';
import { fetch, ServiceName } from '@panda/fetch/renderer';
import { SearchItemData } from '@panda/shared';
import { useMap } from '@panda/renderer-utils';

import { styles } from './style';
import { Cover } from './cover';

type ItemData = MangaDataInList;

export function List() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [selected, setSelected] = useMap<Record<number, boolean>>({});

  useEffect(() => {
    fetch<ItemData[], SearchItemData[]>(ServiceName.GetItemsList, []).then((data) =>
      setItems(data.data),
    );
  }, []);

  const leftClickHandler = (id: number) => (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setSelected.reset();
    setSelected.set(id, true);
  };
  const resetHandler = (ev: React.MouseEvent) => {
    if (ev.currentTarget === ev.target) {
      setSelected.reset();
    }
  };

  return (
    <div className={styles.classes.list} onClick={resetHandler}>
      {items.map((item) => (
        <Cover
          key={item.id}
          data={item}
          isSelected={selected[item.id]}
          onLeftClick={leftClickHandler(item.id)}
        />
      ))}
    </div>
  );
}
