# 企业独立站构建 SOP（Agent 版）

版本 v1.2 · 2026-09-17

适用场景：用户提供企业资料，Agent 使用本仓库的 Astro + Tailwind 基座，为一个客户创建独立的企业网站 MVP。

目标：即使执行模型能力一般，也能依靠固定的信息来源、阶段产物、检查命令和停止条件，稳定交付一个事实可靠、可继续维护的网站。

---

## 1. 最终结果是什么

一次完整任务必须产出一个位于 catalog 之外的客户项目，而不是只修改模板或给出方案。默认 MVP 应包含：

- 一个选定模板的独立 Astro 项目；
- 已替换的公司名称、主营业务、联系方式和品牌视觉；
- 根据资料决定是否保留的 Home、Capabilities/Products、Projects、About、Contact 页面；
- 只使用已确认事实和已授权素材；
- 可以执行 `npm run dev`；
- `npm run verify` 通过；
- 已记录无法确认的内容缺口；
- 明确区分“本地可用”和“可生产发布”。

部署、域名、CDN、CMS、后台、数据库和表单服务默认不在范围内，除非用户明确提出。

---

## 2. 整体流程

```text
服务器 Agent：Clone 运营方统一基座 → 固定批准版本
本地 Agent：使用已有基座 checkout
  ↓
接收资料
  ↓
资料消化与事实分级
  ↓
补齐 P0 输入并确认公开授权
  ↓
选择模板并复制到独立目录
  ↓
建立 requirements / content-gaps
  ↓
先数据与素材，后组件与页面
  ↓
循环执行 build + verify
  ↓
桌面/手机视觉检查与运行时检查
  ↓
delivery gate + Git 基线 + 交付说明
```

每个阶段都有可观察产物。不要凭“感觉差不多”跨过阶段。

---

## 3. 阶段 A：资料接收与开工判定

先完整执行 [`docs/onboarding.md`](onboarding.md)。该文档定义 P0/P1/P2 字段、资料校验、事实冲突和客户补料规则。

### 开工所需最小信息

至少确认：

1. 公司公开名称；
2. 目标客户；
3. 核心产品或服务；
4. 网站语言；
5. 一个可公开的询盘联系方式；
6. 哪些文字、图片、资质、案例获准公开；
7. 是否包含部署；
8. 用户选择的模板，或允许 Agent 根据业务类型选择。

### Agent 必须先消化资料

不要先向客户发送一张几十字段的空表。先读取 PDF、Word、PPT、表格和图片，提取能够确认的事实，再一次性询问真正缺失的决策项。

将信息分成四类：

| 类别 | 动作 |
|---|---|
| 已确认且允许公开 | 可以进入网站 |
| 已确认但不允许公开 | 只保留在 `materials/` 或内部 notes |
| 多来源冲突 | 不自行选择，记录后询问客户 |
| 缺失 | 隐藏依赖区块，并记录降级方案 |

### 阻断条件

以下情况不要开始写最终页面：

- 不知道网站代表哪家公司；
- 没有任何可描述的产品或服务；
- 没有任何可公开联系方式；
- 不清楚素材是否允许公开；
- 用户要求的语言未确认。

可以先做资料分析和缺口清单，但不能用演示内容或编造内容填空。

---

## 4. 阶段 B：获取基座、选择模板并创建客户项目

### 两种入口

| 运行环境 | 获取基座的方式 |
|---|---|
| Agent 与用户共享本地工作区，基座已经存在 | 直接读取现有 checkout |
| Agent 运行在独立服务器或云端，无法访问用户本地目录 | Clone 运营方提供的统一基座仓库 |

运营方只维护一个基座仓库。十个远程 Agent 可以分别 Clone 同一个基座，但每个客户最终必须拥有独立项目和独立 Git 仓库：

```text
运营方统一基座仓库
        ↓ 每台服务器 Clone
Agent 服务器上的 catalog checkout
        ↓ 固定批准的 commit/tag
        ↓ create-site 选择一个模板
客户独立站目录
        ↓ 初始化 Git 并推送
客户自己的 Git 仓库
```

### 服务器 Agent 获取基座

仓库地址和批准版本由运营方或任务输入提供。服务器执行：

