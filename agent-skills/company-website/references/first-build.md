# 首次客户建站执行手册

本文件从“模板已经复制为独立客户项目”开始。若仍在模板 catalog 中，先回到 catalog 的 `docs/site-build-sop.md` 完成资料 intake、模板选择和项目创建。

## 0. 完成定义

只有同时满足以下条件，才可称为首版网站完成：

- 客户真实公司和业务内容已替换演示内容；
- 所有公开事实能够追溯到客户确认或获准公开的资料；
- 原始资料未被网站代码导入；
- 空字段对应的内容已隐藏，而不是显示占位符；
- `npm run verify` 通过；
- 已进行范围内的视觉检查；
- `npm run verify:delivery` 已执行并正确解释；
- `notes/content-gaps.md` 记录仍待补充的内容；
- 最终回复给出路径、运行方法、验证结果和未完成范围。

部署、CMS、后台、CDN、数据库和在线表单服务不是默认任务。

---

## 1. 编辑前审计

依次完整读取：

1. `AGENTS.md`
2. `README.md`
3. `site.config.ts`
4. `src/data/company.json`
5. `src/content.config.ts`
6. `src/content/products/*.md`
7. `docs/content-contract.md`
8. `docs/verification.md`
9. `notes/requirements.md`
10. `notes/content-gaps.md`
11. `git status --short`

记录模板原始公司名、演示产品名和现有路由，后续用于搜索残留。不要覆盖已有未提交的用户改动。

确认 `materials/` 中有哪些源文件，但不要把该目录当作公开资源目录。

### Gate 1：是否可以继续

至少需要：

- 公司公开名称；
- 网站语言；
- 目标客户；
- 一项真实产品或服务；
- 一个获准公开的询盘方式；
- 素材公开授权边界。

缺少其中任何一项时，先读取资料并一次性提出最小缺口清单。不要用模板内容顶替。

---

## 2. 建立事实账本

先更新 `notes/requirements.md`，至少记录：

- audience
- language
- company display name
- core products/services
- public contact
- approved material types
- excluded business lines
- selected template direction
- deployment/domain scope

再更新 `notes/content-gaps.md`。每条缺口应包括：

| Item | Priority | Current treatment |
|---|---|---|
| 缺失或冲突内容 | P0/P1/P2 | 阻断、隐藏、使用低清替代或等待确认 |

事实按以下优先级使用：

1. 用户在当前任务中的明确确认；
2. 用户确认允许公开的正式资料；
3. 现有 `src/data/company.json` 和产品 Markdown 中已确认的内容；
4. 其他来源只能作为待确认线索。

多个来源冲突时不自行取一个值。省略依赖内容并登记冲突。

### Gate 2：事实与授权

对准备发布的每个数字、资质、奖项、地址、联系方式、客户 logo 和项目图片，都能回答：

- 来源在哪里？
- 是否允许公开？
- 是否存在冲突？
- 网站中将出现在哪个字段或页面？

任何一个问题无法回答时，该内容暂不发布。

---

## 3. 设置构建状态和范围

开工时保持：

```ts
siteMode: "local"
contentStatus: "draft"
```

只有真实域名和部署进入范围后才考虑 production。不要为了让交付检查变绿而伪造域名。

根据资料决定页面，不要求填满模板：

- Home 和 Contact 默认保留；
- 有明确业务线时保留 Capabilities/Products；
- 有案例名称、图片和事实点时保留 Projects；
- About 只写可确认的公司事实；
- 内容不足的详情标记 draft 或删除；
- 同时从导航、首页入口和 Footer 移除不成立的页面。

先在 `site.config.ts` 确认语言、导航和本地模式，再开始页面工作。

---

## 4. 处理公开素材

原始文件留在：

```text
materials/
```

网站只能使用复制到下列目录的获准公开版本：

```text
public/media/company/
public/media/products/
public/media/projects/
```

执行顺序：

1. 提取源文件中的文本和图片；
2. 逐张查看图片语义；
3. 排除二维码、私人联系方式、无关截图、未授权客户 logo；
4. 选择与页面实际内容匹配的图片；
5. 转换为适合网页的 WebP/PNG/SVG；
6. 使用稳定的小写英文文件名；
7. 记录低清、裁切、缺原图和授权问题；
8. 给内容图片写描述画面的 alt。

禁止：

- 从 `materials/` 直接 import；
- 把整份画册放入 `public/`；
- 为真实工程、工厂或产品生成看似纪实的虚构照片；
- 因缺少 logo 而伪造商标；
- 未授权展示客户墙。

### Gate 3：公开资源检查

每个 `public/media/` 文件都必须是页面实际需要且已经批准公开的文件。每个源码图片路径都必须指向 `public/media/`。

---

## 5. 先数据，后页面

固定实施顺序：

1. `site.config.ts`
2. `src/data/company.json`
3. `src/content/products/*.md`
4. `public/media/`
5. `src/styles/theme.css`
6. Header、Footer、Button、Card 等共享组件
7. `src/pages/`
8. SEO 和 404

### 公司数据

公司名、简介、邮箱、电话、地址、社媒只维护在 `src/data/company.json`。页面和组件从该文件读取，不要复制粘贴。

不确定的可选字段使用空字符串。调用方应隐藏空字段。

### 产品或项目内容

先删除全部演示 Markdown，再创建真实条目。遵循 `src/content.config.ts` 的 schema：

- slug 使用稳定的小写英文；
- 标题与摘要真实具体；
- draft 决定是否生成公开路由；
- featured 只用于真实精选内容；
- 图片路径和 alt 完整；
- specifications 只保留有来源的值；
- SEO 标题和描述不夸大。

