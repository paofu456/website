# 多 Agent 建站操作流程

本仓库只维护三套通用 Astro + Tailwind 基座，不保存任何客户资料或客户页面。

## 仓库关系

```text
用户发起新客户建站
          ↓ 没有资料时，Agent 请求用户上传附件并等待
读取附件、提取事实、一次性补齐 P0 并确认公开授权
          ↓
外部 Agent Clone 统一基座并固定批准的 commit/tag
          ↓ 使用已通过 catalog CI 的版本
选择 lumen / forge / nexus，create-site
          ↓ 在基座目录之外生成
创建该客户的空远程仓库，初始化客户项目 Git
          ↓
company-website Skill 完成内容、页面和验收
          ↓
Commit 并 Push 到该客户仓库
```

十个 Agent 可以 Clone 同一个只读基座；十家公司必须产生十个互不相干的客户仓库。客户项目不要求与基座保持 Git Fork 关系。

## 首次准备 Agent

将本仓库 `agent-skills/` 中的两个 Skill 安装到 Agent 的技能目录：

```bash
npm run install:agent-skills -- --target <agent-skills-directory>
```

安装内容：

- `company-site-bootstrap`：定位或 Clone 基座、固定版本、消化资料、选模板并创建客户项目；
- `company-website`：在客户项目中替换真实内容、修改页面、验证并交付。

安装脚本只复制 Skill 文件，不读取或写入 Git 凭据、SSH 密钥、Token 或 Agent 配置。

## 每个客户任务

1. 如果对话中尚未收到资料，Agent 先请用户上传现有 PDF、Word、PPT、表格、Logo 和图片，然后等待；不要要求用户编造本地资料目录。
2. 收到附件后使用运行时提供的真实附件路径。先完整消化资料，再一次性询问真正缺失的 P0 信息和公开授权。P0 未确认时不得创建项目或远程仓库。
3. 客户附件、PDF 页面、OCR、联系表和 intake notes 必须位于运行时附件区或 catalog 外的客户任务工作区；禁止写入 catalog 的 `.tmp/`、`materials/` 或任何其他目录。
4. P0 就绪后，外部 Agent 先读取 Profile 根目录的非秘密 `site-builder.json`，用其中的 catalog URL、批准版本、Gitee owner 和 SSH host；任务输入可以覆盖这些默认值。再用 `git ls-remote <catalog-url> HEAD` 检查运营方配置好的 SSH，将 `website` catalog Clone 到自己的独立 workspace 并检出批准的 commit/tag。精确版本已由运营方或 CI 验证并标为 `operator-verified` 时，不在每个客户任务中重复根目录依赖安装和三模板全量验证；只有未经验证或正在维护 catalog 时，才运行 `npm ci --include=optional` 和 `npm run verify`。工作流验收测试即使在运营方本机运行，也不得复用运营方维护目录；只有用户明确指定可信现有 checkout 时才可复用。建站 Agent 不生成、复制 SSH 私钥或重写 `~/.ssh/config`。
5. 按 `docs/onboarding.md` 选择一个模板，并从 catalog 运行：

   ```bash
   npm run create-site -- --template <lumen|forge|nexus> --target <absolute-customer-project-path>
   ```

   创建后进入客户项目，使用其锁文件执行一次 `npm ci --include=optional`。不要用多次 `npm install --no-save` 逐个补原生绑定。

6. 把原始资料和内部记录放到客户项目的 `materials/`、`notes/`；`materials/` 默认不进入 Git。
7. 默认创建该客户的私有空远程仓库。在客户项目中执行 `git init`，将客户仓库的 SSH 地址设置为 `origin`；不能把 catalog 的 `origin` 改成客户仓库。只有用户明确要求仅本地输出时才可跳过，并必须称为本地草稿。
8. 进入客户项目，读取 `AGENTS.md` 和 `skills/company-website/SKILL.md`。按内容契约直接替换数据、Markdown、素材和主题，不遍历阅读全部组件；只在具体布局需求或验证缺陷出现时读取相关页面或组件。
9. 编辑批次使用 `npm run verify:quick`；最终只构建一次：本地/不部署运行 `npm run verify`，生产交付运行 `npm run verify:delivery`。默认只做约 1440px 桌面端 QA，移动端只有在用户明确加入范围时才检查。
10. 只暂存本次交付文件，Commit 后 Push 到客户仓库，再运行 `npm run verify:handoff -- --owner <owner> --repo <customer-repo>`。不得把客户内容推回基座。

初始化示例：

```bash
cd <customer-project-directory>
git init -b main
git remote add origin <customer-repository-ssh-url>
git remote -v
```

本地 Commit 不是远端交付。只有 Push 成功且 `verify:handoff` 证明远端目标分支与本地 HEAD 一致，才能报告仓库交付完成。

## 修改已有客户网站

已有客户站不再经过 catalog 和 `create-site`。Agent 直接用 SSH Clone 该客户仓库，读取其中的 `AGENTS.md` 和 `skills/company-website/SKILL.md`，选择修改路径，检查现有分支与未提交改动后实施、验证、Commit 并 Push 到原 `origin`。不要重新选择模板、覆盖整个项目或更换远程仓库。

## SSH 与仓库创建权限

- 每台服务器使用自己的 SSH 私钥；只把公钥添加到建站专用 Gitee 账户，不在多台服务器复制同一私钥。
- SSH 负责访问已经存在的基座仓库和客户仓库，远程地址必须使用 SSH URL，不能继续使用会提示账号密码的 HTTPS URL。
- SSH 不能创建新的 Gitee 仓库。需要 Agent 自动创建时，由运行环境提供最小权限 API Token，或由中央仓库创建服务返回空仓库的 SSH URL。
- Token、私钥和账号密码只存在于服务器的 SSH/Secret 配置中，不写入 Skill、项目文件、命令输出或 Git。
- 创建仓库前检查名称是否已存在；存在时不得覆盖或复用为另一个客户。

## 变更归属

| 变更 | 提交位置 |
|---|---|
| 某公司的内容、图片、页面和主题 | 该公司的独立仓库 |
| 三套模板都应获得的通用修复 | 基座仓库的独立分支/合并请求 |
| 原始画册、内部文件、凭据 | 不提交 Git |

不自动创建 Gitee Fork，也不在仓库内保存共享账号。服务器凭据由运行环境单独配置，仓库地址作为任务输入提供。
