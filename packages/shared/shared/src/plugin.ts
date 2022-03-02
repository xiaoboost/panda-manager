import type { ItemData } from './type';
import type { Stats } from 'fs';
import type { DeepReadonly } from '@xiao-ai/utils';

/** 插件在渲染端接口 */
export interface PluginRenderer<Data extends ItemData> {
  /** 列表页面的项目封面 */
  Cover(data: Data): React.ReactNode;
}

/** 插件数据实例 */
export interface PluginClientInstance<Data extends ItemData = ItemData> {
  /** 数据 */
  readonly data: Data;
  /** 写入缓存 */
  writeCache(): Promise<void>;
  /** 删除缓存 */
  removeCache(): Promise<void>;
  /** 在资源管理器中打开 */
  openInShell(): void;
  /** 生成渲染进程需要的数据 */
  toRendererData(): any;
}

/** 插件公共接口 */
export interface PluginClientConstructor<Data extends ItemData = ItemData> {
  /** 从原始文件生成 */
  createByPath(filePath: string, stat?: Stats): Promise<PluginClientInstance | undefined>;
  /** 从原始数据生成 */
  createByData(id: number, data: Data | DeepReadonly<Data>): PluginClientInstance;
}
