import { ItemData } from './type';

import type { Stats } from 'fs';

/** 插件在服务端接口 */
export interface PluginClient<Data extends ItemData, Cache> {
  /**
   * 从路径生成数据
   *   - 返回`undefined`时表示此路径不是当前插件处理
   */
  getDataByPath(
    filePath: string,
    fileStat?: Stats,
  ): Promise<[Data, Cache] | undefined>;

  /** 将缓存写入硬盘 */
  writeCacheToDisk?(data: Data, cache?: Cache): Promise<void>;
  /** 将缓存从硬盘中删除 */
  removeCacheFromDisk?(data: Data): Promise<void>;
  /** 打开项目 */
  openItem(data: Data): Promise<void>;
}

/** 插件在渲染端接口 */
export interface PluginRenderer<Data extends ItemData> {
  /** 列表页面的项目封面 */
  Cover(data: Data): React.ReactNode;
}
