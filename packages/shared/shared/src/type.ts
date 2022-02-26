/** 文件类型 */
export enum FileKind {
  Manga,
}

/** 排序方式 */
export enum SortBy {
  name,
  lastModified,
  size,
}

/** 排序选项 */
export interface SortOption {
  by: SortBy;
  asc: boolean;
}

/** 参数选项 */
export interface SettingData {
  directories: string[];
  sort: SortOption;
}

/** 标签基础数据 */
export interface TagData {
  /** 编号 */
  id: number;
  /** 标签名称 */
  name: string;
  /** 注释说明 */
  comment: string;
  /** 标签别名 */
  alias: string[];
}

/** 标签集数据 */
export interface TagGroupData extends TagData {
  /** 包含的标签编号 */
  tags: number[];
}

/** 文件数据储存数据 */
export interface BaseFileData {
  /** 项目编号 */
  id: number;
  /** 项目类型 */
  kind: FileKind;
  /** 项目名称 */
  name: string;
  /** 标签数据 */
  tags: number[];
  /** 原始文件 */
  file: {
    /** 文件路径 */
    path: string;
    /** 是否是压缩包 */
    isZip: boolean;
    /**
     * 文件大小
     *   - 单位 `kb`
     */
    size: number;
    /** 文件最后修改的时间 */
    lastModified: number;
  };
}