```bash
git clone <catalog-repository-url> website-catalog
cd website-catalog
git fetch origin --tags
git checkout --detach <approved-tag-or-commit>
npm ci
npm run verify
```

要求：

- `origin` 指向运营方提供的统一基座；
- 每次客户任务固定到明确 tag 或 commit，避免任务执行中模板变化；
- 记录 catalog URL、模板 ID 和完整 source commit；
- 客户上传资料不要放进基座 checkout；
- Agent 制作客户页面时，不把客户代码提交到基座；
- 通用基座改进使用单独分支或合并请求，不与客户交付混在一起。

Clone 负责把基座下载到 Agent 所在服务器；Fork 只是 Git 平台上的仓库关系，不是本流程的必需步骤。除非运营方明确要求，Agent 不自行创建 Fork。

### 为什么客户站还需要独立仓库

直接在 catalog 中开发客户站会携带三个模板、生成脚本和基座文档，也容易把不同客户资料混入同一个仓库。客户站仓库只包含被选中的一个模板和该客户内容，它不需要与 catalog 保持 Fork 关系。

### 模板选择

| 模板 ID | 对外风格 | 优先适用 |
|---|---|---|
| `lumen` | 极简画册 | 设计驱动、精品制造、高端品牌 |
| `forge` | 产品目录 | 产品数量多、参数多、目录浏览重要 |
| `nexus` | 现代商务 | B2B 服务、工程企业、集团、多能力线 |

用户已经选择时直接遵循。用户没有偏好时，根据核心转化任务选择，不要把三个模板混在一起。

### 创建规则

客户项目必须创建在 catalog 和 `templates/` 之外：

```bash
npm run create-site -- --template nexus --target ../client-website
```

目标目录必须为空。不要直接在 `D:/work/website` 或 `templates/<id>` 中制作客户站，也不要在一个站点里加入运行时模板切换器。

创建后进入客户项目：

```bash
cd ../client-website
npm install
```

在 `notes/requirements.md` 记录来源信息：

```text
catalogRepository: <catalog-repository-url>
templateId: lumen | forge | nexus
templateSourceCommit: <full-commit-sha>
```

然后重新读取该项目的：

1. `AGENTS.md`
2. `README.md`
3. `skills/company-website/SKILL.md`
4. `site.config.ts`
5. `src/data/company.json`
6. `src/content/products/*.md`
7. Git 状态

从此只在客户项目中实施客户内容，不回写模板的演示页面。

客户项目验证通过后，为它创建新的远程仓库并设置为客户项目的 `origin`。基座仓库与客户站仓库不能使用同一个 origin。

---

## 5. 阶段 C：建立事实与文件映射

先把状态设为：

```ts
siteMode: "local"
contentStatus: "draft"
```

再填写三份内部记录：

- `notes/requirements.md`：用户确认的目标、语言、受众、业务、模板、范围和联系方式；
- `notes/content-gaps.md`：未确认事实、素材质量问题、冲突、授权问题及降级方案；
- `notes/change-log.md`：已经执行的重要变化。

这些文件是内部工作记录，不得由网站代码读取。

### 唯一事实来源

| 内容 | 唯一位置 |
|---|---|
| 语言、站点模式、域名、导航 | `site.config.ts` |
| 公司名、介绍、电话、邮箱、地址、社媒 | `src/data/company.json` |
| 产品/项目事实、参数、SEO | `src/content/products/*.md` |
| 颜色、字体、圆角、阴影 | `src/styles/theme.css` |
| 获准公开的图片和文件 | `public/media/` |
| 页面顺序和组成 | `src/pages/` |
| 共享展示 | `src/components/` |

不要把邮箱、电话、公司介绍重复硬编码到多个页面。重复内容必须从统一数据文件读取。

---

## 6. 阶段 D：素材处理

### 私有区和公开区

```text
materials/     原始画册、合同、内部文档、未筛选图片；永不被网站导入
notes/         内部事实和缺口；永不被网站导入
public/media/  已确认可以公开、已经重命名和优化的素材
```

### 处理顺序

