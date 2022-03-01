import { ItemData, ItemKind } from '@panda/shared';

/** 漫画项目类别 */
export enum MangaKind {
  Directory,
  Zip,
}

/** 漫画模块储存数据 */
export interface MangaData extends ItemData {
  /** 项目类别 */
  kind: ItemKind.Manga;
  /** 漫画项目类别 */
  mangaKind: MangaKind;
}

/** 漫画模块在渲染线程的数据 */
export interface MangaRendererData extends MangaData {
  /** 封面图片路径 */
  coverPath: string;
}
