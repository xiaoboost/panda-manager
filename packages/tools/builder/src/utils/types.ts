import { BuildConfig } from '../builder';

export interface PackageConfig extends Required<BuildConfig> {
  /** 包名称 */
  name: string;
  /** 包文件夹路径 */
  dirname: string;
}
