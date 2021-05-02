# panda/bundler

代码打包工具

## 安装

```shell
pnpm install @panda/bundler -D
```

## 使用

在项目根目录放置名为`build.config.(t|j)s`文件，默认导出配置。样例：  
```typescript
import { BuildOptions, ConfigContext } from '@panda/bundler';

export default ({ env }: ConfigContext): BuildOptions => ({
  entryPoints: ['./src/index.ts'],
  outfile: 'dist/index.js',
  platform: 'node',
  external: [env.isDevelopment ? 'react' : undefined],
});
```

然后再在命令行里输入以下指令即可。

```shell
# 生产模式
bundle --production

# 调试模式
bundle --development

# 调试监听模式
bundle --development --watch
```