1. 为每份资料记录来源；
2. 从资料提取文本和图片；
3. 检查图片语义，不把二维码、证书局部、客户 logo、私人联系方式误当产品图；
4. 确认公开授权；
5. 选择真正会使用的素材；
6. 生成适合网页的版本；
7. 复制到 `public/media/company/` 或 `public/media/products|projects/`；
8. 使用稳定英文文件名，如 `company-logo.webp`、`project-name.webp`；
9. 为每张内容图片编写描述画面本身的英文 alt；
10. 将低清、裁切或缺原图问题记录到 `notes/content-gaps.md`。

优先使用客户原图。画册提取图可以作为 MVP 降级方案，但必须记录清晰度限制。不要生成“看起来像真实项目”的虚构工程照片。

---

## 7. 阶段 E：先做内容模型，再做页面

固定执行顺序：

1. 更新 `site.config.ts`；
2. 更新 `src/data/company.json`；
3. 删除全部演示产品/项目内容；
4. 为真实产品或项目建立 Markdown；
5. 放入公开素材；
6. 更新主题 token；
7. 更新 Header、Footer、按钮等共享组件；
8. 更新页面组成；
9. 最后处理 SEO 和 404。

这种顺序能避免先写页面、后改数据造成重复内容和演示残留。

### 内容写作规则

- 使用用户确认的语言；
- 面向目标客户写，而不是逐页翻译画册；
- 标题说明客户能获得什么；
- 正文只写资料能支持的事实；
- 不发明认证、产能、交期、客户、评价、地址、规格或性能；
- 数字必须能追溯到明确来源；
- 冲突数字直接省略；
- 内容不足时删掉区块，不用空话撑版面；
- 产品名称和 SEO 可以调整，但已有 slug 不随意更改。

---

## 8. 阶段 F：MVP 页面决策

默认信息架构只是候选，不是强制填满：

| 页面 | 最低可用内容 | 没有足够事实时 |
|---|---|---|
| Home | 公司定位、核心业务、代表内容、询盘入口 | 必须保留 |
| Capabilities/Products | 至少一条可解释的业务线或产品线 | 合并进 Home |
| Projects | 至少一个有名称、图片和事实点的案例 | 隐藏导航和页面 |
| About | 一段公司事实和至少一个可信信息点 | 做简版 |
| Contact | 已确认联系方式和询盘建议 | 必须保留 |
| Detail | 对应条目有足够内容 | 条目标记 draft，不生成路由 |

### 页面验收重点

- Header：Logo、导航、CTA 都来自真实配置；
- Home：首屏一句话讲清行业、能力和对象；
- 列表卡片：标题、图片、摘要和链接一致；
- 详情页：参数只展示非空且已确认的值；
- About：资质和荣誉必须有资料依据；
- Contact：邮箱/电话可点击，空字段不出现；
- Footer：不残留模板公司名、演示口号或假社媒链接。

保持模板的视觉方向，只替换品牌 token 和内容。不要因为一个客户站重新设计完整组件体系，也不要增加 React、Vue、CMS 或后台。

---

## 9. 阶段 G：小步验证

每完成一个有意义的批次就执行：

```bash
npm run verify
```

推荐批次：

1. 配置和公司数据；
2. 产品/项目 Markdown；
3. 公共素材；
4. 共享组件；
5. 页面和 SEO；
6. 最终修正。

发现失败时立即修，不要积累到最后。错误必须按根因处理，不要删除检查脚本或降低校验标准。

### 交付前文本搜索

至少搜索：

```bash
rg -n -i "demo|starter|lorem|placeholder|模板演示公司名" src public site.config.ts
```

再确认：

- 网站源码没有导入 `materials/` 或 `notes/`；
- 所有本地链接和资源存在；
- 图片有非空 alt；
- 页面标题和描述唯一且真实；
- 没有 localhost canonical；
- 没有空按钮、假链接和空卡片。

---

## 10. 阶段 H：视觉和运行时检查

如果浏览器工具可用，至少检查约 1440px 和 390px。用户明确把手机端延期时，可以只验收桌面端，但必须在交付说明中写明手机端未作为本轮验收项。

### 必查项目

- 页面没有横向滚动；
- Header 和移动菜单可操作；
- 长标题、项目名称和邮箱不会截断；
- 按钮文字与背景有足够对比度；
- 图片比例、裁切和清晰度合理；
- 详情参数不会挤出容器；
- Footer 不遮挡正文；
- 懒加载图片滚动后能出现；
- 浏览器控制台没有 error 或 warning；
- 所有主导航和 CTA 指向正确页面。

