/** 构建选项 */
export interface BuildConfig {
  /** 入口文件 */
  entry: string;
  /**
   * 编译模式
   *   - `'main'`主进程
   *   - `'renderer'`渲染进程
   *   - `'preload'`预加载进程
   */
  process: 'main' | 'renderer' | 'preload';
  /** 打包输出文件夹 */
  output: string;
  /** html 入口文件 */
  html?: string;
  /**
   * TS 配置文件路径
   *   - 相对于当前文件路径
   */
  tsConfigFile?: string;
}
