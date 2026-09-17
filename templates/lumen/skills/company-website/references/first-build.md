# 首次客户建站执行手册

本手册从模板已经复制为独立客户项目开始。默认目标是一个已验证并 Push 到客户私有仓库的桌面端 MVP；部署、域名、后台、CMS、数据库、在线表单和移动端专项适配不在默认范围。

## 1. 完成定义

只有同时满足以下条件，才可称为首次建站完成：

- P0 全部由用户或获准公开的资料确认，Agent 推断没有被写成确认事实；
- 资料冲突已由用户确认，或相关内容已从公开页面省略；
- 演示公司、产品、素材和联系方式已移除；
- `npm run verify` 真实退出码为 0；
- 桌面端页面、导航、图片和浏览器控制台已实际检查；
- 客户 `origin` 指向独立客户仓库；
- Commit 已 Push，`npm run verify:handoff` 确认远端分支与本地 HEAD 一致；
- 最终回复准确报告路径、远端、提交、验证范围和缺口。

只有用户明确要求“仅本地生成”时，才可省略远端与 Push；此时结果必须称为本地草稿，不能称为仓库交付完成。

## 2. 最小读取范围

开始前读取：

1. `AGENTS.md`；
2. `skills/company-website/SKILL.md`；
3. `site.config.ts`；
4. `src/data/company.json`；
5. `src/content.config.ts`；
6. `src/content/products/*.md`；
7. `notes/requirements.md`；
8. `notes/content-gaps.md`；
9. `git status --short`、当前分支和 `git remote -v`。

不要为了“理解模板”遍历读取 `src/pages/`、`src/components/`、构建脚本或所有样式。模板已经提供完整页面代码。只有用户要求改变布局、内容契约无法表达需求，或验证发现具体缺陷时，才读取并修改对应文件；修改共享组件时再检查其调用位置。

## 3. P0 与构建状态

必须能够区分：

- 用户在当前任务中明确确认的事实；
- 获准公开资料直接记载的事实；
- Agent 推断；
- 缺失或冲突事实。

P0 包括公司公开名称、目标客户、至少一项真实业务、网站语言、公开联系方式、文字和媒体授权范围，以及会影响公开内容的事实冲突。P0 未清时停止内容实现，保持：

```ts
siteMode: "local"
contentStatus: "draft"
```

`contentStatus: "ready"` 只表示公开内容已经确认且普通验证和范围内视觉检查通过，不表示已经部署。

## 4. 事实和素材

数字、资质、奖项、地址、联系方式、客户 Logo 和项目图片都必须能追溯到用户确认或获准公开的资料。多个位置出现不同数字时，不自行选择；向用户确认，或省略该数字并记录到 `notes/content-gaps.md`。

原始文件留在 `materials/`，网站只使用放入以下目录的授权版本：

```text
public/media/company/
public/media/products/
public/media/projects/
```

大 PDF 优先批量提取文本和内嵌图片，并生成缩略联系表后一次选择素材。禁止逐页反复渲染和逐张调用视觉分析。只有缺少文本层或无法提取原图的候选页才单独渲染。必须检查：

- 残留页码、标题、数字标签和底部残字；
- 画册版式、半透明覆盖、裁切残片和白底横条；
- 二维码、私人联系方式和未授权客户 Logo；
- 清晰度、比例、裁切和页面语义。

画册裁图可作为明确记录的 MVP 降级方案，但不能称为高质量原图。优先请求客户提供 Logo 源文件和项目原片。

## 5. 快速实现路径

按以下顺序工作：

1. `site.config.ts`：语言、导航、local/draft；
2. `src/data/company.json`：唯一的公司信息和联系方式来源；
3. 删除演示 Markdown，建立真实产品、业务或案例条目；
4. 将选定的授权素材放入 `public/media/`；
5. 在 `src/styles/theme.css` 修改品牌 token；
6. 运行普通验证；
7. 只有存在具体布局需求或验证缺陷时，修改相关页面或组件；
8. 完成 SEO、404 和演示内容搜索。

不要默认重写 Header、Footer、Button、Card 或全部页面。不要为了单个客户重建模板架构。

公司名、介绍、邮箱、电话、地址和社媒不得在多个组件中重复硬编码。空字段对应区块必须隐藏。案例只有在具备名称、图片和至少一个确认事实点时才公开；不要把所有案例强行伪装成产品。

## 6. 验证

每个有意义的内容批次后直接运行：

```bash
npm run verify
```

禁止使用可能隐藏退出码的管道，例如：

```bash
npm run verify 2>&1 | tail
```

需要缩短日志时，先保存命令退出码，再单独读取日志。不得删除检查、降低 schema 或忽略失败。

在 `siteMode: "local"` 时仍执行 `npm run verify:delivery` 并准确说明 production gate 的结果；不要伪造域名让它通过。

## 7. 桌面端浏览器 QA

当前默认只验收桌面端，建议使用约 `1440 × 900`。保留模板已有响应式能力，但不主动进行移动端适配或 390px 验收；只有用户明确加入移动端范围时才增加该项。

使用一个由当前任务启动并可追踪的 Dev Server。确认服务健康后逐一检查实际公开路由：

- HTTP 和页面加载成功；
- Console 无 error 或 warning；
- 图片请求成功且 `naturalWidth > 0`；
- 图片比例、裁切和清晰度合理；
- 页面没有横向溢出；
- Header、主导航、CTA 和 Footer 链接可操作；
- 长标题、邮箱和参数没有遮挡或截断；
- 懒加载图片滚动后出现。

保存的截图和浏览器临时文件放在 Git 忽略目录。检查后关闭本任务启动的服务，不要结束无法确认归属的其他进程。只报告实际打开过的页面和尺寸；浏览器不可用时明确写“视觉验收未完成”。

## 8. Git 与远端交付

首次建站开始实现前，bootstrap 应已初始化 Git 并设置客户 `origin`。继续前确认：

- `origin` 是客户仓库 SSH URL；
- `origin` 不指向 catalog；
- 仓库所有者和客户仓库名正确；
- `.gitignore` 排除 `materials/`、依赖、构建物、临时文件和环境变量。

普通验证和桌面 QA 完成后：

1. 检查 `git status --short`；
2. 确认没有 PDF、OCR、截图、`node_modules`、`dist`、`.astro`、`.tmp` 或 `.env` 被跟踪；
3. 暂存本次网站文件并创建准确的 Commit；
4. `git push -u origin main`；
5. 运行：

```bash
npm run verify:handoff -- --owner <gitee-owner> --repo <customer-repo>
```

`verify:handoff` 未通过时，不得宣称 Push 或仓库交付完成。

## 9. 最终回复

最终回复必须给出：

- catalog SSH URL、来源 commit 和模板 ID；
- 客户项目绝对路径；
- 客户 Gitee 仓库 SSH 地址；
- 本地和远端一致的 commit；
- `npm run verify` 与 `verify:delivery` 的真实结果；
- 实际检查过的桌面路由和尺寸；
- 尚未解决的 P1/P2 内容缺口；
- 明确未做的部署、域名、后台、在线表单和移动端专项适配。

本地 Commit 不是 Push，模板复制成功不是网站完成，构建通过也不是生产上线。
