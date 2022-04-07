import { ItemData, ItemKind, ItemDataInList, ItemDataInDetail } from '@panda/shared';

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
export interface MangaDataInList extends ItemDataInList {
  /** 封面图片路径 */
  coverPath: string;
}

/** 漫画模块在渲染线程的数据 */
export interface MangaDetail extends ItemDataInDetail {
  /** 项目类别 */
  kind: ItemKind.Manga;
  /** 漫画项目类别 */
  mangaKind: MangaKind;
  /** 封面图片路径 */
  coverPath: string;
}
