type PromiseComp<T = any> = T | Promise<T>;

/** 创建元数据时的上下文 */
export interface FromContext {
    id: number;
    path: string;
    buffer(): PromiseComp<Buffer>;
}

/** 模块类型 */
export const enum ModuleType {
    Manga,
}

/** 模块类储存数据 */
export interface BaseModuleData {
    /** 模块类型 */
    type: ModuleType;

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

export interface ListCoverProps {
    id: number;
}

/** 模块静态接口 */
export interface Module {
    /** 模块类型 */
    type: ModuleType;

    /** 列表页封面组件 */
    ListCover: (props: ListCoverProps) => JSX.Element;
    /** 详情页面组件 */
    DetailPage: () => JSX.Element;

    /** 从真实的文件中中生成当前模块实例数据 */
    from(context: FromContext): PromiseComp<BaseModuleData | undefined>;
    /** 模块安装 */
    install(): void;
}

/** 传递给模块上下文 */
export interface InstallContext {
    metaDir(id: number): string;
    tempDir(id: number): string;
}

/** 组件暴露的回调 */
export interface ModuleOption {
    /** 模块本身 */
    module: Module;

    /** 加载模块 */
    install?(context: InstallContext): void;
    /** 使能模块 */
    enabel?(): void;
    /** 禁用模块 */
    disable?(): void;
}
