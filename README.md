# Panda Manager

用来管理**本地**漫画库存的软件，**目前**只支持`Windows`。

## 界面

![cover](https://user-images.githubusercontent.com/7752883/87851761-7bbec580-c92e-11ea-83cc-52c986d9e17f.jpg)

## 路线图

- [ ] 标签管理
- [ ] 标签爬虫
- [ ] 漫画详情
- [ ] 漫画体积压缩

## 注意事项

### 大文件储存服务

由于源码中含有中文字体等大文件，所以本仓库使用了 [LFS](https://git-lfs.github.com/) 功能，在拉取代码的时候，就需要事先安装`git-lfs`。

### 安装 LFS 服务

对于 Windows 用户，可以直接去[官网下载页](https://github.com/git-lfs/git-lfs/releases/tag/v3.1.2)下载安装即可。

对于 Mac 用户，可以使用`brew`安装——

```bash
brew install git-lfs
```

安装完成之后，再运行此命令将其和`git`连接起来：

```bash
git lfs install
```

#### 代理服务

如果你的网络情况不需要翻墙，可以无视这一节。

由于`LFS`的服务器在墙外，所以就必须要翻墙，你可以选择在全局设置代理服务器，不过个人推荐只设置`git`服务。

设置代理服务

```bash
git config --global http.proxy http://127.0.0.1:[本地端口号]
git config --global https.proxy https://127.0.0.1:[本地端口号]
```

清除代理服务

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## BUG 反馈

[新问题](https://github.com/xiaoboost/panda-manager/issues/new)

## 技术支持

- [Electron](https://github.com/electron/electron)
- [React](https://github.com/facebook/react)
- [Ant Design](https://github.com/ant-design/ant-design)
- [Jimp](https://github.com/oliver-moran/jimp)
- [JSZip](https://github.com/Stuk/jszip)
