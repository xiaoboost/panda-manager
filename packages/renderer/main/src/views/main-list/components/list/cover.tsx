import React from 'react';

import { styles } from './style';
import { ItemDataInList, ItemKind } from '@panda/shared';
import { Cover as MangaCover, MangaDataInList } from '@panda/plugin-manga/renderer';
import { stringifyClass as cln } from '@xiao-ai/utils';
import { MouseButtons } from '@xiao-ai/utils/web';
import { useNavigate } from 'react-router';

export interface CoverProps {
  data: ItemDataInList;
  isSelected?: boolean;
  onLeftClick?: (ev: React.MouseEvent) => void;
  onRightClick?: (ev: React.MouseEvent) => void;
}

export function Cover({ data, isSelected = false, onLeftClick, onRightClick }: CoverProps) {
  const navigate = useNavigate();
  const { classes: names } = styles;
  const isItemData = data.kind === ItemKind.Manga;

  if (!isItemData) {
    return null;
  }

  const dbClickHandler = (ev: React.MouseEvent) => {
    if (ev.button === MouseButtons.Left) {
      navigate(`/detail/${data.id}`);
    }
  };

  return (
    <div
      onClick={onLeftClick}
      onContextMenu={onRightClick}
      onDoubleClick={dbClickHandler}
      className={cln(names.itemCover, {
        [names.selected]: isSelected,
      })}
      title={data.name}
    >
      <div className={names.mask}>
        <div className={names.maskOutside}></div>
        <div className={names.maskInside}></div>
      </div>
      <MangaCover {...(data as MangaDataInList)} />
    </div>
  );
}
