/**
 * 标签数据
 *   - 存在数据库中
 */
export interface TagDataInDb {
  /** 标签名称 */
  name: string;
  /** 注释说明 */
  comment: string;
  /** 标签别名 */
  alias: string[];
}

/**
 * 标签集数据
 *   - 存在数据库中
 */
export interface TagGroupDataInDb extends TagDataInDb {
  /** 包含的标签编号 */
  tags: number[];
}

/** 标签数据 */
export interface TagData extends TagDataInDb {
  /** 标签编号 */
  id: number;
}

/** 标签集数据 */
export interface TagGroupData extends TagDataInDb {
  /** 标签编号 */
  id: number;
  /** 包含的标签 */
  tags: TagData[];
}

/** 标签种类 */
export enum TagKind {
  /** 标签 */
  Tag,
  /** 标签集 */
  Group,
}

/** 修改标签数据 */
export interface PatchTagData extends TagDataInDb {
  /** 标签编号 */
  id: number;
  /** 标签种类 */
  kind: TagKind;
  /** 包含的标签编号 */
  tags?: number[];
}

/** 新标签数据 */
export interface NewTagData {
  /** 标签种类 */
  kind: TagKind;
  /** 新标签名称 */
  name: string;
}
