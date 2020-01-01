type PromiseComp<T = any> = T | Promise<T>;

/** 创建元数据时的上下文 */
export interface FromContext {
    id: number;
    path: string;
    buffer(): PromiseComp<Buffer>;
}

/** 文件数据储存数据 */
export interface BaseFileData {
    /** 项目编号 */
    id: number;
    /** 项目名称 */
    name: string;

    /** 实际文件路径 */
    filePath: string;
    /** 文件大小 - 单位：kb */
    fileSize: number;
    /** 文件最后修改的时间 */
    lastModified: number;

    /** 标签数据 */
    tags: number[];
}

/** 列表封面组件传递数据 */
export interface ListCoverProps {
    id: number;
}

/** 扩展静态接口 */
export interface Extension {
    /** 扩展名称 */
    name: string;

    /** 列表页封面组件 */
    ListCover?: (props: ListCoverProps) => JSX.Element;
    /** 详情页面组件 */
    DetailPage?: () => JSX.Element;
    /** 从真实的文件中中生成当前模块实例数据 */
    from?(context: FromContext): PromiseComp<BaseFileData | undefined>;
    /** 爬虫方法 */
    spider?(): void;
}
