import { BrowserWindow, WebContents } from 'electron';
import * as directories from './directories';

/** 主界面通信事件接口 */
export interface IpcMainEvent {
    returnValue: any;
    sender: WebContents;
}

/** 为主界面安装通信事件 */
export function install(win: BrowserWindow | null) {
    directories.install(win);
}

/** 为主界面卸载通信事件 */
export function uninstall() {
    directories.uninstall();
}
