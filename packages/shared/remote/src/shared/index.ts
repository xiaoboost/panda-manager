import { BrowserWindow } from 'electron';

export const RemoteEventName = '_remote_event';
export const ListenerEventName = '_listener_event';

/** 远程返回事件 */
export interface RemoteReplyEvent {
  /** 返回值 */
  returnValue: any;
  /** 调用属性是否是函数 */
  isPropertyFunction: boolean;
  /** 属性是函数时，此函数是否被调用 */
  isCalled: boolean;
}

/** 远程事件 */
export interface RemoteToEvent {
  /** 属性名称 */
  key: string;
  /** 调用方法参数 */
  params?: any[];
  /** 是事件监听 */
  isEventListener: boolean;
  /** 如果是函数，则调用 */
  callFunction: boolean;
  /** 忽略返回 */
  ignoreReturn: boolean;
}

/** 远程监听事件 */
export interface ListenerEvent {
  /** 事件名称 */
  name: string;
  /** 事件参数 */
  params: any[]
}

type EventMethodKey =
  | 'on'
  | 'once'
  | 'off'
  | 'addListener'
  | 'removeListener'
  | 'removeAllListeners';

export const EventMethodKey = [
  'on',
  'once',
  'off',
  'addListener',
  'removeListener',
  'removeAllListeners',
];

/**
 * 窗口控制器
 *   - @link https://www.electronjs.org/zh/docs/latest/api/browser-window
 */
export type RemoteWindow =
  | Omit<BrowserWindow, 'webContents' | EventMethodKey>
  & {
    [Key in EventMethodKey]: (name: string, ...params: any[]) => void;
  };
