/** 数据库中的标签数据 */
export interface TagDataInDb {
  /** 标签名称 */
  name: string;
  /** 注释说明 */
  comment?: string;
  /** 标签别名 */
  alias?: string[];
}

/** 数据库中的标签集数据 */
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

/** 修改标签数据 */
export type PatchTagData = TagData;
/** 修改标签集数据 */
export type PatchTagGroupData = TagData;

/** 新标签参数 */
export interface NewTagData {
  /** 新标签名称 */
  name: string;
}

/** 新标签集参数 */
export type NewTagGroupData = NewTagData;

/** 删除标签参数 */
export interface DeleteTagData {
  /** 删除标签编号 */
  id: string;
}

/** 删除标签集参数 */
export type DeleteTagGroupData = DeleteTagData;

/** 移动标签 */
export interface MoveTagData {
  /** 待移动的标签编号 */
  id: number;
  /** 移动至哪个标签集 */
  to: number;
}
