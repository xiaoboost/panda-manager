/** 标签数据 */
export interface TagData {
    /** 标签编号 */
    id: number;
    /** 标签名称 */
    name: string;
    /** 标签别名 */
    alias: string[];
}

/** 标签集数据 */
export interface TagGroupData extends TagData {
    /** 包含的标签编号 */
    tags: TagData[];
}

/** 全局标签编号 */
let tagId  = 0;
/** 全局标签集编号 */
let groupId  = 0;

/** 标签类 */
export class Tag implements TagData {
    /** 标签编号 */
    id = tagId++;
    /** 标签名称 */
    name = '';
    /** 标签别名 */
    alias: string[] = [];

    /** 从标签数据生成标签 */
    static from(data: TagData) {
        const tag = Object.assign(new Tag(), data) as Tag;

        // 全局编号重置
        if (data.id >= tagId) {
            tagId = data.id + 1;
        }

        return tag;
    }
}

/** 标签类 */
export class TagGroup implements TagGroupData {
    /** 标签编号 */
    id = groupId++;
    /** 标签集名称 */
    name = '';
    /** 标签集包含的标签 */
    tags: Tag[] = [];
    /** 标签集别名 */
    alias: string[] = [];

    /** 从标签数据生成标签 */
    static from(data: TagGroupData) {
        const group = Object.assign(new TagGroup(), data) as TagGroup;

        group.tags = data.tags.map(Tag.from);

        // 全局编号重置
        if (data.id >= groupId) {
            groupId = data.id + 1;
        }

        return group;
    }
}
