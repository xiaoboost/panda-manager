/** 文件类型 */
export enum ItemKind {
  Manga,
}

/** 项目数据储存数据 */
export interface ItemData {
  /** 项目类型 */
  kind: ItemKind;
  /** 项目名称 */
  name: string;
  /** 标签数据 */
  tags: number[];
  /** 项目路径 */
  uri: string;
  /**
   * 项目大小
   *   - 单位 `kb`
   */
  fileSize: number;
  /** 文件最后修改的时间 */
  lastModified: number;
}

/** 列表基础数据 */
export interface ItemDataInList {
  id: number;
  name: string;
  size: number;
  kind: ItemKind;
}

/** 带编号的项目数据 */
export type DataWithId<Data extends ItemData> = Data & {
  /** 项目编号 */
  id: number;
};
