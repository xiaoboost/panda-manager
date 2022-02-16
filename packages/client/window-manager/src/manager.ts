import { debounce } from '@xiao-ai/utils';
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { resolveTempDir, resolveUserDir, stat, mkdirp } from '@panda/client-utils';

import { state } from './constant';

/** 初始化配置文件夹 */
async function initDir() {
  const checkDir = async (dir: string) => {
    if (!(await stat(dir))) {
      await mkdirp(dir);
    }
  };

  return Promise.all([checkDir(resolveTempDir()), checkDir(resolveUserDir())]);
}

export async function windowStateKeeper(
  options: BrowserWindowConstructorOptions = {},
) {
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
  win.on('maximize', () => state.set({ isMaximize: true }));
  win.on('unmaximize', () => state.set({ isMaximize: false }));

  win.on('resize', debounce(() => {
    if (!win.isMaximized()) {
      const [width, height] = win.getSize();

      state.set({
        width,
        height,
      });
    }
  }));

  win.on('move', debounce(() => {
    if (!win.isMaximized()) {
      const [left, top] = win.getPosition();

      state.set({
        left,
        top,
      });
    }
  }));

  return win;
}
