# AGENTS.md

本仓库是 Hexo 个人博客「幻煞幽穹」（作者：夏侯仪）。本文件给 AI 编码助手（pi / Claude 等）提供项目约定，请遵守。

## 项目概览

- **框架**：Hexo 8（`package.json` 中 `hexo.version` 标注 8.1.2，依赖 `hexo@^8.1.2`，要求 Node 20+）
- **主题**：NexT，以 git submodule 引入（`themes/next` → `theme-next/hexo-theme-next`）
- **站点语言**：zh-CN，时区 Asia/Shanghai
- **源分支**：`main`（默认分支，所有写作在此进行；旧源分支 `blog-source` 已合并进 `main`）
- **部署**：推送到 `main` 后由 GitHub Actions（`.github/workflows/pages.yml`）自动构建并发布到 GitHub Pages。CI 用 Node 24 LTS + Actions v5（基于 Node 24 runtime），依赖通过 `npm ci` 严格按 `package-lock.json` 安装
- **旧链路**：`.travis.yml`、`_config.yml` 的 `deploy: git` 段为历史遗留，新提交不要再依赖

## 常用命令

```bash
# 安装依赖（首次或拉取新依赖后）
npm install

# 本地预览（默认 http://localhost:4000）
hexo s

# 生成静态文件到 public/
hexo clean && hexo g

# 新建文章（用 scaffolds/post.md 模板）
hexo new "标题"

# 新建草稿 / 页面
hexo new draft "标题"
hexo new page about
```

> `package.json` 的 `scripts` 字段：`build` = `hexo clean && hexo g`，`generate` = `hexo g`，`server` = `hexo s`，`clean` = `hexo clean`，`deploy` = `hexo d`。CI 的 `npm run build` 实际调用这些脚本。

## 目录结构

```
_config.yml              # Hexo 主配置
.npmrc                   # 固定公网 npm registry（勿改，见下文说明）
scaffolds/               # 文章模板（post.md / draft.md / page.md）
source/
  _posts/                # 所有文章（核心写作目录）
    ai/ ops/ Java/ ...   # 按分类建子目录，目录名大致对应 categories
    xxx.md              # 也有不少文章直接平铺在 _posts 根下
  _data/                # NexT 主题数据文件（next.yml 覆盖主题配置）
  uploads/              # 全局图片资源（头像、打赏图等）
  about/ categories/ tags/ 404.html   # 站点页面
themes/next/            # 主题（submodule，勿直接改其内部文件）
.github/workflows/pages.yml   # CI/CD（Node 24 + Actions v5）
.travis.yml             # 已废弃（待清理）
```

## 文章约定（重要）

### Front-matter

`source/_posts/` 下的文章统一用如下 front-matter（参考 `scaffolds/post.md`）：

```yaml
---
title: 文章标题
date: 2025-01-01            # 也可带时间 2025-01-01 14:30
categories:
- 分类名                     # 建议与所在子目录名一致
tags:
- 标签1
- 标签2
---

这里是摘要，会显示在首页列表。
<!--more-->

正文从这里开始……
```

### 约定要点

- **摘要分隔符**：每篇文章必须在开头写一两句摘要，紧跟 `<!--more-->`，首页只展示分隔符之前的内容。
- **字段名**：用复数 `tags` / `categories`（仓库历史中部分老文章用了 `tag:` 单数，属于不规范，新建/修改文章时统一改成 `tags`）。
- **日期**：permalink 是 `:year/:month/:day/:title/`，日期影响 URL，发布后不要随意改动。
- **文件名**：支持中文文件名；放子目录还是根目录都行，但同一分类建议集中在对应子目录下。
- **图片**：站级图片放 `source/uploads/`；单篇文章的图片可开启 `post_asset_folder`（`_config.yml` 已设为 `true`），用与文章同名的目录引用相对路径。

## 写作 / 修改流程

1. 在 `source/_posts/` 下新建或编辑 `.md`，遵守上面的 front-matter。
2. 本地 `hexo s` 预览确认效果。
3. `git add` → `git commit` → 推送到 `main`。
4. GitHub Actions 自动构建并部署，无需手动 `hexo d`，也不要手动提交 `public/`（已在 `.gitignore` 中）。

## 禁止事项

- ❌ 不要直接修改 `themes/next/` 内部文件（它是 submodule，指向上游仓库）。主题定制请在 `_config.yml` 的主题段、`source/_data/`、或 NexT 支持的自定义注入点完成。
- ❌ 不要提交 `public/`、`db.json`、`node_modules/`（见 `.gitignore`）。
- ❌ 不要向 `master` / `blog-source` 分支推送，写作只在 `main`。
- ❌ 不要删除或改写已有文章的 `date`，会改变线上 URL 导致死链。
- ❌ 不要修改 `.npmrc` 的 `registry` 配置。此项目固定用公网 `registry.npmjs.org`，防止本地内网镜像源被写入 `package-lock.json` 导致公网 CI（GitHub Actions）无法访问。本地如需用内网镜像源加速下载，用 `npm install --registry=...` 临时覆盖，勿写入仓库文件。
- ❌ 不要重新引入 `hexo-related-popular-posts`。该插件已停止维护，其传递依赖 `ga-analytics`（2014）→ `googleapis@1` → `buffer-equal-constant-time` 在 Node 22+ 会因 `SlowBuffer` 被移除而崩溃。相关文章功能已在 `source/_data/next.yml` 中关闭（`related_posts.enable: false`）。

## 其它

- **依赖更新由 Dependabot 提 PR**（见 `dependabot/*` 分支），合并前确认 `hexo g` 能正常生成。
- **主题升级**：在 `themes/next` 内 `git pull` 上游后，回到仓库根目录提交 submodule 指针变更。
- **本地 Node 版本兼容**：CI 用 Node 24。本地若用 Node 22+（SlowBuffer 已移除），勿引入会因 `SlowBuffer` 崩溃的依赖（如前述 `hexo-related-popular-posts` 的传递依赖链）。本地 Node 20 则无此问题。
- **GitHub Pages 部署设置**：仓库 Settings → Pages → Source 需设为 "GitHub Actions"，Settings → Branches → Default branch 需设为 `main`。
