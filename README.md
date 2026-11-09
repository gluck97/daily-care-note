# 每日记录

中文每日情况点选表单，包含饮食、排便、身体感受、测量值和选填补充。所有图标、样式和脚本内嵌为一个 HTML 文件，支持手机使用。

使用网页：[每日记录](https://gluck97.github.io/daily-care-note/)。可以复制这个链接，通过微信发送。

这个仓库仅用于公开空白表单。填写后由本人复制简报或使用系统分享发送给家属；页面不自动上传填写内容。网页不会自动保存或汇总家属收到的记录。

## 本地构建

安装 Node.js 24 后，在本目录运行：

```sh
node build.mjs
```

无需安装 npm 依赖。生成 `dist/index.html`，可用浏览器打开。修改源文件后重新构建。

## GitHub Pages 发布

1. 将本目录作为独立 GitHub 仓库，建议仓库名为 `daily-care-note`，默认分支为 `main`。不要上传其上级的生活照护文件夹。免费 GitHub 账号使用公开仓库发布 Pages；公开仓库的源码也会公开。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
3. 在 **Actions → Publish daily record → Run workflow** 运行一次。以后每次推送到 `main`，工作流会自动重新构建和发布。
4. 等待 `build` 和 `deploy` 成功，以 **Settings → Pages** 显示的网址为准。普通项目网址形式为 `https://你的用户名.github.io/daily-care-note/`，不需要购买域名。

发布配置位于 `.github/workflows/pages.yml`，只上传 `dist/`。源码仓库内不应存放病历、填写结果、家属记录或个人密钥。发布使用 GitHub Actions 内置权限，不需要填写个人访问令牌。

GitHub Pages 适合托管这类静态页面，但不能据此保证国内网络或微信的可达性。发布后须用国内手机网络和微信实测打开、点选、复制简报和接收结果。

## 文件

- `src/`：表单、字段、交互和图标原始文件。
- `build.mjs`：将源文件构建为一个 HTML。
- `.github/workflows/pages.yml`：自动构建和发布。
- `dist/`：构建输出，可由工作流重新生成。

表单和接收端需要使用兼容的字段定义与记录格式；修改记录字段时应同步维护本地接收端。换网址不会自动迁移旧浏览器中保存的资料。

依据：[GitHub Pages 说明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[配置发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。配置核对日期：2026-11-09。