名称和 SEO 文案可以优化，已有 slug 不随意更改。

### 主题和共享组件

优先修改 `src/styles/theme.css` 中的颜色和视觉 token。保持选定模板的布局语言，不为单个客户重建技术栈。

修改共享组件前，使用 `rg` 找到所有调用位置。按钮、Header、Footer 和卡片的改动必须在所有页面复核。

---

## 6. 页面实现顺序

### Home

必须在首屏回答：

1. 公司做什么？
2. 服务哪类客户或项目？
3. 用户下一步做什么？

首页只选择 2–3 个最重要的信任点和代表内容。不要把画册所有段落堆进首页。

### Capabilities 或 Products

每条能力应有清楚的服务范围或产品价值。无依据的“全球领先”“最快交付”“最高品质”删除。

### Projects

每个案例至少包含名称、图片和一个确认事实点。项目数据不足时使用简短卡片，不补造技术参数。

### About

优先写成立时间、地点、主营演进、已确认资质和技术体系。没有来源的团队规模、产能和市场排名不写。

### Contact

展示统一数据源中的公开联系方式，并给出简短询盘建议。无后端时使用 `mailto:` 或直接联系入口，不伪装成已工作的提交表单。

### Detail 和 404

详情页只渲染非 draft 条目。404 必须使用真实品牌和有效返回入口。

### Gate 4：演示内容清零

搜索模板原始公司名及常见占位内容：

```bash
rg -n -i "demo|starter|lorem|placeholder|<original-demo-company>" src public site.config.ts
```

业务代码和页面中不得残留演示公司、演示产品、假联系方式或无效链接。内部函数名如 `products` 可以保留，不要求为了命名重构内容系统。

---

## 7. 小步验证

每完成一个有意义的批次都运行：

```bash
npm run verify
```

建议批次：

1. 配置与公司数据；
2. 内容条目；
3. 公开素材；
4. 共享组件；
5. 页面；
6. 最终修正。

验证失败时立即修复根因。不要删除校验逻辑、降低 schema 或跳过错误。

普通验证应确认：

- Astro/TypeScript 无错误；
- 静态页面成功生成；
- title、description、H1 和 alt 合格；
- 本地页面与资源链接存在；
- 私有目录名没有泄漏进 HTML；
- 产品/项目内容符合 schema；
- 本地模式没有 localhost canonical。

---

## 8. 视觉和运行时 QA

范围未另行约定时，检查约 390px 与 1440px。若用户明确延期手机端，只验收桌面端并在交付说明中注明。

逐页检查：

- 页面没有横向滚动；
- Header、导航、移动菜单和 CTA 可操作；
- 长标题、邮箱和参数能换行；
- 图片已加载，比例和裁切正确；
- 按钮文字可见，特别检查白底白字；
- 卡片高度和间距合理；
- Footer 不遮挡正文；
- 所有主链接目标正确；
- 控制台无 error 或 warning。

不要仅根据截图文件宽度判断 viewport。确认：

```js
window.innerWidth
document.documentElement.scrollWidth
```

移动端期望前者约为 390，后者不大于前者。部分 headless Chromium 会以 500px 布局后裁成 390px 截图；这种截图不能作为移动端缺陷证据。

懒加载图片需要滚动页面后再截图。开发工具条只存在于 dev 模式，不应误判为网站内容。

### Gate 5：视觉结论可追溯

只报告实际打开检查过的页面和宽度。浏览器工具不可用时明确说明，不能写“已完成视觉验收”。

---

## 9. Ready 与交付检查

当以下条件都满足时，把：

```ts
contentStatus: "ready"
```

- P0 内容全部确认；
- 公开素材授权明确；
- 演示内容清零；
- `npm run verify` 通过；
- 范围内视觉问题已修复。

然后运行：

```bash
npm run verify:delivery
```

结果解释：

- 有真实域名并要求上线：应切 production 并通过 delivery gate；
- 用户明确不部署：保持 local/noindex；delivery gate 因 `siteMode` 失败是预期状态，但普通 verify 必须通过；
- P0 未清：保持 draft，不得称内容完成；
- 只有已记录的 P1/P2 缺口：可按降级方案交付 MVP。

---

## 10. Git 与交付

确认 `.gitignore` 排除：

- `materials/`
- `node_modules/`
- `dist/`
- `.astro/`
- `.tmp/`
- 本地环境变量

提交前运行 `git status --short`，不得出现原始画册、临时提取文件、截图、依赖或构建产物。不要覆盖或清理不属于当前任务的用户改动。

最终回复必须包含：

- 客户项目绝对路径；
- 完成的页面和内容范围；
- `npm run dev` 的使用方法；
- `npm run verify` 结果；
- 实际视觉检查范围；
- delivery gate 结果及原因；
- Git 状态或提交 ID；
- 内容缺口；
- 明确未做的部署、后台、表单服务或延期端适配。

## 最终自检

结束前逐项确认：

- [ ] 客户事实可追溯且获准公开。
- [ ] 演示公司和产品已经移除。
- [ ] 网站没有读取 `materials/` 或 `notes/`。
- [ ] 重复联系方式来自统一数据源。
- [ ] 空字段没有生成空区块。
- [ ] 公开图片路径、alt 和授权正确。
- [ ] 普通 verify 通过。
- [ ] 范围内视觉检查真实执行。
- [ ] delivery gate 已执行并解释。
- [ ] Git 没有跟踪私有或生成文件。
- [ ] 交付回复说明完成项、缺口和未做范围。

任一项为否时，不要宣称整个 MVP 已完成。
