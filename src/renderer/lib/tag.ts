/** 标签数据 */
export interface TagData {
    /** 标签编号 */
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
    tags: TagData[];
}

/** 全局标签编号 */
let tagId  = 0;
/** 全局标签集编号 */
let groupId  = 0;

/** 标签类 */
export class Tag implements TagData {
    id: number;
    name: string;
    comment: string;
    alias: string[];

    constructor({
        id = tagId++,
        name = '',
        comment = '',
        alias = [],
    }: Partial<TagData> = {}) {
        this.id = id;
        this.name = name;
        this.comment = comment;
        this.alias = alias;

        // 全局编号重置
        if (id >= tagId) {
            tagId = this.id + 1;
        }
    }
}

/** 标签类 */
export class TagGroup implements TagGroupData {
    id: number;
    name: string;
    comment: string;
    tags: Tag[];
    alias: string[];

    constructor({
        id = groupId++,
        name = '',
        comment = '',
        tags = [],
        alias = [],
    }: Partial<TagGroupData> = {}) {
        this.id = id;
        this.name = name;
        this.comment = comment;
        this.alias = alias;

        this.tags = tags.map((item) => new Tag(item));

        // 全局编号重置
        if (id >= groupId) {
            groupId = this.id + 1;
        }
    }
}
