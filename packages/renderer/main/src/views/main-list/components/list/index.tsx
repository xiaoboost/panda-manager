import React from 'react';
import qs from 'qs';

import { useState, useEffect } from 'react';
import { MangaDataInList } from '@panda/plugin-manga/renderer';
import { fetch, ServiceName } from '@panda/fetch/renderer';
import { SearchOption, log } from '@panda/shared';
import { useMap, useKeyboard } from '@panda/renderer-utils';
import { SearchBar } from '../search';

import { styles } from './style';
import { Cover } from './cover';

type ItemData = MangaDataInList;

// TODO: 顶部阴影

export function List() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [searchOpts, setSearchOpts] = useState<SearchOption[]>([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [selected, setSelected] = useMap<Record<number, boolean>>({});

  useKeyboard('ctrl+f', () => setSearchVisible(true));
  useKeyboard('esc, escape', () => setSearchVisible(false));

  useEffect(() => {
    const searchQuery = qs.parse(location.search);

    if (process.env.NODE_ENV === 'development') {
      log('初始化搜索参数为：', JSON.stringify(searchQuery.search, null, 2));
    }

    fetch<ItemData[], SearchOption[]>(ServiceName.GetItemsList, []).then((data) =>
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
    <div className={styles.classes.list} onClick={resetHandler} tabIndex={0}>
      <SearchBar
        visible={searchVisible}
        data={searchOpts}
        onClose={() => setSearchVisible(false)}
      />
      <div className={styles.classes.listContainer}>
        {items.map((item) => (
          <Cover
            key={item.id}
            data={item}
            isSelected={selected[item.id]}
            onLeftClick={leftClickHandler(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
