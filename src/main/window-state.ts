import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

import { Model } from 'src/utils/data/model';

import { debounce } from 'src/utils/shared/func';
import { exists, mkdirp } from 'src/utils/node/file-system';
import { resolveUserDir, resolveTempDir } from 'src/utils/node/env';

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

/** 初始化窗口状态 */
const initState: WindowState = {
    width: 800,
    height: 600,
    left: undefined,
    top: undefined,
    isMaximize: false,
};

/** 当前窗口状态 */
const state = new Model<WindowState>(initState, resolveUserDir('window-state'));

/** 初始化配置文件夹 */
async function initDir() {
    const checkDir = async (dir: string) => {
        if (!(await exists(dir))) {
            await mkdirp(dir);
        }
    };

    return Promise.all([
        checkDir(resolveTempDir()),
        checkDir(resolveUserDir()),
    ]);
}

export async function windowStateKeeper(options: BrowserWindowConstructorOptions = {}) {
    // 等待配置文件夹初始化
    await initDir();

    // 配置初始化
    await state.ready;

    // 合并输入配置
    state.fill({
        isMaximize: false,
        height: options.height || 600,
        width: options.width || 800,
        top: options.y,
        left: options.x,
    });

    // 最大化
    if (state.data.isMaximize) {
        options.center = true;
    }
    else {
        options.width = state.data.width;
        options.height = state.data.height;
        options.x = state.data.left;
        options.y = state.data.top;
    }

    const win = new BrowserWindow(options);

    if (state.data.isMaximize) {
        win.maximize();
    }

    win.on('close', () => state.write());

    win.on('maximize', () => (state.data.isMaximize = true));
    win.on('unmaximize', () => (state.data.isMaximize = false));

    win.on('resize', debounce(() => {
        if (!win.isMaximized()) {
            const [width, height] = win.getSize();

            state.data.width = width;
            state.data.height = height;
        }
    }));

    win.on('move', debounce(() => {
        if (!win.isMaximized()) {
            const [left, top] = win.getPosition();

            state.data.left = left;
            state.data.top = top;
        }
    }));

    return win;
}
