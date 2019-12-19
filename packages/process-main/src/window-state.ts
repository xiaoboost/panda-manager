import { resolveUserDir, debounce } from '@utils/shared';
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

import * as fs from 'fs-extra';

const fileName = 'window-state.json';
const filePath = resolveUserDir(fileName);

/** 全局配置文件基础接口 */
interface WindowState {
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

/** 当前窗口状态缓存 */
const state: WindowState = {
    width: 800,
    height: 600,
    left: undefined,
    top: undefined,
    isMaximize: false,
};

/** 保存配置 */
function writeState(opt: Partial<WindowState> = {}) {
    Object.assign(state, {
        ...state,
        ...opt,
    });

    fs.writeJSON(filePath, state);
}

export async function windowStateKeeper(options: BrowserWindowConstructorOptions = {}) {
    const config: WindowState = await fs.readJSON(filePath).catch(() => ({
        isMaximize: false,
        height: options.height,
        width: options.width,
        top: options.y,
        left: options.x,
    }));

    Object.assign(state, config);

    // 最大化
    if (config.isMaximize) {
        options.center = true;
        options.show = false;
    }
    else {
        options.width = config.width;
        options.height = config.height;
        options.x = config.left;
        options.y = config.top;
    }

    const win = new BrowserWindow(options);

    if (config.isMaximize) {
        win.maximize();
    }

    win.on('close', () => writeState());

    win.on('maximize', () => writeState({
        isMaximize: true,
    }));

    win.on('unmaximize', () => writeState({
        isMaximize: false,
    }));

    win.on('resize', debounce(() => {
        if (!win.isMaximized()) {
            const [width, height] = win.getSize();
            writeState({ width, height });
        }
    }));

    win.on('move', debounce(() => {
        if (!win.isMaximized()) {
            const [left, top] = win.getPosition();
            writeState({ left, top });
        }
    }));

    return win;
}
