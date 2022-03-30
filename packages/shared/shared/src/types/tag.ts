/** 标签基础数据 */
interface BaseTagData {
  /** 标签名称 */
  name: string;
  /** 注释说明 */
  comment?: string;
  /** 标签别名 */
  alias?: string[];
}

/** 数据库中的标签数据 */
export interface TagDataInDb extends BaseTagData {
  /** 标签所属的标签集编号 */
  groupId: number;
}

/** 数据库中的标签集数据 */
export interface TagGroupDataInDb extends BaseTagData {
  // ..
}

/** 标签数据 */
export interface TagData extends BaseTagData {
  /** 标签编号 */
  id: number;
  /** 标签所属的标签集编号 */
  groupId: number;
}

/** 标签集数据 */
export interface TagGroupData extends BaseTagData {
  /** 标签编号 */
  id: number;
  /** 包含的标签 */
  tags: TagData[];
}

type RequiredPart<T extends object, K extends keyof T> = Partial<Omit<T, Extract<keyof T, K>>> & {
  [Key in K]: NonNullable<T[Key]>;
};

/** 修改标签数据 */
export type PatchTagData = RequiredPart<TagData, 'id'>;
/** 修改标签集数据 */
export type PatchTagGroupData = RequiredPart<TagGroupDataInDb & { id: number }, 'id'>;

/** 新标签参数 */
export interface NewTagData {
  /** 新标签名称 */
  name: string;
  /** 该标签属于哪个标签集 */
  groupId: number;
}

/** 新标签集参数 */
export interface NewTagGroupData {
  /** 新标签集名称 */
  name: string;
}

/** 删除标签参数 */
export interface DeleteTagData {
  /** 删除标签编号 */
  id: number;
}

/** 删除标签集参数 */
export type DeleteTagGroupData = DeleteTagData;

/** 移动标签 */
export interface MoveTagData {
  /** 待移动的标签编号 */
  id: number;
  /** 移动至哪个标签集 */
  toGroup: number;
}

/** 变更元数据的需求数据 */
export interface PatchTagMetaData {
  /** 编号 */
  id: number;
}
