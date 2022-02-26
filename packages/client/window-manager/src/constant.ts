import { Model } from '@panda/db';
import { resolveUserDir } from '@panda/client-utils';

/** 全局配置文件基础接口 */
export interface WindowState {
  /** 是否是最大化 */
  isMaximize: boolean;
  /** 上次关闭时主窗口的高度 */
  height: number;
  /** 上次关闭时主窗口的宽度 */
  width: number;
  /** 上次关闭时主窗口距离桌面左边的距离 */
  left?: number;
  /** 上次关闭时主窗口距离桌面顶端的距离 */
  top?: number;
}

/** 初始化窗口状态 */
export const initState: WindowState = {
  width: 800,
  height: 600,
  left: undefined,
  top: undefined,
  isMaximize: false,
};

/** 当前窗口状态 */
export const state = new Model<WindowState>(initState, resolveUserDir('window-state'));
