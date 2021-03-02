# panda/builder

代码打包工具

## 安装
```shell
pnpm install @panda/builder -D
```

## 使用

在项目根目录放置名为`build.config.(t|j)s`文件，默认导出配置。样例：  
```typescript
import { BuildOptions, ConfigContext } from '@panda/build';

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
build --production

# 调试模式
build --development

# 监听
build --watch
```
