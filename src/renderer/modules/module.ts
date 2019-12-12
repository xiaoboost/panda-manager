import { uid, resolveUserDir, resolveTempDir } from 'utils/shared';

type Component = () => JSX.Element;
type PromiseComp<T = any> = T | Promise<T>;

/** 创建元数据时的上下文 */
export interface FromContext {
    file: string;
    buffer(): PromiseComp<Buffer>;
}

/** 模块类型 */
export const enum ModuleType {
    Manga,
}

/** 模块基类 */
export abstract class BaseModule {
    id: number;

    constructor(id = uid()) {
        this.id = id;
    }

    get metaDir() {
        return resolveUserDir('metas', this.id);
    }
    get tempDir() {
        return resolveTempDir(this.id);
    }
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

/** 模块类实例数据接口 */
export interface ModuleInstance extends BaseModuleData {
    /** 元数据存放的路径 */
    metaDir: string;
    /** 临时文件存放路径 */
    tempDir: string;
}

/** 模块类静态接口 */
export interface ModuleStatic {
    /** 模块类型 */
    type: ModuleType;

    /** 从真实的文件中中生成当前模块实例数据 */
    from(context: FromContext): PromiseComp<BaseModuleData>;

    /** 列表页封面组件 */
    ListCover: Component;
    /** 详情页面组件 */
    DetailPage: Component;

    /** 类接口 */
    new (): ModuleInstance;
}