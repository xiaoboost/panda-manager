import type { ItemData, ItemDataInList } from './types';
import type { Stats } from 'fs';

/** 插件在渲染端接口 */
export interface PluginRenderer<Data extends ItemData> {
  /** 列表页面的项目封面 */
  Cover(data: Data): React.ReactNode;
}

/** 插件数据实例 */
export interface PluginClientInstance<Data extends ItemData = ItemData> {
  /** 编号 */
  id: number;
  /** 数据 */
  readonly data: Data;
  /** 创建缓存 */
  createCache(): Promise<void>;
  /** 写入缓存 */
  writeCache(): Promise<void>;
  /** 删除缓存 */
  removeCache(): Promise<void>;
  /** 在资源管理器中打开 */
  openInShell(): void;
  /** 渲染进程中列表页数据 */
  toRendererDataInList(): ItemDataInList;
  /** 渲染进程中详情页数据 */
  toRendererDataInDetail(): any;
}

/** 插件公共接口 */
export interface PluginClientConstructor<Data extends ItemData = ItemData> {
  /** 从原始文件生成 */
  createByPath(filePath: string, stat?: Stats): Promise<PluginClientInstance | undefined>;
  /** 从原始数据生成 */
  createByData(id: number, data: Data | Readonly<Data>): PluginClientInstance;
}
