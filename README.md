# 科研图库 · chang-figcollection

以整幅 Figure 为单位收藏论文图形和研究笔记。React + Vite + TypeScript + Tailwind CSS。

## 在线浏览

发布成功后：https://friendszc.github.io/chang-figcollection/

GitHub Pages 版本支持搜索、筛选、详情、同篇论文图形跳转和 JSON 导出，仅供浏览。任何人可查看，只有仓库获授权的维护者能发布更新。

## 本机维护

安装 Node.js 24，执行 npm install 与 npm run dev，或依赖安装后双击 start.cmd。新增、编辑、删除直接写入 src/figures.json。

维护后提交 src/figures.json 和有权使用的 public/images 图片到 main 分支，Actions 自动重新发布。本机保存不等于已发布，可请助手辅助提交。

## 首次部署

在 Settings → Pages → Build and deployment → Source 选择 GitHub Actions。之后在 Actions 中运行 Publish research figure library，或向 main 提交修改。

## 数据

复制 src/figures.json 中的对象，使用唯一 id。每条对应 Fig. 5 等整幅 Figure，面板说明写入 composition。directions 可填农业、interface，或同时填写；types 为图形类型数组；tags 为自由标签。question、learning、transfer、boundaries、notes 保存研究笔记。

同篇论文按 DOI 优先关联，没有 DOI 时用规范化标题。previewUrl 留空显示占位；可使用允许外链的 https 图片，或把有权使用的整幅图片放入 public/images 并填 /images/文件名。当前两条示例不含出版社原图。

仓库与笔记均公开，请勿提交私密材料、密码或令牌。此版没有云端编辑接口，不依赖 ChatGPT 登录或 Sites 数据库。

## 构建

npm run build:pages 输出 dist-pages；npm run preview:pages 本地预览。
