/** 编译选项 */
export interface CommandOptions {
  outDir: string;
  mode: string;
  watch: boolean;
  bundleAnalyze: boolean;
}

/** 打包选项 */
export interface PackageOptions {
  input: string;
  output: string;
}