### 不要被截图工具误导

某些 headless Chromium 的 `--window-size=390` 实际布局宽度可能仍为 500px，只把截图裁成 390px，从而制造“页面被裁切”的假象。移动端检查必须确认：

```js
window.innerWidth === 390
document.documentElement.scrollWidth <= window.innerWidth
```

应使用浏览器设备模拟或 DevTools Protocol 设置真实 viewport。不要只看文件像素宽度就宣称完成视觉检查。

对发现的共享组件问题，要搜索并检查所有使用位置。例如按钮出现白底白字时，应检查按钮组件的 variant 与调用方样式优先级，而不是只修当前页面。

---

## 11. 阶段 I：状态与交付门槛

当公开事实和素材已经确认、演示内容已经移除、普通验证通过后，才将：

```ts
contentStatus: "ready"
```

交付前执行：

```bash
npm run verify:delivery
```

### 如何解释结果

| 场景 | 正确处理 |
|---|---|
| 用户要求部署且已给真实域名 | 配置 production 与 canonical，再通过 delivery gate |
| 用户明确不部署 | 保持 `siteMode: "local"` 和 noindex；如实说明 delivery gate 只因非生产模式失败 |
| 内容仍有未确认 P0 | 保持 `contentStatus: "draft"`，不能称为交付完成 |
| 只有 P1/P2 缺口 | 采用已记录的降级方案，可以交付 MVP |

“构建成功”“内容可用”“生产可发布”是三个不同状态，不要混为一谈。

---

## 12. 阶段 J：Git 与工作区

客户项目应有自己的 Git 仓库。提交前确认 `.gitignore` 至少排除：

```text
node_modules/
dist/
.astro/
.tmp/
materials/
.env*
```

执行 `git status --short`，确认没有画册原件、临时截图、PDF 提取目录、依赖或构建产物进入提交。只有在项目通过普通验证后，才建立初始基线提交。

不要用 destructive Git 命令清理用户改动。遇到已有未提交修改时，先辨认所有权并绕开无关内容。

远程服务器还要确认两个仓库的职责：

- catalog checkout 的 `origin` 是运营方统一基座；
- 客户项目的 `origin` 是该客户的独立网站仓库；
- 客户资料和客户页面不得被推送到 catalog；
- 基座改进不得直接混进客户站提交。

---

## 13. 交付回复模板

最终回复必须独立说明：

1. 项目绝对路径；
2. 已完成页面和真实内容范围；
3. 本地启动命令和访问地址；
4. `npm run verify` 结果；
5. 实际做过的桌面/手机视觉检查；
6. `verify:delivery` 是否通过，以及失败是否属于明确的非部署范围；
7. Git 状态或提交 ID；
8. 仍存在的内容缺口；
9. 明确未做的部署、后台、表单服务或手机端优化。

不要只说“已经完成”，也不要声称执行过没有实际执行的检查。

---

## 14. 低能力 Agent 的强制自检清单

在结束任务前逐项回答“是”：

- [ ] 如果我在远程服务器，我已 Clone 运营方基座并固定 source commit。
- [ ] 我记录了 catalog URL、模板 ID 和 source commit。
- [ ] 我在 catalog 外创建了独立客户目录。
- [ ] 我读取了客户项目的 `AGENTS.md` 和 skill。
- [ ] 我先提取资料，再询问缺口。
- [ ] 我记录了公开授权范围。
- [ ] 我没有编造任何公司或产品事实。
- [ ] 我删除了全部演示公司和演示产品内容。
- [ ] 我没有从 `materials/` 或 `notes/` 导入文件。
- [ ] 公司联系方式只存在于统一数据源。
- [ ] 公共图片都在 `public/media/` 且有 alt。
- [ ] 空字段对应的区块已隐藏。
- [ ] 我在每个重要批次后运行了 `npm run verify`。
- [ ] 我检查了实际 viewport，而不是只看截图尺寸。
- [ ] 我运行了 `npm run verify:delivery` 并正确解释结果。
- [ ] Git 没有跟踪原始资料、依赖、构建物或临时文件。
- [ ] 最终回复说明了完成项、未完成项和缺口。

任何一项为“否”时，不要宣称整个 MVP 已完成。
