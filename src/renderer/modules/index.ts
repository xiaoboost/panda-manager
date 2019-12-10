import { default as Manga } from './manga';

import { toMap } from 'utils/shared';
import { warn } from 'renderer/lib/print';

type Component = () => JSX.Element;
type PromiseComp<T = any> = T | Promise<T>;

// /** 模块类实例数据接口 */
// export interface ModuleInstance {
//     /** 文件编号 */
//     id: number;
//     /** 文件名称 - 默认为实际的文件名称，但是可以和实际文件名称不同 */
//     name: string;

//     /** 实际文件路径 */
//     filePath: string;
//     /** 文件大小 - 单位：kb */
//     fileSize: number;

//     /** 元数据存放的路径 */
//     metaDir: string;
//     /** 临时文件存放路径 */
//     tempDir: string;

//     /** 生成元数据 */
//     createMeta(): void;
// }

// /** 模块类静态接口 */
// export interface ModuleStatic {
//     /** 判断当前路径所示真实文件是否可以用于当前模块 */
//     testFile(path: string): PromiseComp<boolean>;
//     /** 测试当前路径所示的元数据否可以用于当前模块 */
//     testMeta(path: string): PromiseComp<boolean>;

//     /** 从真实的文件中中生成当前模块实例数据 */
//     fromFile(path: string): PromiseComp<object>;
//     /** 从元数据中生成当前模块实例数据 */
//     fromMeta(path: string): PromiseComp<object>;

//     /** 列表页封面组件 */
//     ListCover: Component;
//     /** 详情页面组件 */
//     DetailPage: Component;

//     /** 类接口 */
//     new (): ModuleInstance;
// }

/** 模块类型 */
export const enum ModuleType {
    Manga,
}

/** 数据库中存储数据 */
export interface ModuleBaseData {
    /** 模块类型 */
    type: ModuleType;
    /** 文件名称 - 默认为实际的文件名称，但是可以和实际文件名称不同 */
    name: string;
    /** 实际文件路径 */
    file: string;
    /** 标签数据 */
    tags: number[]
    /** 文件最后修改的时间 */
    lastModified: number;
}

/** 模块公共接口 */
export interface Module {
    /** 模块类型 */
    type: ModuleType;

    /** 列表页封面组件 */
    ListCover: Component;
    /** 详情页面组件 */
    DetailPage: Component;

    /** 判断当前路径所示真实文件是否可以用于当前模块 */
    test(path: string): PromiseComp<boolean>;
    /** 从真实的文件中中生成当前模块实例数据 */
    from(path: string): PromiseComp<ModuleBaseData>;
    /** 删除当前模块实例的元数据 */
    remove(): PromiseComp<void>;
}

/** 模块模板数据 */
const modules = [Manga];
/** 模块类型索引 */
const modulesMap = toMap(modules, (target) => target.type);

/** 创建文件元数据 */
export async function createMeta(path: string) {
    try {
        let target: Module | undefined;

        // 搜索符合条件的模块
        for (let i = 0; i < modules.length; i++) {
            if (await modules[i].test(path)) {
                target = modules[i];
                break;
            }
        }

        // 没有则直接退出
        if (!target) {
            return;
        }

        return await target.from(path);
    }
    catch (e) {
        warn(e, true);
        return;
    }
}

/** 由类型获得模块 */
export function getModule(type: ModuleType) {
    return modulesMap[type];
}

export default modules;
